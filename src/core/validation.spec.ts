import {
  convertAmountDecimals,
  isValidCategory,
  isValidCity,
  isValidClient,
  isValidDate,
  isValidDelivery,
  isValidProduct,
  isValidPurchaseDate,
  isValidPurchasePrice,
  isValidSellingDate,
  isValidSellingPriceAndCredit,
  isValidState,
  isValidTelephone,
} from "@/core/validation";
import { describe, expect, it } from "vitest";
import { StartDate } from "@/core/core";

describe("Test isValidCity", () => {
  it("Test valid input", () => {
    const [city, valid] = isValidCity("NEUQUÉN");
    expect(city).to.equal("NEUQUÉN");
    expect(valid).to.be.true;
  });
  it("Test valid input", () => {
    const [city, valid] = isValidCity("BUENOS AIRES");
    expect(city).to.equal("BUENOS AIRES");
    expect(valid).to.be.true;
  });
  it("Test invalid input", () => {
    const [city, valid] = isValidCity("DUMMY");
    expect(city).to.equal("DUMMY");
    expect(valid).to.be.false;
  });
  it("Test invalid input", () => {
    const [city, valid] = isValidCity("");
    expect(city).to.equal("");
    expect(valid).to.be.false;
  });
});

describe("Test isValidCategory", () => {
  it("Test valid inputs", () => {
    const [category, valid] = isValidCategory("ROPA");
    expect(category).to.equal("ROPA");
    expect(valid).to.be.true;
  });
  it("Test invalid inputs", () => {
    const [category, valid] = isValidCategory("");
    expect(category).to.equal("");
    expect(valid).to.be.false;
  });
});

describe("Test isValidSellingPriceAndCreditAndCredit", () => {
  /* eslint-disable */
    const tests = [
      { conditions: { price: "",     credit: "",    states: ["Vendido", "Credito"] },                                               result: {sellingPriceAmount: NaN,   creditAmount: NaN,   valid: false }},
      { conditions: { price: "",     credit: "",    states: ["Apartado", "Sin vender", "Dañado", "Perdido"] },                       result: {sellingPriceAmount: NaN,   creditAmount: NaN,   valid: true  }},
      { conditions: { price: "",     credit: "50",  states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido"] }, result: {sellingPriceAmount: NaN,   creditAmount: 5000,  valid: false }},
      { conditions: { price: "",     credit: "B",   states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido"] }, result: {sellingPriceAmount: NaN,   creditAmount: NaN,   valid: false }},
      { conditions: { price: "A",    credit: "",    states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido"] }, result: {sellingPriceAmount: NaN,   creditAmount: NaN,   valid: false }},
      { conditions: { price: "A",    credit: "B",   states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido"] }, result: {sellingPriceAmount: NaN,   creditAmount: NaN,   valid: false }},
      { conditions: { price: "A",    credit: "50",  states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido"] }, result: {sellingPriceAmount: NaN,   creditAmount: 5000,  valid: false }},
      { conditions: { price: "A100", credit: "",    states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido"] }, result: {sellingPriceAmount: NaN,   creditAmount: NaN,   valid: false }},
      { conditions: { price: "A100", credit: "50",  states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido"] }, result: {sellingPriceAmount: NaN,   creditAmount: 5000,  valid: false }},
      { conditions: { price: "100A", credit: "50B", states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido"] }, result: {sellingPriceAmount: NaN,   creditAmount: NaN,   valid: false }},
      { conditions: { price: "100A", credit: "B",   states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido"] }, result: {sellingPriceAmount: NaN,   creditAmount: NaN,   valid: false }},
      { conditions: { price: "100",  credit: "",    states: ["Vendido", "Credito", "Apartado", "Sin vender"] },                      result: {sellingPriceAmount: 10000, creditAmount: NaN,   valid: true  }},
      { conditions: { price: "100",  credit: "",    states: ["Dañado", "Perdido"] },                                                result: {sellingPriceAmount: 10000, creditAmount: NaN,   valid: false }},
      { conditions: { price: "100",  credit: "50",  states: ["Credito"] },                                                          result: {sellingPriceAmount: 10000, creditAmount: 5000,  valid: true  }},
      { conditions: { price: "100",  credit: "100", states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido"] }, result: {sellingPriceAmount: 10000, creditAmount: 10000, valid: false }},
      { conditions: { price: "100",  credit: "B",   states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido"] }, result: {sellingPriceAmount: 10000, creditAmount: NaN,   valid: false }},
      { conditions: { price: "100",  credit: "50B", states: ["Vendido", "Credito", "Apartado", "Sin vender", "Dañado", "Perdido"] }, result: {sellingPriceAmount: 10000, creditAmount: NaN,   valid: false }},
    ];
    /* eslint-enable */
  tests.forEach((test) => {
    test.conditions.states.forEach((state) => {
      it(`Si el precio es "${test.conditions.price}", el crédito "${test.conditions.credit}" y el estado "${state}"`, () => {
        const [sellingPriceAmount, creditAmount, valid] =
          isValidSellingPriceAndCredit(
            test.conditions.price,
            test.conditions.credit,
            state
          );
        expect(sellingPriceAmount).to.deep.equal(
          test.result.sellingPriceAmount
        );
        expect(creditAmount).to.deep.equal(test.result.creditAmount);
        expect(valid).to.deep.equal(test.result.valid);
      });
    });
  });
});

describe("Test isValidDelivery", () => {
  describe("Test valid inputs", () => {
    /* eslint-disable */
      const tests = [
        { conditions: { delivery: "un lugar", states: ["Vendido", "Credito"] },                          result: { delivery: "un lugar", valid: true }},
        { conditions: { delivery:    ""     , states: ["Apartado", "Sin vender", "Dañado", "Perdido"] }, result: { delivery: "",         valid: true }}
      ];
      /* eslint-enable */
    tests.forEach((test) => {
      test.conditions.states.forEach((state) => {
        it(`Si el estado es "${state}" y la entrega esta definida en "${test.conditions.delivery}"`, () => {
          const [delivery, valid] = isValidDelivery(
            test.conditions.delivery,
            state
          );
          expect(delivery).is.equal(test.conditions.delivery);
          expect(valid).is.equal(test.result.valid);
        });
      });
    });
  });
  describe("Test invalid inputs", () => {
    const test = {
      conditions: {
        delivery: "un lugar",
        states: ["Apartado", "Sin vender", "Dañado", "Perdido"],
      },
      result: { delivery: "un lugar", valid: false },
    };
    test.conditions.states.forEach((state) => {
      it(
        `Si el estado es "${state}" y la entrega esta definida en "${test.conditions.delivery}"`
      );
      const [delivery, valid] = isValidDelivery(
        test.conditions.delivery,
        state
      );
      expect(delivery).is.equal(test.conditions.delivery);
      expect(valid).is.equal(test.result.valid);
    });
  });
});

describe("Test isValidProduct", () => {
  it("Test valid inputs", () => {
    const [product, valid] = isValidProduct("PANTALON");
    expect(product).to.equal("PANTALON");
    expect(valid).to.be.true;
  });
  it("Test invalid inputs", () => {
    const [product, valid] = isValidProduct("");
    expect(product).to.equal("");
    expect(valid).to.be.false;
  });
});

describe("Test isValidClient", () => {
  describe("Test valid inputs", () => {
    describe("Cliente con un nombre conocido", () => {
      it("Estado Vendido", () => {
        const [client, valid] = isValidClient("PEDRO", "Vendido");
        expect(client).is.equal("PEDRO");
        expect(valid).to.be.true;
      });
      it("Estado Crédito", () => {
        const [client, valid] = isValidClient("MARIA", "Credito");
        expect(client).is.equal("MARIA");
        expect(valid).to.be.true;
      });
      it("Estado Apartado", () => {
        const [client, valid] = isValidClient("CLAUDIA", "Apartado");
        expect(client).is.equal("CLAUDIA");
        expect(valid).to.be.true;
      });
    });
    describe("Cliente con Alias", () => {
      it("Válido para estado: Vendido, Crédito o Apartado", () => {
        const [client, valid] = isValidClient("PEDRO123", "Vendido");
        expect(client).is.equal("PEDRO123");
        expect(valid).to.be.true;
      });
    });
    describe("Cliente con nombre desconocido", () => {
      it("Sólo válido para estado Vendido", () => {
        const [client, valid] = isValidClient("", "Vendido");
        expect(client).is.equal("");
        expect(valid).to.be.true;
      });
    });
  });
  describe("Test invalid inputs", () => {
    describe("Cliente con nombre", () => {
      it("Estado Sin vender", () => {
        const [client, valid] = isValidClient("PEDRO", "Sin vender");
        expect(client).is.equal("PEDRO");
        expect(valid).to.be.false;
      });
      it("Estado Dañado", () => {
        const [client, valid] = isValidClient("VICTOR", "Dañado");
        expect(client).is.equal("VICTOR");
        expect(valid).to.be.false;
      });
      it("Estado Perdido", () => {
        const [client, valid] = isValidClient("KARINA", "Perdido");
        expect(client).is.equal("KARINA");
        expect(valid).to.be.false;
      });
    });
  });
});

describe("Test isValidPurchasePrice", () => {
  it("Test valid inputs", () => {
    const [value, valid] = isValidPurchasePrice("100");
    expect(value).to.equal(10000);
    expect(valid).to.be.true;
  });
  it("Test invalid inputs", () => {
    const [value, valid] = isValidPurchasePrice("");
    expect(value).is.NaN;
    expect(valid).to.be.false;
  });
  it("Test invalid inputs", () => {
    const [value, valid] = isValidPurchasePrice("a100");
    expect(value).is.NaN;
    expect(valid).to.be.false;
  });
});

describe("Test isValidState", () => {
  describe("Estados válidos", () => {
    it("Vendido", () => {
      const [value, valid] = isValidState("Vendido");
      expect(value).is.equal("Vendido");
      expect(valid).to.be.true;
    });
    it("Credito", () => {
      const [value, valid] = isValidState("Credito");
      expect(value).is.equal("Credito");
      expect(valid).to.be.true;
    });
    it("Apartado", () => {
      const [value, valid] = isValidState("Apartado");
      expect(value).is.equal("Apartado");
      expect(valid).to.be.true;
    });
    it("Sin vender", () => {
      const [value, valid] = isValidState("Sin vender");
      expect(value).is.equal("Sin vender");
      expect(valid).to.be.true;
    });
    it("Dañado", () => {
      const [value, valid] = isValidState("Dañado");
      expect(value).is.equal("Dañado");
      expect(valid).to.be.true;
    });
    it("Perdido", () => {
      const [value, valid] = isValidState("Perdido");
      expect(value).is.equal("Perdido");
      expect(valid).to.be.true;
    });
  });

  describe("Estados inválidos", () => {
    it("DUMMY", () => {
      const [value, valid] = isValidState("DUMMY");
      expect(value).is.equal("DUMMY");
      expect(valid).to.be.false;
    });
    it("", () => {
      const [value, valid] = isValidState("");
      expect(value).is.equal("");
      expect(valid).to.be.false;
    });
  });
});

describe("Test isValidSellingDate", () => {
  describe("Para estado: Vendido, Crédito o Apartado", () => {
    describe("Casos válidos", () => {
      it("Fecha de venta y compra coinciden con inicio de kchmodas", () => {
        const [value, valid] = isValidSellingDate(
          "2019-04-22",
          "2019-04-22",
          "Vendido"
        );
        expect(value).is.equal("2019-04-22");
        expect(valid).to.be.true;
      });
      it("Fecha de venta posterior a la de compra", () => {
        const [value, valid] = isValidSellingDate(
          "2019-04-23",
          "2019-04-22",
          "Vendido"
        );
        expect(value).is.equal("2019-04-23");
        expect(valid).to.be.true;
      });
    });
    describe("Casos inválidos", () => {
      it("Fecha de venta anterior a la de compra", () => {
        const [value, valid] = isValidSellingDate(
          "2019-04-21",
          "2019-04-22",
          "Vendido"
        );
        expect(value).is.equal("2019-04-21");
        expect(valid).to.be.false;
      });
      it("Fecha de venta vacía", () => {
        const [value, valid] = isValidSellingDate("", "2019-04-22", "Vendido");
        expect(value).is.equal("");
        expect(valid).to.be.false;
      });
    });
    describe("Para estado: Sin vender, Dañado o Perdido", () => {
      describe("Caso válido", () => {
        it("Campo fecha de venta vacío", () => {
          const [value, valid] = isValidSellingDate(
            "",
            "2019-04-22",
            "Sin vender"
          );
          expect(value).is.equal("");
          expect(valid).to.be.true;
        });
      });
      describe("Casos inválido", () => {
        it("Campo fecha de venta NO vacío", () => {
          const [value, valid] = isValidSellingDate(
            "2020-05-12",
            "2019-04-22",
            "Sin vender"
          );
          expect(value).is.equal("2020-05-12");
          expect(valid).to.be.false;
        });
      });
    });
  });
});

describe("Test isValidPurchaseDate", () => {
  describe("Test valid inputs", () => {
    it("Igual a la fecha de inicio de actividades kchmodas", () => {
      const [value, valid] = isValidPurchaseDate("2019-04-22");
      expect(value).is.equal("2019-04-22");
      expect(valid).to.be.true;
    });
    it("Fecha posterior al inicio", () => {
      const [value, valid] = isValidPurchaseDate("2022-04-30");
      expect(value).is.equal("2022-04-30");
      expect(valid).to.be.true;
    });
    it("Fecha actual (hoy) igual al día de la validación de este test", () => {
      const [value, valid] = isValidPurchaseDate("2023-07-23");
      expect(value).is.equal("2023-07-23");
      expect(valid).to.be.true;
    });
  });
  describe("Test invalid inputs", () => {
    it("Fecha anterior al inicio de actividades de kchmodas", () => {
      const [value, valid] = isValidPurchaseDate("2019-04-21");
      expect(value).is.equal("2019-04-21");
      expect(valid).to.be.false;
    });
    it("Fecha futura, un año después a la fecha de hoy", () => {
      const [value, valid] = isValidPurchaseDate("2024-07-24");
      expect(value).is.equal("2024-07-24");
      expect(valid).to.be.false;
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
  describe("Estado Vendido", () => {
    describe("Casos válidos", () => {
      it("Número telefónico con 10 dígitos", () => {
        const [value, valid] = isValidTelephone("1234567890", "Vendido");
        expect(value).is.equal("1234567890");
        expect(valid).to.be.true;
      });
      it("Número telefónico vacío", () => {
        const [value, valid] = isValidTelephone("", "Vendido");
        expect(value).is.equal("");
        expect(valid).to.be.true;
      });
    });
    describe("Casos inválidos", () => {
      it("Números telefónicos con cantidad de dígitos distinto a 10", () => {
        const [value, valid] = isValidTelephone("1", "Vendido");
        expect(value).is.equal("1");
        expect(valid).to.be.false;
      });
      it("Números telefónicos alfanuméricos", () => {
        const [value, valid] = isValidTelephone("1f", "Vendido");
        expect(value).is.equal("1f");
        expect(valid).to.be.false;
      });
    });
  });
  describe("Estado Crédito", () => {
    describe("Casos válidos", () => {
      it("Número telefónico con 10 dígitos", () => {
        const [value, valid] = isValidTelephone("1234567890", "Credito");
        expect(value).is.equal("1234567890");
        expect(valid).to.be.true;
      });
      it("Número telefónico vacío", () => {
        const [value, valid] = isValidTelephone("", "Credito");
        expect(value).is.equal("");
        expect(valid).to.be.true;
      });
    });
    describe("Casos inválidos", () => {
      it("Números telefónicos con cantidad de dígitos distinto a 10", () => {
        const [value, valid] = isValidTelephone("1", "Credito");
        expect(value).is.equal("1");
        expect(valid).to.be.false;
      });
      it("Números telefónicos alfanuméricos", () => {
        const [value, valid] = isValidTelephone("1f", "Credito");
        expect(value).is.equal("1f");
        expect(valid).to.be.false;
      });
    });
  });

  describe("Estado Apartado", () => {
    describe("Casos válidos", () => {
      it("Número telefónico con 10 dígitos", () => {
        const [value, valid] = isValidTelephone("1234567890", "Apartado");
        expect(value).is.equal("1234567890");
        expect(valid).to.be.true;
      });
      it("Número telefónico vacío", () => {
        const [value, valid] = isValidTelephone("", "Apartado");
        expect(value).is.equal("");
        expect(valid).to.be.true;
      });
    });
    describe("Casos inválidos", () => {
      it("Números telefónicos con cantidad de dígitos distinto a 10", () => {
        const [value, valid] = isValidTelephone("1", "Apartado");
        expect(value).is.equal("1");
        expect(valid).to.be.false;
      });
      it("Números telefónicos alfanuméricos", () => {
        const [value, valid] = isValidTelephone("1f", "Apartado");
        expect(value).is.equal("1f");
        expect(valid).to.be.false;
      });
    });
  });

  describe("Estado Sin vender", () => {
    it("Caso válido: número debe estar vacío", () => {
      const [value, valid] = isValidTelephone("", "Sin vender");
      expect(value).is.equal("");
      expect(valid).to.be.true;
    });
    it("Caso inválido: campo con dígitos", () => {
      const [value, valid] = isValidTelephone("12", "Sin vender");
      expect(value).is.equal("12");
      expect(valid).to.be.false;
    });
  });
  describe("Estado Dañado", () => {
    it("Caso válido: número debe estar vacío", () => {
      const [value, valid] = isValidTelephone("", "Dañado");
      expect(value).is.equal("");
      expect(valid).to.be.true;
    });
    it("Caso inválido: campo con dígitos", () => {
      const [value, valid] = isValidTelephone("12", "Dañado");
      expect(value).is.equal("12");
      expect(valid).to.be.false;
    });
  });

  describe("Estado Perdido", () => {
    it("Caso válido: número debe estar vacío", () => {
      const [value, valid] = isValidTelephone("", "Perdido");
      expect(value).is.equal("");
      expect(valid).to.be.true;
    });
    it("Caso inválido: campo con dígitos", () => {
      const [value, valid] = isValidTelephone("12", "Perdido");
      expect(value).is.equal("12");
      expect(valid).to.be.false;
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
