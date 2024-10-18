import TypeDataModel = foundry.abstract.TypeDataModel;
import {
  FacesNpcActorSchema,
  facesNpcActorSchema,
} from "../schemas/FacesNpcActorSchema";
import FacesActor from "../documents/FacesActor";

export default class FacesNpcActorDataModel extends TypeDataModel<
  FacesNpcActorSchema,
  FacesActor
> {
  static override defineSchema() {
    return facesNpcActorSchema;
  }
}
