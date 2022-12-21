import { DateType, Validation } from "@/core/validation";
import { beforeEach, describe, expect, it } from "vitest";
import type { Entry } from "@/core/core";

describe("Test class Validation", () => {
  let validation: Validation;
  let entry: Entry;

  beforeEach(() => {
    validation = new Validation();
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
