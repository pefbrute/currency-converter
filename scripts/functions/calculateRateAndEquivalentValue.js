function calculateRateAndEquivalentValue(
  amount,
  exchangeRates,
  isRupeesToCurrency = false
) {
  for (const [limit, exchangeRate] of Object.entries(exchangeRates)) {
    if (limit * exchangeRate >= amount) {
      const equivalentValue = calculateEquivalentValue(
        amount,
        exchangeRate,
        isRupeesToCurrency
      );
      return { rate: exchangeRate, equivalentValue };
    }
  }

  const maxRate = getMaxRate(exchangeRates);
  const equivalentValue = calculateEquivalentValue(
    amount,
    maxRate,
    isRupeesToCurrency
  );
  return { rate: maxRate, equivalentValue };
}