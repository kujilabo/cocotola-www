export class TranslationModel {
  id: number;
  updatedAt: string;
  text: string;
  pos: number;
  translated: string;
  lang: string;
  provider: string;
  constructor(
    id: number,
    updatedAt: string,
    text: string,
    pos: number,
    translated: string,
    lang: string,
    provider: string
  ) {
    this.id = id;
    this.updatedAt = updatedAt;
    this.text = text;
    this.pos = pos;
    this.translated = translated;
    this.lang = lang;
    this.provider = provider;
  }
}
