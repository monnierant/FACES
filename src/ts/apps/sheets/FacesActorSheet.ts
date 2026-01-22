import {
  moduleId,
  difficultyLevels,
  tabs,
  dices,
  moduleIdCore,
} from "../../constants";
import FacesActor from "../documents/FacesActor";
import { StatHelpers } from "../helpers/StatHelpers";
import { Spell } from "../schemas/commonSchema";

export default class FacesActorSheet extends ActorSheet {
  constructor(object: any, options = {}) {
    super(object, { ...options, width: 620, height: 765 });
  }

  private tab: string = "attributes";

  // Define the template to use for this sheet
  override get template() {
    return `systems/${moduleId}/templates/sheets/actor/actor-sheet-${this.actor.type}.hbs`;
  }

  // Data to be passed to the template when rendering
  override getData() {
    const data: any = super.getData();
    data.moduleId = moduleId;

    data.tabs = tabs[this.actor.type as keyof typeof tabs];
    data.tab = this.tab;
    data.dices = dices;

    data.currency = {
      c1: game.settings?.get(moduleIdCore, "currency"),
      c2: game.settings?.get(moduleIdCore, "currency2"),
      c3: game.settings?.get(moduleIdCore, "currency3"),
      multi: game.settings?.get(moduleIdCore, "multiCurrency"),
    };

    data.tallenttooltip = game.settings?.get(moduleIdCore, "tallenttooltip");

    data.extraGauge = {
      text: game.settings?.get(moduleIdCore, "extraGauge.text"),
      enabled: game.settings?.get(moduleIdCore, "extraGauge.enable"),
    };

    data.difficultyLevels = difficultyLevels;

    if (this.actor.type === "character") {
      data.health = StatHelpers.calculateActorHealth(this.actor as FacesActor);
      data.mana = StatHelpers.calculateActorMana(this.actor as FacesActor);
      if (game.settings?.get(moduleIdCore, "extraGauge.enable")) {
        data.extra = StatHelpers.calculateActorExtra(this.actor as FacesActor);
      }
    }

    return data;
  }

  override async _render(...args: any[]) {
    console.log("render");
    console.log(this);
    console.trace();
    try {
      return await super._render(...args);
    } catch (e: any) {
      console.error(e);
    }
  }

  // Event Listeners
  override activateListeners(html: JQuery) {
    super.activateListeners(html);
    // Roll handlers, click handlers, etc. would go here.
    html.find(".faces-roll").on("click", this._onRollDice.bind(this));
    html
      .find(".faces-weapon-roll")
      .on("click", this._onRollWeaponDice.bind(this));
    html.find(".faces-tab").on("click", this._onTabChange.bind(this));

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    html
      .find(".faces-health-update")
      .on("click", this._onUpdateHealth.bind(this));

    if (this.actor.type === "character") {
      this.activateListenersPC(html);
    }
  }

  private activateListenersPC(html: JQuery) {
    html.on("click", ".faces-xp", this._onUpdateXp.bind(this));
    html.on("click", ".faces-mana-update", this._onUpdateMana.bind(this));
    html.on("click", ".faces-spell-add", this._onAddSpell.bind(this));
    html.on("click", ".faces-spell-move", this._onMoveSpell.bind(this));
    html.on("click", ".faces-spell-delete", this._onDeleteSpell.bind(this));

    if (game.settings?.get(moduleIdCore, "extraGauge.enable")) {
      html.on("click", ".faces-extra-update", this._onUpdateExtra.bind(this));
    }
  }

  // Event Handlers
  private async _onRollDice(event: JQuery.ClickEvent) {
    event.preventDefault();
    await (this.actor as FacesActor).rollDialog();
  }

  private async _onRollWeaponDice(event: JQuery.ClickEvent) {
    event.preventDefault();
    const type = event.currentTarget.dataset.type;
    const id = parseInt(event.currentTarget.dataset.id) ?? 0;
    await (this.actor as FacesActor).rollWeaponDialog(type === "melee", id);
  }

  private _onTabChange(event: JQuery.ClickEvent) {
    event.preventDefault();
    this.tab = event.currentTarget.dataset.tab;
    this.render();
  }

  private async _onUpdateHealth(event: JQuery.ClickEvent) {
    event.preventDefault();
    const parent = event.currentTarget.parentElement;
    const input = parent.querySelector(
      "input[name='health']",
    ) as HTMLInputElement;
    const mult = parseInt(event.currentTarget.dataset.mult) ?? 0;
    const health = parseInt(input.value) ?? 0;
    await (this.actor as FacesActor).updateHealth(health * mult);
    this.render();
  }

  private async _onUpdateMana(event: JQuery.ClickEvent) {
    event.preventDefault();
    const parent = event.currentTarget.parentElement;
    const input = parent.querySelector(
      "input[name='mana']",
    ) as HTMLInputElement;
    const mult = parseInt(event.currentTarget.dataset.mult) ?? 0;
    const mana = parseInt(input.value) ?? 0;
    await (this.actor as FacesActor).updateMana(mana * mult);
    this.render();
  }

  private async _onUpdateExtra(event: JQuery.ClickEvent) {
    event.preventDefault();
    const parent = event.currentTarget.parentElement;
    const input = parent.querySelector(
      "input[name='extra']",
    ) as HTMLInputElement;
    const mult = parseInt(event.currentTarget.dataset.mult) ?? 0;
    const extra = parseInt(input.value) ?? 0;
    await (this.actor as FacesActor).updateExtra(extra * mult);
    this.render();
  }

  private async _onUpdateXp(event: JQuery.ClickEvent) {
    event.preventDefault();
    const parent = event.currentTarget.parentElement;
    const input = parent.querySelector("input[name='xp']") as HTMLInputElement;
    const mult = parseInt(event.currentTarget.dataset.mult) ?? 0;
    const xp = parseInt(input.value) ?? 0;

    await (this.actor as FacesActor).updateXp(mult * xp);
    this.render();
  }

  private async _onAddSpell(event: JQuery.ClickEvent) {
    event.preventDefault();
    const spell: Spell = {
      name: "",
      description: "",
      difficulty: 0,
      duration: 0,
    };
    await (this.actor as FacesActor).addSpell(spell);
    this.render();
  }

  private async _onDeleteSpell(event: JQuery.ClickEvent) {
    event.preventDefault();
    const spellId = parseInt(event.currentTarget.dataset.spell) ?? -1;
    await (this.actor as FacesActor).deleteSpell(spellId);
    this.render();
  }

  private async _onMoveSpell(event: JQuery.ClickEvent) {
    event.preventDefault();
    const spellId = parseInt(event.currentTarget.dataset.spell) ?? -1;
    const direction = parseInt(event.currentTarget.dataset.direction) ?? 1;
    await (this.actor as FacesActor).moveSpell(spellId, direction);
    this.render();
  }
}
