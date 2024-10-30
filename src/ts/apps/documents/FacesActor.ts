import { FacesActorSystem } from "../schemas/FacesActorSchema";

import FacesActorRollDialog from "../dialogs/FacesRollDialog";
import { moduleId } from "../../constants";
import { StatHelpers } from "../helpers/StatHelpers";
import { Carac, Weapon } from "../schemas/commonSchema";

export default class FacesActor extends Actor {
  public constructor(data: any, context: any) {
    super(data, context);
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

  public async rollWeaponDialog(isMelee: boolean, weaponId: number) {
    const system = this.system as any as FacesActorSystem;
    const weapon = isMelee
      ? system.meleeWeapons[weaponId]
      : system.rangedWeapons[weaponId];
    const dialog = new FacesActorRollDialog(this, weapon);
    dialog.render(true);
  }

  public async rollTest(
    attributeId: number,
    talentId: number,
    difficulty: number,
    modificator: number,
    weapon: Weapon | undefined,
    weaponBonus: number
  ) {
    const talent = talentId >= 0 ? this.getTalent(talentId).dice : 0;
    const attribute =
      attributeId >= 0 ? this.getAttribute(attributeId).dice : 0;
    const value = difficulty + modificator;

    const roll = await new Roll(`1d${attribute}+1d${talent}`).roll();
    const success = roll.total >= value;
    const degree = success ? Math.floor((roll.total - value) / 4) : 0;
    let damage = 0;
    if (success && weapon !== undefined) {
      const damageRoll = await new Roll(`1d${weapon.damage}`).roll();
      damage = damageRoll.total + weaponBonus;
    }

    const content = await renderTemplate(
      `systems/${moduleId}/templates/chat/roll.hbs`,
      {
        actor: this,
        degree: degree,
        difficulty: difficulty,
        modificator: modificator,
        totalDifficulty: value,
        result: roll,
        success: success,
        weapon: weapon,
        damage: damage,
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
    // const syst = this.system as any as BrigandyneActorSystem;
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
}
