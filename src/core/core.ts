interface Entry {
  purchaseDate: string;
  city: string;
  category: string;
  name: string;
  product: string;
  type: string;
  detail: string;
  brand: string;
  gender: string;
  code: string;
  color: string;
  size: string;
  purchasePrice: string;
  monthsUnsold: string;
  state: string;
  saleDate: string;
  salePrice: string;
  credit: string;
  difference: string;
  client: string;
  telephone: string;
  delivery: string;
  contact: string;
  note: string;
  address: string;
}

const Cities = ["NEUQUÉN", "BUENOS AIRES"];

const States = [
  "Vendido",
  "Credito",
  "Apartado",
  "SinVender",
  "Dañado",
  "Perdido",
];
const StartDate = "2019-04-22";

export { type Entry, Cities, StartDate, States };
