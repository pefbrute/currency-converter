function getMaxRate(exchangeRates) {
  const maxLimit = Math.max(...Object.keys(exchangeRates));
  return exchangeRates[maxLimit];
}