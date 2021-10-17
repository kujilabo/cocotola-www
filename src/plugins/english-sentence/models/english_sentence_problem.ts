import { ProblemModel } from '../../../models/problem';

export class EnglishWordProblemModel extends ProblemModel {
  text: string;
  lang: string;
  translated: string;
  constructor(
    id: number,
    version: number,
    updatedAt: string,
    number: number,
    problemType: string,
    text: string,
    lang: string,
    translated: string
  ) {
    super(id, version, updatedAt, number, problemType, {});
    this.text = text;
    this.lang = lang;
    this.translated = translated;
  }
}

export const EnglishSentenceProblemTypeId = 'english_sentence';
