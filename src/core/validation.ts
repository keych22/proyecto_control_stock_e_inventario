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
  purchaseDate: boolean | string = true;
  city: boolean | string = true;
  category: boolean | string = true;
  delivery: boolean | string = true;
  product: boolean | string = true;
  purchasePrice: boolean | string = true;
  state: boolean | string = true;
  sellingDate: boolean | string = true;
  sellingPrice: boolean | string = true;
  credit: boolean | string = true;
  client: boolean | string = true;
  telephone: boolean | string = true;

  public getErrors() {
    const errors = [];
    for (const validation of Object.values(this)) {
      if (_.isString(validation)) {
        errors.push(validation);
      } else if (!validation) {
        errors.push("Hay un error de validación");
      }
    }
    return errors;
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
  [product.city,          validation.city]          = isValidCity(entry.city);
  [product.category,      validation.category]      = isValidCategory(entry.category);
  [product.delivery,      validation.delivery]      = isValidDelivery(entry.delivery, entry.state);
  [product.product,       validation.product]       = isValidProduct(entry.product);
  [product.purchasePrice, validation.purchasePrice] = isValidPurchasePrice(entry.purchasePrice);
  [product.state,         validation.state]         = isValidState(entry.state);
  [product.telephone,     validation.telephone]     = isValidTelephone(entry.telephone, entry.state);
  [product.client,        validation.client]        = isValidClient(entry.client, entry.state);
  [product.purchaseDate,  validation.purchaseDate]  = isValidPurchaseDate(entry.purchaseDate);
  [product.sellingDate,   validation.sellingDate]   = isValidSellingDate(entry.sellingDate, entry.purchaseDate, entry.state);
  [product.sellingPrice,  validation.city]          = isValidSellingPrice(entry.sellingPrice, entry.credit, entry.state);
  [product.credit, validation.city]                 = isValidCredit(entry.credit, entry.sellingPrice, entry.state);
  /* eslint-enable */

  return [product, validation];
}

export function isValidCity(city: string): [string, boolean | string] {
  const validation = Cities.includes(city) ? true : `Ciudad inválida "${city}"`;
  return [city, validation];
}

export function isValidCategory(category: string): [string, boolean | string] {
  const validation = !_.isEmpty(category)
    ? true
    : "Es necesario agregar una categoria";
  return [category, validation];
}

export function isValidClient(
  client: string,
  state: string
): [string, boolean | string] {
  let validation: boolean | string = true;
  switch (state) {
    case "Vendido":
      break;
    case "Credito":
    case "Apartado":
      if (_.isEmpty(client)) {
        validation = `Si es ${state.toLowerCase()} la condición del producto, el nombre del cliente no puede estar vacío`;
      }
      break;
    case "Sin vender":
    case "Dañado":
    case "Perdido":
    case "Robado":
      if (!_.isEmpty(client)) {
        validation = `El nombre del cliente debe estar vacío si el producto esta ${state.toLowerCase()}`;
      }
      break;
    default:
      validation = `La condición del producto "${state}" no es reconocida en la validación del cliente`;
      break;
  }
  return [client, validation];
}

export function isValidDelivery(
  delivery: string,
  state: string
): [string, boolean | string] {
  let validation: boolean | string = true;
  switch (state) {
    case "Vendido":
    case "Credito":
      break;
    case "Apartado":
    case "Sin vender":
    case "Dañado":
    case "Perdido":
    case "Robado":
      if (!_.isEmpty(delivery)) {
        validation = `La dirección debe estar vacía si el producto esta ${state.toLowerCase()}`;
      }
      break;
    default:
      validation = `La condición del producto "${state}" no es reconocida en la validación de la dirección`;
      break;
  }
  return [delivery, validation];
}

export function isValidSellingPrice(
  sellingPrice: string,
  credit: string,
  state: string
): [number, boolean | string] {
  const sellingPriceAmount = convertAmountDecimals(sellingPrice);
  const creditAmount = convertAmountDecimals(credit);

  const isSellingPriceInvalid = _.isNaN(sellingPriceAmount);

  const isSellingPriceEmpty = _.isEmpty(sellingPrice);
  const isSellingPriceNotEmpty = !isSellingPriceEmpty;

  const isSellingPriceNotEmptyAndInvalid =
    isSellingPriceNotEmpty && isSellingPriceInvalid;

  const isSellingPriceEmptyOrInvalid =
    isSellingPriceEmpty || isSellingPriceInvalid;

  const isCreditGreaterThanOrEqualToSellingPrice =
    creditAmount >= sellingPriceAmount;

  let validation: boolean | string = true;
  switch (state) {
    case "Sin vender":
    case "Apartado":
      if (isSellingPriceNotEmptyAndInvalid) {
        validation = `El precio de venta "${sellingPrice}" tiene formato inválido`;
      }
      break;
    case "Vendido":
      if (isSellingPriceEmptyOrInvalid) {
        validation = `El precio de venta "${sellingPrice}" esta vacío o tiene formato inválido para el producto vendido`;
      }
      break;
    case "Credito":
      if (isSellingPriceEmptyOrInvalid) {
        validation = `El precio de venta "${sellingPrice}" esta vacío o tiene formato inválido para el producto a crédito`;
      } else if (isCreditGreaterThanOrEqualToSellingPrice) {
        validation = `Si crédito es la condición de venta, el precio de venta $${sellingPrice} no puede ser menor o igual al abono`;
      }
      break;
    case "Dañado":
    case "Perdido":
      validation = true;
      break;
    case "Robado":
      if (isSellingPriceNotEmpty) {
        validation = `El precio de venta debe estar vacío si el producto esta ${state.toLowerCase()}`;
      }
      break;
    default:
      validation = `La condición del producto "${state}" no es reconocida en la validación del precio de venta`;
      break;
  }
  return [sellingPriceAmount, validation];
}

export function isValidCredit(
  credit: string,
  sellingPrice: string,
  state: string
): [number, boolean | string] {
  const creditAmount = convertAmountDecimals(credit);
  const sellingPriceAmount = convertAmountDecimals(sellingPrice);

  const isCreditInvalid = _.isNaN(creditAmount);

  const isCreditEmpty = _.isEmpty(credit);
  const isCreditNotEmpty = !isCreditEmpty;
  const isCreditNotEmptyAndInvalid = isCreditNotEmpty && isCreditInvalid;

  const isCreditGreaterThanOrEqualToSellingPrice =
    creditAmount >= sellingPriceAmount;

  let validation: boolean | string = true;
  switch (state) {
    case "Credito":
      if (isCreditNotEmptyAndInvalid) {
        validation = `El abono "${credit}" tiene un formato inválido`;
      } else if (isCreditGreaterThanOrEqualToSellingPrice) {
        validation = `Si crédito es la condición de venta, el abono $${credit} no puede ser mayor o igual al precio de venta`;
      }
      break;
    case "Vendido":
    case "Sin vender":
    case "Apartado":
    case "Dañado":
    case "Perdido":
    case "Robado":
      if (isCreditNotEmpty) {
        validation = `El abono debe estar vacío, si el producto esta ${state.toLowerCase()}`;
      }
      break;
    default:
      validation = `La condición del producto "${state}" no es reconocida en la validación del abono`;
      break;
  }
  return [creditAmount, validation];
}

export function isValidProduct(product: string): [string, boolean | string] {
  const validation = !_.isEmpty(product)
    ? true
    : `El producto "${product}" no puede estar vacío`;
  return [product, validation];
}

export function isValidPurchasePrice(
  purchasePrice: string
): [number, boolean | string] {
  const value = convertAmountDecimals(purchasePrice);
  const validation = !_.isNaN(value)
    ? true
    : `Formato del precio de compra ingresado no válido "${purchasePrice}" `;
  return [value, validation];
}

export function isValidState(state: string): [string, boolean | string] {
  const validation = States.includes(state)
    ? true
    : `El estado del producto "${state}" no es válido`;
  return [state, validation];
}

export function isValidSellingDate(
  sellingDate: string,
  purchaseDate: string,
  state: string
): [string, boolean | string] {
  const valueSellingDate = new Date(sellingDate);
  const valuePurchaseDate = new Date(purchaseDate);

  const isSellingDateInvalid = !isValidDate(valueSellingDate);
  const isSellingDateLessThanPurchaseDate =
    valueSellingDate < valuePurchaseDate;

  let validation: boolean | string = true;
  switch (state) {
    case "Vendido":
    case "Credito":
    case "Apartado":
      if (isSellingDateInvalid || isSellingDateLessThanPurchaseDate) {
        validation = `Fecha de venta inválida, en un rango no permitido o menor que la de compra. Fecha de venta "${sellingDate}" y fecha de compra "${purchaseDate}". `;
      }
      break;
    case "Sin vender":
    case "Dañado":
    case "Perdido":
    case "Robado":
      if (!_.isEmpty(sellingDate)) {
        validation = `La fecha de venta debe estar vacía si el producto esta ${state.toLowerCase()}`;
      }
      break;
    default:
      validation = `La condición del producto "${state}" no es reconocida en la validación de la fecha de venta`;
      break;
  }
  return [sellingDate, validation];
}

export function isValidPurchaseDate(
  purchaseDate: string
): [string, boolean | string] {
  const value = new Date(purchaseDate);
  const validation = isValidDate(value)
    ? true
    : `Fecha de compra "${purchaseDate}" incorrecta o rango inválido`;
  return [purchaseDate, validation];
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
): [string, boolean | string] {
  const regex = /^[1-9]\d{9}$/;

  const isTelephoneNotEmptyAndNotMatchRegex =
    !regex.test(telephone) && !_.isEmpty(telephone);

  let validation: boolean | string = true;
  switch (state) {
    case "Vendido":
    case "Credito":
    case "Apartado":
      if (isTelephoneNotEmptyAndNotMatchRegex) {
        validation = `Formato ingresado "${telephone}" es incorrecto, deben ser 10 dígitos únicamente sin empezar por 0`;
      }
      break;
    case "Sin vender":
    case "Dañado":
    case "Perdido":
    case "Robado":
      if (!_.isEmpty(telephone)) {
        validation = `El teléfono debe estar vacío si el producto esta ${state.toLowerCase()}`;
      }
      break;
    default:
      validation = `La condición del producto "${state}" no es reconocida en la validación del teléfono`;
      break;
  }
  return [telephone, validation];
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
