import { FacesActorSystem } from "../schemas/FacesActorSchema";

import FacesActorRollDialog from "../dialogs/FacesRollDialog";
import { moduleId } from "../../constants";
import { StatHelpers } from "../helpers/StatHelpers";
import { Carac, Spell, Weapon } from "../schemas/commonSchema";

export default class FacesActor extends Actor {
  public constructor(data: any, context: any) {
    super(data, context);
    console.log(this);
  }

  public getTalentValueById(talentId: number) {
    return this.getTalent(talentId).dice;
  }

  public getTalent(id: number): Carac {
    return (this.system as any as FacesActorSystem).talents[id];
  }

  public getAttribute(id: number): Carac {
    return (this.system as any as FacesActorSystem).attributes[id];
  }

  public async rollDialog() {
    const dialog = new FacesActorRollDialog(this);
    dialog.render(true);
  }

  public getWeapon(id: number, isMelee: boolean): Weapon {
    const system = this.system as any as FacesActorSystem;
    return isMelee ? system.meleeWeapons[id] : system.rangedWeapons[id];
  }

  public async rollWeaponDialog(isMelee: boolean, weaponId: number) {
    const dialog = new FacesActorRollDialog(this, weaponId, isMelee);
    dialog.render(true);
  }

  public async rollDamage(
    weaponId: number,
    weaponBonus: number,
    weaponIsMelee: boolean
  ) {
    const weapon = this.getWeapon(weaponId, weaponIsMelee);
    const roll = await new Roll(`1d${weapon.damage}`).roll();

    const damageResult = roll.total;
    const damageBonus = weaponBonus;
    const damage = damageResult + damageBonus;

    const content = await renderTemplate(
      `systems/${moduleId}/templates/chat/damage.hbs`,
      {
        actor: this,
        roll: roll,
        weapon: weapon,
        weaponId: weaponId,
        weaponIsMelee: weaponIsMelee,
        weaponBonus: weaponBonus,
        result: damage,
      }
    );

    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: content,
    });
  }

  public async rollExplode(
    dice: number,
    difficulty: number,
    previousResult: number,
    weaponId: number | undefined,
    weaponIsMelee: boolean,
    weaponBonus: number,
    remainingExplodes: number[]
  ) {
    const roll = await new Roll(`1d${dice}`).roll();

    roll.dice.forEach((d) => {
      if (d.results[0].result == d.faces) {
        remainingExplodes.push(d.faces);
      }
    });

    const result = roll.total + previousResult;
    const success = result >= difficulty && roll.total != 1;
    const degree = success ? Math.floor((result - difficulty) / 4) : 0;

    const content = await renderTemplate(
      `systems/${moduleId}/templates/chat/explode.hbs`,
      {
        actor: this,
        degree: degree,
        difficulty: difficulty,
        roll: roll,
        result: result,
        success: success,
        faill: roll.total == 1,
        previousResult: previousResult,
        weapon:
          weaponId !== undefined
            ? this.getWeapon(weaponId, weaponIsMelee)
            : undefined,
        weaponId: weaponId,
        weaponIsMelee: weaponIsMelee,
        weaponBonus: weaponBonus,
        canExplodes: remainingExplodes,
      }
    );

    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: content,
    });
  }

  public async rollTest(
    attributeId: number,
    talentId: number,
    difficulty: number,
    modificator: number,
    weaponId: number | undefined,
    weaponIsMelee: boolean,
    weaponBonus: number
  ) {
    const talent = talentId >= 0 ? this.getTalent(talentId).dice : 0;
    const attribute =
      attributeId >= 0 ? this.getAttribute(attributeId).dice : 0;

    const roll = await new Roll(`1d${attribute}+1d${talent}`).roll();

    let double = 0;
    // double => +1
    if (roll.dice.length == 2) {
      if (roll.dice[0].results[0].result == roll.dice[1].results[0].result) {
        double = 1;
      }
    }

    let canExplodes: number[] = [];
    roll.dice.forEach((d) => {
      if (d.results[0].result == d.faces) {
        canExplodes.push(d.faces);
      }
    });

    const result = roll.total + modificator + double;
    const success = result >= difficulty;
    const degree = success ? Math.floor((result - difficulty) / 4) : 0;

    const content = await renderTemplate(
      `systems/${moduleId}/templates/chat/roll.hbs`,
      {
        actor: this,
        degree: degree,
        difficulty: difficulty,
        modificator: modificator,
        roll: roll,
        result: result,
        success: success,
        weapon:
          weaponId !== undefined
            ? this.getWeapon(weaponId, weaponIsMelee)
            : undefined,
        weaponId: weaponId,
        weaponIsMelee: weaponIsMelee,
        weaponBonus: weaponBonus,
        double: double,
        canExplodes: canExplodes,
      }
    );

    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: content,
    });
  }

  public async updateHealth(health: number) {
    // const syst = this.system as any as FacesActorSystem;
    const syst: FacesActorSystem = this.system as any as FacesActorSystem;

    const healthValue = Math.clamp(
      syst.health.current + health,
      0,
      StatHelpers.calculateActorHealth(this).max
    );

    await this.update({
      system: { health: { current: healthValue } },
    });
  }

  public async updateMana(mana: number) {
    // const syst = this.system as any as FacesActorSystem;
    const syst: FacesActorSystem = this.system as any as FacesActorSystem;

    const manaValue = Math.clamp(
      syst.mana.current + mana,
      0,
      StatHelpers.calculateActorMana(this).max
    );

    await this.update({
      system: { mana: { current: manaValue } },
    });
  }
  public async updateExtra(extra: number) {
    // const syst = this.system as any as FacesActorSystem;
    const syst: FacesActorSystem = this.system as any as FacesActorSystem;

    const extraValue = Math.clamp(
      syst.extra.current + extra,
      0,
      StatHelpers.calculateActorExtra(this).max
    );

    await this.update({
      system: { extra: { current: extraValue } },
    });
  }

  public async updateXp(xp: number) {
    // const syst = this.system as any as FacesActorSystem;
    const syst: FacesActorSystem = this.system as any as FacesActorSystem;

    if (syst.experience.current + xp < 0) {
      return;
    }

    await this.update({
      system: {
        experience: {
          current: syst.experience.current + xp,
          total: Math.max(syst.experience.total + xp, syst.experience.total),
          spent: Math.max(
            syst.experience.spent + xp * -1,
            syst.experience.spent
          ),
        },
      },
    });
  }

  public async addSpell(spell: Spell) {
    // const syst = this.system as any as FacesActorSystem;
    const syst: FacesActorSystem = this.system as any as FacesActorSystem;

    await this.update({
      system: {
        spells: [...syst.spells, spell],
      },
    });
  }

  public async deleteSpell(spellId: number) {
    // const syst = this.system as any as FacesActorSystem;
    const syst: FacesActorSystem = this.system as any as FacesActorSystem;

    console.log("spellId", spellId);
    console.log(
      syst.spells.filter((spell: Spell, index: number) =>
        spell ? index !== spellId : true
      )
    );
    await this.update({
      system: {
        spells: syst.spells.filter((spell: Spell, index: number) =>
          spell ? index !== spellId : true
        ),
      },
    });
  }

  public async moveSpell(spellId: number, direction: number) {
    // const syst = this.system as any as FacesActorSystem;
    const syst: FacesActorSystem = this.system as any as FacesActorSystem;

    if (spellId + direction < 0 || spellId + direction >= syst.spells.length) {
      return;
    }

    let spells = [...syst.spells];
    const spell = spells[spellId];
    spells[spellId] = spells[spellId + direction];
    spells[spellId + direction] = spell;

    await this.update({
      system: { spells: spells },
    });
  }
}
