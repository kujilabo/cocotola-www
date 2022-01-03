export class RecordModel {
  problemId: number;
  level: number;
  isReview: boolean;
  reviewLevel: number;
  constructor(problemId: number, level: number) {
    this.problemId = problemId;
    this.level = level;
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
