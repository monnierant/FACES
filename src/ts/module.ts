// Do not remove this import. If you do Vite will think your styles are dead
// code and not include them in the build output.
import "../styles/style.scss";

import FacesActorSheet from "./apps/sheets/FacesActorSheet";

import { moduleId } from "./constants";
import { range } from "./handlebarsHelpers/range";
import { concat } from "./handlebarsHelpers/concat";
import { ternary } from "./handlebarsHelpers/ternary";
import { partial } from "./handlebarsHelpers/partial";
import { facesActorSchema } from "./apps/schemas/FacesActorSchema";
import FacesActorDataModel from "./apps/datamodels/FacesActorDataModel";
import MyNpcRoleActorDataModel from "./apps/datamodels/FacesNpcActorDataModel";
import FacesActor from "./apps/documents/FacesActor";

declare global {
  interface DocumentClassConfig {
    Actor: FacesActor;
  }

  // interface DataModelConfig {
  //   Actor: {
  //     someActorSubtype: SomeActorSubtypeDataModel;
  //     anotherActorSubtype: AnotherActorSubtypeDataModel;
  //   };
  // }
}

async function preloadTemplates(): Promise<any> {
  const templatePaths = [
    `systems/${moduleId}/templates/partials/actor/header.hbs`,
  ];

  return loadTemplates(templatePaths);
}

Hooks.once("init", () => {
  console.log(`Initializing ${moduleId}`);

  console.log("facesActorSchema", facesActorSchema);

  Handlebars.registerHelper("partial", partial);
  Handlebars.registerHelper("range", range);
  Handlebars.registerHelper("concat", concat);
  Handlebars.registerHelper("ternary", ternary);

  Handlebars.registerHelper("divide", function (a: number, b: number) {
    return a / b;
  });

  CONFIG.Actor.dataModels.character = FacesActorDataModel;
  CONFIG.Actor.dataModels.npc = MyNpcRoleActorDataModel;
  CONFIG.Actor.documentClass = FacesActor;

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet(moduleId, FacesActorSheet, { makeDefault: true });

  preloadTemplates();
});
