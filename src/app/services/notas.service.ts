import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Nota } from '../model/nota';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotasService {

  private myCollection:AngularFirestoreCollection<any>;
  

  constructor(private fire:AngularFirestore,private auht:AuthService) {
    this.myCollection= fire.collection<any>(environment.notasCollection);
   }

  agregaNota(nuevaNota:Nota):Promise<any>{
    return this.myCollection.add(nuevaNota);
  }

  leeNotas():Observable<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>>{
    return this.myCollection.get();
  }

  /**
   *  Realiza la lectura de firebase de una nota dada por una clave
   * @param id la clave del documento (nota) a leer
   * @return un obseravble con la informacion de la nota seleccionada
   */
  leeNota(id:any):Observable<any>{
    return this.myCollection.doc(id).get();
  }

  actualizaNota(id:any, nuevaNota:Nota):Promise<void>{
    return this.myCollection.doc(id).set({titulo:nuevaNota.titulo, texto:nuevaNota.texto,caseSearch:nuevaNota.caseSearch,user:nuevaNota.user,fecha:nuevaNota.fecha,coordenadas:nuevaNota.coordenadas});
  }

  borraNota(id:any):Promise<void>{
    return this.myCollection.doc(id).delete();
  }
  //Fin crud básico
  leerNotasPorCriterio():Promise<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>>{
    return this.myCollection.ref.where('user','==',this.auht.user.token).get();
  }
  leerNotasPorTitulo(date:string):Promise<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>>{
    return this.myCollection.ref.where('user','==',this.auht.user.token).where('caseSearch','array-contains',date).get();
  }
}
