// The import = is important so that `CaracModBaseCarr` works.
import fields = foundry.data.fields;

export interface Carac {
  name: string;
  value: number;
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

export interface Weapon {
  name: string;
  damage: number;
  range: number;
  special: string;
}

export const weaponSchema = () => ({
  name: new fields.StringField({ initial: "" }),
  damage: new fields.NumberField({ initial: 0 }),
  range: new fields.NumberField({ initial: 0 }),
  special: new fields.StringField({ initial: "" }),
});
