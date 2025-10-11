export const sleep = (ms = 0) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/** Validation */
export const validators = {
  email: (v: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(v) || "Please enter a valid email address";
  },
  required: (v: any) => !!v || "This field is required",
  minValue: (min: number) => (v: number) => {
    return v >= min || `Value must be at least ${min}`;
  },
  maxValue: (max: number) => (v: number) => {
    return v <= max || `Value must be at most ${max}`;
  },
};
