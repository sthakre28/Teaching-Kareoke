import { Injectable } from '@angular/core';
import { WebsocketService } from '../websocket.service';

declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class VoiceRecognitionService {

 recognition =  new webkitSpeechRecognition();
  isStoppedSpeechRecog = false;
  public text :any;
  tempWords: any;
  currentDate !: Date;
  currentTime : any;

processProperty(property: any): void {
    // Do something with the property in the service
    // console.log('Received property in service:', property);
    this.currentTime = property;
  }

  constructor(public websocket: WebsocketService) { }

  init() {
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.addEventListener('result', (e:any) => {
        console.log(e);
        const transcript = Array.from(e.results)
        .map((result:any) => result[0])
        .map((result:any) => result.transcript)
        .join('');
      this.tempWords = transcript;
      console.log(this.tempWords)
      console.log(this.text);
      this.currentDate = new Date();
      const year = this.currentDate.getFullYear();
      const month = String(this.currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(this.currentDate.getDate()).padStart(2, '0');
      const hour = String(this.currentDate.getHours()).padStart(2, '0');
      const minute = String(this.currentDate.getMinutes()).padStart(2, '0');
      const second = String(this.currentDate.getSeconds()).padStart(2, '0');
  
      const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

      let newJson = {
        'text': this.text,
        'delta_text': transcript,
        'time': this.currentTime,
        'clock_time': formattedDate,
      }

      this.websocket.sendMessage(newJson);
      console.log(newJson)
    });
  }

  start() {
    this.isStoppedSpeechRecog = false;
    this.recognition.start();
    console.log("Speech recognition started")
    this.recognition.addEventListener('end', (condition:any) => {
        console.log(condition);
      if (this.isStoppedSpeechRecog) {
        this.recognition.stop();
        console.log("End speech recognition")
      } else {
        this.wordConcat()
        this.recognition.start();
      }
    });
  }

  stop() {
    this.isStoppedSpeechRecog = true;
    this.wordConcat()
    this.recognition.stop();
    console.log("End speech recognition")
  }

  wordConcat() {
    this.text = this.text + ' ' + this.tempWords;
    this.tempWords = '';
    // console.log(this.text);
  }
}
