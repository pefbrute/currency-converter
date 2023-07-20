function getInputs() {
  const amount = parseInt(getInputValueById("amount"));
  const exchangeRates = getInputValueById("exchange-rates").trim();
  const currency = getInputValueById("currency");

  return { amount, exchangeRates, currency };
}
