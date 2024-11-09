// The import = is important so that `CaracModBaseCarr` works.
import fields = foundry.data.fields;

export interface Carac {
  name: string;
  dice: number;
}

export const caracSchema = () => ({
  name: new fields.StringField({ initial: "" }),
  dice: new fields.NumberField({ initial: 0 }),
});

export interface VitalStat {
  current: number;
  max: number;
}

export const vitalStatSchema = () => ({
  current: new fields.NumberField({ initial: 0 }),
  max: new fields.NumberField({ initial: 0 }),
});

export interface Asset {
  name: string;
  effect: string;
}

export const assetSchema = () => ({
  name: new fields.StringField({ initial: "" }),
  effect: new fields.StringField({ initial: "" }),
});

export interface Armor {
  name: string;
  defense: number;
  special: string;
}

export const armorSchema = () => ({
  name: new fields.StringField({ initial: "" }),
  defense: new fields.NumberField({ initial: 0 }),
  special: new fields.StringField({ initial: "" }),
});

export interface Weapon {
  name: string;
  damage: number;
  range: number;
  special: string;
  isMelee: boolean;
}

export const weaponSchema = () => ({
  name: new fields.StringField({ initial: "" }),
  damage: new fields.NumberField({ initial: 0 }),
  range: new fields.NumberField({ initial: 0 }),
  special: new fields.StringField({ initial: "" }),
  isMelee: new fields.BooleanField({ initial: false }),
});

export interface Contact {
  name: string;
  dice: number;
}

export const contactSchema = () => ({
  name: new fields.StringField({ initial: "" }),
  dice: new fields.NumberField({ initial: 0 }),
});

export interface Experience {
  current: number;
  total: number;
  spent: number;
}

export const experienceSchema = () => ({
  current: new fields.NumberField({ initial: 0 }),
  total: new fields.NumberField({ initial: 0 }),
  spent: new fields.NumberField({ initial: 0 }),
});

export interface Spell {
  name: string;
  difficulty: number;
  duration: number;
  description: string;
}

export const spellSchema = () => ({
  name: new fields.StringField({ initial: "" }),
  difficulty: new fields.NumberField({ initial: 0 }),
  duration: new fields.NumberField({ initial: 0 }),
  description: new fields.StringField({ initial: "" }),
});
