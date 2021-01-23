import { condition } from '../payload.types/rules.td';
import { UserFactory } from '../factory.repository/user.repository';

export type Rule = {
  field: string;
  condition: Condition;
  condition_value: any;
};

export type RequestDTO = { data: any; rule: Rule };

export type ResponseDTO = {
  message: string;
  status: string;
  data?: {
    validation: {
      error: boolean,
      field: string,
      field_value: string,
      condition: string,
      condition_value: string
    }
  }
};


function isObject(o, strict = true) {
  const checkIfArray = Object.prototype.toString.call(o) === "[object Array]";

  if (o === null || o === undefined || !!checkIfArray) {
    return false;
  }

  const instanceOfObject = o instanceof Object;
  const typeOfObject = typeof o === 'object';
  const constructorUndefined = o.constructor === undefined;
  const constructorObject = o.constructor === Object;
  const typeOfConstructorObject = typeof o.constructor === 'function';
  let r;
  if (strict === true) {
    r = (instanceOfObject || typeOfObject) && (constructorUndefined || constructorObject);
  } else {
    r = (constructorUndefined || typeOfConstructorObject);
  }
  return r;
};


function isString(x) {
  return Object.prototype.toString.call(x) === '[object String]';
}


function checkDefineAndTypeString(field, name) {

  if (!isDefined(field)) {
    return { isSuccess: false, errorMessage: `${name} is required.` };
  }
  if (!isString(field)) {
    return { isSuccess: false, errorMessage: `${name} should be a string.` };
  }
  return { isSuccess: true }
}

const POSSIBLE_CONDITIONS: Array<condition> = ["eq", "neq", "gt", "gte", "contains"];

type Condition = typeof POSSIBLE_CONDITIONS[number];

const isDefined = (data) => {
  return data !== null && data !== undefined;
};



// factory to create rule ..
function createRule(
  rawRule: any
): { rule?: Rule; isSuccess: boolean; errorMessage?: string } {
  // rule must be defined

  if (!isDefined(rawRule)) {
    return { isSuccess: false, errorMessage: "rule is required." };
  }

  if (!isObject(rawRule)) {
    return { isSuccess: false, errorMessage: "rule should be an object." };
  }

  const arr = [[rawRule.field, 'field'], [rawRule.condition, 'condition']];

  for (let arg of arr) {
    const isDefinedAndString = checkDefineAndTypeString(arg[0], arg[1]);
    if (!isDefinedAndString.isSuccess) return isDefinedAndString;
  }


  if (!isDefined(rawRule.condition_value)) {
    return { isSuccess: false, errorMessage: "condition_value is required." };
  }

  if (!POSSIBLE_CONDITIONS.includes(rawRule.condition)) {
    return {
      isSuccess: false,
      errorMessage: `condition is required.`,
    };
  }

  return { rule: rawRule as Rule, isSuccess: true };
}


export function validate(InputValue) {
  let { message, status, data } = validateHelper(InputValue);

  const { rule } = InputValue;
  let validateInputValue = {
    message,
    status,
    data
  }

  if (data != null && message.includes("failed")) {
    validateInputValue = {
      message,
      status,
      data: {
        validation: {
          error: false,
          field: rule.field,
          field_value: formatResponseTypeForSuccessAndFail(rule, data),
          condition: rule.condition,
          condition_value: rule.condition_value
        }
      }
    }

    return validateInputValue;
  }
  if (data != null && message.includes("successfully")) {
    validateInputValue = {
      message,
      status,
      data: {
        validation: {
          error: false,
          field: rule.field,
          field_value: formatResponseTypeForSuccessAndFail(rule, data),
          condition: rule.condition,
          condition_value: rule.condition_value
        }
      }
    }
    return validateInputValue;
  }
  return validateInputValue;
}




export function validateHelper(inputValue): ResponseDTO {
  // validate both rule and data field

  if (!inputValue.data && !inputValue.rule) {
    return { message: "Invalid JSON payload passed.", status: "error", data: null };
  }
  const { data, rule }: RequestDTO = inputValue;

  const ruleOrError = createRule(rule);

  if (!ruleOrError.isSuccess) {
    return { message: ruleOrError.errorMessage, status: "error", data: null };
  }

  if (!isDefined(data)) {
    return { message: "data is required.", status: "error", data: null };
  }

  // Check that data is in field
  const { value: fieldValue, isSuccess: lessThan2 } = getNestedData(
    data,
    rule.field
  );

  if (!fieldValue || !lessThan2) {
    return {
      message: `field ${rule.field} is missing from data.`,
      status: "error",
      data: null
    };
  }
  //#endregion

  //#region Main validator
  const isConditionMet = conditionValidator(
    fieldValue,
    rule.condition_value,
    rule.condition
  );
  //#endregion

  if (isConditionMet) {

    return {
      message: `field ${rule.field} successfully validated.`,
      status: "success",
      data: inputValue.data
    };
  } else {
    return {
      message: `field ${rule.field} failed validation.`,
      status: "error",
      data: inputValue.data
    };
  }

}

function getNestedData(
  data: any,
  path: string
): { value?: any; isSuccess: boolean } {
  const keys = path.split("."); // ["f","g"]

  if (keys.length > 2 || !keys[0]) {
    return { isSuccess: false };
  } else if (keys.length === 2) {
    return { value: data[keys[0]][keys[1]], isSuccess: true };
  }

  return { value: data[keys[0]], isSuccess: true }; // data["3"]
}



export function formatResponseTypeForSuccessAndFail(rule, data) {
  let nestedCheck = rule.field.split('.');
  if (nestedCheck.length === 2) {
    return data[nestedCheck[0]][nestedCheck[1]]
  }
  if (nestedCheck.length === 1) {
    return data[nestedCheck[0]]
  }
}



function conditionValidator(
  fieldValue: string,
  condition_value: any,
  condition: Condition
) {
  switch (condition) {
    case "eq":
      return fieldValue === condition_value;
    case "neq":
      return fieldValue !== condition_value;
    case "gt":
      return fieldValue > condition_value;
    case "gte":
      return fieldValue >= condition_value;
    case "contains":
      return fieldValue.includes(condition_value);
    default:
      return false;
  }
}
