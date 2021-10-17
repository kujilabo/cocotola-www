import { NumberLocale } from 'yup/lib/locale';

export class ProblemWithLevelModel {
  problemId: number;
  level: number;
  constructor(problemId: number, level: number) {
    this.problemId = problemId;
    this.level = level;
  }
}
