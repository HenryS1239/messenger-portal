export const PATTERNS = {
  EMAIL:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};

export const EmailValidator: any = async (rule: any, value: any) => {
  const { message, field } = rule;
  if (rule?.required && `${value}`.trim().length === 0) {
    throw new Error(message ?? `'${field}' is require`);
  }

  if (!PATTERNS.EMAIL.test(String(value).toLowerCase())) {
    throw new Error(message ?? `'${field}' invalid email format`);
  }
};

export const VALIDATE_MESSAGES = {
  required: "${label} is required!",

  types: {
    email: "${label} is not a valid email!",
  },
};

export const QueryFilter = (value: any) => {
  let finalQuery = {};
  for (const key in value) {
    if (value[key] !== "" && value[key] !== null && value[key] !== undefined) {
      finalQuery = { ...finalQuery, [key]: value[key] };
    }
  }
  return finalQuery;
};

type AddressProps = {
  address1: string;
  address2: string;
  address3: string;
  postcode: string;
  city: string;
  state: string;
  country: string;
};

export const formatFullAddress = (address: AddressProps) => {
  const { address1, address2, address3, postcode, city, state, country } =
    address;
  return `${address1 ? address1.trim() : ""}${
    address2 ? `, ${address2.trim()}` : ""
  }${address3 ? `, ${address3.trim()}` : ""}${
    postcode ? `, ${postcode.trim()}` : ""
  }${city ? ` ${city.trim()}` : ""}${state ? `, ${state.trim()}` : ""}${
    country ? `, ${country.trim()}` : ""
  }`;
};
