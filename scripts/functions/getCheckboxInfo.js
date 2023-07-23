function getCheckboxInfo() {
  return {
    deliveryTimeCheckBox: getCheckboxState(
      "delivery-time-checkbox",
      "\n\nМы доставим рупии в течении 1-2 часов"
    ),
    onlineExchangeCheckBox: getCheckboxState(
      "online-exchange-checkbox",
      "онлайн обмен через оператора"
    ),
    atmCheckBox: getCheckboxState("atm-checkbox", "АТМ"),
    secondPartnerCheckBox: getCheckboxState(
      "second-partner-checkbox",
      "партнёр 2"
    ),
  };
}


