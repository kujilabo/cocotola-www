export class RecordbookModel {
  id: number;
  results: { [key: number]: number };
  constructor(id: number, results: { [key: number]: number }) {
    this.id = id;
    this.results = results;
  }
}
