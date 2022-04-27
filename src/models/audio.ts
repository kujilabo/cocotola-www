export class AudioModel {
  id: number;
  lang2: string;
  text: string;
  audioContent: string;
  constructor(id: number, lang2: string, text: string, audioContent: string) {
    this.id = id;
    this.lang2 = lang2;
    this.text = text;
    this.audioContent = audioContent;
  }
}
