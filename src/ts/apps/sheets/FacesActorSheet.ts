import { moduleId, difficultyLevels, tabs, dices } from "../../constants";
import FacesActor from "../documents/FacesActor";
import { StatHelpers } from "../helpers/StatHelpers";

export default class FacesItemSheet extends ActorSheet {
  constructor(object: any, options = {}) {
    super(object, { ...options, width: 600, height: 750 });
    console.log("this.actor.type", this.actor.type);
  }

  private tab: string = "attributes";

  // Define the template to use for this sheet
  override get template() {
    return `systems/${moduleId}/templates/sheets/actor/actor-sheet-${this.actor.system.type}.hbs`;
  }

  // Data to be passed to the template when rendering
  override getData() {
    const data: any = super.getData();
    data.moduleId = moduleId;

    data.tabs = tabs[this.actor.system.type as keyof typeof tabs];
    data.tab = this.tab;
    data.dices = dices;

    data.difficultyLevels = difficultyLevels;
    if (this.actor.system.type === "character") {
      data.health = StatHelpers.calculateActorHealth(this.actor as FacesActor);
      data.mana = StatHelpers.calculateActorMana(this.actor as FacesActor);
    }
    return data;
  }

  // Event Listeners
  override activateListeners(html: JQuery) {
    super.activateListeners(html);
    // Roll handlers, click handlers, etc. would go here.
    html.find(".faces-talent-roll").on("click", this._onRollDice.bind(this));
    html.find(".faces-tab").on("click", this._onTabChange.bind(this));

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    html
      .find(".faces-health-update")
      .on("click", this._onUpdateHealth.bind(this));

    if (this.actor.system.type === "character") {
      this.activateListenersPC(html);
    }
  }

  private activateListenersPC(html: JQuery) {
    html.find(".faces-mana-update").on("click", this._onUpdateMana.bind(this));
  }

  // Event Handlers
  private async _onRollDice(event: JQuery.ClickEvent) {
    event.preventDefault();
    const talentId = event.currentTarget.dataset.talent;
    await (this.actor as FacesActor).rollDialog(talentId);
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
      "input[name='health']"
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
      "input[name='mana']"
    ) as HTMLInputElement;
    const mult = parseInt(event.currentTarget.dataset.mult) ?? 0;
    const mana = parseInt(input.value) ?? 0;
    await (this.actor as FacesActor).updateMana(mana * mult);
    this.render();
  }
}
