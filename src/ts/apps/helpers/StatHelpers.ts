import FacesActor from "../documents/FacesActor";
import { VitalStat } from "../schemas/commonSchema";
import { FacesActorSystem } from "../schemas/FacesActorSchema";

export const StatHelpers = {
  calculateActorVital: function (vital: VitalStat) {
    return {
      current: vital.current,
      max: vital.max,
      percent: Math.round((vital.current / vital.max) * 100),
    };
  },

  calculateLine: function (vitality: number) {
    return Math.ceil(vitality / 2);
  },

  calculateActorHealth: function (actor: FacesActor) {
    const syst = actor.system as any as FacesActorSystem;

    const base = StatHelpers.calculateActorVital(syst.health);

    return {
      current: base.current,
      max: base.max,
      percent: Math.round((base.current / base.max) * 100),
      line: StatHelpers.calculateLine(base.max),
      lineValue: Math.round(
        (Math.max(base.current - StatHelpers.calculateLine(base.max), 0) /
          base.max) *
          100
      ),
    };
  },

  calculateActorMana: function (actor: FacesActor) {
    const syst = actor.system as any as FacesActorSystem;

    const base = StatHelpers.calculateActorVital(syst.mana);

    return {
      current: base.current,
      max: base.max,
      percent: Math.round((base.current / base.max) * 100),
    };
  },
};
