const VALID_METHODS = [
  "Pour Over",
  "French Press",
  "Espresso",
  "AeroPress",
  "Cold Brew",
  "Other",
];

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

  return errors;
}

export { VALID_METHODS };
