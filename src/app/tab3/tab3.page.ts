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

  public User:{
    token:any,
    name:any,
    avatar:any,
    theme:any,
    idiom:any,
  }=null;
  public darkmode=false;
  public ingles=false;

  constructor( private authS:AuthService,private router:Router,public alertController: AlertController,private theme:ThemeService,public util:UtilidadesService
    ,private translateService: TranslateService) {}
  
  
  ngOnInit(): void {
    this.User={
      token:this.authS.user.token,
      name:this.authS.user.name,
      avatar:this.authS.user.avatar,
      theme:this.authS.user.theme,
      idiom:this.authS.user.idiom
    }
  }
  ionViewDidEnter(){
    this.ngOnInit();
    if(this.User.theme==1){
      this.darkmode=true;
    }
    if(this.translateService.currentLang=='es'){
      this.ingles=false;
    }else{
      this.ingles=true;
    }
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
            this.translateService.use(this.translateService.getBrowserLang());
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

  changeTheme($event){
    console.log($event)
    if($event.detail.checked){
      this.darkmode=true;
      this.enableDark();
    }else{
      this.darkmode=false;
      this.enableLight();
    }
  }

  enableLight(){
    this.theme.enableLight();
    this.authS.changeTheme(0);
  }

  changeLenguaje2($event){
    if($event.detail.checked){
      this.changeLeguaje('en');
    }else{
      this.changeLeguaje('es');
    }
    
  }
        
    changeLeguaje(l:string){
      console.log("Esta el "+l)
      if(l!=null){
        this.translateService.use(l);
        this.authS.changeIdiomaStorage(l);
      }
    }

    async prueba(){
      console.log("1");
      await this.util.verLocalizaAvaliable().then((date)=>{
        
        console.log("2");
        
      },(error)=>{
        console.log("2");
      }).catch((e)=>{
        console.log(e);
        
      });
      console.log("3");
    }
  }

