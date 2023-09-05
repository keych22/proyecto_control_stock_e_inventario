import {
  convertAmountDecimals,
  isValidCategory,
  isValidCity,
  isValidClient,
  isValidCredit,
  isValidDate,
  isValidDelivery,
  isValidProduct,
  isValidPurchaseDate,
  isValidPurchasePrice,
  isValidSellingDate,
  isValidSellingPrice,
  isValidState,
  isValidTelephone,
} from "@/core/validation";
import { describe, expect, it } from "vitest";
import { StartDate } from "@/core/core";

describe("Test isValidCity", () => {
  /* eslint-disable */
  const testCases = [ 
    { cities: ["NEUQUÉN", "BUENOS AIRES"], validation: true,  message: "correcto"   },
    { cities: ["DUMMY",        "" ],       validation: false, message: "incorrecto" }
  ];
  /* eslint-enable */
  testCases.forEach((testCase) => {
    testCase.cities.forEach((city) => {
      it(`"${city}" es un lugar ${testCase.message}`, () => {
        const [place, validation] = isValidCity(city);
        expect(place).to.be.equal(city);
        if (testCase.validation) {
          expect(validation).to.be.true;
        } else {
          // En caso de validation ser inválido o false, no sera de tipo booleano sino un string.
          expect(validation).to.be.string;
        }
      });
    });
  });
});

describe("Test isValidCategory", () => {
  describe("Existe categoría", () => {
    it("El producto tiene una categoría", () => {
      const [category, validation] = isValidCategory("ROPA");
      expect(category).to.be.equal("ROPA");
      expect(validation).to.be.true;
    });
  });
  describe("No hay categoría", () => {
    it("Todo producto requiere una categoría", () => {
      const [category, validation] = isValidCategory("");
      expect(category).to.be.equal("");
      expect(validation).to.be.string;
    });
  });
});

describe("Test isValidSellingPrice", () => {
  // const mensajeComun1 = "el precio no puede estar vacío";
  // const mensajeComun2 = "el precio puede estar vacío";
  /* eslint-disable */
    const testCases = [
      { sellingPrice: "",     credit: "50",  states: ["Vendido", "Credito"],                                                          result: {sellingPriceAmount: NaN  , validation: false, message: "es la condición del producto, el precio no puede estar vacío" }},
      { sellingPrice: "",     credit: "50",  states: ["Apartado", "Sin vender", "Dañado"],                                            result: {sellingPriceAmount: NaN  , validation: false, message: "es la condición del producto, el precio puede estar vacío" }},
      { sellingPrice: "",     credit: "50",  states: ["Robado", "Perdido"],                                                           result: {sellingPriceAmount: NaN  , validation: true , message: "es la condición del producto, el precio debe estar vacío" }},
      { sellingPrice: "100",  credit: "",    states: ["Robado", "Perdido"],                                                                      result: {sellingPriceAmount: 10000, validation: false, message: "es la condición del producto, no debe tener precio" }},
      { sellingPrice: "A",    credit: "50",  states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {sellingPriceAmount: NaN  , validation: false, message: "es la condición del producto, el precio no puede tener letras" }},
      { sellingPrice: "A100", credit: "50",  states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {sellingPriceAmount: NaN  , validation: false, message: "es la condición del producto, el precio no puede ser alfanumérico" }},
      { sellingPrice: "100",  credit: "50",  states: ["Credito"],                                                                     result: {sellingPriceAmount: 10000, validation: true , message: "es la condición del producto, el precio tiene que ser mayor al abono"}},
      { sellingPrice: "100",  credit: "100", states: ["Credito"],                                                                     result: {sellingPriceAmount: 10000, validation: false, message: "es la condición del producto, el abono no puede ser igual al precio" }},
      { sellingPrice: "100",  credit: "150", states: ["Credito"],                                                                     result: {sellingPriceAmount: 10000, validation: false, message: "es la condición del producto, el abono no puede ser mayor al precio" }}
    ];
    //tiene sentido que en los estados donde debe estar vacío no verifique A ni A100
    // y solo verifique con un numero? o debo hacerlo por seguridad y contemplar todos los
    //casos independientemente de la condicion?
    // Para un producto a credito el precio es mayor que el abono ESTE MENSAJE
    /* eslint-enable */
  testCases.forEach((test) => {
    test.states.forEach((state) => {
      it(`Si ${state} ${test.result.message} `, () => {
        const [sellingPriceAmount, validation] = isValidSellingPrice(
          test.sellingPrice,
          test.credit,
          state
        );
        expect(sellingPriceAmount).to.deep.equal(
          test.result.sellingPriceAmount
        );
        if (test.result.validation) {
          expect(validation).to.be.true;
        } else {
          // En caso de validation ser inválido o false, no sera de tipo booleano sino un string.
          expect(validation).to.be.string;
        }
      });
    });
  });
});

describe("Test isValidCredit", () => {
  /* eslint-disable */
    const testCases = [
      { credit: "50",   sellingPrice: "100", states: ["Credito"],                                                          result: {creditAmount: 5000,  validation: true , message: "El abono tiene un monto correcto"}},
      { credit: "50",   sellingPrice: "100", states: ["Vendido", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {creditAmount: 5000,  validation: false, message: "El abono debe estar vacío"}},
      { credit: "150",  sellingPrice: "100", states: ["Credito"],                                                          result: {creditAmount: 15000, validation: false, message: "El abono no puede ser mayor que el precio de venta" }},
      { credit: "",     sellingPrice: "100", states: ["Credito"],                                                          result: {creditAmount: NaN,   validation: true , message: "El abono puede estar vacío"}},
      { credit: "",     sellingPrice: "100", states: ["Vendido", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {creditAmount: NaN,   validation: true, message:  "El abono debe estar vacío"}},
      { credit: "A",    sellingPrice: "100", states: ["Credito"],                                                          result: {creditAmount: NaN,   validation: false, message: "El abono no puede tener letras"}},
      { credit: "A100", sellingPrice: "100", states: ["Credito"],                                                          result: {creditAmount: NaN,   validation: false, message: "El abono no puede ser alfanumérico"}}
    ];
    //MENSAJE: El producto a credito tiene un monto correcto
    /* eslint-enable */
  testCases.forEach((test) => {
    test.states.forEach((state) => {
      it(`${test.result.message}`, () => {
        const [creditAmount, validation] = isValidCredit(
          test.credit,
          test.sellingPrice,
          state
        );
        expect(creditAmount).to.deep.equal(test.result.creditAmount);
        if (test.result.validation) {
          expect(validation).to.be.true;
        } else {
          // En caso de validation ser inválido o false, no sera de tipo booleano sino un string.
          expect(validation).to.be.string;
        }
      });
    });
  });
});

describe("Test isValidDelivery", () => {
  describe("Test valid inputs", () => {
    /* eslint-disable */
    const testCases = [ 
      { place: "Winter", states : ["Vendido", "Credito"],                                    validation : true,  message: "Un producto a crédito o vendido, puede tener un lugar de entrega"   },
      { place: "Winter", states : ["Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], validation : false, message: "No puede tener un lugar de entrega" },
      { place:    "",    states : ["Vendido", "Credito"],                                    validation : true,  message: "Un producto puede no tener un lugar de entrega" },
      { place:    "",    states : ["Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], validation : true,  message: "No tiene un lugar de entrega"   }
    ]
    /* eslint-enable */
    testCases.forEach((test) => {
      test.states.forEach((state) => {
        it(`${test.message}`, () => {
          const [delivery, validation] = isValidDelivery(test.place, state);
          expect(delivery).to.be.equal(test.place);
          if (test.validation) {
            expect(validation).to.be.true;
          } else {
            // En caso de validation ser inválido o false, no sera de tipo booleano sino un string.
            expect(validation).to.be.string;
          }
        });
      });
    });
  });
});

describe("Test isValidState", () => {
  /* eslint-disable */
    const testCases = [
      { states: ["Vendido", "Credito", "Apartado", "Dañado", "Perdido", "Sin vender", "Robado"] , validation: true,  message: "es una condición permitida para el producto"   },
      { states: ["DUMMY", ""] ,                                                                   validation: false, message: "es una condición no permitida para el producto" } 
    ];
    /* eslint-enable */
  testCases.forEach((test) => {
    test.states.forEach((state) => {
      it(`"${state}" ${test.message}`, () => {
        const [condition, validation] = isValidState(state);
        expect(condition).is.equal(state);
        if (test.validation) {
          expect(validation).to.be.true;
        } else {
          // En caso de validation ser inválido o false, no sera de tipo booleano sino un string.
          expect(validation).to.be.string;
        }
      });
    });
  });
});

describe("Test isValidClient", () => {
  /* eslint-disable */
  const testCases = [ 
    {nombre: "Pedro", states : ["Vendido", "Credito", "Apartado"]           , validation : true , message: "puede tener un cliente"           },
    {nombre: "Pedro", states : ["Credito", "Apartado"]                      , validation : true , message: "debe tener un cliente"            },
    {nombre:   ""   , states : ["Credito", "Apartado"]                      , validation : false, message: "no puede estar sin cliente"       },
    {nombre:   ""   , states : ["Vendido"]                                  , validation : true , message: "puedo no tener un cliente"        },
    {nombre:   ""   , states : ["Sin vender", "Dañado", "Perdido", "Robado"], validation : true , message: "el nombre del cliente esta vacío" },
    {nombre: "Pedro", states : ["Sin vender", "Dañado", "Perdido", "Robado"], validation : false, message: "no puede tener un cliente"        }
];
  /* eslint-enable */
  testCases.forEach((test) => {
    test.states.forEach((state) => {
      it(`Si ${state} es la condición del producto, ${test.message}`, () => {
        const [client, validation] = isValidClient(test.nombre, state);
        expect(client).to.be.equal(test.nombre);
        if (test.validation) {
          expect(validation).to.be.true;
        } else {
          // En caso de validation ser inválido o false, no sera de tipo booleano sino un string.
          expect(validation).to.be.string;
        }
      });
    });
  });
});

describe("Test isValidProduct", () => {
  describe("Producto válido", () => {
    const item = "Pantalon";
    it(`${item} es un producto permitido`, () => {
      const [product, validation] = isValidProduct(item);
      expect(product).to.be.equal(item);
      expect(validation).to.be.true;
    });
  });
  describe("Producto inválido", () => {
    it("El producto no puede estar vacío", () => {
      const [product, validation] = isValidProduct("");
      expect(product).to.be.equal("");
      expect(validation).to.be.string;
    });
  });
});

describe("Test isValidPurchasePrice", () => {
  describe("Precios de compra permitidos", () => {
    /* eslint-disable */
  const testCases = [
    { purchasePrice: "100",  result: { amount: 10000, validation: true  }},
    { purchasePrice: "20.5", result: { amount: 2050,  validation: true  }},
];
    /* eslint-enable */
    testCases.forEach((test) => {
      it(`${test.purchasePrice} es un precio permitido y convertido a céntimos da ${test.result.amount}`, () => {
        const [price, validation] = isValidPurchasePrice(test.purchasePrice);
        expect(price).to.be.equal(test.result.amount);
        expect(validation).to.be.true;
      });
    });
  });
  describe("Precios de compra incorrectos", () => {
    /* eslint-disable */
    const testCases = [
      { purchasePrice: "",     result: { amount: NaN, validation: true  }},
      { purchasePrice: "a100", result: { amount: NaN, validation: true  }}
  ];
    /* eslint-enable */
    testCases.forEach((test) => {
      it(`El precio no puede ser "${test.purchasePrice}"`, () => {
        const [price, validation] = isValidPurchasePrice(test.purchasePrice);
        expect(price).to.be.NaN;
        expect(validation).to.be.string;
      });
    });
  });
});

describe("Test isValidSellingDate", () => {
  const dateBeforeStart = "2019-03-20";
  const dateAfterStart = "2019-06-13";
  const dateFormatInvalid = "2019/09/28";
  const validDate = "2021-10-15";
  const dateBeforeValid = "2021-03-11";
  const dateAfterValid = "2021-11-20";

  describe("Fechas de venta válidas", () => {
    /* eslint-disable */
  const testCases = [
    { sellingDate: validDate,      purchaseDate: validDate, states: ['Vendido' , 'Credito', 'Apartado'], result:{ sellingDate: validDate,      validation: true, message: "La fecha de venta puede ser igual a la de compra"  }},
    { sellingDate: dateAfterValid, purchaseDate: validDate, states: ['Vendido' , 'Credito', 'Apartado'], result:{ sellingDate: dateAfterValid, validation: true, message: "La fecha de venta es mayor a la de compra"}}
  ];
      /* eslint-enable */
    testCases.forEach((test) => {
      test.states.forEach((state) => {
        it(`${test.result.message}`, () => {
          const [sellingDate, validation] = isValidSellingDate(
            test.sellingDate,
            test.purchaseDate,
            state
          );
          expect(sellingDate).to.be.equal(test.result.sellingDate);
          if (test.result.validation) {
            expect(validation).to.be.true;
          } else {
            // En caso de validation ser inválido o false, no sera de tipo booleano sino un string.
            expect(validation).to.be.string;
          }
        });
      });
    });
  });
  describe("Fechas de venta válidas, comparadas con el inicio de Kchmodas", () => {
    /* eslint-disable */
  const testCases = [
    { sellingDate: StartDate,      purchaseDate: StartDate, states: ['Vendido' , 'Credito', 'Apartado'], result:{ sellingDate: StartDate,      validation: true, message: "La fecha de venta puede ser igual al inicio de kchmodas" }},
    { sellingDate: dateAfterStart, purchaseDate: StartDate, states: ['Vendido' , 'Credito', 'Apartado'], result:{ sellingDate: dateAfterStart, validation: true, message: "La fecha de venta puede ser posterior al inicio de kchmodas"}}
  ];
  /* eslint-enable */
    testCases.forEach((test) => {
      test.states.forEach((state) => {
        it(`"${test.result.message}"`, () => {
          const [sellingDate, validation] = isValidSellingDate(
            test.sellingDate,
            test.purchaseDate,
            state
          );
          expect(sellingDate).to.be.equal(test.result.sellingDate);
          if (test.result.validation) {
            expect(validation).to.be.true;
          } else {
            // En caso de validation ser inválido o false, no sera de tipo booleano sino un string.
            expect(validation).to.be.string;
          }
        });
      });
    });
  });
  describe("Fechas de venta vacías", () => {
    /* eslint-disable */
  const testCases = [
    { sellingDate: "", purchaseDate: validDate, states: ["Sin vender", "Dañado", "Perdido", "Robado"], result:{ sellingDate: "", validation: true, message: "la fecha de venta es vacía"}}
  ];
      /* eslint-enable */
    testCases.forEach((test) => {
      test.states.forEach((state) => {
        it(`Un producto ${state} "${test.result.message}"`, () => {
          const [sellingDate, validation] = isValidSellingDate(
            test.sellingDate,
            test.purchaseDate,
            state
          );
          expect(sellingDate).to.be.equal(test.result.sellingDate);
          if (test.result.validation) {
            expect(validation).to.be.true;
          } else {
            // En caso de validation ser inválido o false, no sera de tipo booleano sino un string.
            expect(validation).to.be.string;
          }
        });
      });
    });
  });
  describe("Fechas de venta inválidas, comparadas con el inicio de kchmodas", () => {
    /* eslint-disable */
const testCases = [
  { sellingDate: dateBeforeStart,   purchaseDate: StartDate, states: ['Vendido' , 'Credito', 'Apartado'], result:{ sellingDate: dateBeforeStart,   validation: false, message: "no puede ser anterior al inicio de kchmodas" }},
  { sellingDate: dateFormatInvalid, purchaseDate: StartDate, states: ['Vendido' , 'Credito', 'Apartado'], result:{ sellingDate: dateFormatInvalid, validation: false, message: "tiene un formato no permitido" }}
];
    /* eslint-enable */
    testCases.forEach((test) => {
      test.states.forEach((state) => {
        it(`Si ${state} es la condición del producto, ${test.sellingDate} ${test.result.message} `, () => {
          const [sellingDate, validation] = isValidSellingDate(
            test.sellingDate,
            test.purchaseDate,
            state
          );
          expect(sellingDate).to.be.equal(test.result.sellingDate);
          if (test.result.validation) {
            expect(validation).to.be.true;
          } else {
            // En caso de validation ser inválido o false, no sera de tipo booleano sino un string.
            expect(validation).to.be.string;
          }
        });
      });
    });
  });
  describe("Condición de venta con fechas vacías", () => {
    /* eslint-disable */
const testCases = [
  { sellingDate: StartDate,         purchaseDate: StartDate, states: ["Sin vender", "Dañado", "Perdido", "Robado"], result:{ sellingDate: StartDate,         validation: false, message: "la fecha debe estar vacía"}},
  { sellingDate: dateAfterStart,    purchaseDate: StartDate, states: ["Sin vender", "Dañado", "Perdido", "Robado"], result:{ sellingDate: dateAfterStart,    validation: false, message: "la fecha debe estar vacía"}},
  { sellingDate: dateBeforeStart,   purchaseDate: StartDate, states: ["Sin vender", "Dañado", "Perdido", "Robado"], result:{ sellingDate: dateBeforeStart,   validation: false, message: "la fecha debe estar vacía"}},
  { sellingDate: dateFormatInvalid, purchaseDate: StartDate, states: ["Sin vender", "Dañado", "Perdido", "Robado"], result:{ sellingDate: dateFormatInvalid, validation: false, message: "la fecha debe estar vacía"}},
  { sellingDate: validDate,         purchaseDate: validDate, states: ["Sin vender", "Dañado", "Perdido", "Robado"], result:{ sellingDate: validDate,         validation: false, message: "la fecha debe estar vacía"}}
];
    /* eslint-enable */
    testCases.forEach((test) => {
      test.states.forEach((state) => {
        it(`Si ${state} es la condición del producto, ${test.result.message}`, () => {
          const [sellingDate, validation] = isValidSellingDate(
            test.sellingDate,
            test.purchaseDate,
            state
          );
          expect(sellingDate).to.be.equal(test.result.sellingDate);
          if (test.result.validation) {
            expect(validation).to.be.true;
          } else {
            // En caso de validation ser inválido o false, no sera de tipo booleano sino un string.
            expect(validation).to.be.string;
          }
        });
      });
    });
  });
  describe("Fechas de venta con rangos y formatos inválidos", () => {
  /* eslint-disable */
const testCases = [
  { sellingDate: dateBeforeValid,   purchaseDate: validDate, states: ['Vendido' , 'Credito', 'Apartado'], result:{ sellingDate: dateBeforeValid,   validation: false, message: "no puede ser posterior a la de compra" }},
  { sellingDate: dateFormatInvalid, purchaseDate: validDate, states: ['Vendido' , 'Credito', 'Apartado'], result:{ sellingDate: dateFormatInvalid, validation: false, message: "tiene un formato no permitido" }}
];
      /* eslint-enable */
    testCases.forEach((test) => {
      test.states.forEach((state) => {
        it(`Si ${state} es la condición del producto, ${test.sellingDate} ${test.result.message}`, () => {
          const [sellingDate, validation] = isValidSellingDate(
            test.sellingDate,
            test.purchaseDate,
            state
          );
          expect(sellingDate).to.be.equal(test.result.sellingDate);
          if (test.result.validation) {
            expect(validation).to.be.true;
          } else {
            // En caso de validation ser inválido o false, no sera de tipo booleano sino un string.
            expect(validation).to.be.string;
          }
        });
      });
    });
  });
});

describe("Test isValidPurchaseDate", () => {
  describe("Fechas de compra permitidas", () => {
    it("La fecha puede ser igual al inicio de kchmodas", () => {
      const [purchaseDate, validation] = isValidPurchaseDate("2019-04-22");
      expect(purchaseDate).is.equal("2019-04-22");
      expect(validation).to.be.true;
    });
    it("La fecha puede ser posterior al inicio de kchmodas", () => {
      const [purchaseDate, validation] = isValidPurchaseDate("2022-04-30");
      expect(purchaseDate).is.equal("2022-04-30");
      expect(validation).to.be.true;
    });
  });
  describe("Fechas de compra no permitidas", () => {
    const date = "2020/04/21";
    it(`Fecha ${date} con formato no permitido`, () => {
      const [purchaseDate, validation] = isValidPurchaseDate(date);
      expect(purchaseDate).is.equal("2020/04/21");
      expect(validation).to.be.string;
    });
    it("Fecha anterior al inicio de kchmodas", () => {
      const [purchaseDate, validation] = isValidPurchaseDate("2019-04-21");
      expect(purchaseDate).is.equal("2019-04-21");
      expect(validation).to.be.string;
    });
  });
});

describe("Test isValidDate", () => {
  function dateBefore(date: Date) {
    const dateBefore = new Date(date);
    dateBefore.setDate(dateBefore.getDate() - 1);
    return dateBefore;
  }

  function dateAfter(date: Date) {
    const datAfter = new Date(date);
    datAfter.setDate(datAfter.getDate() + 1);
    return datAfter;
  }

  const startDate = new Date(StartDate);
  const dayBeforeStartDate = dateBefore(startDate);
  const dayAfterStartDate = dateAfter(startDate);

  const today = new Date();
  const yesterday = dateBefore(today);
  const tomorrow = dateAfter(today);

  it("Test day before start date", () => {
    expect(isValidDate(dayBeforeStartDate)).to.be.false;
  });

  it("Test start date", () => {
    expect(isValidDate(startDate)).to.be.true;
  });

  it("Test day after start date", () => {
    expect(isValidDate(dayAfterStartDate)).to.be.true;
  });

  it("Test yesterday", () => {
    expect(isValidDate(yesterday)).to.be.true;
  });

  it("Test today", () => {
    expect(isValidDate(today)).to.be.true;
  });

  it("Test tomorrow", () => {
    expect(isValidDate(tomorrow)).to.be.false;
  });
});

describe("Test isValidTelephone", () => {
  describe("Condición del producto: Vendido, Crédito o Apartado", () => {
    /* eslint-disable */
  const testCases = [ 
    { phone: "1135735745", states : ["Vendido", "Credito", "Apartado"], validation : true, message: "El cliente puede tener un teléfono"  },
    { phone:      "",      states : ["Vendido", "Credito", "Apartado"], validation : true, message: "El telefono puede estar vacío, es opcional"  }
  ]
  /* eslint-enable */
    testCases.forEach((test) => {
      test.states.forEach((state) => {
        it(`${test.phone}`, () => {
          const [telephone, validation] = isValidTelephone(test.phone, state);
          expect(telephone).to.be.equal(test.phone);
          if (test.validation) {
            expect(validation).to.be.true;
          } else {
            // En caso de validation ser inválido o false, no sera de tipo booleano sino un string.
            expect(validation).to.be.string;
          }
        });
      });
    });
  });
  describe("Formatos de teléfono inválidos", () => {
    /* eslint-disable */
  const testCases = [ 
    { phone:    "1135",     states : ["Vendido", "Credito", "Apartado"], validation : false },
    { phone: "0135735745",  states : ["Vendido", "Credito", "Apartado"], validation : false },
    { phone: "11-35735745", states : ["Vendido", "Credito", "Apartado"], validation : false },
  ]
  /* eslint-enable */
    testCases.forEach((test) => {
      test.states.forEach((state) => {
        it(`El teléfono "${test.phone}" tiene un formato incorrecto`, () => {
          const [telephone, validation] = isValidTelephone(test.phone, state);
          expect(telephone).to.be.equal(test.phone);
          if (test.validation) {
            expect(validation).to.be.true;
          } else {
            // En caso de validation ser inválido o false, no sera de tipo booleano sino un string.
            expect(validation).to.be.string;
          }
        });
      });
    });
  });
  describe("Numéro telefónico vacío", () => {
    /* eslint-disable */
  const testCases = [ 
    { phone: "", states : ["Sin vender", "Dañado", "Perdido", "Robado"], validation : true, message: "Para estados del producto"  }
  ]
  /* eslint-enable */
    testCases.forEach((test) => {
      test.states.forEach((state) => {
        it(`${test.message} "${state}", el teléfono debe estar vacío`, () => {
          const [telephone, validation] = isValidTelephone(test.phone, state);
          expect(telephone).to.be.equal(test.phone);
          if (test.validation) {
            expect(validation).to.be.true;
          } else {
            // En caso de validation ser inválido o false, no sera de tipo booleano sino un string.
            expect(validation).to.be.string;
          }
        });
      });
    });
  });
  describe("Estados que no requieren un teléfono", () => {
    /* eslint-disable */
  const testCases = [ 
    { phone: "1135735745", states : ["Sin vender", "Dañado", "Perdido", "Robado"], validation : false, message: "Para producto"}
  ]
    /* eslint-enable */
    testCases.forEach((test) => {
      test.states.forEach((state) => {
        it(`${test.message} ${state}, no puede haber un número telefónico`, () => {
          const [telephone, validation] = isValidTelephone(test.phone, state);
          expect(telephone).to.be.equal(test.phone);
          if (test.validation) {
            expect(validation).to.be.true;
          } else {
            // En caso de validation ser inválido o false, no sera de tipo booleano sino un string.
            expect(validation).to.be.string;
          }
        });
      });
    });
  });
});

describe("Test convertAmountDecimals", () => {
  it("Test valid inputs", () => {
    expect(convertAmountDecimals("0")).to.be.eql(0);

    expect(convertAmountDecimals(".0")).to.be.eql(0);
    expect(convertAmountDecimals(".1")).to.be.eql(10);
    expect(convertAmountDecimals(".2")).to.be.eql(20);

    expect(convertAmountDecimals(".00")).to.be.eql(0);
    expect(convertAmountDecimals(".10")).to.be.eql(10);
    expect(convertAmountDecimals(".20")).to.be.eql(20);

    expect(convertAmountDecimals(".01")).to.be.eql(1);
    expect(convertAmountDecimals(".02")).to.be.eql(2);
    expect(convertAmountDecimals(".12")).to.be.eql(12);

    expect(convertAmountDecimals("0.")).to.be.eql(0);
    expect(convertAmountDecimals("1.")).to.be.eql(100);
    expect(convertAmountDecimals("2.")).to.be.eql(200);

    expect(convertAmountDecimals("00.")).to.be.eql(0);
    expect(convertAmountDecimals("10.")).to.be.eql(1000);
    expect(convertAmountDecimals("20.")).to.be.eql(2000);

    expect(convertAmountDecimals("01.")).to.be.eql(100);
    expect(convertAmountDecimals("02.")).to.be.eql(200);

    expect(convertAmountDecimals("0.0")).to.be.eql(0);
    expect(convertAmountDecimals("0.01")).to.be.eql(1);
    expect(convertAmountDecimals("0.1")).to.be.eql(10);
    expect(convertAmountDecimals("1.0")).to.be.eql(100);
    expect(convertAmountDecimals("1.1")).to.be.eql(110);
    expect(convertAmountDecimals("1.01")).to.be.eql(101);
  });

  it("Test invalid inputs", () => {
    expect(convertAmountDecimals("")).is.NaN;
    expect(convertAmountDecimals(".")).is.NaN;
    expect(convertAmountDecimals("1.234")).is.NaN;
  });
});
