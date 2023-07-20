function calculateEquivalentValue(amount, rate, isRupeesToCurrency) {
  return isRupeesToCurrency ? amount / rate : Math.round(amount * rate);
}