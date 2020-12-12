import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Nota } from 'src/app/model/nota';
import { NotasService } from 'src/app/services/notas.service';

@Component({
  selector: 'app-edit-nota',
  templateUrl: './edit-nota.page.html',
  styleUrls: ['./edit-nota.page.scss'],
})
export class EditNotaPage {

  @Input('nota') nota: Nota;

  public tasks: FormGroup;

  constructor(private formBuilder: FormBuilder, private notasS: NotasService, public loadingController: LoadingController, public toastController: ToastController, private modalController: ModalController) {
    this.tasks = this.formBuilder.group({
      title:['',Validators.required],
      description:['']
    });
  }

  ionViewDidEnter(){
    this.tasks.get('title').setValue(this.nota.titulo);
    this.tasks.get('description').setValue(this.nota.texto)
  }
  
  public async sendForm() {
    await this.presentLoading();
    let ti:string=this.tasks.get('title').value;
    let data: Nota = {
      titulo: ti.toUpperCase(),
      texto: this.tasks.get('description').value,
      caseSearch:this.setSearchParam(ti.toUpperCase()),
      user:this.nota.user
    }
    this.notasS.actualizaNota(this.nota.id, data).then((respuesta) => {
      this.loadingController.dismiss();
      this.presentToast("Nota guardada", "success");
      this.modalController.dismiss();
    }).catch((err) => {
      this.loadingController.dismiss();
      this.presentToast("Error guardando nota", "danger");
      console.log(err);
    });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: '',
      spinner: 'crescent'
      //duration: 2000
    });
    await loading.present();
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
  public setSearchParam(caseNumber:string) {
    let caseSearchList:string[] = [];
    let  temp:string = "";
    for(let  i:number = 0; i < caseNumber.length; i++){
      temp = temp + caseNumber[i];
      caseSearchList.push(temp);
    }
    return caseSearchList;
  }

}
