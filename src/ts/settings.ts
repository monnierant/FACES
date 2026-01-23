import { moduleIdCore } from "./constants";

export async function setupSettings(): Promise<any> {
  await game.settings?.register(moduleIdCore, "currency", {
    name: "FACES.Settings.currency", // can also be an i18n key
    hint: "FACES.Settings.currencyHint", // can also be an i18n key
    scope: "world", // "world" = sync to db, "client" = local storage
    config: true, // false if you dont want it to show in module config
    type: String, // Number, Boolean, String, or even a custom class or DataModel
    default: "€$",
    requiresReload: false, // when changing the setting, prompt the user to reload
  });

  await game.settings?.register(moduleIdCore, "multiCurrency", {
    name: "FACES.Settings.multiCurrency", // can also be an i18n key
    hint: "FACES.Settings.multiCurrencyHint", // can also be an i18n key
    scope: "world", // "world" = sync to db, "client" = local storage
    config: true, // false if you dont want it to show in module config
    type: Boolean, // Number, Boolean, String, or even a custom class or DataModel
    default: false,
    requiresReload: true, // when changing the setting, prompt the user to reload
  });

  await game.settings?.register(moduleIdCore, "currency2", {
    name: "FACES.Settings.currency2", // can also be an i18n key
    hint: "FACES.Settings.currency2Hint", // can also be an i18n key
    scope: "world", // "world" = sync to db, "client" = local storage
    config: true, // false if you dont want it to show in module config
    type: String, // Number, Boolean, String, or even a custom class or DataModel
    default: "PA",
    requiresReload: false, // when changing the setting, prompt the user to reload
  });

  await game.settings?.register(moduleIdCore, "currency3", {
    name: "FACES.Settings.currency3", // can also be an i18n key
    hint: "FACES.Settings.currency3Hint", // can also be an i18n key
    scope: "world", // "world" = sync to db, "client" = local storage
    config: true, // false if you dont want it to show in module config
    type: String, // Number, Boolean, String, or even a custom class or DataModel
    default: "PC",
    requiresReload: false, // when changing the setting, prompt the user to reload
  });

  await game.settings?.register(moduleIdCore, "extraGauge.enable", {
    name: "FACES.Settings.extraGauge.enable", // can also be an i18n key
    hint: "", // can also be an i18n key
    scope: "world", // "world" = sync to db, "client" = local storage
    config: true, // false if you dont want it to show in module config
    type: Boolean, // Number, Boolean, String, or even a custom class or DataModel
    default: false,
    requiresReload: true, // when changing the setting, prompt the user to reload
  });

  await game.settings?.register(moduleIdCore, "extraGauge.text", {
    name: "FACES.Settings.extraGauge.text", // can also be an i18n key
    hint: "", // can also be an i18n key
    scope: "world", // "world" = sync to db, "client" = local storage
    config: true, // false if you dont want it to show in module config
    type: String, // Number, Boolean, String, or even a custom class or DataModel
    default: "Humanity",
    requiresReload: false, // when changing the setting, prompt the user to reload
  });

  await game.settings?.register(moduleIdCore, "oneisfaill", {
    name: "FACES.Settings.oneisfaill", // can also be an i18n key
    hint: "", // can also be an i18n key
    scope: "world", // "world" = sync to db, "client" = local storage
    config: true, // false if you dont want it to show in module config
    type: Boolean, // Number, Boolean, String, or even a custom class or DataModel
    default: true,
    requiresReload: true, // when changing the setting, prompt the user to reload
  });

  await game.settings?.register(moduleIdCore, "tallenttooltip", {
    name: "FACES.Settings.tallenttooltip", // can also be an i18n key
    hint: "FACES.Settings.tallenttooltipHint", // can also be an i18n key
    scope: "world", // "world" = sync to db, "client" = local storage
    config: true, // false if you dont want it to show in module config
    type: Boolean, // Number, Boolean, String, or even a custom class or DataModel
    default: false,
    requiresReload: true, // when changing the setting, prompt the user to reload
  });
}
