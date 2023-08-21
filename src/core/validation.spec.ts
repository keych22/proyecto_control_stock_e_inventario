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
  //isValidSellingDate,
  isValidSellingPrice,
  isValidState,
  isValidTelephone,
} from "@/core/validation";
import { describe, expect, it } from "vitest";
import { StartDate } from "@/core/core";
import _ from "lodash";

describe("Test isValidCity", () => {
  /* eslint-disable */
  const testCases = [ 
    { cities: ["NEUQUÉN", "BUENOS AIRES"], validation: true  },
    { cities: ["DUMMY",        ""       ], validation: false }
  ];
  /* eslint-enable */
  testCases.forEach((testCase) => {
    testCase.cities.forEach((city) => {
      it(`Si la ciudad es "${city}" la validación debe dar "${testCase.validation}"`, () => {
        const [place, validation] = isValidCity(city);
        expect(place).to.be.equal(city);
        if (testCase.validation) {
          expect(validation).to.be.true;
        } else {
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
      { sellingPrice: "",     credit: "",    states: ["Vendido", "Credito"],                                                          result: {sellingPriceAmount: NaN,   validation: false }},
      { sellingPrice: "",     credit: "",    states: ["Apartado", "Sin vender", "Dañado", "Perdido", "Robado"],                       result: {sellingPriceAmount: NaN,   validation: true  }},
      { sellingPrice: "",     credit: "50",  states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {sellingPriceAmount: NaN,   validation: false }},
      { sellingPrice: "",     credit: "B",   states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {sellingPriceAmount: NaN,   validation: false }},
      { sellingPrice: "A",    credit: "",    states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {sellingPriceAmount: NaN,   validation: false }},
      { sellingPrice: "A",    credit: "B",   states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {sellingPriceAmount: NaN,   validation: false }},
      { sellingPrice: "A",    credit: "50",  states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {sellingPriceAmount: NaN,   validation: false }},
      { sellingPrice: "A100", credit: "",    states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {sellingPriceAmount: NaN,   validation: false }},
      { sellingPrice: "A100", credit: "50",  states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {sellingPriceAmount: NaN,   validation: false }},
      { sellingPrice: "100A", credit: "50B", states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {sellingPriceAmount: NaN,   validation: false }},
      { sellingPrice: "100A", credit: "B",   states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {sellingPriceAmount: NaN,   validation: false }},
      { sellingPrice: "100",  credit: "",    states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido"],           result: {sellingPriceAmount: 10000, validation: true  }},
      { sellingPrice: "100",  credit: "",    states: ["Robado"],                                                                      result: {sellingPriceAmount: 10000, validation: false }},
      { sellingPrice: "100",  credit: "50",  states: ["Credito"],                                                                     result: {sellingPriceAmount: 10000, validation: true  }},
      { sellingPrice: "100",  credit: "100", states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {sellingPriceAmount: 10000, validation: false }},
      { sellingPrice: "100",  credit: "B",   states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {sellingPriceAmount: 10000, validation: false }},
      { sellingPrice: "100",  credit: "50B", states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {sellingPriceAmount: 10000, validation: false }},
      { sellingPrice: "100",  credit: "150", states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {sellingPriceAmount: 10000, validation: false }},
    ];
    /* eslint-enable */
  testCases.forEach((test) => {
    test.states.forEach((state) => {
      it(`Si el precio es "${test.sellingPrice}", el crédito "${test.credit}" y el estado "${state}" es "${test.result.validation}"`, () => {
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
          expect(validation).to.be.string;
        }
      });
    });
  });
});

describe("Test isValidCredit", () => {
  /* eslint-disable */
    const testCases = [
      { credit: "50",   sellingPrice: "100", states: ["Credito"],                                                                     result: {creditAmount: 5000,  validation: true  }},
      { credit: "50",   sellingPrice: "100", states: ["Vendido", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"],            result: {creditAmount: 5000,  validation: false }},
      { credit: "150",  sellingPrice: "100", states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {creditAmount: 15000, validation: false }},
      { credit: "",     sellingPrice: "100", states: ["Credito"],                                                                     result: {creditAmount: NaN,   validation: true  }},
      { credit: "",     sellingPrice: "100", states: ["Vendido", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"],            result: {creditAmount: NaN,   validation: false }},
      { credit: "A",    sellingPrice: "100", states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {creditAmount: NaN,   validation: false }},
      { credit: "A100", sellingPrice: "100", states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], result: {creditAmount: NaN,   validation: false }},
    ];
    /* eslint-enable */
  testCases.forEach((test) => {
    test.states.forEach((state) => {
      it(`Si el crédito es "${test.credit}", el precio de venta "${test.sellingPrice}" y el estado "${state}" es válido: "${test.result.validation}"`, () => {
        const [creditAmount, validation] = isValidCredit(
          test.credit,
          test.sellingPrice,
          state
        );
        expect(creditAmount).to.deep.equal(test.result.creditAmount);
        if (test.result.validation) {
          expect(validation).to.be.true;
        } else {
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
      { place: "Winter", states : ["Vendido", "Credito"],                                    validation : true  },
      { place: "Winter", states : ["Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], validation : false },
      { place:    "",    states : ["Vendido", "Credito"],                                    validation : false },
      { place:    "",    states : ["Apartado", "Sin vender", "Dañado", "Perdido", "Robado"], validation : true }
    ]
    /* eslint-enable */
    testCases.forEach((test) => {
      test.states.forEach((state) => {
        it(`Si "${state}" es la condición del producto y hay un lugar de entrega, es "${test.validation}"`, () => {
          const [delivery, validation] = isValidDelivery(test.place, state);
          expect(delivery).to.be.equal(test.place);
          if (test.validation) {
            expect(validation).to.be.true;
          } else {
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
      { states: ["Vendido", "Credito", "Apartado", "Dañado", "Perdido", "Sin vender", "Robado"] , validation: true  },
      { states: ["DUMMY", ""] ,                                                                   validation: false } 
    ];
    /* eslint-enable */
  testCases.forEach((test) => {
    test.states.forEach((state) => {
      it(`Si el estado del producto es "${state}", es ${test.validation}`, () => {
        const [condition, validation] = isValidState(state);
        expect(condition).is.equal(state);
        if (test.validation) {
          expect(validation).to.be.true;
        } else {
          expect(validation).to.be.string;
        }
      });
    });
  });
});

describe("Test isValidClient", () => {
  /* eslint-disable */
  const testCases = [ 
    {nombre: "Pedro", states : ["Vendido", "Credito", "Apartado"],                       validation : true  },
    {nombre:    "",   states : ["Vendido", "Sin vender", "Dañado", "Perdido", "Robado"], validation : true  },
    {nombre: "Pedro", states : ["Sin vender", "Dañado", "Perdido", "Robado"],            validation : false },
    {nombre:    "",   states : ["Credito", "Apartado"],                                  validation : false }
];
  /* eslint-enable */
  testCases.forEach((test) => {
    test.states.forEach((state) => {
      it(`Si "${state}" es la condición del producto y hay un nombre de cliente asociado, es "${test.validation}"`, () => {
        const [client, validation] = isValidClient(test.nombre, state);
        expect(client).to.be.equal(test.nombre);
        if (test.validation) {
          expect(validation).to.be.true;
        } else {
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
  /* eslint-disable */
  const testCases = [
    { amounts: ["100", "20.5"], validation: true  },
    { amounts: ["", "a100"],    validation: false }
];
  /* eslint-enable */
  testCases.forEach((test) => {
    test.amounts.forEach((amount) => {
      it(`Si el monto es "${amount}" es "${test.validation}"`, () => {
        const [value, validation] = isValidPurchasePrice(amount);
        // expect(value).to.be.equal(amount);
        if (test.validation && !_.isNaN(value)) {
          expect(validation).to.be.true;
        } else {
          expect(validation).to.be.string;
        }
      });
    });
  });
});

// describe("Test isValidSellingDate", () => {
//   const startDateKchmodas = "2019-04-22";
//   const dateBeforeStart = "2019-03-20";
//   const dateAfterStart = "2019-06-13";
//   const dateFormatInvalid = "2019/09/28";
//   const validDate = "2021-10-15";
//   const dateBeforeValid = "2021-03-11";
//   const dateAfterValid = "2021-11-20";
//   /* eslint-disable */
//   const testCases = [
//     { saleDates: [startDateKchmodas, dateAfterStart],  purchaseDate: startDateKchmodas, states: ['Vendido' , 'Credito', 'Apartado'],           result:{ sellingDate: saleDate, validation: true }},
//     { saleDates: [dateBeforeStart, dateFormatInvalid], purchaseDate: startDateKchmodas, states: ['Vend' , 'Cred', 'Apart'],                    result:{ sellingDate: saleDate, validation: false }},
//     { saleDates: [startDateKchmodas, dateAfterStart],  purchaseDate: startDateKchmodas, states: ["Sin vender", "Dañado", "Perdido", "Robado"], result:{ sellingDate: saleDate, validation: false }},
//     { saleDates: [dateBeforeStart, dateFormatInvalid], purchaseDate: startDateKchmodas, states: ["Sin vender", "Dañado", "Perdido", "Robado"], result:{ sellingDate: saleDate, validation: false }},
//     { saleDates: [validDate, dateAfterValid],          purchaseDate: validDate,         states: ['Vendido' , 'Credito', 'Apartado'],           result:{ sellingDate: saleDate, validation: true  }},
//     { saleDates: [dateBeforeValid, dateFormatInvalid], purchaseDate: validDate,         states: ['Vendido' , 'Credito', 'Apartado'],           result:{ sellingDate: saleDate, validation: false }},
//     { saleDates: [""],                                 purchaseDate: validDate,         states: ["Sin vender", "Dañado", "Perdido", "Robado"], result:{ sellingDate: saleDate, validation: true  }},
//     { saleDates: [validDate],                          purchaseDate: validDate,         states: ["Sin vender", "Dañado", "Perdido", "Robado"], result:{ sellingDate: saleDate, validation: false }}
//   ];
//   /* eslint-enable */
//   testCases.forEach((test) => {test.saleDates.forEach((saleDate) => {
//     test.states.forEach((state) => {
//       it(`Si la fecha de venta es "${saleDate}"`,() => {
//         const [sellingDate, validation] = isValidSellingDate(saleDate, test.purchaseDate, state);
//       })
//      })
//     });
//   });
// });

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
  /* eslint-disable */
  const testCases = [ 
    { phone: "1135735745",  states : ["Vendido", "Credito", "Apartado"],            validation : true  },
    { phone:      "",       states : ["Vendido", "Credito", "Apartado"],            validation : true  },
    { phone:    "1135",     states : ["Vendido", "Credito", "Apartado"],            validation : false },
    { phone: "0135735745",  states : ["Vendido", "Credito", "Apartado"],            validation : false },
    { phone: "11-35735745", states : ["Vendido", "Credito", "Apartado"],            validation : false },
    { phone: "1135735745",  states : ["Sin vender", "Dañado", "Perdido", "Robado"], validation : false },
    { phone:     "",        states : ["Sin vender", "Dañado", "Perdido", "Robado"], validation : true  }
  ]
  /* eslint-enable */
  testCases.forEach((test) => {
    test.states.forEach((state) => {
      it(`Si "${state}" es la condición del producto y el teléfono es "${test.phone}", es "${test.validation}" `, () => {
        const [telephone, validation] = isValidTelephone(test.phone, state);
        expect(telephone).to.be.equal(test.phone);
        if (test.validation) {
          expect(validation).to.be.true;
        } else {
          expect(validation).to.be.string;
        }
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
