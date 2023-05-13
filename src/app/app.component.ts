import { Component } from '@angular/core';
import { VoiceRecognitionService } from './service/voice-recognition.service';
import { WebsocketService } from './websocket.service';
import {webSocket} from 'rxjs/webSocket';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Teaching-Karaoke';
  text: string = '';
  voiceRecognition: boolean = false;
  videoEnd : boolean = false;
  message = '';
  sample = "twinkle twinkle little star"
  subject = webSocket("wss://automation-api.devinfinitylearn.in/weight");


  constructor( public service : VoiceRecognitionService , public websocket : WebsocketService){
    this.service.init();
    this.websocket.connect();
  }


  ngOnInit(): void {
  }

  sendToServer (event:any){
    this.subject.subscribe();
    this.subject.next(this.message);
    this.subject.complete();
  }

  sendMessage(message: string) {
    this.websocket.sendMessage(message);
  }

  startService(){
    this.voiceRecognition = true;
    this.service.start()
  }

  stopService(){
    this.voiceRecognition = false;
    this.service.stop()
  }

  onVideoEnded(){
    alert('Video is ended')
    this.videoEnd = true;
  }

  ngOnDestroy() {
    this.websocket.close();
  }

}
