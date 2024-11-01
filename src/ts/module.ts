// Do not remove this import. If you do Vite will think your styles are dead
// code and not include them in the build output.
import "../styles/style.scss";

import FacesActorSheet from "./apps/sheets/FacesActorSheet";

import { moduleId } from "./constants";
import { range } from "./handlebarsHelpers/range";
import { concat } from "./handlebarsHelpers/concat";
import { ternary } from "./handlebarsHelpers/ternary";
import { partial } from "./handlebarsHelpers/partial";

import { setupSettings } from "./settings";

import FacesActorDataModel from "./apps/datamodels/FacesActorDataModel";
// import MyNpcRoleActorDataModel from "./apps/datamodels/FacesNpcActorDataModel";
import FacesActor from "./apps/documents/FacesActor";
import { removeEmpty } from "./handlebarsHelpers/removeEmpty";

declare global {
  interface DocumentClassConfig {
    Actor: FacesActor;
  }
  interface SettingConfig {
    "faces.currency": string;
    "faces.currency2": string;
    "faces.currency3": string;
    "faces.multiCurrency": boolean;
    "faces.extraGauge.text": string;
    "faces.extraGauge.enable": boolean;
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
    `systems/${moduleId}/templates/partials/diceSelector.hbs`,
    `systems/${moduleId}/templates/partials/actor/header.hbs`,
    `systems/${moduleId}/templates/partials/actor/hpmpbar.hbs`,
    `systems/${moduleId}/templates/partials/actor/pannels/attributes.hbs`,
    `systems/${moduleId}/templates/partials/actor/pannels/inventory.hbs`,
    `systems/${moduleId}/templates/partials/actor/pannels/histo.hbs`,
  ];

  return loadTemplates(templatePaths);
}

Hooks.once("init", () => {
  console.log(`Initializing ${moduleId}`);

  Handlebars.registerHelper("partial", partial);
  Handlebars.registerHelper("range", range);
  Handlebars.registerHelper("concat", concat);
  Handlebars.registerHelper("ternary", ternary);
  Handlebars.registerHelper("removeEmpty", removeEmpty);

  Handlebars.registerHelper("divide", function (a: number, b: number) {
    return a / b;
  });

  CONFIG.Actor.dataModels.character = FacesActorDataModel;
  // CONFIG.Actor.dataModels.npc = MyNpcRoleActorDataModel;
  CONFIG.Actor.documentClass = FacesActor;

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet(moduleId, FacesActorSheet, { makeDefault: true });

  preloadTemplates();
  setupSettings();
});
