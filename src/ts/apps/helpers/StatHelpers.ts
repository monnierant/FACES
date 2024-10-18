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

  calculateActorHealth: function (actor: FacesActor) {
    const syst = actor.system as any as FacesActorSystem;

    return StatHelpers.calculateActorVital(syst.health);
  },

  calculateActorMana: function (actor: FacesActor) {
    const syst = actor.system as any as FacesActorSystem;

    return StatHelpers.calculateActorVital(syst.mana);
  },
};
