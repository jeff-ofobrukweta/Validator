import Express, { Application } from 'express';
import http from 'http';
import helmet from "helmet";
import cors from 'cors';
import { environment } from './config/enviroment.config/enviroment.variables';
import { CreateUserController } from './controllers/createUser/CreateUserController.ts/user.controller';
import { rateLimiterUsingThirdParty } from './middleware/middleware.throttle';
import { globalErrorHandler } from './middleware/global.error.handler';


class App {
  app: Express.Application
  constructor() {
    this.app = Express();
    this.middleware();
  }

  private middleware = () => {
    this.app.use(helmet());
    this.app.use(Express.json());
    this.app.use(Express.urlencoded({ extended: true }));
    this.app.use(rateLimiterUsingThirdParty)
    this.app.use(cors());
    this.app.use(globalErrorHandler)
    this.router()
  }


  private router() {
    this.app.get('/', CreateUserController.getUserDTO);
    this.app.post('/validate-rule', CreateUserController.validateRule);
    this.app.get('*', CreateUserController.getUserDTO)
      .post('*', CreateUserController.getUserDTO); // out of phase guys
  }



  public start = async (): Promise<void> => {
    http.createServer(this.app).listen(environment.server.port, () => {
      console.log(`Server started, 🚀 listening on port 
      ${environment.server.port} for incoming requests. Auth Service running at 
      http://localhost:${environment.server.port}`);
    });
  }

}



export default new App();