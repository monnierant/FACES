import { Carac } from "../apps/schemas/commonSchema";

export const removeEmpty = function (a: Array<Carac>) {
  return a.filter((v) => v !== undefined && v !== null && v.name !== "");
};
