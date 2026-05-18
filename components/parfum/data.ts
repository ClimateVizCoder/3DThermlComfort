export type DuftFamilie = "Orientalisch" | "Holzig" | "Zitrus" | "Frisch" | "Blumig" | "Gourmand";

export const familyColor: Record<DuftFamilie, string> = {
  Orientalisch: "#C8A96E",
  Holzig:       "#A07850",
  Zitrus:       "#C8B040",
  Frisch:       "#60A888",
  Blumig:       "#C878A0",
  Gourmand:     "#C86048",
};

export interface Flakon {
  id: string;
  name: string;
  maison: string;
  konzentration: "EDP" | "EDT" | "Parfum" | "EDC";
  jahr: number;
  familie: DuftFamilie;
  fuellstand: number; // 0–100
  fuellstandMl: number;
  kapazitaetMl: number;
  kopfnoten: string[];
  herznoten: string[];
  basisnoten: string[];
  zuletztGetragen: string;
  tragediesenMonat: number;
  farbAccent: string;
}

export const flakons: Flakon[] = [
  {
    id: "1",
    name: "Oud Ispahan",
    maison: "Christian Dior",
    konzentration: "EDP",
    jahr: 2012,
    familie: "Orientalisch",
    fuellstand: 78,
    fuellstandMl: 78,
    kapazitaetMl: 100,
    kopfnoten: ["Labdanum", "Safran"],
    herznoten: ["Oud", "Rose de Mai"],
    basisnoten: ["Sandelholz", "Patchouli", "Vetiver"],
    zuletztGetragen: "14. Mai 2026",
    tragediesenMonat: 4,
    farbAccent: "#5A3218",
  },
  {
    id: "2",
    name: "Baccarat Rouge 540",
    maison: "Maison Francis Kurkdjian",
    konzentration: "EDP",
    jahr: 2015,
    familie: "Holzig",
    fuellstand: 45,
    fuellstandMl: 90,
    kapazitaetMl: 200,
    kopfnoten: ["Safran", "Jasmin"],
    herznoten: ["Ambrofix", "Cedr"],
    basisnoten: ["Fir Resin", "Ambergris"],
    zuletztGetragen: "11. Mai 2026",
    tragediesenMonat: 6,
    farbAccent: "#283246",
  },
  {
    id: "3",
    name: "Shalimar",
    maison: "Guerlain",
    konzentration: "Parfum",
    jahr: 1925,
    familie: "Orientalisch",
    fuellstand: 62,
    fuellstandMl: 62,
    kapazitaetMl: 100,
    kopfnoten: ["Bergamotte", "Zitrone"],
    herznoten: ["Iris", "Rose", "Jasmin"],
    basisnoten: ["Vanille", "Oud", "Tonka"],
    zuletztGetragen: "8. Mai 2026",
    tragediesenMonat: 2,
    farbAccent: "#3C2A14",
  },
  {
    id: "4",
    name: "Aventus",
    maison: "Creed",
    konzentration: "EDP",
    jahr: 2010,
    familie: "Frisch",
    fuellstand: 90,
    fuellstandMl: 225,
    kapazitaetMl: 250,
    kopfnoten: ["Ananas", "Bergamotte", "Schwarze Johannisbeere"],
    herznoten: ["Birke", "Patschuli", "Rose"],
    basisnoten: ["Moschus", "Eichenholz", "Ambergris"],
    zuletztGetragen: "15. Mai 2026",
    tragediesenMonat: 8,
    farbAccent: "#1E3828",
  },
  {
    id: "5",
    name: "Chanel N°5",
    maison: "Chanel",
    konzentration: "EDP",
    jahr: 1921,
    familie: "Blumig",
    fuellstand: 35,
    fuellstandMl: 26,
    kapazitaetMl: 75,
    kopfnoten: ["Aldehyde", "Bergamotte", "Neroli"],
    herznoten: ["Ylang-Ylang", "Rose", "Jasmin"],
    basisnoten: ["Sandelholz", "Vetiver", "Vanille"],
    zuletztGetragen: "2. Mai 2026",
    tragediesenMonat: 1,
    farbAccent: "#3A2E42",
  },
  {
    id: "6",
    name: "Ambre Nuit",
    maison: "Christian Dior",
    konzentration: "EDP",
    jahr: 2009,
    familie: "Holzig",
    fuellstand: 55,
    fuellstandMl: 83,
    kapazitaetMl: 150,
    kopfnoten: ["Bergamotte", "Rose"],
    herznoten: ["Ambre", "Labdanum"],
    basisnoten: ["Zeder", "Sandelholz", "Vetiver"],
    zuletztGetragen: "9. Mai 2026",
    tragediesenMonat: 3,
    farbAccent: "#3C2810",
  },
];

export const klimaDaten = {
  temperatur: 17.4,
  luftfeuchte: 48,
  uvStatus: true,
  luefter: 23,
  zielTemp: 17,
  zielFeuchte: 50,
  tempVerlauf: [17.2, 17.1, 17.5, 17.3, 16.9, 17.0, 17.4],
  days: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
};
