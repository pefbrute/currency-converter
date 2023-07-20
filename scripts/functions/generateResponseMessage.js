// Function to generate the response message
function generateResponseMessage(amountUSDT, rate, rupees, limits, checkBoxes) {
  const formattedUSDT = formatNumber(amountUSDT);
  const formattedRupees = formatNumber(rupees);

  const formattedLowUSDT = formatNumber(limits.low.currencyAmount);
  const formattedLowRupees = formatNumber(limits.low.rupees);

  const formattedHighUSDT = formatNumber(limits.high.currencyAmount);
  const formattedHighRupees = formatNumber(limits.high.rupees);

  return `Стоимость: ${formattedUSDT} USDT\nКурс обмена: 1 USDT = ${rate} рупий\nПолучите: ${formattedRupees} рупий${checkBoxes.deliveryTimeCheckBox}\n\nМы принимаем оплату через Binance\n\n- - - -\nОбратите внимание, что курс обмена может измениться в любое время из-за экономических и политических факторов|${formattedUSDT} / ${rate} / ${formattedRupees} ${checkBoxes.onlineExchangeCheckBox} ${checkBoxes.atmCheckBox} ${checkBoxes.secondPartnerCheckBox}#${formattedLowUSDT} / ${limits.low.rate} / ${formattedLowRupees} ${checkBoxes.onlineExchangeCheckBox} ${checkBoxes.atmCheckBox} ${checkBoxes.secondPartnerCheckBox}_${formattedHighUSDT} / ${limits.high.rate} / ${formattedHighRupees} ${checkBoxes.onlineExchangeCheckBox} ${checkBoxes.atmCheckBox} ${checkBoxes.secondPartnerCheckBox}`;
}