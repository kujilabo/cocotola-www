export class AudioModel {
  id: number;
  lang: string;
  text: string;
  audioContent: string;
  constructor(id: number, lang: string, text: string, audioContent: string) {
    this.id = id;
    this.lang = lang;
    this.text = text;
    this.audioContent = audioContent;
  }
}
