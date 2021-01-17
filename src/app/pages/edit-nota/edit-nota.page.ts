import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { Nota } from 'src/app/model/nota';
import { NotasService } from 'src/app/services/notas.service';
import { UtilidadesService } from 'src/app/services/utilidades.service';
import * as Leaflet from 'leaflet';
import { icon, Marker } from 'leaflet';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';


@Component({
  selector: 'app-edit-nota',
  templateUrl: './edit-nota.page.html',
  styleUrls: ['./edit-nota.page.scss'],
})
export class EditNotaPage implements OnInit,OnDestroy{

  @Input('nota') nota: Nota;

  public tasks: FormGroup;
  public actualizargeo:boolean=false;
  public coordenadasanteriores:{
    latitude:number,
    longitude:number
  }=null;
  map: Leaflet.Map;
  ver:boolean;
   iconRetinaUrl = 'assets/marker-icon-2x.png';
   iconUrl = 'assets/marker-icon.png';
   shadowUrl = 'assets/marker-shadow.png';
   iconDefault = icon({
  iconRetinaUrl:this.iconRetinaUrl,
  iconUrl:this.iconUrl,
  shadowUrl:this.shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

encodeData: any;
data:string=null;
  scannedData: {};

  constructor(private formBuilder: FormBuilder, private notasS: NotasService, public toastController: ToastController, 
    private modalController: ModalController,public util:UtilidadesService,private barcodeScanner: BarcodeScanner) {
    this.tasks = this.formBuilder.group({
      title:['',Validators.required],
      description:['']
    });
    Marker.prototype.options.icon = this.iconDefault;
    
  }

  async ngOnInit() {
    
  }
    ionViewDidEnter(){
    this.tasks.get('title').setValue(this.nota.titulo);
    this.tasks.get('description').setValue(this.nota.texto);
    this.data=JSON.stringify(this.nota);
    //this.encodeData =JSON.stringify(this.nota);
    if(this.nota.coordenadas!=null){
      this.coordenadasanteriores={
        latitude:this.nota.coordenadas.latitude,
        longitude:this.nota.coordenadas.longitude
      }
      this.ver=true;
      this.leafletMap();
    }
  }
  
  public async sendForm() {
    await this.util.present();
    
    let ti:string=this.tasks.get('title').value;
    if(!this.actualizargeo){
      if(this.coordenadasanteriores!=null){
        this.nota.coordenadas.latitude=this.coordenadasanteriores.latitude;
        this.nota.coordenadas.longitude=this.coordenadasanteriores.longitude;
      }else{
        this.nota.coordenadas=null;
      }
      
    }
    let data: Nota = {
      titulo: ti.toUpperCase(),
      texto: this.tasks.get('description').value,
      caseSearch:this.setSearchParam(ti.toUpperCase()),
      user:this.nota.user,
      fecha:new Date().toLocaleString(),
      coordenadas:this.nota.coordenadas
    }
    this.notasS.actualizaNota(this.nota.id, data).then((respuesta) => {
      this.util.dismiss();
      this.util.presentToast("Nota guardada", "success");
      this.modalController.dismiss();
    }).catch((err) => {
      this.util.dismiss();
      this.util.presentToast("Error guardando nota", "danger");
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

  public Return(){
    this.modalController.dismiss();
  }
  public async ActivatedDesactivatedGeolo($event){
    this.actualizargeo=$event.detail.checked;
    if(this.actualizargeo){
      await this.util.present();
      await this.util.getGeolocation().then((resp) => {
        // resp.coords.latitude
        console.log(resp.coords.latitude);
        console.log(resp.coords.longitude);
        this.nota.coordenadas={
          latitude:resp.coords.latitude,
          longitude:resp.coords.longitude
        }
        this.util.dismiss();
        if(this.map==null){
          this.map = Leaflet.map('mapId').setView([this.nota.coordenadas.latitude,this.nota.coordenadas.longitude], 15);
          Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'edupala.com © Angular LeafLet',
          }).addTo(this.map);
        }
        this.map.setView([this.nota.coordenadas.latitude,this.nota.coordenadas.longitude], 15);
        Leaflet.marker([this.nota.coordenadas.latitude,this.nota.coordenadas.longitude]).addTo(this.map).bindPopup(this.nota.titulo).openPopup();
        // resp.coords.longitude
       }).catch((error) => {
        this.util.dismiss();
         console.log('Error getting location', error);
         this.util.presentToast(error,"danger");
       });
    }else{
      if(this.coordenadasanteriores==null){
        this.nota.coordenadas==null;
        this.util.presentToast('No había localización anterior','medium');
      }else{
        this.nota.coordenadas=this.coordenadasanteriores;
        this.map.setView([this.nota.coordenadas.latitude,this.nota.coordenadas.longitude], 15);
        Leaflet.marker([this.nota.coordenadas.latitude,this.nota.coordenadas.longitude]).addTo(this.map).bindPopup(this.nota.titulo).openPopup();
      }
      
    }
  }

  ngOnDestroy(){
    this.map.remove();
  }
  ionViewDidLeave(){
    this.map.remove();
    Leaflet.map('mapId').remuve();
  }
  leafletMap() {
    if(this.ver){
        this.map = Leaflet.map('mapId').setView([this.nota.coordenadas.latitude,this.nota.coordenadas.longitude], 15);
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'edupala.com © Angular LeafLet',
      }).addTo(this.map);
      Leaflet.marker([this.nota.coordenadas.latitude,this.nota.coordenadas.longitude]).addTo(this.map).bindPopup(this.nota.titulo).openPopup();
    }
  }

  

  encodedText() {
    let s:string=JSON.stringify(this.nota);
    this.barcodeScanner
      .encode(this.barcodeScanner.Encode.TEXT_TYPE,s)
      .then(
        encodedData => {
          console.log(encodedData);
          this.encodeData = encodedData;
        },
        err => {
          console.log("Error occured : " + err);
        }
      );
  }

}
