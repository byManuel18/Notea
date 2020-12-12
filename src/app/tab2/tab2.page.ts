import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { Nota } from '../model/nota';
import { AuthService } from '../services/auth.service';
import { NotasService } from '../services/notas.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  public tasks:FormGroup;

  constructor(private formBuilder:FormBuilder, private notasS:NotasService, public loadingController:LoadingController,private auth:AuthService, public toastController: ToastController) {
    this.tasks=this.formBuilder.group({
      title:['',Validators.required],
      description:['']
    });
  }
  public async sendForm(){
    await this.presentLoading();
    let ti:string=this.tasks.get('title').value;
    let data:Nota={
      titulo:ti.toUpperCase(),
      texto:this.tasks.get('description').value,
      caseSearch:this.setSearchParam(ti.toUpperCase()),
      user:this.auth.user.token
    } 
    this.notasS.agregaNota(data).then((respuesta)=>{
      this.tasks.setValue({
        title:'',
        description:''
      })
      this.loadingController.dismiss();
      this.presentToast("Nota guardada","success");
    }).catch((err)=>{
      this.loadingController.dismiss();
      this.presentToast("Error guardando nota","danger");
      console.log(err);
    });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: '',
      spinner:'crescent'
      //duration: 2000
    });
    await loading.present();
  }

  async presentToast(msg:string,col:string) {
    const toast = await this.toastController.create({
      message: msg,
      color: col,
      duration: 2000,
      position:"top",
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
