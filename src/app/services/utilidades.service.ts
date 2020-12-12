import { Injectable } from '@angular/core';
import { Vibration } from '@ionic-native/vibration/ngx';


@Injectable({
  providedIn: 'root'
})
export class UtilidadesService {

  constructor(private vibration: Vibration) { }

  public Vibrar(){
    this.vibration.vibrate(1000);
  }
  
  
}
