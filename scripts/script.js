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

function parseAmount(amount) {
  const amountParsed = parseInt(amount);
  if (isNaN(amountParsed) || amountParsed <= 0) {
    return { valid: false };
  }
  return { valid: true, amount: amountParsed };
}

function calculateRubles(amount, exchangeRates) {
  let rate = null;
  let rubles = 0;
  let foundRate = false;

  for (const [limit, exchangeRate] of Object.entries(exchangeRates)) {
    if (limit * exchangeRate >= amount) {
      foundRate = true;
      rate = exchangeRate;
      rubles = amount / rate;
      break;
    }
  }

  if (!foundRate) {
    const limits = Object.keys(exchangeRates);
    const maxLimit = Math.max(...limits);
    const maxRate = exchangeRates[maxLimit];
    rubles = amount / maxRate;
    rate = maxRate;
  }

  return { rubles, rate };
}

function calculateLowAndHighLimits(amount, exchangeRates) {
  const low = 5000 * Math.floor(amount / 5000);
  const high = 5000 * Math.ceil(amount / 5000);
  const lowCalculation = calculateRubles(low, exchangeRates);
  const highCalculation = calculateRubles(high, exchangeRates);

  return {
    low: {
      rubles: Math.round(lowCalculation.rubles),
      rate: lowCalculation.rate,
      amount: low,
    },
    high: {
      rubles: Math.round(highCalculation.rubles),
      rate: highCalculation.rate,
      amount: high,
    },
  };
}

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

function formatNumber(number) {
  return number.toLocaleString("ru-RU");
}

function validateInput(amount) {
  amount = parseInt(amount);
  if (isNaN(amount) || amount <= 0) {
    throw new Error("Invalid input");
  }
  return amount;
}

function getRateAndRupees(amount, exchangeRates) {
  let rate = null;
  let rupees = 0;
  let foundRate = false;

  for (const [limit, exchangeRate] of Object.entries(exchangeRates)) {
    if (limit >= amount) {
      foundRate = true;
      rate = exchangeRate;
      rupees = Math.round(amount * exchangeRate);
      break;
    }
  }

  if (!foundRate) {
    const maxLimit = getMaxLimit(exchangeRates);
    const maxRate = exchangeRates[maxLimit];
    rupees = amount * maxRate;
    rate = maxRate;
  }

  return { rate, rupees };
}

function getMaxLimit(exchangeRates) {
  const limits = Object.keys(exchangeRates);
  return Math.max(...limits);
}

function getLimitRate(amount, exchangeRates) {
  let rubles = 0;
  let rate = 0;
  let foundRate = false;

  for (const [limit, exchangeRate] of Object.entries(exchangeRates)) {
    if (limit * exchangeRate >= amount) {
      foundRate = true;
      rubles = amount / exchangeRate;
      rate = exchangeRate;
      break;
    }
  }

  if (!foundRate) {
    const maxLimit = getMaxLimit(exchangeRates);
    const maxRate = exchangeRates[maxLimit];
    rubles = amount / maxRate;
    rate = maxRate;
  }

  rubles = Math.round(rubles);
  return { rubles, rate };
}

// Calculate the rate and rupees for the given amount and rate limits
function calculateRateAndRupees(amount, rateLimits) {
  let rate = null;
  let rupees = 0;
  let foundRate = false;

  for (const [limit, exchangeRate] of Object.entries(rateLimits)) {
    if (limit >= amount) {
      foundRate = true;
      rate = exchangeRate;
      rupees = Math.round(amount * exchangeRate);
      break;
    }
  }

  if (!foundRate) {
    const maxLimit = Math.max(...Object.keys(rateLimits));
    const maxRate = rateLimits[maxLimit];

    rupees = amount * maxRate;
    rate = maxRate;
  }

  return { rate, rupees };
}

// Function to calculate the limit values
function calculateLimitValues(rupees, rateLimits) {
  const low = 5000 * Math.floor(rupees / 5000);
  const high = 5000 * Math.ceil(rupees / 5000);

  const lowResult = calculateLimitForGivenRupees(low, rateLimits);
  const highResult = calculateLimitForGivenRupees(high, rateLimits);

  return {
    low: { amount: low, USDT: lowResult.amount, rate: lowResult.rate },
    high: { amount: high, USDT: highResult.amount, rate: highResult.rate },
  };
}

// Helper function to calculate the limit for a given amount of rupees
function calculateLimitForGivenRupees(rupees, rateLimits) {
  let amount = 0;
  let rate = 0;
  let foundRate = false;

  for (const [limit, exchangeRate] of Object.entries(rateLimits)) {
    if (limit * exchangeRate >= rupees) {
      foundRate = true;
      amount = rupees / exchangeRate;
      rate = exchangeRate;
      break;
    }
  }

  if (!foundRate) {
    const maxLimit = Math.max(...Object.keys(rateLimits));
    const maxRate = rateLimits[maxLimit];

    amount = rupees / maxRate;
    rate = maxRate;
  }

  amount = Math.round(amount);

  return { amount, rate };
}

// Function to generate the response message
function generateResponseMessage(amountUSDT, rate, rupees, limits, checkBoxes) {
  const formattedUSDT = formatNumber(amountUSDT);
  const formattedRupees = formatNumber(rupees);

  const formattedLowUSDT = formatNumber(limits.low.USDT);
  const formattedLowRupees = formatNumber(limits.low.amount);

  const formattedHighUSDT = formatNumber(limits.high.USDT);
  const formattedHighRupees = formatNumber(limits.high.amount);

  return `Стоимость: ${formattedUSDT} USDT\nКурс обмена: 1 USDT = ${rate} рупий\nПолучите: ${formattedRupees} рупий${checkBoxes.deliveryTimeCheckBox}\n\nМы принимаем оплату через Binance\n\n- - - -\nОбратите внимание, что курс обмена может измениться в любое время из-за экономических и политических факторов|${formattedUSDT} / ${rate} / ${formattedRupees} ${checkBoxes.onlineExchangeCheckBox} ${checkBoxes.atmCheckBox} ${checkBoxes.secondPartnerCheckBox}#${formattedLowUSDT} / ${limits.low.rate} / ${formattedLowRupees} ${checkBoxes.onlineExchangeCheckBox} ${checkBoxes.atmCheckBox} ${checkBoxes.secondPartnerCheckBox}_${formattedHighUSDT} / ${limits.high.rate} / ${formattedHighRupees} ${checkBoxes.onlineExchangeCheckBox} ${checkBoxes.atmCheckBox} ${checkBoxes.secondPartnerCheckBox}`;
}

function calculateRateAndUSDT(amountRupee, exchangeRates) {
  let rate = null;
  let foundRate = false;
  let USDT = 0;

  for (const [limit, exchangeRate] of Object.entries(exchangeRates)) {
    if (limit * exchangeRate >= amountRupee) {
      foundRate = true;
      rate = exchangeRate;
      USDT = amountRupee / rate;
      break;
    }
  }

  if (!foundRate) {
    const maxLimit = Math.max(...Object.keys(exchangeRates));
    const maxRate = exchangeRates[maxLimit];

    USDT = amountRupee / maxRate;
    rate = maxRate;
  }

  return { rate, USDT };
}

function calculateLimitValues(amountRupee, exchangeRates) {
  const low = 5000 * Math.floor(amountRupee / 5000);
  const high = 5000 * Math.ceil(amountRupee / 5000);

  const lowResult = calculateRateAndUSDT(low, exchangeRates);
  const highResult = calculateRateAndUSDT(high, exchangeRates);

  return {
    low: { USDT: lowResult.USDT, rate: lowResult.rate, rupees: low },
    high: { USDT: highResult.USDT, rate: highResult.rate, rupees: high },
  };
}

function generateResponseMessage(USDT, rate, amountRupee, limits, checkBoxes) {
  const formattedUSDT = formatNumber(USDT);
  const formattedRupees = formatNumber(amountRupee);

  const formattedLowUSDT = formatNumber(limits.low.USDT);
  const formattedLowRupees = formatNumber(limits.low.rupees);

  const formattedHighUSDT = formatNumber(limits.high.USDT);
  const formattedHighRupees = formatNumber(limits.high.rupees);

  return `Стоимость: ${formattedUSDT} USDT\nКурс обмена: 1 USDT = ${rate} рупий\nПолучите: ${formattedRupees} рупий ${checkBoxes.deliveryTimeCheckBox}\n\nМы принимаем оплату через Binance\n\n- - - -\nОбратите внимание, что курс обмена может измениться в любое время из-за экономических и политических факторов|${formattedUSDT} / ${rate} / ${formattedRupees} ${checkBoxes.onlineExchangeCheckBox} ${checkBoxes.atmCheckBox} ${checkBoxes.secondPartnerCheckBox}#${formattedLowUSDT} / ${limits.low.rate} / ${formattedLowRupees} ${checkBoxes.onlineExchangeCheckBox} ${checkBoxes.atmCheckBox} ${checkBoxes.secondPartnerCheckBox}_${formattedHighUSDT} / ${limits.high.rate} / ${formattedHighRupees} ${checkBoxes.onlineExchangeCheckBox} ${checkBoxes.atmCheckBox} ${checkBoxes.secondPartnerCheckBox}`;
}

function get_rate_and_rubles(amountRupee, exchangeRatesStr) {
  // Проверка на невалидный ввод
  const parsedAmount = parseAmount(amountRupee);
  if (!parsedAmount.valid) return "Invalid input";

  // Парсинг строки с курсами обмена
  const exchangeRates = parseExchangeRates(exchangeRatesStr);

  // Calculate rubles and rate
  const calculation = calculateRubles(parsedAmount.amount, exchangeRates);

  // Calculate for low and high limits
  const limits = calculateLowAndHighLimits(parsedAmount.amount, exchangeRates);

  // Get information from checkboxes
  const checkBoxesInfo = getCheckboxInfo();

  // Форматирование чисел с помощью метода toLocaleString
  const formattedLowRubles = formatNumber(limits.low.rubles);
  const formattedLowRupees = formatNumber(limits.low.amount);
  const formattedRubles = formatNumber(calculation.rubles);
  const formattedRupees = formatNumber(parsedAmount.amount);
  const formattedHighRubles = formatNumber(limits.high.rubles);
  const formattedHighRupees = formatNumber(limits.high.amount);

  // Возвращение строки с результатами
  return `Стоимость: ${formattedRubles} рублей\nКурс обмена: 1 рубль = ${calculation.rate} рупий\nПолучите: ${formattedRupees} рупий${checkBoxesInfo.deliveryTimeCheckBox}\n\nМы принимаем оплату через банковский перевод на Тинькофф и СБЕР\n\n- - - -\nОбратите внимание, что курс обмена может измениться в любое время из-за экономических и политических факторов|${formattedRubles} / ${calculation.rate} / ${formattedRupees} ${checkBoxesInfo.onlineExchangeCheckBox} ${checkBoxesInfo.atmCheckBox} ${checkBoxesInfo.secondPartnerCheckBox}#${formattedLowRubles} / ${limits.low.rate} / ${formattedLowRupees} ${checkBoxesInfo.onlineExchangeCheckBox} ${checkBoxesInfo.atmCheckBox} ${checkBoxesInfo.secondPartnerCheckBox}_${formattedHighRubles} / ${limits.high.rate} / ${formattedHighRupees} ${checkBoxesInfo.onlineExchangeCheckBox} ${checkBoxesInfo.atmCheckBox} ${checkBoxesInfo.secondPartnerCheckBox}`;
}

function get_rate_and_rupees(amountRubles, exchangeRatesStr) {
  amountRubles = validateInput(amountRubles);

  const exchangeRates = parseExchangeRates(exchangeRatesStr);

  const { rate, rupees } = getRateAndRupees(amountRubles, exchangeRates);

  const low = 5000 * Math.floor(rupees / 5000);
  const high = 5000 * Math.ceil(rupees / 5000);

  const { rubles: lowRubles, rate: lowRate } = getLimitRate(low, exchangeRates);
  const { rubles: highRubles, rate: highRate } = getLimitRate(
    high,
    exchangeRates
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

function get_rate_and_USDT(amountUSDT, exchangeRatesStr) {
  amountUSDT = parseInt(amountUSDT);

  if (amountUSDT <= 0) {
    return "Invalid input";
  }

  const exchangeRates = parseExchangeRates(exchangeRatesStr, true);

  const { rate, rupees } = calculateRateAndRupees(amountUSDT, exchangeRates);
  const limits = calculateLimitValues(rupees, exchangeRates);

  const checkBoxes = getCheckboxInfo();

  return generateResponseMessage(amountUSDT, rate, rupees, limits, checkBoxes);
}

function get_USDT_to_Rupees(amountRupee, exchangeRatesStr) {
  amountRupee = parseInt(amountRupee);

  if (isNaN(amountRupee) || amountRupee <= 0) {
    return "Invalid input";
  }

  const exchangeRates = parseExchangeRates(exchangeRatesStr, true);
  const { rate, USDT } = calculateRateAndUSDT(amountRupee, exchangeRates);
  const limits = calculateLimitValues(amountRupee, exchangeRates);
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
    case "rubles":
      result = get_rate_and_rubles(amount, exchangeRates);
      break;
    case "rupees":
      result = get_rate_and_rupees(amount, exchangeRates);
      break;
    case "USDT":
      result = get_rate_and_USDT(amount, exchangeRates);
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