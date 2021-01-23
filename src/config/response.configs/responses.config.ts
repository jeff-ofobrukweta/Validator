import { IResponse, IRequestsData } from './responses.config.td';

export const Response: IResponse<
  IRequestsData
> = {
  message: null,
  status: null,
  data: {
    name: null,
    github: null,
    email: null,
    mobile: null
  }
}
