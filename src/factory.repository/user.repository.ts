import { IRequestsData } from '../config/response.configs/responses.config.td';
import { condition } from '../payload.types/rules.td';
import { formatResponseTypeForSuccessAndFail } from '../services/validator';
export class UserFactory {

  static getDeveloperInfo = (
    message = null,
    status = null,
    data = null,
    rule = null
  ) => {
    let respons = {
      message,
      status,
      data
    }


    if (data != null && message.includes("failed")) {
      
      respons = {
        message,
        status,
        data: {
          validation: {
            error: false,
            field: rule.field,
            field_value: formatResponseTypeForSuccessAndFail(rule,data),
            condition: rule.condition,
            condition_value: rule.condition_value
          }
        }
      }

      return respons;
    }
    if (data != null && message.includes("successfully")) {
      let nestedCheck = rule.field.split('.');
      respons = {
        message,
        status,
        data: {
          validation: {
            error: false,
            field: rule.field,
            field_value: nestedCheck.length === 2  ? data[nestedCheck[0]][nestedCheck[1]]: data[nestedCheck[0]] ,
            condition: rule.condition,
            condition_value: rule.condition_value
          }
        }
      }
      return respons;
    }
  
      return respons;
  }

}