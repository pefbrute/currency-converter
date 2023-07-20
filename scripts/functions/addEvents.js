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
