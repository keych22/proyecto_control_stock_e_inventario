import { Cities, type Entry, StartDate, States } from "@/core/core";
import _ from "lodash";

export class Validator {
  public static isValidCity(city: string) {
    return Cities.includes(city);
  }
  public static isValidState(state: string) {
    return States.includes(state);
  }
  public static isValidDate(date: Date) {
    const value = date.getTime();

    const lowerBound = new Date(StartDate).getTime();
    const upperBound = Date.now();

    return lowerBound <= value && value <= upperBound;
  }

  public static isValidPhoneNumber(phoneNumber: string) {
    const regex = /^[1-9]\d{9}$/;
    return regex.test(phoneNumber);
  }

  public static convertAmountDecimals(value: string) {
    const regex = /^(?<integer>\d*)(\.?)(?<decimal>\d{0,2})$/;
    const match = value.match(regex);

    if (!match) {
      return null;
    }

    const integer = match.groups!.integer;
    const decimal = match.groups!.decimal;

    if (!integer.length && !decimal.length) {
      return null;
    }

    const integerNumber = parseInt(integer.padEnd(1, "0"));
    const decimalNumber = parseInt(decimal.padEnd(2, "0"));

    return 100 * integerNumber + decimalNumber;
  }
}

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

export class ValidationError {
  public data: Data = new Data();
  public errors: Errors = new Errors();

  public validate(entry: Entry) {
    this.validateCity(entry.city);
    this.validateDate(DateType.purchase, entry.purchaseDate);
    this.validateSupplierNameIsNotEmpty(entry);
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

  public convertAmountStringToCents(type: DateType, value: string) {
    const amount = Validator.convertAmountDecimals(value);

    if (!amount) {
      if (type === DateType.purchase) {
        this.errors.purchasePrice = `El precio de compra esta incorrecto: "${value}"`;
      } else if (type === DateType.selling) {
        this.errors.sellingPrice = `El precio de venta esta incorrecto: "${value}"`;
      }
    }

    return amount;
  }

  public verifyPhoneNumber(telephone: string) {
    if (!Validator.isValidPhoneNumber(telephone)) {
      this.errors.telephone = `Número telefónico inválido (Teléfono: ${telephone})`;
    }
  }

  public validateDate(type: DateType, value: string) {
    const date = new Date(value);
    if (!date) {
      if (type === DateType.purchase) {
        this.errors.purchaseDate = `Formato de fecha de compra incorrecto (Fecha: "${value}")`;
      } else if (type === DateType.selling) {
        this.errors.sellingDate = `Formato de fecha de venta incorrecto (Fecha: "${value}")`;
      }
    } else {
      this.validateDateRange(type, date);
    }
  }

  public validateDateRange(type: DateType, date: Date) {
    if (!Validator.isValidDate(date)) {
      if (type === DateType.purchase) {
        this.errors.purchaseDate = `La fecha de compra no se encuentra dentro de las fechas válidas`;
      } else if (type === DateType.selling) {
        this.errors.sellingDate = `La fecha de venta no se encuentra dentro de las fechas válidas`;
      }
    }
  }

  public validateCity(city: string) {
    if (!Validator.isValidCity(city)) {
      this.errors.city = `Producto debe tener una ciudad válida (Ciudad = ${city})`;
    }
  }
}
