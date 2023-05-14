import { Component, ChangeDetectorRef,OnChanges,SimpleChanges } from '@angular/core';
import { VoiceRecognitionService } from './service/voice-recognition.service';
import { WebsocketService } from './websocket.service';
import {webSocket} from 'rxjs/webSocket';
import { FormControl, FormGroup } from '@angular/forms';
import { interval, Subscription  } from 'rxjs';


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
  propertyToSend: any;
  subscription !: Subscription;

  
  constructor( public service : VoiceRecognitionService , public websocket : WebsocketService, private cdr : ChangeDetectorRef){
    this.service.init();  
    this.websocket.connect();
}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
   }

  ngOnInit(): void {

  this.startTimer();
  this.websocket.realTime.subscribe((data: any) => {
    console.log(data.event);
    if(data.event == 'volumne_up'){
      //@ts-ignore
    document.getElementById("myaudio").volume = 1;
    }
    else {
      //@ts-ignore
    document.getElementById("myaudio").volume = 0;
    }
  });


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
    setTimeout(() => {
     //@ts-ignore
    document.getElementById("myaudio").volume = 0;
    }, 100)
    
    this.service.start();
    // this.setHalfVolume();
  }

  stopService(){
    console.log(this.websocket.receivedData);
    this.voiceRecognition = false;
    this.service.stop();
  }

  onVideoEnded(){
    alert('Video is ended')
    this.videoEnd = true;
    console.log(this.websocket.receivedData)
  }

  // Controlling Volumes
  setHalfVolume() { 

    //@ts-ignore
    document.getElementById("newVideo").volume = 0.2;
   
  }


  reduceAudio(){
    //@ts-ignore
    document.getElementById("myaudio").volume = 0;
  }


startTimer(): void {
    this.subscription = interval(1000).subscribe(() => {
    if(this.voiceRecognition == true){
      //@ts-ignore
      let curTime = document.getElementById('newVideo').currentTime;
      this.propertyToSend = curTime;
      this.service.processProperty(this.propertyToSend);
      console.log(this.propertyToSend);;
    }
      
    });
  }

  stopTimer(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.websocket.close();
    this.stopTimer();
  }

}
