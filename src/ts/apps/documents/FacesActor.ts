import { FacesActorSystem } from "../schemas/FacesActorSchema";

import FacesActorRollDialog from "../dialogs/FacesRollDialog";
import { moduleId, moduleIdCore } from "../../constants";
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
        moduleId: moduleId,
      }
    );

    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: content,
    });
  }

  public async rollExplode(
    difficulty: number,
    double: number,
    modificator: number,
    dices: {
      previousResult: number;
      previousDice: number;
      otherResult: number;
      otherDice: number;
    },
    weapon: {
      weaponId: number | undefined;
      weaponIsMelee: boolean;
      weaponBonus: number;
    },
    isDoubleExplode: boolean
  ) {
    const secondRoll = isDoubleExplode ? `+1d${dices.otherDice}` : "";
    const roll = await new Roll(`1d${dices.previousDice}${secondRoll}`).roll();
    const isOneA =
      roll.dice[0].results[0].result == 1 &&
      game.settings?.get(moduleIdCore, "oneisfaill");
    const isOneT = isDoubleExplode
      ? roll.dice[1].results[0].result == 1 &&
        game.settings?.get(moduleIdCore, "oneisfaill")
      : false;

    const valueA = isOneA
      ? 1
      : roll.dice[0].results[0].result + dices.previousResult;
    const valueT = isOneT
      ? 1
      : (isDoubleExplode ? roll.dice[1].results[0].result : 0) +
        dices.otherResult;

    const max = Math.max(valueA, valueT);

    const result = max + modificator + double;

    const criticalFaill = valueA == 1 && valueT == 1;

    const success =
      result >= difficulty &&
      (roll.total != 1 || !game.settings?.get(moduleIdCore, "oneisfaill")) &&
      !criticalFaill;

    const degree = success ? Math.floor((result - difficulty) / 4) : 0;

    const content = await renderTemplate(
      `systems/${moduleId}/templates/chat/explode.hbs`,
      {
        actor: this,
        difficulty: difficulty,
        modificator: modificator,
        double: double,
        roll: roll,
        result: result,
        degree: degree,
        success: success,
        faill: roll.total == 1,
        max: max,
        rA: {
          result: valueA,
          faces: dices.previousDice,
          canExplode: roll.dice[0].faces == roll.dice[0].results[0].result,
        },
        rT: {
          result: valueT,
          faces: dices.otherDice,
          canExplode: isDoubleExplode
            ? roll.dice[1].faces == roll.dice[1].results[0].result
            : false,
        },
        weapon:
          weapon.weaponId !== undefined
            ? this.getWeapon(weapon.weaponId, weapon.weaponIsMelee)
            : undefined,
        weaponId: weapon.weaponId,
        weaponIsMelee: weapon.weaponIsMelee,
        weaponBonus: weapon.weaponBonus,
        moduleId: moduleId,
        oneisfaill: game.settings?.get(moduleIdCore, "oneisfaill"),
        criticalFaill: criticalFaill,
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
    let criticalFaill = false;
    // double => +1
    if (roll.dice.length == 2) {
      if (roll.dice[0].results[0].result == roll.dice[1].results[0].result) {
        if (roll.dice[0].results[0].result == 1) {
          criticalFaill = true;
        } else {
          double = 1;
        }
      }
    }

    let max = 0;
    roll.dice.forEach((d) => {
      if (d.results[0].result > max) {
        max = d.results[0].result;
      }
    });

    const result = max + modificator + double;
    const success = result >= difficulty && !criticalFaill;
    const degree = success ? Math.floor((result - difficulty) / 4) : 0;

    const content = await renderTemplate(
      `systems/${moduleId}/templates/chat/roll.hbs`,
      {
        actor: this,
        weaponId: weaponId,
        weaponIsMelee: weaponIsMelee,
        weaponBonus: weaponBonus,
        double: double,
        moduleId: moduleId,
        difficulty: difficulty,
        modificator: modificator,
        degree: degree,
        roll: roll,
        rA: {
          result: roll.dice[0].results[0].result,
          faces: roll.dice[0].faces,
          canExplode: roll.dice[0].faces == roll.dice[0].results[0].result,
        },
        rT: {
          result: roll.dice[1].results[0].result,
          faces: roll.dice[1].faces,
          canExplode: roll.dice[1].faces == roll.dice[1].results[0].result,
        },
        result: result,
        max: max,
        success: success,
        weapon:
          weaponId !== undefined
            ? this.getWeapon(weaponId, weaponIsMelee)
            : undefined,
        criticalFaill: criticalFaill,
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
