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
import FacesNpcActorDataModel from "./apps/datamodels/FacesNpcActorDataModel";
import FacesActor from "./apps/documents/FacesActor";
import { removeEmpty } from "./handlebarsHelpers/removeEmpty";
import FacesRollsRegister from "./apps/rolls/FacesRollsRegister";
import { join } from "./handlebarsHelpers/join";
import { filterdice } from "./handlebarsHelpers/filterdice";
import { and } from "./handlebarsHelpers/and";
import { or } from "./handlebarsHelpers/or";
import { lengt } from "./handlebarsHelpers/lengt";

declare global {
  interface DocumentClassConfig {
    Actor: typeof FacesActor;
  }
  interface SettingConfig {
    "faces.currency": string;
    "faces.currency2": string;
    "faces.currency3": string;
    "faces.multiCurrency": boolean;
    "faces.extraGauge.text": string;
    "faces.extraGauge.enable": boolean;
    "faces.oneisfaill": boolean;
    "faces.tallenttooltip": boolean;
  }

  interface DataModelConfig {
    Actor: {
      character: typeof FacesActorDataModel;
      npc: typeof FacesNpcActorDataModel;
    };
  }
}

async function preloadTemplates(): Promise<any> {
  const templatePaths = [
    `systems/${moduleId}/templates/partials/diceSelector.hbs`,
    `systems/${moduleId}/templates/partials/diceDetails.hbs`,
    `systems/${moduleId}/templates/partials/actor/header.hbs`,
    `systems/${moduleId}/templates/partials/actor/hpmpbar.hbs`,
    `systems/${moduleId}/templates/partials/actor/pannels/attributes.hbs`,
    `systems/${moduleId}/templates/partials/actor/pannels/inventory.hbs`,
    `systems/${moduleId}/templates/partials/actor/pannels/histo.hbs`,
    `systems/${moduleId}/templates/partials/actor/pannels/spells.hbs`,
    `systems/${moduleId}/templates/partials/actor/pannels/tallenttooltip.hbs`,
  ];

  return loadTemplates(templatePaths);
}

Hooks.once("init", () => {
  console.log(`Initializing ${moduleId}`);

  Handlebars.registerHelper("join", join);
  Handlebars.registerHelper("filterdice", filterdice);
  Handlebars.registerHelper("partial", partial);
  Handlebars.registerHelper("range", range);
  Handlebars.registerHelper("concat", concat);
  Handlebars.registerHelper("ternary", ternary);
  Handlebars.registerHelper("removeEmpty", removeEmpty);
  Handlebars.registerHelper("myand", and);
  Handlebars.registerHelper("myor", or);
  Handlebars.registerHelper("lengt", lengt);

  Handlebars.registerHelper("divide", function (a: number, b: number) {
    return a / b;
  });

  CONFIG.Actor.dataModels.character = FacesActorDataModel;
  CONFIG.Actor.dataModels.npc = FacesNpcActorDataModel;
  CONFIG.Actor.documentClass = FacesActor;

  // To fix a stupid issue with sheet replaced by $ at runtime
  let sheet = new FacesActorSheet({});
  console.log(sheet);

  // let sheet: any; // = FacesActorSheet.sheet;
  // Object.defineProperty(Application, "sheet", {
  //   get() {
  //     console.trace(sheet);
  //     return sheet;
  //   },
  //   set(newSheet) {
  //     console.trace(newSheet);
  //     console.log("SET", newSheet);
  //     if (newSheet === $) {
  //       throw new Error("Sheet was set to $");
  //     }

  //     sheet = newSheet;
  //   },
  // });

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet(moduleId, FacesActorSheet, { makeDefault: true });

  preloadTemplates();
  setupSettings();
});

Hooks.on("renderChatMessage", (app, html, data): void => {
  if (app === undefined) {
    console.log("app is undefined");
  }

  if (data === undefined) {
    console.log("data is undefined");
  }

  if (html === undefined) {
    console.log("html is undefined");
  }

  FacesRollsRegister.registerTriggers(html);
});
