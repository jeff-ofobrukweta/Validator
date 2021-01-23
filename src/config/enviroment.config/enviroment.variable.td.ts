export interface Environment {
  server:{
      port:number;
  },
  throttling:{
    windowMs: number, // 24 hrs in milliseconds
    max: number,
    message: string, 
    headers: boolean,
  }
}