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
  subject = webSocket("wss://automation-api.devinfinitylearn.in/weight/");


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
    console.log(this.service.text)
    this.websocket.sendMessage(message);
  }

  startService(){
    this.voiceRecognition = true;
    this.service.start();
  }

  stopService(){
    console.log(this.service.text);
    this.voiceRecognition = false;
    this.service.stop()
  }

  onVideoEnded(){
    alert('Video is ended')
    this.videoEnd = true;
  }

  // Controlling Volumes
  setHalfVolume() { 
    //@ts-ignore
    document.getElementById("videoId").volume = 0.2;
  } 
    
  // setFullVolume() { 
  //   vid.volume = 1.0;
  // } 

  ngOnDestroy() {
    this.websocket.close();
  }

}
