import { moduleId, difficultyLevels } from "../../constants";
import FacesActor from "../documents/FacesActor";
import { StatHelpers } from "../helpers/StatHelpers";

export default class FacesItemSheet extends ActorSheet {
  constructor(object: any, options = {}) {
    super(object, { ...options, width: 610, height: 750 });
    console.log("this.actor.type", this.actor.type);
  }

  // Define the template to use for this sheet
  override get template() {
    return `systems/${moduleId}/templates/sheets/actor/actor-sheet-${this.actor.system.type}.hbs`;
  }

  // Data to be passed to the template when rendering
  override getData() {
    const data: any = super.getData();
    data.moduleId = moduleId;

    data.difficultyLevels = difficultyLevels;
    if (this.actor.system.type === "character") {
      data.health = StatHelpers.calculateActorHealth(this.actor as FacesActor);
    }
    return data;
  }

  // Event Listeners
  override activateListeners(html: JQuery) {
    super.activateListeners(html);
    // Roll handlers, click handlers, etc. would go here.
    html.find(".faces-talent-roll").on("click", this._onRollDice.bind(this));

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

  private async _onUpdateHealth(event: JQuery.ClickEvent) {
    event.preventDefault();
    const value = parseInt(event.currentTarget.dataset.value) ?? 0;
    await (this.actor as FacesActor).updateHealth(value);
    this.render();
  }

  private async _onUpdateMana(event: JQuery.ClickEvent) {
    event.preventDefault();
    const value = parseInt(event.currentTarget.dataset.value) ?? 0;
    await (this.actor as FacesActor).updateMana(value);
    this.render();
  }
}
