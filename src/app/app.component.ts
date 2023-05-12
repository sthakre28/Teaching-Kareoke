import { Component } from '@angular/core';
import { VoiceRecognitionService } from './service/voice-recognition.service';

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

  constructor( public service : VoiceRecognitionService){
    this.service.init()
  }

  ngOnInit(): void {
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

}
