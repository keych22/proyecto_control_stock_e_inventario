import { Cities, type Entry, StartDate, States } from "@/core/core";
import _ from "lodash";

export class Validator {
  public product = new Product();

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

class Product {
  purchaseDate: string = "";
  city: string = "";
  category: string = "";
  supplier: string = "";
  product: string = "";
  type: string = "";
  detail: string = "";
  brand: string = "";
  gender: string = "";
  code: string = "";
  color: string = "";
  size: string = "";
  purchasePrice: number | null = null;
  state: string = "";
  sellingDate: string = "";
  sellingPrice: number | null = null;
  credit: number | null = null;
  client: string = "";
  telephone: string = "";
  delivery: string = "";
  contact: string = "";
  note: string = "";
  address: string = "";
}

class Valid {
  purchaseDate: boolean = true;
  city: boolean = true;
  category: boolean = true;
  supplier: boolean = true;
  product: boolean = true;
  purchasePrice: boolean = true;
  state: boolean = true;
  sellingDate: boolean = true;
  sellingPrice: boolean = true;
  credit: boolean = true;
  client: boolean = true;
  telephone: boolean = true;
}

export enum DateType {
  purchase,
  selling,
}

export class ValidationError {
  public data = new Data();
  public valid = new Valid();

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
        this.valid.state = false;
    }
  }

  public validateNumberTelephoneIsEmpty(telephone: string): void {
    this.valid.telephone = _.isEmpty(telephone);
  }

  public validateSupplierNameIsNotEmpty(entry: Entry): void {
    this.valid.supplier = !_.isEmpty(entry.supplier);
  }

  public validateClientNameIsNotEmpty(name: string): void {
    this.valid.client = !_.isEmpty(name);
  }

  public validateClientNameIsEmpty(entry: Entry): void {
    this.valid.client = _.isEmpty(entry.client);
  }

  private validateSellingPriceIsEmpty(entry: Entry): void {
    this.valid.sellingPrice = _.isEmpty(entry.sellingPrice);
  }

  public validateSoldItem(entry: Entry): void {
    this.validateClientNameIsNotEmpty(entry.client);
    this.data.sellingPrice = this.convertAmountStringToCents(
      DateType.selling,
      entry.sellingPrice
    );
    if (!_.isEmpty(entry.telephone)) {
      this.verifyPhoneNumber(entry.telephone);
    }
  }

  public validateOnCreditItem(entry: Entry): void {
    this.validateClientNameIsNotEmpty(entry.client);
    this.data.sellingPrice = this.convertAmountStringToCents(
      DateType.selling,
      entry.sellingPrice
    );
    if (!_.isEmpty(entry.telephone)) {
      this.verifyPhoneNumber(entry.telephone);
    }
  }

  public validateReservedItem(entry: Entry): void {
    if (!_.isEmpty(entry.sellingPrice)) {
      this.data.sellingPrice = this.convertAmountStringToCents(
        DateType.selling,
        entry.sellingPrice
      );
    }
    if (!_.isEmpty(entry.telephone)) {
      this.verifyPhoneNumber(entry.telephone);
    }
  }

  public validateNotSoldItem(entry: Entry): void {
    this.validateClientNameIsEmpty(entry);
    this.validateNumberTelephoneIsEmpty(entry.telephone);
    if (!_.isEmpty(entry.sellingPrice)) {
      this.data.sellingPrice = this.convertAmountStringToCents(
        DateType.selling,
        entry.sellingPrice
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
        this.valid.purchasePrice = false;
      } else if (type === DateType.selling) {
        this.valid.sellingPrice = false;
      }
    }

    return amount;
  }

  public verifyPhoneNumber(telephone: string) {
    this.valid.telephone = Validator.isValidPhoneNumber(telephone);
  }

  public validateDate(type: DateType, value: string) {
    const date = new Date(value);
    if (!date) {
      if (type === DateType.purchase) {
        this.valid.purchaseDate = false;
      } else if (type === DateType.selling) {
        this.valid.sellingDate = false;
      }
    } else {
      this.validateDateRange(type, date);
    }
  }

  public validateDateRange(type: DateType, date: Date) {
    if (!Validator.isValidDate(date)) {
      if (type === DateType.purchase) {
        this.valid.purchaseDate = false;
      } else if (type === DateType.selling) {
        this.valid.sellingDate = false;
      }
    }
  }

  public validateCity(city: string) {
    this.valid.city = Validator.isValidCity(city);
  }
}
