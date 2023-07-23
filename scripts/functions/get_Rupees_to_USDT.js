function get_Rupees_to_USDT(amountRupee, exchangeRatesStr) {
  amountRupee = parseInt(amountRupee);

  if (isNaN(amountRupee) || amountRupee <= 0) {
    return "Invalid input";
  }

  const exchangeRates = parseExchangeRates(exchangeRatesStr, true);
  const { rate: rate, equivalentValue: USDT } = calculateRateAndEquivalentValue(
    amountRupee,
    exchangeRates,
    true
  );
  const limits = calculateLimitValues(amountRupee, exchangeRates, true);
  const checkBoxes = getCheckboxInfo();

  return generateResponseMessage(USDT, rate, amountRupee, limits, checkBoxes);
}


