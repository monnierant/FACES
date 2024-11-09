import { Carac } from "../apps/schemas/commonSchema";

export const removeEmpty = function (a: Array<Carac>) {
  return a
    .map((val, ind) => ({ value: val, index: ind }))
    .filter(
      (v) => v.value !== undefined && v.value !== null && v.value.name !== ""
    );
};
