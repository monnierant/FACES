import fields = foundry.data.fields;
import { VitalStat, vitalStatSchema } from "./commonSchema";

export interface FacesNpcActorSystem {
  type: string;
  health: VitalStat;
  note: string;
}

export const facesNpcActorSchema = {
  type: new fields.StringField({ initial: "character" }),

  health: new fields.SchemaField(vitalStatSchema()),

  note: new fields.StringField({ initial: "" }),
};

export type FacesNpcActorSchema = typeof facesNpcActorSchema;
