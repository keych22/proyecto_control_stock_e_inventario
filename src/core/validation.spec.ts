import { DateType, ValidationError, Validator } from "@/core/validation";
import { type Entry, StartDate } from "@/core/core";
import { beforeEach, describe, expect, it } from "vitest";

describe("Test class Validator", () => {
  describe("Test isValidCity", () => {
    it("Test valid inputs", () => {
      expect(Validator.isValidCity("NEUQUÉN")).toBeTruthy();
      expect(Validator.isValidCity("BUENOS AIRES")).toBeTruthy();
    });

    it("Test invalid inputs", () => {
      expect(Validator.isValidCity("DUMMY")).toBeFalsy();
    });
  });

  describe("Test isValidState", () => {
    it("Test valid inputs", () => {
      expect(Validator.isValidState("Vendido")).toBeTruthy();
      expect(Validator.isValidState("Credito")).toBeTruthy();
      expect(Validator.isValidState("Apartado")).toBeTruthy();
      expect(Validator.isValidState("SinVender")).toBeTruthy();
      expect(Validator.isValidState("Dañado")).toBeTruthy();
      expect(Validator.isValidState("Perdido")).toBeTruthy();
    });

    it("Test invalid inputs", () => {
      expect(Validator.isValidState("DUMMY")).toBeFalsy();
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
      expect(Validator.isValidDate(dayBeforeStartDate)).toBeFalsy();
    });

    it("Test start date", () => {
      expect(Validator.isValidDate(startDate)).toBeTruthy();
    });

    it("Test day after start date", () => {
      expect(Validator.isValidDate(dayAfterStartDate)).toBeTruthy();
    });

    it("Test yesterday", () => {
      expect(Validator.isValidDate(yesterday)).toBeTruthy();
    });

    it("Test today", () => {
      expect(Validator.isValidDate(today)).toBeTruthy();
    });

    it("Test tomorrow", () => {
      expect(Validator.isValidDate(tomorrow)).toBeFalsy();
    });
  });

  describe("Test isValidPhoneNumber", () => {
    it("Test valid inputs", () => {
      expect(Validator.isValidPhoneNumber("1234567890")).toBeTruthy();
    });

    it("Test invalid inputs", () => {
      expect(Validator.isValidPhoneNumber("")).toBeFalsy();
      expect(Validator.isValidPhoneNumber("1")).toBeFalsy();
      expect(Validator.isValidPhoneNumber("12")).toBeFalsy();
      expect(Validator.isValidPhoneNumber("123")).toBeFalsy();
      expect(Validator.isValidPhoneNumber("1234")).toBeFalsy();
      expect(Validator.isValidPhoneNumber("12345")).toBeFalsy();
      expect(Validator.isValidPhoneNumber("123456")).toBeFalsy();
      expect(Validator.isValidPhoneNumber("1234567")).toBeFalsy();
      expect(Validator.isValidPhoneNumber("12345678")).toBeFalsy();
      expect(Validator.isValidPhoneNumber("123456789")).toBeFalsy();
      expect(Validator.isValidPhoneNumber("0123456789")).toBeFalsy();
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
      expect(Validator.convertAmountDecimals("")).toBeNull();
      expect(Validator.convertAmountDecimals(".")).toBeNull();
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
      name: "",
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
      saleDate: "",
      salePrice: "",
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
      expect(validation.errors.client).not.to.be.null;
      expect(validation.errors.sellingPrice).not.to.be.null;
    });

    it.skip("Validar articulo en credito con el metodo validate_on_credit_item", () => {
      entry.state = "Credito";
      expect(validation.errors.client).not.to.be.null;
      expect(validation.errors.sellingPrice).not.to.be.null;
    });

    it.skip("Validar articulo apartado con el metodo validate_reserved_item", () => {
      entry.state = "Apartado";
      entry.salePrice = "23.35";
      validation.validateReservedItem(entry);
      expect(validation.errors.client).not.to.be.null;
      expect(validation.errors.sellingPrice).not.to.be.null;
    });

    it.skip("Validar articulo dañado con el metodo validate_damaged_item", () => {
      entry.state = "Dañado";
      entry.client = "Luis";
      entry.salePrice = "23.35";
      entry.telephone = "1023456789";
      validation.validateDamagedItem(entry);
      expect(validation.errors).to.be.eql([
        "Nombre de cliente debería estar vacio",
        "Precio de venta debe estar vacio",
        "El numero telefonico debe estar vacio",
      ]);
    });
  });

  describe("Validar metodo verifyPhoneNumber", () => {
    it.skip("Verificar formato 1", () => {
      validation.verifyPhoneNumber("1234567809");
      expect(validation.errors).to.empty;
    });

    it.skip("Verificar formato 2 comienza con 0", () => {
      validation.verifyPhoneNumber("0234567898");
      expect(validation.errors).to.eql(["Numero telefonico invalido"]);
    });

    it.skip("Verificar si numero telefonico NO esta vacio", () => {
      validation.verifyPhoneNumber("");
      expect(validation.errors).to.eql(["Numero telefonico invalido"]);
    });
  });

  describe("Validar Fechas", () => {
    it.skip("Verificar formato de fechas Incorrecto", () => {
      validation.validateDate(DateType.purchase, "25-04-2022");
      expect(validation.errors).to.eql([
        'Formato de fecha incorrecto (Fecha: "25-04-2022")',
      ]);
    });
  });

  it.skip("Verificar formato de fechas Correcto", () => {
    const validarFecha = validation.validateDate(DateType.purchase, "08-04-23");
    expect(validation.errors).to.empty;
    expect(validarFecha).to.eql("2023-04-08");
  });

  describe("Validar metodo convertAmountStringToCents", () => {
    describe("Validar formatos de montos", () => {
      it.skip("formato 1: un string", () => {
        expect(validation.convertAmountStringToCents(DateType.selling, "a")).to
          .be.null;
        expect(validation.errors).to.be.eql(["Precio de venta es invalido"]);
      });

      it.skip("formato 2: un string vacio", () => {
        expect(validation.convertAmountStringToCents(DateType.selling, "")).to
          .be.null;
        expect(validation.errors).to.be.eql(["Numero o formato invalido"]);
      });

      it.skip("formato 3: un string alfanumerico", () => {
        expect(validation.convertAmountStringToCents(DateType.selling, "2t6"))
          .to.be.null;
        expect(validation.errors).to.be.eql(["Precio de venta es invalido"]);
      });

      it.skip("formato 4: un punto", () => {
        expect(validation.convertAmountStringToCents(DateType.selling, ".")).to
          .be.null;
        expect(validation.errors).to.be.eql(["Numero o formato invalido"]);
      });

      it.skip("formato 5: un valor con punto y decimal", () => {
        expect(
          validation.convertAmountStringToCents(DateType.selling, ".9")
        ).to.be.eql(90);
        expect(validation.errors).to.be.eql([]);
      });

      it.skip("formato 6: un valor con mas decimales de lo permitido", () => {
        expect(
          validation.convertAmountStringToCents(DateType.selling, "25.356")
        ).to.be.null;
        expect(validation.errors).to.be.eql(["Precio de venta es invalido"]);
      });

      it.skip("formato 7: un valor valido o esperado", () => {
        expect(
          validation.convertAmountStringToCents(DateType.selling, "25.35")
        ).to.eql(2535);
        expect(validation.errors).to.empty;
      });
    });
  });
});
