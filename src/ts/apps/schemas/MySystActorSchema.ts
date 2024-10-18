import { defaultLenght } from "../../constants";
import fields = foundry.data.fields;
import {
  Talent,
  talentSchema,
  VitalStat,
  vitalStatSchema,
} from "./commonSchema";

export interface FacesActorSystem {
  type: string;
  health: VitalStat;
  mana: VitalStat;
  talents: Talent[];
}

export const facesActorSchema = {
  type: new fields.StringField({ initial: "character" }),

  health: new fields.SchemaField(vitalStatSchema()),
  mana: new fields.SchemaField(vitalStatSchema()),

  talents: new fields.ArrayField(new fields.SchemaField(talentSchema()), {
    initial: Array(defaultLenght.talent).fill({
      name: "",
      description: "",
    }),
  }),
};

export type FacesActorSchema = typeof facesActorSchema;
