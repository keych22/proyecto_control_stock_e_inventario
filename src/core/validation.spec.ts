import { DateType, ValidationError, Validator } from "@/core/validation";
import { type Entry, StartDate } from "@/core/core";
import { beforeEach, describe, expect, it } from "vitest";

describe("Test class Validator", () => {
  describe("Test isValidCity", () => {
    it("Test valid input", () => {
      const [city, valid] = Validator.isValidCity("NEUQUÉN");
      expect(city).to.equal("NEUQUÉN");
      expect(valid).to.be.true;
    });
    it("Test valid input", () => {
      const [city, valid] = Validator.isValidCity("BUENOS AIRES");
      expect(city).to.equal("BUENOS AIRES");
      expect(valid).to.be.true;
    });
    it("Test invalid input", () => {
      const [city, valid] = Validator.isValidCity("DUMMY");
      expect(city).to.equal("DUMMY");
      expect(valid).to.be.false;
    });
    it("Test invalid input", () => {
      const [city, valid] = Validator.isValidCity("");
      expect(city).to.equal("");
      expect(valid).to.be.false;
    });
  });

  describe("Test isValidCategory", () => {
    it("Test valid inputs", () => {
      const [category, valid] = Validator.isValidCategory("ROPA");
      expect(category).to.equal("ROPA");
      expect(valid).to.be.true;
    });
    it("Test invalid inputs", () => {
      const [category, valid] = Validator.isValidCategory("");
      expect(category).to.equal("");
      expect(valid).to.be.false;
    });
  });

  describe("Test isValidSellingPrice", () => {
    describe("Estado vendido", () => {
      it("Caso válido: Debe tener un precio", () => {
        const [sellingPrice, valid] = Validator.isValidSellingPrice(
          "100",
          "Vendido"
        );
        expect(sellingPrice).to.equal(10000);
        expect(valid).to.be.true;
      });
      it("Caso inválido: Si no tiene el precio", () => {
        const [sellingPrice, valid] = Validator.isValidSellingPrice(
          "",
          "Vendido"
        );
        expect(sellingPrice).is.null;
        expect(valid).to.be.false;
      });
    });
    describe("Estado crédito", () => {
      it("Caso válido: Debe tener un precio", () => {
        const [sellingPrice, valid] = Validator.isValidSellingPrice(
          "100",
          "Credito"
        );
        expect(sellingPrice).to.equal(10000);
        expect(valid).to.be.true;
      });
      it("Caso inválido: Si no tiene el precio", () => {
        const [sellingPrice, valid] = Validator.isValidSellingPrice(
          "",
          "Credito"
        );
        expect(sellingPrice).is.null;
        expect(valid).to.be.false;
      });
    });
    describe("Estado apartado", () => {
      it("Caso válido: Debe tener un precio", () => {
        const [sellingPrice, valid] = Validator.isValidSellingPrice(
          "100",
          "Apartado"
        );
        expect(sellingPrice).to.equal(10000);
        expect(valid).to.be.true;
      });
      it("Caso inválido: Si no tiene el precio", () => {
        const [sellingPrice, valid] = Validator.isValidSellingPrice(
          "",
          "Apartado"
        );
        expect(sellingPrice).is.null;
        expect(valid).to.be.false;
      });
    });
    describe("Estado SinVender", () => {
      it("Caso válido: Sin precio", () => {
        const [sellingPrice, valid] = Validator.isValidSellingPrice(
          "",
          "SinVender"
        );
        expect(sellingPrice).is.null;
        expect(valid).to.be.true;
      });
      it("Caso válido: Con precio", () => {
        const [sellingPrice, valid] = Validator.isValidSellingPrice(
          "100",
          "SinVender"
        );
        expect(sellingPrice).to.equal(10000);
        expect(valid).to.be.true;
      });
      it("Caso inválido: Valor alfanumérico", () => {
        const [sellingPrice, valid] = Validator.isValidSellingPrice(
          "a1",
          "SinVender"
        );
        expect(sellingPrice).to.equal(null);
        expect(valid).to.be.false;
      });
    });
    describe("Estado Dañado", () => {
      it("Caso válido: Sin precio", () => {
        const [sellingPrice, valid] = Validator.isValidSellingPrice(
          "",
          "Dañado"
        );
        expect(sellingPrice).is.null;
        expect(valid).to.be.true;
      });
      it("Caso inválido: Si tiene un precio", () => {
        const [sellingPrice, valid] = Validator.isValidSellingPrice(
          "100",
          "Dañado"
        );
        expect(sellingPrice).to.equal(10000);
        expect(valid).to.be.false;
      });
    });
    describe("Estado Perdido", () => {
      it("Caso válido: Sin precio", () => {
        const [sellingPrice, valid] = Validator.isValidSellingPrice(
          "",
          "Perdido"
        );
        expect(sellingPrice).is.null;
        expect(valid).to.be.true;
      });
      it("Caso inválido: Si tiene un precio", () => {
        const [sellingPrice, valid] = Validator.isValidSellingPrice(
          "100",
          "Perdido"
        );
        expect(sellingPrice).to.equal(10000);
        expect(valid).to.be.false;
      });
    });
  });

  describe("Test isValidProduct", () => {
    it("Test valid inputs", () => {
      const [product, valid] = Validator.isValidProduct("PANTALON");
      expect(product).to.equal("PANTALON");
      expect(valid).to.be.true;
    });
    it("Test invalid inputs", () => {
      const [product, valid] = Validator.isValidProduct("");
      expect(product).to.equal("");
      expect(valid).to.be.false;
    });
  });

  describe("Test isValidPurchasePrice", () => {
    it("Test valid inputs", () => {
      const [value, valid] = Validator.isValidPurchasePrice("100");
      expect(value).to.equal(10000);
      expect(valid).to.be.true;
    });
    it("Test invalid inputs", () => {
      const [value, valid] = Validator.isValidPurchasePrice("");
      expect(value).is.null;
      expect(valid).to.be.false;
    });
    it("Test invalid inputs", () => {
      const [value, valid] = Validator.isValidPurchasePrice("a100");
      expect(value).is.null;
      expect(valid).to.be.false;
    });
  });

  describe("Test isValidState", () => {
    describe("Estados válidos", () => {
      it("Vendido", () => {
        const [value, valid] = Validator.isValidState("Vendido");
        expect(value).is.equal("Vendido");
        expect(valid).to.be.true;
      });
      it("Credito", () => {
        const [value, valid] = Validator.isValidState("Credito");
        expect(value).is.equal("Credito");
        expect(valid).to.be.true;
      });
      it("Apartado", () => {
        const [value, valid] = Validator.isValidState("Apartado");
        expect(value).is.equal("Apartado");
        expect(valid).to.be.true;
      });
      it("SinVender", () => {
        const [value, valid] = Validator.isValidState("SinVender");
        expect(value).is.equal("SinVender");
        expect(valid).to.be.true;
      });
      it("Dañado", () => {
        const [value, valid] = Validator.isValidState("Dañado");
        expect(value).is.equal("Dañado");
        expect(valid).to.be.true;
      });
      it("Perdido", () => {
        const [value, valid] = Validator.isValidState("Perdido");
        expect(value).is.equal("Perdido");
        expect(valid).to.be.true;
      });
    });

    describe("Estados inválidos", () => {
      it("DUMMY", () => {
        const [value, valid] = Validator.isValidState("DUMMY");
        expect(value).is.equal("DUMMY");
        expect(valid).to.be.false;
      });
      it("", () => {
        const [value, valid] = Validator.isValidState("");
        expect(value).is.equal("");
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
      expect(Validator.isValidDate(dayBeforeStartDate)).to.be.false;
    });

    it("Test start date", () => {
      expect(Validator.isValidDate(startDate)).to.be.true;
    });

    it("Test day after start date", () => {
      expect(Validator.isValidDate(dayAfterStartDate)).to.be.true;
    });

    it("Test yesterday", () => {
      expect(Validator.isValidDate(yesterday)).to.be.true;
    });

    it("Test today", () => {
      expect(Validator.isValidDate(today)).to.be.true;
    });

    it("Test tomorrow", () => {
      expect(Validator.isValidDate(tomorrow)).to.be.false;
    });
  });

  describe("Test isValidPhoneNumber", () => {
    it("Test valid inputs", () => {
      expect(Validator.isValidPhoneNumber("1234567890")).to.be.true;
    });

    it("Test invalid inputs", () => {
      expect(Validator.isValidPhoneNumber("")).to.be.false;
      expect(Validator.isValidPhoneNumber("1")).to.be.false;
      expect(Validator.isValidPhoneNumber("12")).to.be.false;
      expect(Validator.isValidPhoneNumber("123")).to.be.false;
      expect(Validator.isValidPhoneNumber("1234")).to.be.false;
      expect(Validator.isValidPhoneNumber("12345")).to.be.false;
      expect(Validator.isValidPhoneNumber("123456")).to.be.false;
      expect(Validator.isValidPhoneNumber("1234567")).to.be.false;
      expect(Validator.isValidPhoneNumber("12345678")).to.be.false;
      expect(Validator.isValidPhoneNumber("123456789")).to.be.false;
      expect(Validator.isValidPhoneNumber("0123456789")).to.be.false;
    });
  });

  describe("Test convertAmount", () => {
    it("Test valid inputs", () => {
      expect(Validator.convertAmountDecimals("0")).to.be.eql(0);

      expect(Validator.convertAmountDecimals(".0")).to.be.eql(0);
      expect(Validator.convertAmountDecimals(".1")).to.be.eql(10);
      expect(Validator.convertAmountDecimals(".2")).to.be.eql(20);

      expect(Validator.convertAmountDecimals(".00")).to.be.eql(0);
      expect(Validator.convertAmountDecimals(".10")).to.be.eql(10);
      expect(Validator.convertAmountDecimals(".20")).to.be.eql(20);

      expect(Validator.convertAmountDecimals(".01")).to.be.eql(1);
      expect(Validator.convertAmountDecimals(".02")).to.be.eql(2);
      expect(Validator.convertAmountDecimals(".12")).to.be.eql(12);

      expect(Validator.convertAmountDecimals("0.")).to.be.eql(0);
      expect(Validator.convertAmountDecimals("1.")).to.be.eql(100);
      expect(Validator.convertAmountDecimals("2.")).to.be.eql(200);

      expect(Validator.convertAmountDecimals("00.")).to.be.eql(0);
      expect(Validator.convertAmountDecimals("10.")).to.be.eql(1000);
      expect(Validator.convertAmountDecimals("20.")).to.be.eql(2000);

      expect(Validator.convertAmountDecimals("01.")).to.be.eql(100);
      expect(Validator.convertAmountDecimals("02.")).to.be.eql(200);

      expect(Validator.convertAmountDecimals("0.0")).to.be.eql(0);
      expect(Validator.convertAmountDecimals("0.01")).to.be.eql(1);
      expect(Validator.convertAmountDecimals("0.1")).to.be.eql(10);
      expect(Validator.convertAmountDecimals("1.0")).to.be.eql(100);
      expect(Validator.convertAmountDecimals("1.1")).to.be.eql(110);
      expect(Validator.convertAmountDecimals("1.01")).to.be.eql(101);
    });

    it("Test invalid inputs", () => {
      expect(Validator.convertAmountDecimals("")).to.be.null;
      expect(Validator.convertAmountDecimals(".")).to.be.null;
    });
  });
});

describe("Test class Validation", () => {
  let validation: ValidationError;
  let entry: Entry;

  beforeEach(() => {
    validation = new ValidationError();
    entry = {
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
      purchasePrice: "",
      monthsUnsold: "",
      state: "",
      sellingDate: "",
      sellingPrice: "",
      credit: "",
      difference: "",
      client: "",
      telephone: "",
      delivery: "",
      contact: "",
      note: "",
      address: "",
    };
  });

  describe("Validar estados", () => {
    it("Validar articulo vendido con el metodo validate_sold_item", () => {
      entry.state = "Vendido";
      validation.validateSoldItem(entry);
      expect(validation.valid.client).not.to.be.null;
      expect(validation.valid.sellingPrice).not.to.be.null;
    });

    it.skip("Validar articulo en credito con el metodo validate_on_credit_item", () => {
      entry.state = "Credito";
      expect(validation.valid.client).not.to.be.null;
      expect(validation.valid.sellingPrice).not.to.be.null;
    });

    it.skip("Validar articulo apartado con el metodo validate_reserved_item", () => {
      entry.state = "Apartado";
      entry.sellingPrice = "23.35";
      validation.validateReservedItem(entry);
      expect(validation.valid.client).not.to.be.null;
      expect(validation.valid.sellingPrice).not.to.be.null;
    });

    it.skip("Validar articulo dañado con el metodo validate_damaged_item", () => {
      entry.state = "Dañado";
      entry.client = "Luis";
      entry.sellingPrice = "23.35";
      entry.telephone = "1023456789";
      validation.validateDamagedItem(entry);
      expect(validation.valid).to.be.eql([
        "Nombre de cliente debería estar vacio",
        "Precio de venta debe estar vacio",
        "El numero telefonico debe estar vacio",
      ]);
    });
  });

  describe("Validar metodo verifyPhoneNumber", () => {
    it.skip("Verificar formato 1", () => {
      validation.verifyPhoneNumber("1234567809");
      expect(validation.valid).to.empty;
    });

    it.skip("Verificar formato 2 comienza con 0", () => {
      validation.verifyPhoneNumber("0234567898");
      expect(validation.valid).to.eql(["Numero telefonico invalido"]);
    });

    it.skip("Verificar si numero telefonico NO esta vacio", () => {
      validation.verifyPhoneNumber("");
      expect(validation.valid).to.eql(["Numero telefonico invalido"]);
    });
  });

  describe("Validar Fechas", () => {
    it.skip("Verificar formato de fechas Incorrecto", () => {
      validation.validateDate(DateType.purchase, "25-04-2022");
      expect(validation.valid).to.eql([
        'Formato de fecha incorrecto (Fecha: "25-04-2022")',
      ]);
    });
  });

  it.skip("Verificar formato de fechas Correcto", () => {
    const validarFecha = validation.validateDate(DateType.purchase, "08-04-23");
    expect(validation.valid).to.empty;
    expect(validarFecha).to.eql("2023-04-08");
  });

  describe("Validar metodo convertAmountStringToCents", () => {
    describe("Validar formatos de montos", () => {
      it.skip("formato 1: un string", () => {
        expect(validation.convertAmountStringToCents(DateType.selling, "a")).to
          .be.null;
        expect(validation.valid).to.be.eql(["Precio de venta es invalido"]);
      });

      it.skip("formato 2: un string vacio", () => {
        expect(validation.convertAmountStringToCents(DateType.selling, "")).to
          .be.null;
        expect(validation.valid).to.be.eql(["Numero o formato invalido"]);
      });

      it.skip("formato 3: un string alfanumerico", () => {
        expect(validation.convertAmountStringToCents(DateType.selling, "2t6"))
          .to.be.null;
        expect(validation.valid).to.be.eql(["Precio de venta es invalido"]);
      });

      it.skip("formato 4: un punto", () => {
        expect(validation.convertAmountStringToCents(DateType.selling, ".")).to
          .be.null;
        expect(validation.valid).to.be.eql(["Numero o formato invalido"]);
      });

      it.skip("formato 5: un valor con punto y decimal", () => {
        expect(
          validation.convertAmountStringToCents(DateType.selling, ".9")
        ).to.be.eql(90);
        expect(validation.valid).to.be.eql([]);
      });

      it.skip("formato 6: un valor con mas decimales de lo permitido", () => {
        expect(
          validation.convertAmountStringToCents(DateType.selling, "25.356")
        ).to.be.null;
        expect(validation.valid).to.be.eql(["Precio de venta es invalido"]);
      });

      it.skip("formato 7: un valor valido o esperado", () => {
        expect(
          validation.convertAmountStringToCents(DateType.selling, "25.35")
        ).to.eql(2535);
        expect(validation.valid).to.empty;
      });
    });
  });
});
