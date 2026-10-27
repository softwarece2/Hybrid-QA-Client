export function inputRestrict(e, removeListRegex) {
  const input = e.target;
  const start = input.selectionStart,
    end = input.selectionEnd;
  const initialLen = input.value.length;
  input.value = input.value.replace(removeListRegex, "");
  const lengthDifference = input.value.length - initialLen;
  if (lengthDifference) {
    const newStart = start + lengthDifference;
    const newEnd = end + lengthDifference;
    input.setSelectionRange(newStart, newEnd);
  }
}

export function inputToUpper(e) {
  const input = e.target,
    start = input.selectionStart,
    end = input.selectionEnd;
  input.value = input.value.toLocaleUpperCase();
  input.value = input.value.endsWith(" ")
    ? input.value.trim() + " "
    : input.value.trim();
  input.setSelectionRange(start, end);
}
export function inputTrim(e) {
  const input = e.target,
    start = input.selectionStart,
    end = input.selectionEnd;
  input.value = input.value.endsWith(" ")
    ? input.value.trim() + " "
    : input.value.trim();
  input.setSelectionRange(start, end);
}

export function inputPhoneNumber(num) {
  const first = num % 10;
  while (num) {
    if (num % 10 !== first) return false;
    num = Math.floor(num / 10);
  }
  return true;
}

export const restrict = {
  email(e) {
    inputRestrict(e, /[^@a-zA-Z-_.\d]/g);
  },
  name(e) {
    inputRestrict(e, /[^a-zA-Z0-9-.,():'& ]/g);
  },
  number(e) {
    inputRestrict(e, /[^0-9. ]/g);
  },
  digit(e) {
    inputRestrict(e, /[^0-9 ]/g);
  },
  alpha(e) {
    inputRestrict(e, /[^a-zA-Z]/g);
  },
  remarks(e) {
    inputRestrict(e, /[^-a-zA-Z(),&."/%@_+=*↑ :\n\d]/g);
  },
  general(e) {
    inputRestrict(e, /[^-a-zA-Z(),&./ \d]/g);
  },
  onlyCharacter(e) {
    inputRestrict(e, /[^a-zA-Z ]/g);
  },
  usernameInput(e) {
    inputRestrict(e, /[^a-zA-Z0-9-_]/g);
  },
  empName(e) {
    inputRestrict(e, /[^a-zA-Z ]/g);
  },
  code(e) {
    inputRestrict(e, /[^a-zA-Z0-9]/g);
  },
  orgnameInput(e) {
    inputRestrict(e, /[^[\]a-zA-Z0-9\s\-_.,()&,]/g);
  },
  dot(e) {
    inputRestrict(e, /[^\w.a-zA-Z\d]/g);
  },
  eventname(e) {
    inputRestrict(e, /[^\w.a-z A-Z\d]/g);
  },
  address(e) {
    inputRestrict(e, /[^-/a-zA-Z.#/,()& \d,]/g);
  },
  indenter(e) {
    inputRestrict(e, /[^-a-zA-Z0-9()/ ,&]/g);
  },
  digits(e) {
    inputRestrict(e, /\D/g);
  },
  dose(e) {
    inputRestrict(e, /[^\d.]/g);
  },
  warrantNo(e) {
    inputRestrict(e, /[^a-zA-Z0-9(),&."/%@_+=*↑ ]/g)
  },
  positiveInteger(e) {
    inputRestrict(e, /[^\d]/g);
  },
  notFirstZero(e) {
    inputRestrict(e, /[^(?!(0))[0-9]]/g);
  },
  restrictedInput(e) {
    inputRestrict(e, /[^-_a-zA-Z0-9 +.@# ]/g);
  },
  ministryName(e) {
    inputRestrict(e, /[^-_a-zA-Z0-9 .,()& ]/g);
  },
  officeName(e) {
    inputRestrict(e, /[^-_a-zA-Z0-9 .,()& ]/g);
  },
  venueName(e) {
    inputRestrict(e, /[^-_a-zA-Z0-9 .,()& ]/g);
  },
  designationName(e) {
    inputRestrict(e, /[^a-zA-Z0-9+-.,/()'&[\] ]/g);
  },
  eventName(e) {
    inputRestrict(e, /[^-a-zA-Z0-9 .,()& ]/g);
  },
  eventDescription(e) {
    inputRestrict(e, /[^-_a-zA-Z0-9 +@#.,:()&' ]/g);
  },
  alphaNumericWithNoSpace(e) {
    inputRestrict(e, /[^a-zA-Z0-9]/g);
  },
  venueRemarks(e) {
    inputRestrict(e, /[^-_a-zA-Z0-9 +@#:,().&' ]/g);
  },
  encRemarks(e) {
    inputRestrict(e, /[^-_a-zA-Z0-9 +@#:,().&' ]/g);
  },
  relationshipName(e) {
    inputRestrict(e, /[^-a-zA-Z ,. ]/g);
  },
  phoneNumber(e) {
    inputRestrict(e, /[^-\d.+]/g);
  },
  faxNumber(e) {
    // inputRestrict(e, /[- +()0-9]+/g);
    inputRestrict(e, /[^-\d.+()]/g);
  },
  numberslash(e) {
    inputRestrict(e, /[^-\d/-]/g);
  },
  ateRemarks(e) {
    inputRestrict(e, /[^0-9a-zA-Z., ]/g);
  },
 
  itemcategory(e) {
    inputRestrict(e, /[^-a-zA-Z 0-9 /-]/g);
  },
    somapping(e) {
    inputRestrict(e, /[^a-zA-Z0-9-]/g);
  },
  epCode(e) {
    inputRestrict(e, /[^a-zA-Z0-9-_() ]/g);
  },
};
