function get_USDT_to_Rupees(amountUSDT, exchangeRatesStr) {
  amountUSDT = parseInt(amountUSDT);

  if (amountUSDT <= 0) {
    return "Invalid input";
  }

  const exchangeRates = parseExchangeRates(exchangeRatesStr, true);

  const { rate: rate, equivalentValue: rupees } =
    calculateRateAndEquivalentValue(amountUSDT, exchangeRates);
  const limits = calculateLimitValues(rupees, exchangeRates, true);

  const checkBoxes = getCheckboxInfo();

  return generateResponseMessage(amountUSDT, rate, rupees, limits, checkBoxes);
}