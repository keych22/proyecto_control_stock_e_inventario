const table: Map<string, string> = new Map();

table.set("FECHA COMPRA", "purchaseDate");
table.set("CIUDAD", "city");
table.set("CATEGORIA", "category");
table.set("PROVEEDOR", "supplier");
table.set("PRODUCTO", "product");
table.set("TIPO DE ARTICULO", "type");
table.set("DETALLE", "detail");
table.set("MARCA", "brand");
table.set("GENERO", "gender");
table.set("CODIGO", "code");
table.set("COLOR", "color");
table.set("TALLE", "size");
table.set("PRECIO DE COMPRA", "purchasePrice");
table.set("MESES SIN VENDER", "monthsUnsold");
table.set("ESTADO", "state");
table.set("FECHA", "sellingDate");
table.set("PRECIO DE VENTA", "sellingPrice");
table.set("ABONO", "credit");
table.set("DIFERENCIA", "difference");
table.set("CLIENTE", "client");
table.set("TELEFONO", "telephone");
table.set("LUGAR DE ENTREGA", "delivery");
table.set("CONTACTO", "contact");
table.set("NOTA", "note");
table.set("DIRECCION DE COMPRA", "address");

export class Dictionary {
  public static inputWords() {
    return Array.from(table.keys());
  }

  public static outputWords() {
    return Array.from(table.values());
  }

  public static translate(word: string) {
    return table.get(word);
  }
}
