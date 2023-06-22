class Dictionary {
  private readonly table: Map<string, string> = new Map();

  constructor() {
    this.table.set("FECHA COMPRA", "purchaseDate");
    this.table.set("CIUDAD", "city");
    this.table.set("CATEGORIA", "category");
    this.table.set("PROVEEDOR", "name");
    this.table.set("PRODUCTO", "product");
    this.table.set("TIPO DE ARTICULO", "type");
    this.table.set("DETALLE", "detail");
    this.table.set("MARCA", "brand");
    this.table.set("GENERO", "gender");
    this.table.set("CODIGO", "code");
    this.table.set("COLOR", "color");
    this.table.set("TALLE", "size");
    this.table.set("PRECIO DE COMPRA", "purchasePrice");
    this.table.set("MESES SIN VENDER", "monthsUnsold");
    this.table.set("ESTADO", "state");
    this.table.set("FECHA", "sale_date");
    this.table.set("PRECIO DE VENTA", "salePrice");
    this.table.set("ABONO", "credit");
    this.table.set("DIFERENCIA", "difference");
    this.table.set("CLIENTE", "client");
    this.table.set("TELEFONO", "telephone");
    this.table.set("LUGAR DE ENTREGA", "delivery");
    this.table.set("CONTACTO", "contact");
    this.table.set("NOTA", "note");
    this.table.set("DIRECCION DE COMPRA", "address");
  }

  public inputWords() {
    return Array.from(this.table.keys());
  }

  public outputWords() {
    return Array.from(this.table.values());
  }

  public translate(word: string) {
    return this.table.get(word);
  }
}

export { Dictionary };
