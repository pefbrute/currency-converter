function calculateLimitValues(
  rupees,
  exchangeRates,
  Rupees_to_Currency = false
) {
  const calculateLimit = (rupees) => {
    const result = calculateRateAndEquivalentValue(
      rupees,
      exchangeRates,
      Rupees_to_Currency
    );
    return {
      rupees,
      currencyAmount: result.equivalentValue,
      rate: result.rate,
    };
  };

  return {
    low: calculateLimit(5000 * Math.floor(rupees / 5000)),
    high: calculateLimit(5000 * Math.ceil(rupees / 5000)),
  };
}


