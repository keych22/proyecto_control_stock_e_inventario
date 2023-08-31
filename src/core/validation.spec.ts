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
    { cities: ["NEUQUÉN", "BUENOS AIRES"], validation: true,  message: "válido"   },
    { cities: ["DUMMY",        ""       ], validation: false, message: "inválido" }
  ];
  /* eslint-enable */
  testCases.forEach((testCase) => {
    testCase.cities.forEach((city) => {
      it(`Si la ciudad es ${city} es un lugar ${testCase.message}`, () => {
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
  it("Test valid inputs", () => {
    const [category, validation] = isValidCategory("ROPA");
    expect(category).to.be.equal("ROPA");
    expect(validation).to.be.true;
  });
  it("Test invalid inputs", () => {
    const [category, validation] = isValidCategory("");
    expect(category).to.be.equal("");
    expect(validation).to.be.string;
  });
});

describe("Test isValidSellingPrice", () => {
  /* eslint-disable */
    const testCases = [
      { sellingPrice: "",     credit: "",    states: ["Vendido", "Credito"],                                                          result: {sellingPriceAmount: NaN,   validation: false, message: "inválido" }},
      { sellingPrice: "",     credit: "",    states: ["Apartado", "Sin vender", "Dañado", "Perdido", "Robado"],                       result: {sellingPriceAmount: NaN,   validation: true , message: "válido"   }},
      { sellingPrice: "",     credit: "50",  states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {sellingPriceAmount: NaN,   validation: false, message: "inválido" }},
      { sellingPrice: "",     credit: "B",   states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {sellingPriceAmount: NaN,   validation: false, message: "inválido" }},
      { sellingPrice: "A",    credit: "",    states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {sellingPriceAmount: NaN,   validation: false, message: "inválido" }},
      { sellingPrice: "A",    credit: "B",   states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {sellingPriceAmount: NaN,   validation: false, message: "inválido" }},
      { sellingPrice: "A",    credit: "50",  states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {sellingPriceAmount: NaN,   validation: false, message: "inválido" }},
      { sellingPrice: "A100", credit: "",    states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {sellingPriceAmount: NaN,   validation: false, message: "inválido" }},
      { sellingPrice: "A100", credit: "50",  states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {sellingPriceAmount: NaN,   validation: false, message: "inválido" }},
      { sellingPrice: "100A", credit: "50B", states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {sellingPriceAmount: NaN,   validation: false, message: "inválido" }},
      { sellingPrice: "100A", credit: "B",   states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {sellingPriceAmount: NaN,   validation: false, message: "inválido" }},
      { sellingPrice: "100",  credit: "",    states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido"],           result: {sellingPriceAmount: 10000, validation: true , message: "válido"   }},
      { sellingPrice: "100",  credit: "",    states: ["Robado"],                                                                      result: {sellingPriceAmount: 10000, validation: false, message: "inválido" }},
      { sellingPrice: "100",  credit: "50",  states: ["Credito"],                                                                     result: {sellingPriceAmount: 10000, validation: true , message: "válido"   }},
      { sellingPrice: "100",  credit: "100", states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {sellingPriceAmount: 10000, validation: false, message: "inválido" }},
      { sellingPrice: "100",  credit: "B",   states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {sellingPriceAmount: 10000, validation: false, message: "inválido" }},
      { sellingPrice: "100",  credit: "50B", states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {sellingPriceAmount: 10000, validation: false, message: "inválido" }},
      { sellingPrice: "100",  credit: "150", states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {sellingPriceAmount: 10000, validation: false, message: "inválido" }}
    ];
    /* eslint-enable */
  testCases.forEach((test) => {
    test.states.forEach((state) => {
      it(`Si el precio es "${test.sellingPrice}", el crédito "${test.credit}" y el estado "${state}" es ${test.result.message}`, () => {
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
      { credit: "50",   sellingPrice: "100", states: ["Credito"],                                                                     result: {creditAmount: 5000,  validation: true , message: "válido"   }},
      { credit: "50",   sellingPrice: "100", states: ["Vendido", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"],            result: {creditAmount: 5000,  validation: false, message: "inválido" }},
      { credit: "150",  sellingPrice: "100", states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {creditAmount: 15000, validation: false, message: "inválido" }},
      { credit: "",     sellingPrice: "100", states: ["Credito"],                                                                     result: {creditAmount: NaN,   validation: true , message: "válido"   }},
      { credit: "",     sellingPrice: "100", states: ["Vendido", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"],            result: {creditAmount: NaN,   validation: false, message: "inválido" }},
      { credit: "A",    sellingPrice: "100", states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {creditAmount: NaN,   validation: false, message: "inválido" }},
      { credit: "A100", sellingPrice: "100", states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {creditAmount: NaN,   validation: false, message: "inválido" }}
    ];
    /* eslint-enable */
  testCases.forEach((test) => {
    test.states.forEach((state) => {
      it(`Si el crédito es "${test.credit}", el precio de venta "${test.sellingPrice}" y el estado "${state}" es ${test.result.message}`, () => {
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
      { place: "Winter", states : ["Vendido", "Credito"],                                    validation : true,  message: "válido"   },
      { place: "Winter", states : ["Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], validation : false, message: "inválido" },
      { place:    "",    states : ["Vendido", "Credito"],                                    validation : false, message: "inválido" },
      { place:    "",    states : ["Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], validation : true,  message: "válido"   }
    ]
    /* eslint-enable */
    testCases.forEach((test) => {
      test.states.forEach((state) => {
        it(`Si "${state}" es la condición del producto y hay un lugar de entrega indicado, es ${test.message}`, () => {
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
      { states: ["Vendido", "Credito", "Apartado", "Dañado", "Perdido", "Sin vender", "Robado"] , validation: true,  message: "válido"   },
      { states: ["DUMMY", ""] ,                                                                   validation: false, message: "inválido" } 
    ];
    /* eslint-enable */
  testCases.forEach((test) => {
    test.states.forEach((state) => {
      it(`Si ${state} es la condición del producto, es un estado ${test.message}`, () => {
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
    {nombre: "Pedro", states : ["Vendido", "Credito", "Apartado"],                       validation : true,  message: "correcto"   },
    {nombre:    "",   states : ["Vendido", "Sin vender", "Dañado", "Perdido", "Robado"], validation : true,  message: "correcto"   },
    {nombre: "Pedro", states : ["Sin vender", "Dañado", "Perdido", "Robado"],            validation : false, message: "incorrecto" },
    {nombre:    "",   states : ["Credito", "Apartado"],                                  validation : false, message: "incorrecto" }
];
  /* eslint-enable */
  testCases.forEach((test) => {
    test.states.forEach((state) => {
      it(`Si ${state} es la condición del producto y hay un nombre de cliente asociado, es ${test.message}`, () => {
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
  it("Test valid inputs", () => {
    const [product, validation] = isValidProduct("Camisa");
    expect(product).to.be.equal("Camisa");
    expect(validation).to.be.true;
  });
  it("Test invalid inputs", () => {
    const [product, validation] = isValidProduct("");
    expect(product).to.be.equal("");
    expect(validation).to.be.string;
  });
});

describe("Test isValidPurchasePrice", () => {
  describe("Test valid inputs", () => {
    /* eslint-disable */
  const testCases = [
    { purchasePrice: "100",  result: { amount: 10000, validation: true  }},
    { purchasePrice: "20.5", result: { amount: 2050,  validation: true  }},
];
    /* eslint-enable */
    testCases.forEach((test) => {
      it(`Si el precio es ${test.purchasePrice}, tiene un formato válido y sera convertido a céntimos ${test.result.amount}`, () => {
        const [price, validation] = isValidPurchasePrice(test.purchasePrice);
        expect(price).to.be.equal(test.result.amount);
        expect(validation).to.be.true;
      });
    });
  });
  describe("Test invalid inputs", () => {
    /* eslint-disable */
    const testCases = [
      { purchasePrice: "",     result: { amount: NaN, validation: true  }},
      { purchasePrice: "a100", result: { amount: NaN, validation: true  }}
  ];
    /* eslint-enable */
    testCases.forEach((test) => {
      it(`Si precio es "${test.purchasePrice}" tiene un formato inválido, lo que representa un "${test.result.amount}"`, () => {
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
  describe("Case 1: test valid inputs", () => {
    /* eslint-disable */
  const testCases = [
    { sellingDate: validDate,      purchaseDate: validDate, states: ['Vendido' , 'Credito', 'Apartado'], result:{ sellingDate: validDate,      validation: true }},
    { sellingDate: dateAfterValid, purchaseDate: validDate, states: ['Vendido' , 'Credito', 'Apartado'], result:{ sellingDate: dateAfterValid, validation: true }}
  ];
      /* eslint-enable */
    testCases.forEach((test) => {
      test.states.forEach((state) => {
        it(`Si ${state} es la condición del producto y la fecha de venta "${test.sellingDate}" es igual o posterior a la de compra "${test.purchaseDate}", es válido`, () => {
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
  describe("Case 2: test valid inputs", () => {
    /* eslint-disable */
  const testCases = [
    { sellingDate: StartDate,      purchaseDate: StartDate, states: ['Vendido' , 'Credito', 'Apartado'], result:{ sellingDate: StartDate,      validation: true }},
    { sellingDate: dateAfterStart, purchaseDate: StartDate, states: ['Vendido' , 'Credito', 'Apartado'], result:{ sellingDate: dateAfterStart, validation: true }}
  ];
  /* eslint-enable */
    testCases.forEach((test) => {
      test.states.forEach((state) => {
        it(`Si ${state} es la condición del producto y la fecha de venta "${test.sellingDate}" es igual o posterior a la fecha de inicio de KchModas "${test.purchaseDate}" es válido`, () => {
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
  describe("Case 3: test invalid inputs", () => {
    /* eslint-disable */
  const testCases = [
    { sellingDate: "", purchaseDate: validDate, states: ["Sin vender", "Dañado", "Perdido", "Robado"], result:{ sellingDate: "", validation: true }}
  ];
      /* eslint-enable */
    testCases.forEach((test) => {
      test.states.forEach((state) => {
        it(`Si ${state} es la condición del producto y la fecha de venta "${test.sellingDate}" esta vacía, es válido`, () => {
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
  describe("Case 4: test invalid inputs", () => {
    /* eslint-disable */
const testCases = [
  { sellingDate: dateBeforeStart,   purchaseDate: StartDate, states: ['Vendido' , 'Credito', 'Apartado'], result:{ sellingDate: dateBeforeStart,   validation: false }},
  { sellingDate: dateFormatInvalid, purchaseDate: StartDate, states: ['Vendido' , 'Credito', 'Apartado'], result:{ sellingDate: dateFormatInvalid, validation: false }}
];
  /* eslint-enable */
    testCases.forEach((test) => {
      test.states.forEach((state) => {
        it(`Si la fecha de venta "${test.sellingDate}" es anterior a la fecha de compra "${test.purchaseDate}" o tiene un formato no permitido, es inválido`, () => {
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
  describe("Case 5: test invalid inputs", () => {
    /* eslint-disable */
const testCases = [
  { sellingDate: StartDate,         purchaseDate: StartDate, states: ["Sin vender", "Dañado", "Perdido", "Robado"], result:{ sellingDate: StartDate,         validation: false,}},
  { sellingDate: dateAfterStart,    purchaseDate: StartDate, states: ["Sin vender", "Dañado", "Perdido", "Robado"], result:{ sellingDate: dateAfterStart,    validation: false,}},
  { sellingDate: dateBeforeStart,   purchaseDate: StartDate, states: ["Sin vender", "Dañado", "Perdido", "Robado"], result:{ sellingDate: dateBeforeStart,   validation: false,}},
  { sellingDate: dateFormatInvalid, purchaseDate: StartDate, states: ["Sin vender", "Dañado", "Perdido", "Robado"], result:{ sellingDate: dateFormatInvalid, validation: false,}},
  { sellingDate: validDate,         purchaseDate: validDate, states: ["Sin vender", "Dañado", "Perdido", "Robado"], result:{ sellingDate: validDate,         validation: false }}
];
    /* eslint-enable */
    testCases.forEach((test) => {
      test.states.forEach((state) => {
        it(`Si ${state} es la condición del producto y hay una fecha de venta "${test.sellingDate}", es inválido`, () => {
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
  describe("Case 6: test invalid inputs", () => {
  /* eslint-disable */
const testCases = [
  { sellingDate: dateBeforeValid,   purchaseDate: validDate, states: ['Vendido' , 'Credito', 'Apartado'], result:{ sellingDate: dateBeforeValid,   validation: false }},
  { sellingDate: dateFormatInvalid, purchaseDate: validDate, states: ['Vendido' , 'Credito', 'Apartado'], result:{ sellingDate: dateFormatInvalid, validation: false }}
];
      /* eslint-enable */
    testCases.forEach((test) => {
      test.states.forEach((state) => {
        it(`Si ${state} es la condición del producto y la fecha de venta "${test.sellingDate}" es anterior a la de compra "${test.purchaseDate}" o tiene un formato no permitido, es inválido`, () => {
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

describe("Test isValidSellingDate", () => {
  const dateBeforeStart = "2019-03-20";
  const dateAfterStart = "2019-06-13";
  const dateFormatInvalid = "2019/09/28";
  const validDate = "2021-10-15";
  const dateBeforeValid = "2021-03-11";
  const dateAfterValid = "2021-11-20";
  /* eslint-disable */
  const testCases = [
    { sellingDate: StartDate,         purchaseDate: StartDate, states: ['Vendido' , 'Credito', 'Apartado'],           result:{ sellingDate: StartDate,         validation: true,  message: "válido"   }},
    { sellingDate: dateAfterStart,    purchaseDate: StartDate, states: ['Vendido' , 'Credito', 'Apartado'],           result:{ sellingDate: dateAfterStart,    validation: true,  message: "válido"   }},
    { sellingDate: dateBeforeStart,   purchaseDate: StartDate, states: ['Vendido' , 'Credito', 'Apartado'],           result:{ sellingDate: dateBeforeStart,   validation: false, message: "inválido" }},
    { sellingDate: dateFormatInvalid, purchaseDate: StartDate, states: ['Vendido' , 'Credito', 'Apartado'],           result:{ sellingDate: dateFormatInvalid, validation: false, message: "inválido" }},
    { sellingDate: StartDate,         purchaseDate: StartDate, states: ["Sin vender", "Dañado", "Perdido", "Robado"], result:{ sellingDate: StartDate,         validation: false, message: "inválido" }},
    { sellingDate: dateAfterStart,    purchaseDate: StartDate, states: ["Sin vender", "Dañado", "Perdido", "Robado"], result:{ sellingDate: dateAfterStart,    validation: false, message: "inválido" }},
    { sellingDate: dateBeforeStart,   purchaseDate: StartDate, states: ["Sin vender", "Dañado", "Perdido", "Robado"], result:{ sellingDate: dateBeforeStart,   validation: false, message: "inválido" }},
    { sellingDate: dateFormatInvalid, purchaseDate: StartDate, states: ["Sin vender", "Dañado", "Perdido", "Robado"], result:{ sellingDate: dateFormatInvalid, validation: false, message: "inválido" }},
    { sellingDate: validDate,         purchaseDate: validDate, states: ['Vendido' , 'Credito', 'Apartado'],           result:{ sellingDate: validDate,         validation: true,  message: "válido"   }},
    { sellingDate: dateAfterValid,    purchaseDate: validDate, states: ['Vendido' , 'Credito', 'Apartado'],           result:{ sellingDate: dateAfterValid,    validation: true,  message: "válido"   }},
    { sellingDate: dateBeforeValid,   purchaseDate: validDate, states: ['Vendido' , 'Credito', 'Apartado'],           result:{ sellingDate: dateBeforeValid,   validation: false, message: "inválido" }},
    { sellingDate: dateFormatInvalid, purchaseDate: validDate, states: ['Vendido' , 'Credito', 'Apartado'],           result:{ sellingDate: dateFormatInvalid, validation: false, message: "inválido" }},
    { sellingDate: "",                purchaseDate: validDate, states: ["Sin vender", "Dañado", "Perdido", "Robado"], result:{ sellingDate: "",                validation: true,  message: "válido"   }},
    { sellingDate: validDate,         purchaseDate: validDate, states: ["Sin vender", "Dañado", "Perdido", "Robado"], result:{ sellingDate: validDate,         validation: false, message: "inválido" }}
  ];
  /* eslint-enable */
  testCases.forEach((test) => {
    test.states.forEach((state) => {
      it(`Si ${state} es la condición del producto, la fecha de venta "${test.sellingDate}" tiene el formato permitido, no esta vacía y es igual o posterior a la fecha de compra "${test.purchaseDate}" es ${test.result.message} `, () => {
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

describe("Test isValidPurchaseDate", () => {
  describe("Test valid inputs", () => {
    it("Igual a la fecha de inicio de actividades de kchmodas", () => {
      const [purchaseDate, validation] = isValidPurchaseDate("2019-04-22");
      expect(purchaseDate).is.equal("2019-04-22");
      expect(validation).to.be.true;
    });
    it("Fecha posterior al inicio de actividades de kchmodas", () => {
      const [purchaseDate, validation] = isValidPurchaseDate("2022-04-30");
      expect(purchaseDate).is.equal("2022-04-30");
      expect(validation).to.be.true;
    });
  });
  describe("Test invalid inputs", () => {
    it("Fecha anterior al inicio de actividades de kchmodas", () => {
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
  describe("Case 1", () => {
    /* eslint-disable */
  const testCases = [ 
    { phone: "1135735745", states : ["Vendido", "Credito", "Apartado"], validation : true  },
    { phone:      "",      states : ["Vendido", "Credito", "Apartado"], validation : true  }
  ]
  /* eslint-enable */
    testCases.forEach((test) => {
      test.states.forEach((state) => {
        it(`Si ${state} es la condición del producto y el teléfono cumple el formato de diez dígitos "${test.phone}" o esta vacío, es válido`, () => {
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
  describe("Case 2", () => {
    /* eslint-disable */
  const testCases = [ 
    { phone:    "1135",     states : ["Vendido", "Credito", "Apartado"], validation : false },
    { phone: "0135735745",  states : ["Vendido", "Credito", "Apartado"], validation : false },
    { phone: "11-35735745", states : ["Vendido", "Credito", "Apartado"], validation : false },
  ]
  /* eslint-enable */
    testCases.forEach((test) => {
      test.states.forEach((state) => {
        it(`Si ${state} es la condición del producto y el teléfono "${test.phone}" no cumple el formato de diez dígitos únicamente sin empezar por cero, es inválido`, () => {
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
  describe("Case 3", () => {
    /* eslint-disable */
  const testCases = [ 
    { phone: "", states : ["Sin vender", "Dañado", "Perdido", "Robado"], validation : true  }
  ]
  /* eslint-enable */
    testCases.forEach((test) => {
      test.states.forEach((state) => {
        it(`Si ${state} es la condición del producto y el teléfono "${test.phone}" esta vacío, es válido`, () => {
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
  describe("Case 4", () => {
    /* eslint-disable */
  const testCases = [ 
    { phone: "1135735745", states : ["Sin vender", "Dañado", "Perdido", "Robado"], validation : false }
  ]
    /* eslint-enable */
    testCases.forEach((test) => {
      test.states.forEach((state) => {
        it(`Si ${state} es la condición del producto y hay un teléfono "${test.phone}", es inválido`, () => {
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
