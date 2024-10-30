import TypeDataModel = foundry.abstract.TypeDataModel;
import {
  FacesActorSchema,
  facesActorSchema,
} from "../schemas/FacesActorSchema";
import FacesActor from "../documents/FacesActor";

export default class FacesActorDataModel extends TypeDataModel<
  FacesActorSchema,
  FacesActor
> {
  static override defineSchema() {
    return facesActorSchema;
  }
}
