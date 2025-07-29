export function validate(data, rules) {
  const errors = {};

  for (const field in rules) {
    const value = data[field];
    const fieldRules = rules[field];

    for (const rule of fieldRules) {
      if (rule === "required") {
        if (!value || value.toString().trim() === "") {
          errors[field] = "Ce champ est requis";
          break;
        }
      }

      else if (rule === "number") {
        if (value === "" || isNaN(parseFloat(value))) {
          errors[field] = "Ce champ doit être un nombre";
          break;
        }
      }

      else if (rule === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          errors[field] = "Email invalide";
          break;
        }
      }

      else if (rule.startsWith("min:")) {
        const min = parseInt(rule.split(":")[1]);
        if (value && value.length < min) {
          errors[field] = `Minimum ${min} caractères`;
          break;
        }
      }

      else if (rule === "phone") {
        const phoneRegex = /^\d{6,}$/;
        if (value && !phoneRegex.test(value)) {
          errors[field] = "Numéro invalide (min 6 chiffres)";
          break;
        }
      }
    }
  }

  return errors;
}
