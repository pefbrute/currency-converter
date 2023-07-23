function copyToClipboard(id) {
  const result = document.getElementById(id).innerText;

  const tempTextArea = document.createElement("textarea");
  tempTextArea.value = result;
  document.body.appendChild(tempTextArea);

  tempTextArea.select();
  document.execCommand("copy");

  document.body.removeChild(tempTextArea);
}


