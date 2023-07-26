import { Cities, type Entry, StartDate, States } from "@/core/core";
import _ from "lodash";

export class Product {
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

class Validation {
  purchaseDate: boolean = true;
  city: boolean = true;
  category: boolean = true;
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
  const product = new Product();
  const validation = new Validation();

  product.color = entry.color;

  /* eslint-disable */
  [product.city,          validation.city]          = isValidCity(entry.city);
  [product.category,      validation.category]      = isValidCategory(entry.category);
  [product.sellingPrice,  validation.sellingPrice]  = isValidSellingPrice(entry.sellingPrice, entry.state);
  [product.product,       validation.product]       = isValidProduct(entry.product);
  [product.purchasePrice, validation.purchasePrice] = isValidPurchasePrice(entry.purchasePrice);
  [product.state,         validation.state]         = isValidState(entry.state);
  [product.telephone,     validation.telephone]     = isValidTelephone(entry.telephone, entry.state);
  [product.credit,        validation.credit]        = isValidCredit(entry.credit, entry.state, entry.sellingPrice);
  [product.client,        validation.client]        = isValidClient(entry.client, entry.state);
  [product.purchaseDate,  validation.purchaseDate]  = isValidPurchaseDate(entry.purchaseDate);
  [product.sellingDate,   validation.sellingDate]   = isValidSellingDate(entry.sellingDate, entry.purchaseDate, entry.state);
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
    case "SinVender":
    case "Dañado":
    case "Perdido":
      valid = _.isEmpty(value);
      break;
    default:
      valid = false;
  }
  return [value, valid];
}

export function isValidSellingPrice(
  amount: string,
  state: string
): [number | null, boolean] {
  amount = amount.trim();
  const value = convertAmountDecimals(amount);
  let valid = false;
  switch (state) {
    case "SinVender":
      valid = _.isEmpty(amount) || !_.isNull(value);
      break;
    case "Vendido":
    case "Credito":
    case "Apartado":
      valid = !_.isNull(value);
      break;
    case "Dañado":
    case "Perdido":
      valid = _.isEmpty(amount);
      break;
    default:
      valid = false;
  }
  return [value, valid];
}

export function isValidCredit(
  credit: string,
  sellingPrice: string,
  state: string
): [number | null, boolean] {
  credit = credit.trim();
  const value = convertAmountDecimals(credit);
  let price = convertAmountDecimals(sellingPrice);
  let valid = false;
  switch (state) {
    case "Credito":
      if (_.isNull(price)) {
        price = Infinity;
      }
      if ((!_.isNull(value) && value < price) || _.isEmpty(credit)) {
        valid = true;
      } else {
        valid = false;
      }
      break;
    case "Vendido":
    case "Apartado":
    case "SinVender":
    case "Dañado":
    case "Perdido":
      valid = _.isNull(value);
      break;
    default:
      valid = false;
  }
  return [value, valid];
}

export function isValidProduct(product: string): [string, boolean] {
  const value = product;
  const valid = !_.isEmpty(product);
  return [value, valid];
}

export function isValidPurchasePrice(price: string): [number | null, boolean] {
  const value = convertAmountDecimals(price);
  const valid = !_.isNull(value);
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
    case "SinVender":
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
    case "SinVender":
    case "Dañado":
    case "Perdido":
      valid = _.isEmpty(telephone);
      break;
    default:
      valid = false;
  }
  return [value, valid];
}

export function convertAmountDecimals(value: string): number | null {
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
