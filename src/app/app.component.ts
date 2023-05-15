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
  results: any;
  
  constructor( public service : VoiceRecognitionService , public websocket : WebsocketService, private cdr : ChangeDetectorRef ){
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
    if(data.event == 'volume_up'){
      //@ts-ignore
    document.getElementById("myaudio").volume = 1;
    }
    else if (data.event == 'result'){
      alert('Good Job !');
      this.results = data.totalScore * 1000;
      alert(this.results + '%');
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
    //@ts-ignore
    document.getElementById("newVideo").pause();
    //@ts-ignore
    document.getElementById("myaudio").pause();
  }

  onVideoEnded(){
    alert('Video ends,lets sing')
    this.videoEnd = true;
    console.log(this.websocket.receivedData);
    
  }

  newVideoEnded(){
    let endData = {
      "text": "undefined twinkle twinkle little star how I wonder what you are. Twinkle Twinkle Twinkle Twinkle. . Twinkle Twinkle. Twinkle Twinkle",
      "delta_text": "the little",
      "time": 55.965205,
      "clock_time": "2023-05-14 20:36:03",
      "videoEnded": true
      }
    this.websocket.sendMessage(endData);
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
    this.subscription = interval(500).subscribe(() => {
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
