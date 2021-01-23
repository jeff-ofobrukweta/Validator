import * as express from 'express'
import { validate } from '../../../services/validator';
import { UserFactory } from '../../../factory.repository/user.repository';
import { dummy } from '../../../factory.repository/data.factory';

export class CreateUserController {

  public static getUserDTO = (req: express.Request, res: express.Response): any => {
    try {
      const { data, status, message } = dummy;
      const response = UserFactory.getDeveloperInfo(message, status, data);

      console.log(">><<><><",response)

      res.status(200).json(response);
    } catch (err) {
      res.status(500).send(err);
    }
  }

  public static validateRule = (req: express.Request, res: express.Response): any => {
    try {
      const body = req.body;
      const response = validate(body);
      const userResponse = UserFactory.getDeveloperInfo(response.message, response.status, response.data, body.rule);
      // response to return with data appended to the respose payload

      res.status(200).json(userResponse)
    } catch (err) {
      throw new Error(err)

    }
  }

}