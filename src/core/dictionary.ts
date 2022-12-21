export class Dictionary {
  private static readonly table: Record<string, string> = {
    "FECHA COMPRA": "purchaseDate",
    CIUDAD: "city",
    CATEGORIA: "category",
    PROVEEDOR: "name",
    PRODUCTO: "product",
    "TIPO DE ARTICULO": "type",
    DETALLE: "detail",
    MARCA: "brand",
    GENERO: "gender",
    CODIGO: "code",
    COLOR: "color",
    TALLE: "size",
    "PRECIO DE COMPRA": "purchasePrice",
    "MESES SIN VENDER": "monthsUnsold",
    ESTADO: "state",
    FECHA: "sale_date",
    "PRECIO DE VENTA": "salePrice",
    ABONO: "credit",
    DIFERENCIA: "difference",
    CLIENTE: "client",
    TELEFONO: "telephone",
    "LUGAR DE ENTREGA": "delivery",
    CONTACTO: "contact",
    NOTA: "note",
    "DIRECCION DE COMPRA": "address",
  };

  public static readonly inputWords = Object.getOwnPropertyNames(this.table);

  public static translate(word: string): string {
    return Dictionary.table[word];
  }
}
