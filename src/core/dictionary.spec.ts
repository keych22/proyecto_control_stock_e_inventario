import { describe, expect, it } from "vitest";
import { Dictionary } from "@/core/dictionary";
import _ from "lodash";

describe("Test class Dictionary", () => {
  const validInputWords = [
    "FECHA COMPRA",
    "CIUDAD",
    "CATEGORIA",
    "PROVEEDOR",
    "PRODUCTO",
    "TIPO DE ARTICULO",
    "DETALLE",
    "MARCA",
    "GENERO",
    "CODIGO",
    "COLOR",
    "TALLE",
    "PRECIO DE COMPRA",
    "MESES SIN VENDER",
    "ESTADO",
    "FECHA",
    "PRECIO DE VENTA",
    "ABONO",
    "DIFERENCIA",
    "CLIENTE",
    "TELEFONO",
    "LUGAR DE ENTREGA",
    "CONTACTO",
    "NOTA",
    "DIRECCION DE COMPRA",
  ];

  const validOutputWords = [
    "purchaseDate",
    "city",
    "category",
    "supplier",
    "product",
    "type",
    "detail",
    "brand",
    "gender",
    "code",
    "color",
    "size",
    "purchasePrice",
    "monthsUnsold",
    "state",
    "sellingDate",
    "sellingPrice",
    "credit",
    "difference",
    "client",
    "telephone",
    "delivery",
    "contact",
    "note",
    "address",
  ];

  it("Validate length of input/output words", () => {
    expect(validInputWords.length).to.eql(validOutputWords.length);
  });

  it("Validate list of input words", () => {
    expect(Dictionary.inputWords()).to.eql(validInputWords);
  });

  it("Validate list of output words", () => {
    expect(Dictionary.outputWords()).to.eql(validOutputWords);
  });

  it("Validate word translations", () => {
    const inputOutputWordPairs = _.zip(validInputWords, validOutputWords) as [
      string,
      string
    ][];

    _.forEach(inputOutputWordPairs, (inputOutputWordPair) => {
      const inputWord = inputOutputWordPair[0];
      const outputWord = inputOutputWordPair[1];

      expect(Dictionary.translate(inputWord)).to.eql(outputWord);
    });
  });
});
