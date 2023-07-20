function parseAndValidateAmount(amount) {
  const amountParsed = parseInt(amount);
  if (isNaN(amountParsed) || amountParsed <= 0) {
    throw new Error("Invalid input");
  }
  return { valid: true, amount: amountParsed };
}