export interface IRule {
	field: string
  condition: condition,
  condition_value: any;
}

export type condition = "eq" | "neq" | "gt" | "gte" | "contains";

export interface IData{
  name:string;
  crew: string;
  age: number;
  position: string;
  missions: number;
}



