const form = document.getElementById("converter-form");
const resultDiv = document.getElementById("result");

const clearButton = document.getElementById("clear");
const exchangeRatesTextarea = document.getElementById("exchange-rates");

clearButton.addEventListener("click", () => (exchangeRatesTextarea.value = ""));

const ids = [
  "currency",
  "amount",
  "exchange-rates",
  "delivery-time-checkbox",
  "online-exchange-checkbox",
  "atm-checkbox",
  "second-partner-checkbox",
];

ids.forEach((id) => {
  const element = document.getElementById(id);
  element.addEventListener("input", makeCalculations);
  if (element.type === "checkbox") {
    element.addEventListener("click", makeCalculations);
  }
});

form.addEventListener("submit", makeCalculations);

function getCheckboxInfo() {
  let checkBoxesInfo = {};

  checkBoxesInfo.deliveryTimeCheckBox = document.getElementById(
    "delivery-time-checkbox"
  ).checked
    ? "\n\nМы доставим рупии в течении 1-2 часов"
    : "";

  checkBoxesInfo.onlineExchangeCheckBox = document.getElementById(
    "online-exchange-checkbox"
  ).checked
    ? "онлайн обмен через оператора"
    : "";

  checkBoxesInfo.atmCheckBox = document.getElementById("atm-checkbox").checked
    ? "АТМ"
    : "";

  checkBoxesInfo.secondPartnerCheckBox = document.getElementById(
    "second-partner-checkbox"
  ).checked
    ? "партнёр 2"
    : "";

  return checkBoxesInfo;
}


function calculateLowAndHighLimits(amount, exchangeRates, Rupees_to_Currency = false) {
  const low = 5000 * Math.floor(amount / 5000);
  const high = 5000 * Math.ceil(amount / 5000);
  const lowCalculation = calculateCurrencyAndRate(low, exchangeRates, Rupees_to_Currency);
  const highCalculation = calculateCurrencyAndRate(high, exchangeRates, Rupees_to_Currency);

  return {
    low: {
      rubles: Math.round(lowCalculation.currencyAmount),
      rate: lowCalculation.rate,
      amount: low,
    },
    high: {
      rubles: Math.round(highCalculation.currencyAmount),
      rate: highCalculation.rate,
      amount: high,
    },
  };
}

function calculateLimitValues(rupees, exchangeRates, Rupees_to_Currency = false) {
  const low = 5000 * Math.floor(rupees / 5000);
  const high = 5000 * Math.ceil(rupees / 5000);

  const lowResult = calculateRateAndEquivalentValue(low, exchangeRates, Rupees_to_Currency);
  const highResult = calculateRateAndEquivalentValue(high, exchangeRates, Rupees_to_Currency);

  return {
    low: { rupees: low, currencyAmount: lowResult.equivalentValue, rate: lowResult.rate },
    high: { rupees: high, currencyAmount: highResult.equivalentValue, rate: highResult.rate },
  };
}


function calculateRateAndEquivalentValue(amount, exchangeRates, isRupeesToCurrency=false) {
  let rate = null;
  let equivalentValue = 0;
  let foundRate = false;

  for (const [limit, exchangeRate] of Object.entries(exchangeRates)) {
    if (limit * exchangeRate >= amount) {
      foundRate = true;
      rate = exchangeRate;
      equivalentValue = isRupeesToCurrency ? amount / rate : Math.round(amount * exchangeRate);
      break;
    }
  }

  if (!foundRate) {
    const maxLimit = Math.max(...Object.keys(exchangeRates));
    const maxRate = exchangeRates[maxLimit];
    equivalentValue = isRupeesToCurrency ? amount / maxRate : Math.round(amount * maxRate);
    rate = maxRate;
  }

  return { rate, equivalentValue };
}


function parseAndValidateAmount(amount) {
  const amountParsed = parseInt(amount);
  if (isNaN(amountParsed) || amountParsed <= 0) {
    throw new Error("Invalid input");
  }
  return { valid: true, amount: amountParsed };
}


function formatNumber(number) {
  return number.toLocaleString("ru-RU");
}

function getMaxLimit(exchangeRates) {
  const limits = Object.keys(exchangeRates);
  return Math.max(...limits);
}

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


function get_Rubles_to_Rupees(amountRubles, exchangeRatesStr) {
  parsedAmount = parseAndValidateAmount(amountRubles);
  
  if (!parsedAmount.valid) return "Invalid input";


  const exchangeRates = parseExchangeRates(exchangeRatesStr);

  const { rate, equivalentValue: rupees } = calculateRateAndEquivalentValue(amountRubles, exchangeRates);

  const low = 5000 * Math.floor(rupees / 5000);
  const high = 5000 * Math.ceil(rupees / 5000);

  const { rate: lowRate, equivalentValue: lowRubles } = calculateRateAndEquivalentValue(low, exchangeRates, true);
  const { rate: highRate, equivalentValue: highRubles } = calculateRateAndEquivalentValue(
    high,
    exchangeRates,
    true
  );

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

function get_Rupees_to_Rubles(amountRupee, exchangeRatesStr) {
  // Проверка на невалидный ввод
  const parsedAmount = parseAndValidateAmount(amountRupee);
  if (!parsedAmount.valid) return "Invalid input";

  // Парсинг строки с курсами обмена
  const exchangeRates = parseExchangeRates(exchangeRatesStr);

  // Calculate rubles and rate
  const calculation = calculateRateAndEquivalentValue(parsedAmount.amount, exchangeRates, true);

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


function get_USDT_to_Rupees(amountUSDT, exchangeRatesStr) {
  amountUSDT = parseInt(amountUSDT);

  if (amountUSDT <= 0) {
    return "Invalid input";
  }

  const exchangeRates = parseExchangeRates(exchangeRatesStr, true);

  const { rate: rate, equivalentValue: rupees } = calculateRateAndEquivalentValue(amountUSDT, exchangeRates);
  const limits = calculateLimitValues(rupees, exchangeRates, true);

  const checkBoxes = getCheckboxInfo();

  return generateResponseMessage(amountUSDT, rate, rupees, limits, checkBoxes);
}

function get_Rupees_to_USDT(amountRupee, exchangeRatesStr) {
  amountRupee = parseInt(amountRupee);

  if (isNaN(amountRupee) || amountRupee <= 0) {
    return "Invalid input";
  }

  const exchangeRates = parseExchangeRates(exchangeRatesStr, true);
  const { rate: rate, equivalentValue: USDT } = calculateRateAndEquivalentValue(amountRupee, exchangeRates, true);
  const limits = calculateLimitValues(amountRupee, exchangeRates, true);
  const checkBoxes = getCheckboxInfo();

  return generateResponseMessage(USDT, rate, amountRupee, limits, checkBoxes);
}



function copyToClipboard(id) {
  const result = document.getElementById(id).innerText;

  const tempTextArea = document.createElement("textarea");
  tempTextArea.value = result;
  document.body.appendChild(tempTextArea);

  tempTextArea.select();
  document.execCommand("copy");

  document.body.removeChild(tempTextArea);
}

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

function getInputs() {
  const amountInput = document.getElementById("amount");
  const amount = parseInt(amountInput.value);

  const exchangeRatesInput = document.getElementById("exchange-rates");
  const exchangeRates = exchangeRatesInput.value.trim();

  const currencyInput = document.getElementById("currency");
  const currency = currencyInput.value;

  return { amount, exchangeRates, currency };
}

function calculateCurrency({ amount, exchangeRates, currency }) {
  let result;
  switch (currency) {
    case "Rupees-Rubles":
      result = get_Rupees_to_Rubles(amount, exchangeRates);
      break;
    case "Rubles-Rupees":
      result = get_Rubles_to_Rupees(amount, exchangeRates);
      break;
    case "Rupees-USDT":
      result = get_Rupees_to_USDT(amount, exchangeRates);
      break;
    case "USDT-Rupees":
      result = get_USDT_to_Rupees(amount, exchangeRates);
      break;
    default:
      break;
  }
  return result;
}

function parseResult(result) {
  const lastVrtclLnIndex = result.lastIndexOf("|");
  const lastGateIndex = result.lastIndexOf("#");
  const lastUnderlineIndex = result.lastIndexOf("_");

  const clientsString = result.slice(0, lastVrtclLnIndex);
  const stringCommon = result.slice(lastVrtclLnIndex + 1, lastGateIndex);
  const stringLow = result.slice(lastGateIndex + 1, lastUnderlineIndex);
  const stringHigh = result.slice(lastUnderlineIndex + 1);

  return { clientsString, stringCommon, stringLow, stringHigh };
}

function displayResults({
  clientsString,
  stringCommon,
  stringLow,
  stringHigh,
}) {
  const clientsResultDiv = document.getElementById("result_clients");
  clientsResultDiv.innerText = clientsString;

  const commonResultDiv = document.getElementById("result_common");
  commonResultDiv.innerText = stringCommon;

  const lowResultDiv = document.getElementById("result_low");
  lowResultDiv.innerText = stringLow;

  const highResultDiv = document.getElementById("result_high");
  highResultDiv.innerText = stringHigh;
}

function makeCalculations() {
  const inputs = getInputs();
  const result = calculateCurrency(inputs);
  const parsedResults = parseResult(result);
  displayResults(parsedResults);
}

function formatNumber(num) {
  return num.toLocaleString("ru", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: true,
  });
}