export default class FacesRollsRegister {
  public static registerTriggers(html: JQuery) {
    html.find(".faces-roll-damage").on("click", this._onRollDamage);
    html.find(".faces-roll-explode").on("click", this._onRollExplode);
  }

  public static async _onRollDamage(event: JQuery.ClickEvent) {
    event.preventDefault();
    const actorId = event.currentTarget?.dataset.actorId;
    const actor = game.actors?.get(actorId);

    const weaponId = parseInt(event.currentTarget.dataset.weaponId) ?? 0;
    const weaponBonus = parseInt(event.currentTarget.dataset.weaponBonus) ?? 0;
    const weaponIsMelee = event.currentTarget.dataset.weaponIsMelee == "true";
    if (actor) {
      await actor.rollDamage(weaponId, weaponBonus, weaponIsMelee);
    }
  }

  public static async _onRollExplode(event: JQuery.ClickEvent) {
    event.preventDefault();
    const actorId = event.currentTarget?.dataset.actorId;
    const actor = game.actors?.get(actorId);
    console.log(actor);

    const explode = parseInt(event.currentTarget.dataset.explode) ?? 0;
    const difficulty = parseInt(event.currentTarget.dataset.difficulty) ?? 0;
    const previousResult =
      parseInt(event.currentTarget.dataset.previousResult) ?? 0;
    const weaponId = parseInt(event.currentTarget.dataset.weaponId) ?? 0;
    const weaponIsMelee = event.currentTarget.dataset.weaponIsMelee == "true";
    const weaponBonus = parseInt(event.currentTarget.dataset.weaponBonus) ?? 0;

    console.log(event.currentTarget.dataset.explodes);

    const remainingExplodes = event.currentTarget.dataset.explodes
      .split(",")
      .map((e: string) => parseInt(e));

    console.log(remainingExplodes);
    console.log(isNaN(remainingExplodes[0]));

    if (actor) {
      await actor.rollExplode(
        explode,
        difficulty,
        previousResult,
        weaponId,
        weaponIsMelee,
        weaponBonus,
        isNaN(remainingExplodes[0]) ? [] : remainingExplodes
      );
    }
  }
}
