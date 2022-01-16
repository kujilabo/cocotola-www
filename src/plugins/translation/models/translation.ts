export class TranslationModel {
  id: number;
  version: number;
  updatedAt: string;
  text: string;
  pos: number;
  translated: string;
  lang: string;
  constructor(
    id: number,
    version: number,
    updatedAt: string,
    text: string,
    pos: number,
    translated: string,
    lang: string
  ) {
    this.id = id;
    this.version = version;
    this.updatedAt = updatedAt;
    this.text = text;
    this.pos = pos;
    this.translated = translated;
    this.lang = lang;
  }
}
