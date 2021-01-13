import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { AlertController, IonToggle } from '@ionic/angular';
import { Nota } from '../model/nota';
import { AuthService } from '../services/auth.service';
import { NotasService } from '../services/notas.service';
import { UtilidadesService } from '../services/utilidades.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  public tasks:FormGroup;
  public geoactivated:boolean=false;
  public coordenadas:{
    latitude:number,
    longitude:number
  }=null;
  isLoading = false;
  barcodeScannerOptions: BarcodeScannerOptions;
  encodeData: any;
  //scannedData: {};

  constructor(private formBuilder:FormBuilder, private notasS:NotasService,private auth:AuthService
    ,private utils:UtilidadesService,private barcodeScanner: BarcodeScanner,public alertController: AlertController ) {
      this.tasks=this.formBuilder.group({
        title:['',Validators.required],
        description:['']
      });
    this.geoactivated=false;
    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true,
    };
    
  }
  ngOnInit(){
    
  }
  ionViewDidEnter(){
    this.geoactivated=false;
    this.tasks.get('title').setValue('');
    this.tasks.get('description').setValue('');
  }
  public async sendForm(){
    
    if(!this.geoactivated){
      this.coordenadas=null;
    }
    await this.utils.present();
    let ti:string=this.tasks.get('title').value;
    let data:Nota={
      titulo:ti.toUpperCase(),
      texto:this.tasks.get('description').value,
      caseSearch:this.setSearchParam(ti.toUpperCase()),
      user:this.auth.user.token,
      fecha:new Date().toLocaleString(),
      coordenadas:this.coordenadas
    } 
    this.notasS.agregaNota(data).then((respuesta)=>{
      this.tasks.setValue({
        title:'',
        description:''
      })
      this.coordenadas=null;
      this.geoactivated=false;
      this.utils.dismiss();
      this.utils.presentToast("Nota guardada","success");
    }).catch((err)=>{
      this.utils.dismiss();
      this.utils.presentToast("Error guardando nota","danger");
      console.log(err);
    });
    
  }

  public setSearchParam(caseNumber:string) {
    let caseSearchList:string[] = [];
    let  temp:string = "";
    for(let  i:number = 0; i < caseNumber.length; i++){
      temp = temp + caseNumber[i];
      caseSearchList.push(temp);
    }
    return caseSearchList;
  }

  public ActivatedDesactivatedGeolo($event){
    if($event.detail.checked){
      /*NO VA
      this.utils.present();
      this.utils.verLocalizaAvaliable().then((date)=>{
        if(date==true){
          this.geoactivated==true;
          this.utils.dismiss();
          alert("Si está");
          if(this.geoactivated==true){
            this.GetCoordenadas();
          }
        }else{
          this.geoactivated==false;
          $event.detail.checked=false;
          this.utils.dismiss();
          alert("No está disponible la ubicación");
        }
        
      },(error)=>{
        this.utils.dismiss();
        this.utils.presentToast(error,"danger");
      });*/
      
      this.geoactivated=true;
      if(this.geoactivated==true){
        this.GetCoordenadas();
      }
    }else{
      this.geoactivated=false;
    }
  }

  private  GetCoordenadas(){
    this.utils.present();
    this.utils.getGeolocation().then((resp) => {
      // resp.coords.latitude
      console.log(resp.coords.latitude);
      console.log(resp.coords.longitude);
      this.coordenadas={
        latitude:resp.coords.latitude,
        longitude:resp.coords.longitude
      }
      this.utils.dismiss();
      // resp.coords.longitude
     }).catch((error) => {
       this.utils.dismiss();
       console.log('Error getting location', error);
       this.utils.presentToast(error,"danger");
     });
  }

  scanCode() {
    this.barcodeScanner
      .scan(this.barcodeScannerOptions)
      .then(barcodeData => {
        //alert("Barcode data " + barcodeData.text);
        let n:Nota=JSON.parse(barcodeData.text);
        if(n!=null){
          this.presentAlertConfirm(n);
          
        }
        // alert("Barcode data " + JSON.stringify(barcodeData));
        //this.scannedData = barcodeData;
      })
      .catch(err => {
        console.log("Error", err);
      });
  }

  async presentAlertConfirm(n:Nota){
    
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'INFORMACIÓN',
      message: '¿SEGURO QUE DESEA AGREGAR LA NOTA?',
      buttons: [
        {
          text: 'CANCELAR',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'AGREGAR',
          handler: () => {

            this.utils.present();         
            let data:Nota={
              titulo:n.titulo,
              texto:n.texto,
              caseSearch:n.caseSearch,
              user:this.auth.user.token,
              fecha:new Date().toLocaleString(),
              coordenadas:n.coordenadas
            } 
            this.notasS.agregaNota(data).then((respuesta)=>{
              this.tasks.setValue({
                title:'',
                description:''
              })
              this.coordenadas=null;
              this.geoactivated=false;
              this.utils.dismiss();
              this.utils.presentToast("Nota guardada","success");
            }).catch((err)=>{
              this.utils.dismiss();
              this.utils.presentToast("Error guardando nota","danger");
              console.log(err);
            });

            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
   
  }

}
