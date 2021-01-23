import { RequestDTO, validate } from "./validator";

test("Correct Validation", () => {
  const correctDTO = {
    rule: {
      field: "missions",
      condition: "gte",
      condition_value: 30,
    },
    data: {
      name: "James Holden",
      crew: "Rocinante",
      age: 34,
      position: "Captain",
      missions: 45,
    },
  };
  const response = validate(correctDTO as RequestDTO);
  const validResponse = {
    message: "field missions successfully validated.",
    status: "success",
    data: {
      validation: {
        error: false,
        field: "missions",
        field_value:45,
        condition:"gte",
        condition_value:30
      }
    }
  };
  expect(response).toEqual(validResponse);
});

describe("Failed Validation", () => {
  test("Check for failed validation check", () => {
    const dto = {
      rule: {
        field: "missions",
        condition: "eq",
        condition_value: 30,
      },
      data: {
        name: "James Holden",
        crew: "Rocinante",
        age: 34,
        position: "Captain",
        missions: 45,
      },
    };
    const response = validate(dto as RequestDTO);
    const validResponse = {
      message: "field missions failed validation.",
      status: "error",
      data: {
          validation: {
              error: false,
              field: "missions",
              field_value: 45,
              condition: "eq",
              condition_value: 30
          }
      }
  }
    expect(response).toEqual(validResponse);
  });

  test("Check field in string data", () => {
    const dto = {
      rule: {
        field: "0",
        condition: "eq",
        condition_value: "a",
      },
      data: "damien-marley",
    };
    const response = validate(dto as RequestDTO);
    const validResponse = {
      message: "field 0 failed validation.",
      status: "error",
      data:{
        validation:{
          condition:"eq",
          condition_value:"a",
          error:false,
          field:"0",
          field_value:"d"
        }
      }
    };
    expect(response).toEqual(validResponse);
  });
});

describe("The rule and data fields are required.", () => {
  test("rule is required.", () => {
    const dto = {
      data: {
        name: "James Holden",
      },
    };

    const response = validate(dto as RequestDTO);
    const validResponse = {
      message: "rule is required.",
      status: "error",
      data:null
    };
    expect(response).toEqual(validResponse);
  });

  test("data is required.", () => {
    const dto = {
      rule: {
        field: "missions",
        condition: "gte",
        condition_value: 30,
      },
    };

    const response = validate(dto as RequestDTO);
    const validResponse = {
      message: "data is required.",
      status: "error",
      data:null
    };
    expect(response).toEqual(validResponse);
  });

  /**
   * e/ If a field is of the wrong type, your endpoint should return with a response (HTTP 400 status code)
   *  that is similar to the below:
    case scenerios to consider
    1. validate type for key field
    2. validate type for key condition
    3. validate type for data if its 
     {object} | array | string
   **/

  // validate type of the rule field

  test("validate the type of the rule field", () => {
    const dto = {
      rule: {
        field: 3,
        condition: "gte",
        condition_value: 30
      },
      data: ["tola", "tolu", "30"]
    };

    const response = validate(dto as any);
    const validResponse = {
      message: `field should be a string.`,
      status: "error",
      data:null
    };
    expect(response).toEqual(validResponse);
  })


   //The rule and data fields are required. line 63
   // nb: no response was explicitly set for this 
  test("The rule and data fields are required.", () => {
    const dto = {};
    const response = validate(dto as any);
    const validResponse = {
      message: "Invalid JSON payload passed.",
      status: "error",
      data:null
    };
    expect(response).toEqual(validResponse);
  })


  // validate type of the data field
  test.skip("validate the type of the data input", () => {
    const dto = {
      rule: {
        field: "3",
        condition: "gte",
        condition_value: 30
      },
      data: 12
    };

    const response = validate(dto as any);
    const validResponse = {
      message: "field data be an array,string,object.",
      status: "error",
      data:null
    };

    expect(response).toEqual(validResponse);
  })


  /*
  f/ If an invalid JSON payload is passed to your API, your endpoint response (HTTP 400 status code) should be:
    {
      "message": "Invalid JSON payload passed."
      "status": "error",
      "data": null
    }
   */

  test.skip("Invalid JSON payload passed", () => {

  })


});

/*
  b/ The rule field should be a valid JSON object and should contain the following required fields: 
  b1/ field: The field in the data passed to validate the rule against. Your implementation for the field should also support nested data objects.
  e.g. if field is passed as "card.first6" it means you need to check to see if the data contains a card field, then check to see if the card field contains a first6 field.
  [PS: The nesting should not be more than two levels]
  b2/ condition: The condition to use for validating the rule. Accepted condition values are:
    i/ eq: Means the field value should be equal to the condition value 
    ii/ neq: Means the field value should not be equal to the condition value 
    iii/ gt: Means the field value should be greater than the condition value 
    iv/ gte: Means the field value should be greater than or equal to the condition value 
    v/ contains: Means the field value should contain the condition value
  b3/ condition_value: The condition value to run the rule against. Your rule evaluation is expected to be like: 
  ["data.field"] ["rule.condition"] ["rule.condition_value"]
*/
describe("rule validation", () => {
 // rule should be an object. message for 
  //if the rule field is passed as a number instead of a valid object, your endpoint response should be:

  test("rule should be a valid JSON object", () => {
    const dto = {
      rule: 12,
      data: "damien-marley"
    };

    const response = validate(dto as any);
    const validResponse = {
      message: "rule should be an object.",
      status: "error",
      data:null
    };
    expect(response).toEqual(validResponse);
  })

  test("field must be in the rule", () => {
    const dto = {
      rule: {
        condition: "gte",
        condition_value: 30,
      },
      data: ["jeff","taiwo","flutter",34],
    };
    const response = validate(dto as RequestDTO);
    const validResponse = {
      message: "field is required.",
      status: "error",
      data: null
    };
    expect(response).toEqual(validResponse);
  });

  test("condition must be in the rule", () => {
    const dto = {
      rule: {
        field: "missions",
        condition_value: 30,
      },
      data: 1,
    };
    const response = validate(dto as RequestDTO);
    const validResponse = {
      message: "condition is required.",
      status: "error",
      data:null
    };
    expect(response).toEqual(validResponse);
  });
  test("condition must be one of eq, neq, gt, gte, contains", () => {
    const dto = {
      rule: {
        field: "missions",
        condition: "lmao",
        condition_value: 30,
      },
      data: 1,
    };

    const response = validate(dto as RequestDTO);
    const validResponse = {
      message: "condition is required.",
      status: "error",
      data:null
    };
    expect(response).toEqual(validResponse);
  });

  test("condition_value must be in the rule", () => {
    const dto = {
      rule: {
        field: "missions",
        condition: "lmao",
      },
      data: 1,
    };
    const response = validate(dto as RequestDTO);
    const validResponse = {
      message: "condition_value is required.",
      status: "error",
      data:null
    };
    expect(response).toEqual(validResponse);
  });
});

/*
  c/ The data field can be any of:
  c1/ A valid JSON object 
  c2/ A valid array
  c3/ A string
*/
describe("data validation", () => {
  test("array index be in the array data i.e validate rule for array data type", () => {
    const dto = {
      rule: {
        field: "5",
        condition: "contains",
        condition_value: "rocinante",
      },
      data: ["The Nauvoo", "The Razorback", "The Roci", "Tycho"],
    };

    const response = validate(dto as RequestDTO);
    const validResponse = {
      message: "field 5 is missing from data.",
      status: "error",
      data:null
    };
    expect(response).toEqual(validResponse);
  });

  test("field must be in the data", () => {
    const dto = {
      rule: {
        field: "missions",
        condition: "gte",
        condition_value: 30,
      },
      data: {
        name: "James Holden",
        crew: "Rocinante",
        age: 34,
        position: "Captain",
      },
    };

    const response = validate(dto as RequestDTO);
    const validResponse = {
      message: "field missions is missing from data.",
      status: "error",
      data:null
    };
    expect(response).toEqual(validResponse);
  });

  test("field nesting must not must be greater than 2 levels", () => {
    const dto = {
      rule: {
        field: "missions.a.b",
        condition: "gte",
        condition_value: 30,
      },
      data: {
        name: "James Holden",
        crew: "Rocinante",
        age: 34,
        position: "Captain",
        missions: {
          a: {
            b: "c",
          },
        },
      },
    };

    const response = validate(dto as RequestDTO);
    const validResponse = {
      message: "field missions.a.b is missing from data.",
      status: "error",
      data:null
    };
    expect(response).toEqual(validResponse);
  });
});
