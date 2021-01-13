import { Injectable } from '@angular/core';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { TranslateService } from '@ngx-translate/core';




@Injectable({
  providedIn: 'root'
})
export class UtilidadesService {

  isLoading = true;
  constructor(private vibration: Vibration, private geolocation: Geolocation, public toastController: ToastController,
    public navCtrl: NavController, private launchNavigator: LaunchNavigator, public loadingController: LoadingController, private diagnostic: Diagnostic,
    private translateService: TranslateService) { }

  public Vibrar() {
    this.vibration.vibrate(1000);
  }

  getGeolocation(): Promise<Geoposition> {
    return this.geolocation.getCurrentPosition();
  }

  gotoMaps(latitude: number, longitude: number): Promise<any> {

    let options: LaunchNavigatorOptions = {
      app: this.launchNavigator.APP.GOOGLE_MAPS,
      start: [latitude, longitude],

    };
    return this.launchNavigator.navigate('London', options);

  }

  async present() {
    this.isLoading = true;
    return await this.loadingController.create().then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss();
        }
      });
    });
  }

  async dismiss() {
    if (this.isLoading) {
      this.isLoading = false;
      return await this.loadingController.dismiss();
    }
    return null;
  }

  async presentToast(msg: string, col: string) {
    const toast = await this.toastController.create({
      message: msg,
      color: col,
      duration: 2000,
      position: "top",
    });
    toast.present();
  }

  verLocalizaAvaliable():Promise<any>{
    
    return this.diagnostic.isGpsLocationEnabled();
      
  }
 async verLocalizaAvaliable2(){
  await this.diagnostic.isLocationAvailable().then((available)=>{
    alert("Location is " + (available ? "available" : "not available"));
    return available;
  }).catch((error)=>{
    return false;
  });
}

iniciarLenguaje(){
  this.translateService.setDefaultLang('es');
  this.translateService.use('es');
  try {
    this.translateService.use(this.translateService.getBrowserLang());
  } catch (error) {
    
  }
}

changeLeguaje(l:string){
  console.log("Esta el "+l)
  if(l!=null){
    this.translateService.use(l);
  }
}
}
