import valid from "card-validator";
import pick from "lodash.pick";
import values from "lodash.values";
import every from "lodash.every";

const MAESTRO_CARD_TYPE = {
  niceType: "Maestro",
  type: "maestro",
  patterns: [
    493698,
    [500000, 506698],
    [506779, 508999],
    [56, 59],
    63,
    67,
    6,
    601782,
    508143,
    501081,
    501080,
    501051,
    501059,
    557909,
    501066,
    588729,
    501075,
    501062,
    501060,
    501057,
    501056,
    501055,
    501053,
    501043,
    501041,
    501038,
    501028,
    501023,
    501021,
    501020,
    501018,
    501016
  ],
  gaps: [4, 8, 12],
  lengths: [12, 13, 14, 15, 16, 17, 18, 19],
  code: {
    name: "CVC",
    size: 3
  }
};

const VISA_CARD_TYPE = {
  niceType: "Visa",
  type: "visa",
  patterns: [4, 4026, 417500, 4405, 4508, 4844, 4913, 4917],
  gaps: [4, 8, 12],
  lengths: [16, 18, 19],
  code: {
    name: "CVV",
    size: 3
  }
};

const HIPER_CARD_TYPE = {
  niceType: "Hipercard",
  type: "hipercard",
  patterns: [606282, 637599, 637609, 637612, 384100, 384140, 384160, 606282, 637095, 637568],
  gaps: [4, 8, 12],
  lengths: [16],
  code: {
    name: "CVC",
    size: 3
  }
};

valid.creditCardType.addCard(MAESTRO_CARD_TYPE);
valid.creditCardType.addCard(VISA_CARD_TYPE);
valid.creditCardType.addCard(HIPER_CARD_TYPE);

const toStatus = validation => {
  return validation.isValid ? "valid" :
         validation.isPotentiallyValid ? "incomplete" :
         "invalid";
};

const FALLBACK_CARD = { gaps: [4, 8, 12], lengths: [16], code: { size: 3 } };
export default class CCFieldValidator {
  constructor(displayedFields, validatePostalCode) {
    this._displayedFields = displayedFields;
    this._validatePostalCode = validatePostalCode;
  }

  validateValues = (formValues) => {
    const numberValidation = valid.number(formValues.number);
    alert(JSON.stringify(valid.number(formValues.number)));
    const expiryValidation = valid.expirationDate(formValues.expiry);
    const maxCVCLength = (numberValidation.card || FALLBACK_CARD).code.size;
    const cvcValidation = valid.cvv(formValues.cvc, maxCVCLength);

    const validationStatuses = pick({
      number: toStatus(numberValidation),
      expiry: toStatus(expiryValidation),
      cvc: toStatus(cvcValidation),
      name: !!formValues.name ? "valid" : "incomplete",
      postalCode: this._validatePostalCode(formValues.postalCode),
    }, this._displayedFields);

    return {
      valid: every(values(validationStatuses), status => status === "valid"),
      status: validationStatuses,
    };
  };
}
