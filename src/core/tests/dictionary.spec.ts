import { describe, expect, it } from "vitest";
import { Dictionary } from "@/core/dictionary";

describe("Test class Dictionary", () => {
  it("Validate list of Spanish words", () => {
    const validWords = [
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
    expect(Dictionary.inputWords).toStrictEqual(validWords);
  });

  it("Validate translations", () => {
    expect(Dictionary.translate("FECHA COMPRA")).to.eql("purchaseDate");
    expect(Dictionary.translate("CIUDAD")).to.eql("city");
    expect(Dictionary.translate("CATEGORIA")).to.eql("category");
    expect(Dictionary.translate("PROVEEDOR")).to.eql("name");
    expect(Dictionary.translate("PRODUCTO")).to.eql("product");
    expect(Dictionary.translate("TIPO DE ARTICULO")).to.eql("type");
    expect(Dictionary.translate("DETALLE")).to.eql("detail");
    expect(Dictionary.translate("MARCA")).to.eql("brand");
    expect(Dictionary.translate("GENERO")).to.eql("gender");
    expect(Dictionary.translate("CODIGO")).to.eql("code");
    expect(Dictionary.translate("COLOR")).to.eql("color");
    expect(Dictionary.translate("TALLE")).to.eql("size");
    expect(Dictionary.translate("PRECIO DE COMPRA")).to.eql("purchasePrice");
    expect(Dictionary.translate("MESES SIN VENDER")).to.eql("monthsUnsold");
    expect(Dictionary.translate("ESTADO")).to.eql("state");
    expect(Dictionary.translate("FECHA")).to.eql("sale_date");
    expect(Dictionary.translate("PRECIO DE VENTA")).to.eql("salePrice");
    expect(Dictionary.translate("ABONO")).to.eql("credit");
    expect(Dictionary.translate("DIFERENCIA")).to.eql("difference");
    expect(Dictionary.translate("CLIENTE")).to.eql("client");
    expect(Dictionary.translate("TELEFONO")).to.eql("telephone");
    expect(Dictionary.translate("LUGAR DE ENTREGA")).to.eql("delivery");
    expect(Dictionary.translate("CONTACTO")).to.eql("contact");
    expect(Dictionary.translate("NOTA")).to.eql("note");
    expect(Dictionary.translate("DIRECCION DE COMPRA")).to.eql("address");
  });
});
