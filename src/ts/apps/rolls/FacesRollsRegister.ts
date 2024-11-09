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
      weaponBonus !== undefined &&
      weaponIsMelee
    ) {
      // await actor.rollDamage(weaponId, weaponBonus, weaponIsMelee);
      console.log(actor);
    }
  }

  public static async _onRollExplode(event: JQuery.ClickEvent) {
    event.preventDefault();
    const actorId = event.currentTarget?.dataset.actorId;
    const actor = game.actors?.find((a) => a.id == actorId);
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

    if (
      actor &&
      weaponId !== undefined &&
      weaponBonus !== undefined &&
      explode !== undefined &&
      difficulty !== undefined &&
      previousResult !== undefined &&
      remainingExplodes !== undefined &&
      weaponIsMelee
    ) {
      console.log(actor);
      // if (actor) {
      // await actor.rollExplode(
      //   explode,
      //   difficulty,
      //   previousResult,
      //   weaponId,
      //   weaponIsMelee,
      //   weaponBonus,
      //   isNaN(remainingExplodes[0]) ? [] : remainingExplodes
      // );
    }
  }
}
