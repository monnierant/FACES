import { id } from "../system.json";

export const defaultLenght = {
  talent: 6,
  asset: 10,
  meleeweapon: 4,
  rangedweapon: 4,
  contact: 4,
  armor: 4,
};

export const difficultyLevels = [
  { value: 0, label: "easy" },
  { value: -10, label: "medium" },
  { value: -20, label: "hard" },
  { value: -30, label: "veryhard" },
  { value: -40, label: "impossible" },
];

// export const dices = [0, 1, 2, 4, 6, 8, 10, 12, 20];
export const dices = [0, 4, 6, 8, 10, 12, 20];

export const tabs = {
  character: ["attributes", "inventory", "histo"], //  ,"spells"],
  npc: ["abilities"],
};

export const attributeList = ["FOR", "AGI", "CAR", "SPI", "SEN"];

export const moduleId: string = id;
export const moduleIdCore = id as "faces";
