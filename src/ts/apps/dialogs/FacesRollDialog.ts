import { difficultyLevels, moduleId } from "../../constants";
import FacesActor from "../documents/FacesActor";

export default class FacesActorRollDialog extends Dialog {
  // ========================================
  // Constructor
  // ========================================
  constructor(actor: FacesActor, options: any = {}, data: any = {}) {
    // Call the parent constructor

    const _options = {
      ...options,
      ...{
        title: "Roll",
        buttons: {
          rollButton: {
            label: "Roll",
            callback: (html: JQuery) => {
              console.log("Roll");
              this._onRoll(html);
            },
            icon: '<i class="fas fa-dice"></i>',
          },
          cancelButton: {
            label: "Cancel",
            icon: '<i class="fa-solid fa-ban"></i>',
          },
        },
      },
    };

    super(_options, data);

    // Set the actor
    this.actor = actor;
  }

  // ========================================
  // Properties
  // ========================================
  public actor: FacesActor;
  // public roll: CowboyBebopRoll | undefined;

  // Define the template to use for this sheet
  override get template() {
    return `systems/${moduleId}/templates/dialog/roll.hbs`;
  }

  // Data to be passed to the template when rendering
  override getData() {
    let data: any = super.getData();
    data.actor = this.actor;
    data.difficultyLevels = difficultyLevels;
    return data;
  }

  // ========================================
  // Actions
  // ========================================
  // Roll the dice
  private async _onRoll(html: JQuery) {
    // Roll the dice
    let difficulty =
      parseInt(
        html.find("#faces-dialog-modifier-difficulty").val() as string
      ) ?? 0;
    let modificator =
      parseInt(
        html.find("#faces-dialog-modifier-modificator").val() as string
      ) ?? 0;
    let talent =
      parseInt(html.find("#faces-dialog-modifier-talent").val() as string) ?? 0;
    let attribut =
      parseInt(html.find("#faces-dialog-modifier-attribut").val() as string) ??
      0;
    await this.actor.rollTest(
      isNaN(attribut) ? 0 : attribut,
      isNaN(talent) ? 0 : talent,
      isNaN(difficulty) ? 0 : difficulty,
      isNaN(modificator) ? 0 : modificator
    );
  }
}
