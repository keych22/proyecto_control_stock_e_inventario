import type { Entry } from "@/core/core";
import _ from "lodash";
class Data {
  purchasePrice: null | number = null;
  sellingPrice: null | number = null;
}

class Errors {
  purchasePrice: null | string = null;
  telephone: null | string = null;
  client: null | string = null;
  name: null | string = null;
  city: null | string = null;
  state: null | string = null;
  supplier: null | string = null;
  sellingPrice: null | string = null;
  sellingDate: null | string = null;
  purchaseDate: null | string = null;
  category: null | string = null;
  brand: null | string = null;
  details: null | string = null;
  size: null | string = null;
  color: null | string = null;
  code: null | string = null;
}

export enum DateType {
  purchase,
  selling,
}

export class Validation {
  public data: Data = new Data();
  public errors: Errors = new Errors();

  public validate(entry: Entry) {
    this.validateDate(DateType.purchase, entry.purchaseDate);
    this.validateSupplierNameIsNotEmpty(entry);
    this.validateCity(entry.city);
    switch (entry.state) {
      case "Vendido": {
        this.validateSoldItem(entry);
        break;
      }
      case "Credito": {
        this.validateOnCreditItem(entry);
        break;
      }
      case "Apartado": {
        this.validateReservedItem(entry);
        break;
      }
      case "SinVender": {
        this.validateNotSoldItem(entry);
        break;
      }
      case "Dañado": {
        this.validateDamagedItem(entry);
        break;
      }
      case "Perdido": {
        this.validateLostItem(entry);
        break;
      }
      default:
        this.errors.state = `Estado tiene un valor inválido: "${entry.state}"`;
    }
  }

  public validateNumberTelephoneIsEmpty(telephone: string): void {
    if (!_.isEmpty(telephone)) {
      this.errors.telephone = "El número telefónico debe estar vacío";
    }
  }

  public validateSupplierNameIsNotEmpty(entry: Entry): void {
    if (_.isEmpty(entry.name)) {
      this.errors.supplier = "Nombre de proveedor no puede estar vacío";
    }
  }

  public validateClientNameIsNotEmpty(name: string): void {
    if (_.isEmpty(name)) {
      this.errors.client = "Nombre de cliente no puede estar vacío";
    }
  }

  public validateClientNameIsEmpty(entry: Entry): void {
    if (!_.isEmpty(entry.client)) {
      this.errors.client = "Nombre de cliente debería estar vacío";
    }
  }
  private validateSellingPriceIsEmpty(entry: Entry): void {
    if (!_.isEmpty(entry.salePrice)) {
      this.errors.sellingPrice = "Precio de venta debe estar vacío";
    }
  }

  public validateSoldItem(entry: Entry): void {
    this.validateClientNameIsNotEmpty(entry.client);
    this.data.sellingPrice = this.convertAmountStringToCents(
      DateType.selling,
      entry.salePrice
    );
    if (!_.isEmpty(entry.telephone)) {
      this.verifyPhoneNumber(entry.telephone);
    }
  }

  public validateOnCreditItem(entry: Entry): void {
    this.validateClientNameIsNotEmpty(entry.client);
    this.data.sellingPrice = this.convertAmountStringToCents(
      DateType.selling,
      entry.salePrice
    );
    if (!_.isEmpty(entry.telephone)) {
      this.verifyPhoneNumber(entry.telephone);
    }
  }

  public validateReservedItem(entry: Entry): void {
    if (!_.isEmpty(entry.salePrice)) {
      this.data.sellingPrice = this.convertAmountStringToCents(
        DateType.selling,
        entry.salePrice
      );
    }
    if (!_.isEmpty(entry.telephone)) {
      this.verifyPhoneNumber(entry.telephone);
    }
  }

  public validateNotSoldItem(entry: Entry): void {
    this.validateClientNameIsEmpty(entry);
    this.validateNumberTelephoneIsEmpty(entry.telephone);
    if (!_.isEmpty(entry.salePrice)) {
      this.data.sellingPrice = this.convertAmountStringToCents(
        DateType.selling,
        entry.salePrice
      );
    }
  }

  public validateDamagedItem(entry: Entry): void {
    this.validateClientNameIsEmpty(entry);
    this.validateSellingPriceIsEmpty(entry);
    this.validateNumberTelephoneIsEmpty(entry.telephone);
  }

  public validateLostItem(entry: Entry): void {
    this.validateClientNameIsEmpty(entry);
    this.validateSellingPriceIsEmpty(entry);
    this.validateNumberTelephoneIsEmpty(entry.telephone);
  }

  public convertAmountStringToCents(
    type: DateType,
    amount: string
  ): null | number {
    const match = amount.match(
      /^(?<integer>\d*)(?<dot>\.?)(?<decimal>\d{0,2})$/
    );
    if (!match) {
      if (type === DateType.purchase) {
        this.errors.purchasePrice = `El precio de compra esta incorrecto: "${amount}"`;
      } else if (type === DateType.selling) {
        this.errors.sellingPrice = `El precio de venta esta incorrecto: "${amount}"`;
      }
      return null;
    }

    const integer = match!.groups!.integer;
    const decimal = match!.groups!.decimal;

    if (!integer.length && !decimal.length) {
      if (type === DateType.purchase) {
        this.errors.purchasePrice = `El precio de compra esta incorrecto: "${amount}"`;
      } else if (type === DateType.selling) {
        this.errors.sellingPrice = `El precio de venta esta incorrecto: "${amount}"`;
      }
      return null;
    }

    return (
      100 * parseInt(integer.padEnd(1, "0")) + parseInt(decimal.padEnd(2, "0"))
    );
  }

  public verifyPhoneNumber(telephone: string): void {
    const expReg = /^[1-9]\d{9}$/;
    const formatMatch = expReg.test(telephone);
    if (!formatMatch) {
      this.errors.telephone = `Número telefónico inválido (Teléfono: ${telephone})`;
    }
  }

  public validateDate(type: DateType, date: string): void {
    const regex = /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})$/;
    const match = date.match(regex);
    if (!match) {
      if (type === DateType.purchase) {
        this.errors.purchaseDate = `Formato de fecha de compra incorrecto (Fecha: "${date}")`;
      } else if (type === DateType.selling) {
        this.errors.sellingDate = `Formato de fecha de venta incorrecto (Fecha: "${date}")`;
      }
      return;
    }

    this.validateDateRange(type, date);
  }

  public validateDateRange(type: DateType, dateEntry: string): void {
    const date = new Date(dateEntry).getTime();
    const firstPurchaseDate = "2019-04-22";
    const lowerDate = new Date(firstPurchaseDate).getTime();
    const currentDate = Date.now();
    if (date < lowerDate || currentDate < date) {
      if (type === DateType.purchase) {
        this.errors.purchaseDate = `La fecha de compra no se encuentra dentro de las fechas válidas`;
      } else if (type === DateType.selling) {
        this.errors.sellingDate = `La fecha de venta no se encuentra dentro de las fechas válidas`;
      }
    }
  }

  public validateCity(city: string): void {
    const validCities = ["NEUQUÉN", "BUENOS AIRES"];
    if (!validCities.includes(city)) {
      this.errors.city = `Producto debe tener una ciudad válida (Ciudad = ${city})`;
    }
  }

  public validateMetadata(
    metadata: string,
    value: string,
    label: string
  ): null | string {
    switch (metadata) {
      case "Opcional": {
        return null;
      }
      case "Obligatorio": {
        if (_.isEmpty(value)) {
          return `${label} no puede estar vacío`;
        }
        break;
      }
      case "": {
        if (!_.isEmpty(value)) {
          return `${label} debe estar vacío`;
        }
        break;
      }
      default: {
        return `${label} metadata incorrecto: "${metadata}"`;
      }
    }
    return null;
  }
}
