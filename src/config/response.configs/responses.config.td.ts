export interface IResponse<T> {
  message: string;
  status: string,
  data:T
}


export interface IRequestsData {
  name: string;
  github: string;
  email:string;
  mobile:string;
  twitter?: string;
}

// validator response type

export interface IValidateRule{
  message?:string;
  isValid:boolean
}
