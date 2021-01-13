import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { UtilidadesService } from '../services/utilidades.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  public User:any=null;

  constructor( private authS:AuthService,private router:Router,public alertController: AlertController,private theme:ThemeService,public util:UtilidadesService
    ,private translateService: TranslateService) {}
  
  
  ngOnInit(): void {
    this.User={
      token:this.authS.user.token,
      name:this.authS.user.name,
      avatar:this.authS.user.avatar

    }
  }
  ionViewDidEnter(){
    this.ngOnInit();
  }

  async presentAlertConfirm(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'INFORMACIÓN',
      message: '¿SEGURO QUE DESEA CERRAR SESIÓN?',
      buttons: [
        {
          text: 'CANCELAR',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'DESCONECTAR',
          handler: () => {
            this.desconect();
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
   
  }

  
  private desconect(){
    this.authS.logout();
  }
  enableDark(){
    this.theme.enableDark();
    this.authS.changeTheme(1);
  }

  enableLight(){
    this.theme.enableLight();
    this.authS.changeTheme(0);
  }
        
    changeLeguaje(l:string){
      console.log("Esta el "+l)
      if(l!=null){
        this.translateService.use(l);
      }
    }
  }

