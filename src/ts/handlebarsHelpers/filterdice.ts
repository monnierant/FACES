export const filterdice = function (dices: number[], index: number) {
  return dices.filter((d, i) => {
    if (d === undefined) {
      console.log("dices", dices);
    }
    return i !== index;
  });
};
