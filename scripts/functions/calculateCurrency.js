function calculateCurrency({ amount, exchangeRates, currency }) {
  const conversionFuncs = {
    "Rupees-Rubles": get_Rupees_to_Rubles,
    "Rubles-Rupees": get_Rubles_to_Rupees,
    "Rupees-USDT": get_Rupees_to_USDT,
    "USDT-Rupees": get_USDT_to_Rupees,
  };

  const conversionFunc = conversionFuncs[currency];
  return conversionFunc ? conversionFunc(amount, exchangeRates) : undefined;
}


