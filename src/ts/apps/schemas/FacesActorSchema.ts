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
  Contact,
  contactSchema,
  Experience,
  experienceSchema,
} from "./commonSchema";

export interface FacesActorSystem {
  type: string;
  health: VitalStat;
  mana: VitalStat;
  extra: VitalStat;
  attributes: Carac[];
  talents: Carac[];
  assets: Asset[];
  meleeWeapons: Weapon[];
  rangedWeapons: Weapon[];
  contacts: Contact[];
  bag: string;
  bag2: string;
  vice: string;
  money: number;
  money2: number;
  money3: number;
  experience: Experience;
}

export const facesActorSchema = {
  type: new fields.StringField({ initial: "character" }),

  health: new fields.SchemaField(vitalStatSchema()),
  mana: new fields.SchemaField(vitalStatSchema()),
  extra: new fields.SchemaField(vitalStatSchema()),

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

  contacts: new fields.ArrayField(new fields.SchemaField(contactSchema()), {
    initial: Array(defaultLenght.contact).fill({
      name: "",
      dice: 0,
    }),
  }),

  bag: new fields.StringField({ initial: "" }),
  bag2: new fields.StringField({ initial: "" }),

  vice: new fields.StringField({ initial: "" }),

  money: new fields.NumberField({ initial: 0 }),
  money2: new fields.NumberField({ initial: 0 }),
  money3: new fields.NumberField({ initial: 0 }),

  experience: new fields.SchemaField(experienceSchema(), {
    initial: {
      current: 0,
      total: 0,
      spent: 0,
    },
  }),
};

export type FacesActorSchema = typeof facesActorSchema;
