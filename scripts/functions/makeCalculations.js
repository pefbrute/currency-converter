function makeCalculations() {
  const inputs = getInputs();
  const result = calculateCurrency(inputs);
  const parsedResults = parseResult(result);
  displayResults(parsedResults);
}