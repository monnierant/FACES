export default class FacesRollsRegister {
  public static async registerTriggers(html: JQuery<HTMLElement>) {
    console.log(html);
    html.on("click", ".faces-roll-damage", this._onRollDamage.bind(this));
    html.on("click", ".faces-roll-explode", this._onRollExplode.bind(this));
  }

  public static async _onRollDamage(event: JQuery.ClickEvent) {
    event.preventDefault();
    const actorId = event.currentTarget?.dataset.actorId;
    const actor = game.actors?.find((a) => a.id == actorId);

    const weaponId = parseInt(event.currentTarget.dataset.weaponId) ?? 0;
    const weaponBonus = parseInt(event.currentTarget.dataset.weaponBonus) ?? 0;
    const weaponIsMelee = event.currentTarget.dataset.weaponIsMelee == "true";

    if (
      actor &&
      weaponId !== undefined &&
      weaponBonus !== undefined
    ) {
      await actor.rollDamage(weaponId, weaponBonus, weaponIsMelee);
      // console.log(actor);
    }
  }

  public static async _onRollExplode(event: JQuery.ClickEvent) {
    event.preventDefault();
    const actorId = event.currentTarget?.dataset.actorId;
    const actor = game.actors?.find((a) => a.id == actorId);

    const weaponId = parseInt(event.currentTarget.dataset.weaponId) ?? 0;
    const weaponIsMelee = event.currentTarget.dataset.weaponIsMelee == "true";
    const weaponBonus = parseInt(event.currentTarget.dataset.weaponBonus) ?? 0;

    const previousResult =
      parseInt(event.currentTarget.dataset.previousResult) ?? 0;
    const previousDice =
      parseInt(event.currentTarget.dataset.previousDice) ?? 0;
    const otherResult = parseInt(event.currentTarget.dataset.otherResult) ?? 0;
    const otherDice = parseInt(event.currentTarget.dataset.otherDice) ?? 0;
    const difficulty = parseInt(event.currentTarget.dataset.difficulty) ?? 0;
    const double = parseInt(event.currentTarget.dataset.double) ?? 0;
    const modificator = parseInt(event.currentTarget.dataset.modificator) ?? 0;
    const isDoubleExplode = event.currentTarget.dataset.doubleExplode == "true";

    if (actor) {
      await actor.rollExplode(
        difficulty,
        double,
        modificator,
        {
          previousResult,
          previousDice,
          otherResult,
          otherDice,
        },
        {
          weaponId,
          weaponIsMelee,
          weaponBonus,
        },
        isDoubleExplode
      );
    }
  }
}
