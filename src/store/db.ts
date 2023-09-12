import { ConvertAndValidate, type Product } from "@/core/validation";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import CSVFile from "@/core/csvfile";
import _ from "lodash";
import { defineStore } from "pinia";
import firebase from "@/core/services/firebase";
import { ref } from "vue";

function storeSetup() {
  const products = ref<{ key: string; product: Product }[]>([]);

  const productCollection = collection(firebase.db, "product");
  onSnapshot(
    productCollection,
    { includeMetadataChanges: true },
    (doc) => {
      doc.docChanges().forEach((change) => {
        const key = change.doc.id;
        const document = { key: key, product: change.doc.data() as Product };
        if (change.type === "added") {
          products.value.splice(change.newIndex, 0, document);
        } else if (change.type === "modified") {
          products.value.splice(change.oldIndex, 1, document);
        } else if (change.type === "removed") {
          products.value.splice(change.oldIndex, 1);
        }
      });
    },
    (error) => console.log(error)
  );

  async function loadInventory(
    file: File,
    progress: (value: number) => void,
    logError: (message: string) => void
  ): Promise<void> {
    const content = await file.text();
    const csvFile = new CSVFile();
    const entries = csvFile.parse(content);

    if (!_.isEmpty(csvFile.errors)) {
      _.forEach(csvFile.errors, (message) => logError(message));
    } else {
      let lineNumber = 1;
      const totalEntries = entries.length;
      let validationErrors = false;
      const validProducts: Product[] = [];
      for (const entry of entries) {
        progress(Math.ceil((lineNumber / totalEntries) * 100));
        ++lineNumber;
        const [product, validation] = ConvertAndValidate(entry);
        const errors = validation.getErrors();
        if (_.isEmpty(errors)) {
          validProducts.push(product);
        } else {
          validationErrors = true;
          for (const error of errors) {
            logError(`Error en línea ${lineNumber} --> ${error}`);
          }
        }
      }
      if (!validationErrors) {
        const batchMaxSize = 500;
        const numberOfBatches = Math.ceil(validProducts.length / batchMaxSize);
        progress(0);

        for (let batchIndex = 0; batchIndex < numberOfBatches; batchIndex++) {
          const batch = writeBatch(firebase.db);
          const batchSize =
            batchIndex + 1 < numberOfBatches
              ? batchMaxSize
              : validProducts.length % 500;
          for (let docIndex = 0; docIndex < batchSize; docIndex++) {
            const productIndex = batchIndex * batchMaxSize + docIndex;
            const docRef = doc(collection(firebase.db, "product"));
            batch.set(docRef, validProducts[productIndex]);
          }
          await batch.commit();
          progress(Math.ceil(((batchIndex + 1) / numberOfBatches) * 100));
        }
      }
    }
  }

  async function update(key: string, product: Product) {
    const docRef = doc(firebase.db, "product", key);
    await updateDoc(docRef, { ...product });
  }

  function getProduct(key: string) {
    const product = _.filter(
      products.value,
      (product) => product.key === key
    )[0].product;
    return _.cloneDeep(product);
  }

  function filterProducts(filtro: string) {
    const columnasAFiltrar = [
      "purchaseDate",
      "city",
      "product",
      "type",
      "brand",
      "gender",
      "code",
      "color",
      "size",
      "state",
    ];

    const valoresABuscar = filtro.split(" ");
    const valoresABuscarAminusculas = _.map(valoresABuscar, (valor) =>
      valor.toLowerCase()
    );
    console.log(valoresABuscar);
    console.log(valoresABuscarAminusculas);

    return products.value.filter((producto) => {
      const columnasYValores = _.pick(
        producto.product,
        columnasAFiltrar
      ) as Record<string, string>;
      const valores = _.values(columnasYValores);
      console.log(columnasYValores);
      console.log(valores);
      const valoresAMinusculas = _.map(valores, (valor) => valor.toLowerCase());
      console.log(valoresAMinusculas);
      return valoresABuscarAminusculas.every((valor) => {
        console.log(valor);
        const xx = _.find(valoresAMinusculas, (valorMinuscula) => {
          console.log(valorMinuscula);
          return valorMinuscula.includes(valor);
        }); // valoresAMinusculas.includes(valor)
        return !_.isUndefined(xx);
      });
    });
  }

  return {
    filterProducts,
    products,
    update,
    loadInventory,
    getProduct,
  };
}

export const useDBStore = defineStore("db", storeSetup);
