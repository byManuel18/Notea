import { Component, LOCALE_ID } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilidadesService } from './services/utilidades.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authS:AuthService,
    private utilsS:UtilidadesService
  ) {
   
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.utilsS.iniciarLenguaje();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.authS.init();
    });
  }
}
