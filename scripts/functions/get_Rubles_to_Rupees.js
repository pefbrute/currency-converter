function get_Rubles_to_Rupees(amountRubles, exchangeRatesStr) {
  parsedAmount = parseAndValidateAmount(amountRubles);

  if (!parsedAmount.valid) return "Invalid input";

  const exchangeRates = parseExchangeRates(exchangeRatesStr);

  const { rate, equivalentValue: rupees } = calculateRateAndEquivalentValue(
    amountRubles,
    exchangeRates
  );

  const low = 5000 * Math.floor(rupees / 5000);
  const high = 5000 * Math.ceil(rupees / 5000);

  const { rate: lowRate, equivalentValue: lowRubles } =
    calculateRateAndEquivalentValue(low, exchangeRates, true);
  const { rate: highRate, equivalentValue: highRubles } =
    calculateRateAndEquivalentValue(high, exchangeRates, true);

  const {
    deliveryTimeCheckBox,
    onlineExchangeCheckBox,
    atmCheckBox,
    secondPartnerCheckBox,
  } = getCheckboxInfo();

  return `Стоимость: ${formatNumber(
    amountRubles
  )} рублей\nКурс обмена: 1 рубль = ${rate} рупий\nПолучите: ${formatNumber(
    rupees
  )} рупий${deliveryTimeCheckBox}\n\nМы принимаем оплату через банковский перевод на Тинькофф и СБЕР\n\n- - - -\nОбратите внимание, что курс обмена может измениться в любое время из-за экономических и политических факторов|${formatNumber(
    amountRubles
  )} / ${rate} / ${formatNumber(
    rupees
  )} ${onlineExchangeCheckBox} ${atmCheckBox} ${secondPartnerCheckBox}#${formatNumber(
    lowRubles
  )} / ${lowRate} / ${formatNumber(
    low
  )} ${onlineExchangeCheckBox} ${atmCheckBox} ${secondPartnerCheckBox}_${formatNumber(
    highRubles
  )} / ${highRate} / ${formatNumber(
    high
  )} ${onlineExchangeCheckBox} ${atmCheckBox} ${secondPartnerCheckBox}`;
}


