class Entry {
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
  purchasePrice: string = "";
  monthsUnsold: string = "";
  state: string = "";
  sellingDate: string = "";
  sellingPrice: string = "";
  credit: string = "";
  difference: string = "";
  client: string = "";
  telephone: string = "";
  delivery: string = "";
  contact: string = "";
  note: string = "";
  address: string = "";
}

const Cities = ["NEUQUÉN", "BUENOS AIRES"];

const States = [
  "Vendido",
  "Crédito",
  "Apartado",
  "Sin vender",
  "Dañado",
  "Perdido",
  "Robado",
  "Regalado",
];

const ContactMethod = [
  "Facebook",
  "Instagram",
  "Ninguna",
  "Personal",
  "Referencia",
  "Whatsapp",
  "Feria",
];

const StartDate = "2019-04-22";

export { Entry, Cities, ContactMethod, StartDate, States };
