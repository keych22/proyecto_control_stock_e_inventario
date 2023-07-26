import {
  convertAmountDecimals,
  isValidCategory,
  isValidCity,
  isValidClient,
  isValidCredit,
  isValidDate,
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

describe("Test isValidSellingPrice", () => {
  describe("Estado vendido", () => {
    it("Caso válido: Debe tener un precio", () => {
      const [sellingPrice, valid] = isValidSellingPrice("100", "Vendido");
      expect(sellingPrice).to.equal(10000);
      expect(valid).to.be.true;
    });
    it("Caso inválido: Si no tiene el precio", () => {
      const [sellingPrice, valid] = isValidSellingPrice("", "Vendido");
      expect(sellingPrice).is.null;
      expect(valid).to.be.false;
    });
  });
  describe("Estado crédito", () => {
    it("Caso válido: Debe tener un precio", () => {
      const [sellingPrice, valid] = isValidSellingPrice("100", "Credito");
      expect(sellingPrice).to.equal(10000);
      expect(valid).to.be.true;
    });
    it("Caso inválido: Si no tiene el precio", () => {
      const [sellingPrice, valid] = isValidSellingPrice("", "Credito");
      expect(sellingPrice).is.null;
      expect(valid).to.be.false;
    });
  });
  describe("Estado apartado", () => {
    it("Caso válido: Debe tener un precio", () => {
      const [sellingPrice, valid] = isValidSellingPrice("100", "Apartado");
      expect(sellingPrice).to.equal(10000);
      expect(valid).to.be.true;
    });
    it("Caso inválido: Si no tiene el precio", () => {
      const [sellingPrice, valid] = isValidSellingPrice("", "Apartado");
      expect(sellingPrice).is.null;
      expect(valid).to.be.false;
    });
  });
  describe("Estado SinVender", () => {
    it("Caso válido: Sin precio", () => {
      const [sellingPrice, valid] = isValidSellingPrice("", "SinVender");
      expect(sellingPrice).is.null;
      expect(valid).to.be.true;
    });
    it("Caso válido: Con precio", () => {
      const [sellingPrice, valid] = isValidSellingPrice("100", "SinVender");
      expect(sellingPrice).to.equal(10000);
      expect(valid).to.be.true;
    });
    it("Caso inválido: Valor alfanumérico", () => {
      const [sellingPrice, valid] = isValidSellingPrice("a1", "SinVender");
      expect(sellingPrice).to.equal(null);
      expect(valid).to.be.false;
    });
  });
  describe("Estado Dañado", () => {
    it("Caso válido: Sin precio", () => {
      const [sellingPrice, valid] = isValidSellingPrice("", "Dañado");
      expect(sellingPrice).is.null;
      expect(valid).to.be.true;
    });
    it("Caso inválido: Si tiene un precio", () => {
      const [sellingPrice, valid] = isValidSellingPrice("100", "Dañado");
      expect(sellingPrice).to.equal(10000);
      expect(valid).to.be.false;
    });
  });
  describe("Estado Perdido", () => {
    it("Caso válido: Sin precio", () => {
      const [sellingPrice, valid] = isValidSellingPrice("", "Perdido");
      expect(sellingPrice).is.null;
      expect(valid).to.be.true;
    });
    it("Caso inválido: Si tiene un precio", () => {
      const [sellingPrice, valid] = isValidSellingPrice("100", "Perdido");
      expect(sellingPrice).to.equal(10000);
      expect(valid).to.be.false;
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
      it("Estado SinVender", () => {
        const [client, valid] = isValidClient("PEDRO", "SinVender");
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
    expect(value).is.null;
    expect(valid).to.be.false;
  });
  it("Test invalid inputs", () => {
    const [value, valid] = isValidPurchasePrice("a100");
    expect(value).is.null;
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
    it("SinVender", () => {
      const [value, valid] = isValidState("SinVender");
      expect(value).is.equal("SinVender");
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

describe("Test isValidCredit", () => {
  describe("Test valid inputs", () => {
    it("Monto del crédito inferior al precio de venta", () => {
      const [credit, valid] = isValidCredit("90", "100", "Credito");
      expect(credit).is.equal(9000);
      expect(valid).to.be.true;
    });
    it("Monto del crédito vacío", () => {
      const [credit, valid] = isValidCredit("", "100", "Credito");
      expect(credit).is.null;
      expect(valid).to.be.true;
    });
    it("Monto del crédito y el precio de venta vacíos", () => {
      const [credit, valid] = isValidCredit("", "", "Credito");
      expect(credit).is.null;
      expect(valid).to.be.true;
    });
  });
  describe("Test invalid inputs", () => {
    it("Monto del crédito igual al precio de venta", () => {
      const [credit, valid] = isValidCredit("100", "100", "Credito");
      expect(credit).is.equal(10000);
      expect(valid).to.be.false;
    });
    it("Monto del crédito con valor en estado Vendido", () => {
      const [credit, valid] = isValidCredit("50", "100", "Vendido");
      expect(credit).is.equal(5000);
      expect(valid).to.be.false;
    });
    it("Monto del crédito con valor en estado Apartado", () => {
      const [credit, valid] = isValidCredit("50", "100", "Apartado");
      expect(credit).is.equal(5000);
      expect(valid).to.be.false;
    });
    it("Monto del crédito con valor en estado SinVender", () => {
      const [credit, valid] = isValidCredit("50", "100", "SinVender");
      expect(credit).is.equal(5000);
      expect(valid).to.be.false;
    });
    it("Monto del crédito con valor en estado Dañado", () => {
      const [credit, valid] = isValidCredit("50", "100", "Dañado");
      expect(credit).is.equal(5000);
      expect(valid).to.be.false;
    });
    it("Monto del crédito con valor en estado Perdido", () => {
      const [credit, valid] = isValidCredit("50", "100", "Perdido");
      expect(credit).is.equal(5000);
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
    describe("Para estado: SinVender, Dañado o Perdido", () => {
      describe("Caso válido", () => {
        it("Campo fecha de venta vacío", () => {
          const [value, valid] = isValidSellingDate(
            "",
            "2019-04-22",
            "SinVender"
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
            "SinVender"
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

  describe("Estado SinVender", () => {
    it("Caso válido: número debe estar vacío", () => {
      const [value, valid] = isValidTelephone("", "SinVender");
      expect(value).is.equal("");
      expect(valid).to.be.true;
    });
    it("Caso inválido: campo con dígitos", () => {
      const [value, valid] = isValidTelephone("12", "SinVender");
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

describe("Test convertAmount", () => {
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
    expect(convertAmountDecimals("")).to.be.null;
    expect(convertAmountDecimals(".")).to.be.null;
  });
});
