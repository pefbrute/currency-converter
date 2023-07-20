function parseResult(result) {
  const lastVrtclLnIndex = result.lastIndexOf("|");
  const lastGateIndex = result.lastIndexOf("#");
  const lastUnderlineIndex = result.lastIndexOf("_");

  const clientsString = result.slice(0, lastVrtclLnIndex);
  const stringCommon = result.slice(lastVrtclLnIndex + 1, lastGateIndex);
  const stringLow = result.slice(lastGateIndex + 1, lastUnderlineIndex);
  const stringHigh = result.slice(lastUnderlineIndex + 1);

  return { clientsString, stringCommon, stringLow, stringHigh };
}
