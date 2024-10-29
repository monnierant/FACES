import { defaultLenght, attributeList } from "../../constants";
import fields = foundry.data.fields;
import {
  Carac,
  caracSchema,
  VitalStat,
  vitalStatSchema,
  Asset,
  assetSchema,
  Weapon,
  weaponSchema,
} from "./commonSchema";

export interface FacesActorSystem {
  type: string;
  health: VitalStat;
  mana: VitalStat;
  attributes: Carac[];
  talents: Carac[];
  assets: Asset[];
  meleeWeapons: Weapon[];
  rangedWeapons: Weapon[];
}

export const facesActorSchema = {
  type: new fields.StringField({ initial: "character" }),

  health: new fields.SchemaField(vitalStatSchema()),
  mana: new fields.SchemaField(vitalStatSchema()),

  attributes: new fields.ArrayField(new fields.SchemaField(caracSchema()), {
    initial: attributeList.map((carac) => ({
      name: carac,
      dice: 4,
    })),
  }),

  talents: new fields.ArrayField(new fields.SchemaField(caracSchema()), {
    initial: Array(defaultLenght.talent).fill({
      name: "",
      dice: 0,
    }),
  }),

  assets: new fields.ArrayField(new fields.SchemaField(assetSchema()), {
    initial: Array(defaultLenght.asset).fill({
      name: "",
      effect: "",
    }),
  }),

  meleeWeapons: new fields.ArrayField(new fields.SchemaField(weaponSchema()), {
    initial: Array(defaultLenght.meleeweapon).fill({
      name: "",
      damage: 0,
      range: 0,
      special: "",
    }),
  }),

  rangedWeapons: new fields.ArrayField(new fields.SchemaField(weaponSchema()), {
    initial: Array(defaultLenght.rangedweapon).fill({
      name: "",
      damage: 0,
      range: 0,
      special: "",
    }),
  }),
};

export type FacesActorSchema = typeof facesActorSchema;
