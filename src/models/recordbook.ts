export class RecordbookModel {
  id: number;
  results: { level: number; problemId: number }[];
  constructor(id: number, results: { level: number; problemId: number }[]) {
    this.id = id;
    this.results = results;
  }
}
