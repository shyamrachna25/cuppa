const VALID_METHODS = ["Pour Over", "French Press", "Espresso", "AeroPress", "Cold Brew", "Other"];

export function validateBrew(data) {
  const errors = [];

  if (!data.beanName || typeof data.beanName !== "string" || !data.beanName.trim()) {
    errors.push("Bean/roaster name is required.");
  }

  if (!data.method || !VALID_METHODS.includes(data.method)) {
    errors.push(`Method must be one of: ${VALID_METHODS.join(", ")}.`);
  }

  if (data.rating === undefined || data.rating < 1 || data.rating > 5) {
    errors.push("Rating must be between 1 and 5.");
  }

  if (!data.date || isNaN(Date.parse(data.date))) {
    errors.push("A valid date is required.");
  }

  // REVIEW: ratio, grindSize, brewTime and waterTemp are never validated, so values like
  // waterTemp 500, ratio "133" or any free text in grindSize are saved. Consider checking
  // waterTemp is a number in a sane range, ratio matches /^\d+(\.\d+)?:\d+(\.\d+)?$/
  // (e.g. 1:16), brewTime matches m:ss, and grindSize is one of a fixed list (the seed
  // script already uses Coarse ... Fine). Rating could also be required to be an integer.
  // The form's "Water temp (°)" label also doesn't say whether it is °F or °C.
  return errors;
}

export { VALID_METHODS };
