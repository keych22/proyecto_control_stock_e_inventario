import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import CSVFile from "@/core/csvfile";
import type { Entry } from "@/core/core";
import { ValidationError } from "@/core/validation";
import _ from "lodash";
import { defineStore } from "pinia";
import firebase from "@/core/services/firebase";
import { ref } from "vue";

function storeSetup() {
  const entries = ref<{ key: string; entry: Entry }[]>([]);

  const entryCollection = collection(firebase.db, "entry");
  onSnapshot(
    entryCollection,
    { includeMetadataChanges: true },
    (doc) => {
      doc.docChanges().forEach((change) => {
        const key = change.doc.id;
        const document = { key: key, entry: change.doc.data() as Entry };
        if (change.type === "added") {
          entries.value.splice(change.newIndex, 0, document);
        } else if (change.type === "modified") {
          entries.value.splice(change.oldIndex, 1, document);
        } else if (change.type === "removed") {
          entries.value.splice(change.oldIndex, 1);
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
      for (const entry of entries) {
        progress(Math.ceil((lineNumber / totalEntries) * 100));
        ++lineNumber;
        const validation = new ValidationError();
        validation.validate(entry);
        _.values(validation.errors).forEach((error) => {
          if (error) {
            logError(`Line: ${lineNumber}. ${error}`);
            validationErrors = true;
          }
        });
      }
      if (!validationErrors) {
        const batchMaxSize = 500;
        const numberOfBatches = Math.ceil(entries.length / batchMaxSize);
        progress(0);

        for (let batchIndex = 0; batchIndex < numberOfBatches; batchIndex++) {
          const batch = writeBatch(firebase.db);
          const batchSize =
            batchIndex + 1 < numberOfBatches
              ? batchMaxSize
              : entries.length % 500;
          for (let docIndex = 0; docIndex < batchSize; docIndex++) {
            const entryIndex = batchIndex * batchMaxSize + docIndex;
            const docRef = doc(collection(firebase.db, "entry"));
            batch.set(docRef, entries[entryIndex]);
          }
          await batch.commit();
          progress(Math.ceil(((batchIndex + 1) / numberOfBatches) * 100));
        }
      }
    }
  }

  async function save(key: string, entry: Entry) {
    const docRef = doc(firebase.db, "entry", key);
    await updateDoc(docRef, { ...entry });
  }

  return {
    entries,
    save,
    loadInventory,
  };
}

export const useDBStore = defineStore("db", storeSetup);
