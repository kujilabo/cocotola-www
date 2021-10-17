export class ProblemModel {
  id: number;
  version: number;
  updatedAt: string;
  number: number;
  problemType: string;
  properties: { [key: string]: any };
  constructor(
    id: number,
    version: number,
    updatedAt: string,
    number: number,
    problemType: string,
    properties: { [key: string]: any }
  ) {
    this.id = id;
    this.version = version;
    this.updatedAt = updatedAt;
    this.number = number;
    this.problemType = problemType;
    this.properties = properties;
  }
}
