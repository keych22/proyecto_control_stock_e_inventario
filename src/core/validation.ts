import { Cities, type Entry, StartDate, States } from "@/core/core";
import _ from "lodash";

export interface Product {
  purchaseDate: string;
  city: string;
  category: string;
  supplier: string;
  product: string;
  type: string;
  detail: string;
  brand: string;
  gender: string;
  code: string;
  color: string;
  size: string;
  purchasePrice: number;
  state: string;
  sellingDate: string;
  sellingPrice: number;
  credit: number;
  client: string;
  telephone: string;
  delivery: string;
  contact: string;
  note: string;
  address: string;
}

class Validation {
  purchaseDate: boolean = true;
  city: boolean = true;
  category: boolean = true;
  delivery: boolean = true;
  product: boolean = true;
  purchasePrice: boolean = true;
  state: boolean = true;
  sellingDate: boolean = true;
  sellingPrice: boolean = true;
  credit: boolean = true;
  client: boolean = true;
  telephone: boolean = true;

  public isValid() {
    const validValues = Object.values(this);
    for (const validValue of validValues) {
      if (!validValue) {
        return false;
      }
    }
    return true;
  }
}

export function ConvertAndValidate(entry: Entry): [Product, Validation] {
  const product: Product = {
    purchaseDate: "",
    city: "",
    category: "",
    supplier: "",
    product: "",
    type: "",
    detail: "",
    brand: "",
    gender: "",
    code: "",
    color: "",
    size: "",
    purchasePrice: NaN,
    state: "",
    sellingDate: "",
    sellingPrice: NaN,
    credit: NaN,
    client: "",
    telephone: "",
    delivery: "",
    contact: "",
    note: "",
    address: "",
  };
  const validation = new Validation();

  product.supplier = entry.supplier;
  product.type = entry.type;
  product.detail = entry.detail;
  product.brand = entry.brand;
  product.gender = entry.gender;
  product.code = entry.code;
  product.color = entry.color;
  product.size = entry.size;
  product.contact = entry.contact;
  product.note = entry.address;
  product.address = entry.address;

  /* eslint-disable */
  [product.city,          validation.city]                = isValidCity(entry.city);
  [product.category,      validation.category]            = isValidCategory(entry.category);
  [product.delivery,      validation.delivery]            = isValidDelivery(entry.delivery, entry.state);
  [product.product,       validation.product]             = isValidProduct(entry.product);
  [product.purchasePrice, validation.purchasePrice]       = isValidPurchasePrice(entry.purchasePrice);
  [product.state,         validation.state]               = isValidState(entry.state);
  [product.telephone,     validation.telephone]           = isValidTelephone(entry.telephone, entry.state);
  [product.client,        validation.client]              = isValidClient(entry.client, entry.state);
  [product.purchaseDate,  validation.purchaseDate]        = isValidPurchaseDate(entry.purchaseDate);
  [product.sellingDate,   validation.sellingDate]         = isValidSellingDate(entry.sellingDate, entry.purchaseDate, entry.state);
  [product.sellingPrice, product.credit, validation.city] = isValidSellingPriceAndCredit(entry.sellingPrice, entry.credit, entry.state);
  /* eslint-enable */

  return [product, validation];
}

export function isValidCity(city: string): [string, boolean] {
  return [city, Cities.includes(city)];
}

export function isValidCategory(category: string): [string, boolean] {
  const value = category;
  const valid = !_.isEmpty(category);
  return [value, valid];
}

export function isValidClient(
  client: string,
  state: string
): [string, boolean] {
  const value = client;
  let valid = false;
  switch (state) {
    case "Credito":
    case "Apartado":
      valid = !_.isEmpty(value);
      break;
    case "Vendido":
      valid = true;
      break;
    case "Sin vender":
    case "Dañado":
    case "Perdido":
      valid = _.isEmpty(value);
      break;
    default:
      valid = false;
  }
  return [value, valid];
}

export function isValidDelivery(
  delivery: string,
  state: string
): [string, boolean] {
  let valid = true;
  switch (state) {
    case "Vendido":
    case "Credito":
      valid = true;
      break;
    case "Apartado":
    case "Sin vender":
    case "Dañado":
    case "Perdido":
      valid = _.isEmpty(delivery);
      break;
    default:
      valid = false;
  }
  return [delivery, valid];
}

export function isValidSellingPriceAndCredit(
  sellingPrice: string,
  credit: string,
  state: string
): [number, number, boolean] {
  const sellingPriceAmount = convertAmountDecimals(sellingPrice);
  const creditAmount = convertAmountDecimals(credit);
  let valid = false;
  const priceIsEmptyOrValidNumber =
    _.isEmpty(sellingPrice) || !_.isNaN(sellingPriceAmount);
  const creditIsEmpty = _.isEmpty(credit);
  const priceIsValidNumber = !_.isNaN(sellingPriceAmount);
  const priceNotIsEmptyAndIsValidNumber =
    !_.isEmpty(sellingPrice) && !_.isNaN(sellingPriceAmount);
  const creditIsValidNumberAndLessThanPrice =
    !_.isNaN(creditAmount) && creditAmount < sellingPriceAmount;
  const priceAndCreditEmpty = _.isEmpty(sellingPrice) && _.isEmpty(credit);
  switch (state) {
    case "Sin vender":
      valid = priceIsEmptyOrValidNumber && creditIsEmpty;
      break;
    case "Vendido":
      valid = priceIsValidNumber && creditIsEmpty;
      break;
    case "Credito":
      valid =
        priceNotIsEmptyAndIsValidNumber &&
        (creditIsEmpty || creditIsValidNumberAndLessThanPrice);
      break;
    case "Apartado":
      valid = priceIsEmptyOrValidNumber && creditIsEmpty;
      break;
    case "Dañado":
    case "Perdido":
      valid = priceAndCreditEmpty;
      break;
    default:
      valid = false;
  }
  return [sellingPriceAmount, creditAmount, valid];
}

export function isValidProduct(product: string): [string, boolean] {
  const value = product;
  const valid = !_.isEmpty(product);
  return [value, valid];
}

export function isValidPurchasePrice(price: string): [number, boolean] {
  const value = convertAmountDecimals(price);
  const valid = !_.isNaN(value);
  return [value, valid];
}

export function isValidState(state: string): [string, boolean] {
  const value = state;
  const valid = States.includes(state);
  return [value, valid];
}

export function isValidSellingDate(
  sellingDate: string,
  purchaseDate: string,
  state: string
): [string, boolean] {
  const valueSellingDate = new Date(sellingDate);
  const valuePurchaseDate = new Date(purchaseDate);
  let valid = false;
  switch (state) {
    case "Vendido":
    case "Credito":
    case "Apartado":
      valid =
        isValidDate(valueSellingDate) && valueSellingDate >= valuePurchaseDate;
      break;
    case "Sin vender":
    case "Dañado":
    case "Perdido":
      valid = _.isEmpty(sellingDate);
      break;
    default:
      valid = false;
  }
  return [sellingDate, valid];
}

export function isValidPurchaseDate(date: string): [string, boolean] {
  const value = new Date(date);
  const valid = isValidDate(value);
  return [date, valid];
}

export function isValidDate(date: Date) {
  const value = date.getTime();

  const lowerBound = new Date(StartDate).getTime();
  const upperBound = Date.now();

  return lowerBound <= value && value <= upperBound;
}

export function isValidTelephone(
  telephone: string,
  state: string
): [string, boolean] {
  const regex = /^[1-9]\d{9}$/;
  const value = telephone;
  let valid = false;
  switch (state) {
    case "Vendido":
    case "Credito":
    case "Apartado":
      valid = regex.test(telephone) || _.isEmpty(telephone);
      break;
    case "Sin vender":
    case "Dañado":
    case "Perdido":
      valid = _.isEmpty(telephone);
      break;
    default:
      valid = false;
  }
  return [value, valid];
}

export function convertAmountDecimals(value: string): number {
  const regex = /^(?<integer>\d*)(\.?)(?<decimal>\d{0,2})$/;
  const match = value.match(regex);

  if (!match) {
    return NaN;
  }

  const integer = match.groups!.integer;
  const decimal = match.groups!.decimal;

  if (!integer.length && !decimal.length) {
    return NaN;
  }

  const integerNumber = parseInt(integer.padEnd(1, "0"));
  const decimalNumber = parseInt(decimal.padEnd(2, "0"));

  return 100 * integerNumber + decimalNumber;
}
