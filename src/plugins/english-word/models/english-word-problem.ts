import { ProblemModel } from '../../../models/problem';

export const POS_ADJ = 1; // 形容詞
export const POS_ADV = 2; // 副詞
export const POS_CONJ = 3; // 接続詞
export const POS_DET = 4; // 限定詞
export const POS_MODAL = 5; // 動詞
export const POS_NOUN = 6; // 名詞
export const POS_PREP = 7; // 前置詞
export const POS_PRON = 8; // 代名詞
export const POS_VERB = 9; // 動詞
export const POS_OTHER = 99; // その他

export class EnglishWordProblemModel extends ProblemModel {
  text: string;
  pos: number;
  phonetic: string;
  presentThird: string;
  pastTense: string;
  pastParticiple: string;
  lang: string;
  translated: string;
  phrase: string;
  sentence: string;
  constructor(
    id: number,
    version: number,
    updatedAt: string,
    number: number,
    problemType: string,
    text: string,
    pos: number,
    phonetic: string,
    presentThird: string,
    pastTense: string,
    pastParticiple: string,
    lang: string,
    translated: string,
    phrase: string,
    sentence: string
  ) {
    super(id, version, updatedAt, number, problemType, {});
    this.text = text;
    this.pos = pos;
    this.phonetic = phonetic;
    this.presentThird = presentThird;
    this.pastTense = pastTense;
    this.pastParticiple = pastParticiple;
    this.lang = lang;
    this.translated = translated;
    this.phrase = phrase;
    this.sentence = sentence;
  }
}
