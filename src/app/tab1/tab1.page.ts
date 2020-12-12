import { Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Nota } from '../model/nota';
import { EditNotaPage } from '../pages/edit-nota/edit-nota.page';
import { NotasService } from '../services/notas.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UtilidadesService } from '../services/utilidades.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page{

  public listaNotas = [];

  constructor(private notasS: NotasService, private modalController:ModalController,private utilidades:UtilidadesService,
    private utils:UtilidadesService,
    private nativeStorage:NativeStorage, private authS:AuthService, private router:Router,public alertController: AlertController) { }

  public async logout(){
    await this.authS.logout();
    if(!this.authS.isLogged()){
      this.router.navigate(['/login'])
    }
  }
  
  ngOnInit(){
   // this.cargaDatos();
    this.nativeStorage.setItem('myitem', {property:'value', anotherProperty: 'anotherValue'}).then(
      ()=> console.log('Stored item!'),
      error=> console.error('Error storing item', error)
    );
  }

  ionViewDidEnter() {
    //Mostrar loading
    this.cargaDatos();
  }

  public cargaDatos($event=null){
    console.log("Cargando");
    
    this.listaNotas=[];
    try {
     /* this.notasS.leeNotas().subscribe((info:firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>) => {
        //ya ha llegado al servidor
        this.listaNotas=[];
        info.forEach((doc)=>{
          let nota={
            id:doc.id,
            ...doc.data()
          }
          this.listaNotas.push(nota);
          //console.log(nota); 
        });
        //Ocultar el loading
        
        if($event){
          $event.target.complete();
        }
      })*/
      this.notasS.leerNotasPorCriterio().then((qs)=>{
        qs.forEach((d)=>{
          let nota={
            id:d.id,
            ...d.data()
          }
         this.listaNotas.push(nota);
        })
        if($event){
          $event.target.complete();
        }
      })
    } catch (err) {
      //error
    }
  }

  private  borraNota(id:any){
    this.notasS.borraNota(id).then(()=>{
      //borrado
      let tmp=[];
      this.listaNotas.forEach((nota)=>{
        if(nota.id!=id){
          tmp.push(nota);
        }
      })
      this.listaNotas=tmp;
    }).catch(err=>{

    });
  }
  async presentAlertConfirm(id:any){
    this.utilidades.Vibrar();
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'INFORMACIÓN',
      message: '¿SEGURO QUE DESEA ELIMINAR LA NOTA?',
      buttons: [
        {
          text: 'CANCELAR',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'BORRAR',
          handler: () => {
            this.borraNota(id);
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
   
  }

  public async editaNota(nota:Nota){
    const modal = await this.modalController.create({
      component: EditNotaPage,
      cssClass: 'my-custom-class',
      componentProps:{
        nota:nota
      }
    });
    return await modal.present();
  }
  public search($event){
    let cadena:string=$event.srcElement.value;
    console.log($event.srcElement.value);
    if(cadena!=null&&cadena!=""){
      this.listaNotas=[];
      this.notasS.leerNotasPorTitulo(cadena.toUpperCase()).then((querySnapshot)=> {
        querySnapshot.forEach((doc)=>{
            let nota={
              id:doc.id,
              ...doc.data()
            }
           this.listaNotas.push(nota);
           // console.log(doc.id, " => ", doc.data());
           console.log(nota);
        });
        })
        .catch((error)=>{
            console.log("Error getting documents: ", error);
        });
    }else{
      this.cargaDatos();
    }
    

    
  }
}
