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
