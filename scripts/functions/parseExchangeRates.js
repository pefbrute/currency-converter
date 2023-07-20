function parseExchangeRates(exchangeRatesStr, isUSDT = false) {
  const exchangeRates = {};
  const pattern = isUSDT ? /^До (\d+)-(\d+)$/gm : /^До (\d+)-(\d+\.\d+)$/gm;
  let matches;
  while ((matches = pattern.exec(exchangeRatesStr)) !== null) {
    const limit = parseInt(matches[1]);
    const rate = parseFloat(matches[2]);
    exchangeRates[limit] = rate;
  }
  return exchangeRates;
}
