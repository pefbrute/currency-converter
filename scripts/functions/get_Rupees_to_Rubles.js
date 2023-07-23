function get_Rupees_to_Rubles(amountRupee, exchangeRatesStr) {
  // Проверка на невалидный ввод
  const parsedAmount = parseAndValidateAmount(amountRupee);
  if (!parsedAmount.valid) return "Invalid input";

  // Парсинг строки с курсами обмена
  const exchangeRates = parseExchangeRates(exchangeRatesStr);

  // Calculate rubles and rate
  const calculation = calculateRateAndEquivalentValue(
    parsedAmount.amount,
    exchangeRates,
    true
  );

  // Calculate for low and high limits
  const limits = calculateLimitValues(parsedAmount.amount, exchangeRates, true);

  // Get information from checkboxes
  const checkBoxesInfo = getCheckboxInfo();

  // Форматирование чисел с помощью метода toLocaleString
  const formattedLowRubles = formatNumber(limits.low.currencyAmount);
  const formattedLowRupees = formatNumber(limits.low.rupees);
  const formattedRubles = formatNumber(calculation.equivalentValue);
  const formattedRupees = formatNumber(parsedAmount.amount);
  const formattedHighRubles = formatNumber(limits.high.currencyAmount);
  const formattedHighRupees = formatNumber(limits.high.rupees);

  // Возвращение строки с результатами
  return `Стоимость: ${formattedRubles} рублей\nКурс обмена: 1 рубль = ${calculation.rate} рупий\nПолучите: ${formattedRupees} рупий${checkBoxesInfo.deliveryTimeCheckBox}\n\nМы принимаем оплату через банковский перевод на Тинькофф и СБЕР\n\n- - - -\nОбратите внимание, что курс обмена может измениться в любое время из-за экономических и политических факторов|${formattedRubles} / ${calculation.rate} / ${formattedRupees} ${checkBoxesInfo.onlineExchangeCheckBox} ${checkBoxesInfo.atmCheckBox} ${checkBoxesInfo.secondPartnerCheckBox}#${formattedLowRubles} / ${limits.low.rate} / ${formattedLowRupees} ${checkBoxesInfo.onlineExchangeCheckBox} ${checkBoxesInfo.atmCheckBox} ${checkBoxesInfo.secondPartnerCheckBox}_${formattedHighRubles} / ${limits.high.rate} / ${formattedHighRupees} ${checkBoxesInfo.onlineExchangeCheckBox} ${checkBoxesInfo.atmCheckBox} ${checkBoxesInfo.secondPartnerCheckBox}`;
}


