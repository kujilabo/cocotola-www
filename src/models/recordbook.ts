export class RecordModel {
  problemId: number;
  level: number;
  memorized: boolean;
  isReview: boolean;
  reviewLevel: number;
  constructor(problemId: number, level: number, memorized: boolean) {
    this.problemId = problemId;
    this.level = level;
    this.memorized = memorized;
    this.isReview = false;
    this.reviewLevel = 0;
  }
}

export class RecordbookModel {
  id: number;
  records: RecordModel[];
  constructor(id: number, records: RecordModel[]) {
    this.id = id;
    this.records = records;
  }
}
