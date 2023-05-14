import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import {environment } from '../environments/environment';

import {Observable, Subject} from 'rxjs';

interface MessageData {
  message: any;
  time?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket$!: WebSocketSubject<any>;
  public receivedData: MessageData[] = [];
  realTime = new Subject();

  constructor() {
    
  }

  public connect(): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket(environment.webSocketUrl);

      this.socket$.subscribe((data: MessageData) => {
        console.log(data);
        this.receivedData.push(data);
        this.realTime.next(data);
      });
    }
  }

  sendMessage(message: any) {
    console.log(message);
    this.socket$.next({ message });
  }

  close() {
    this.socket$.complete();
  }

}
