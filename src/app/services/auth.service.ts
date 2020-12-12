import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';


@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate{

  public user={
    token:-1,
    name:'',
    avatar:''
  }

  constructor(private storage:NativeStorage, private google:GooglePlus, private router:Router,) {

   }
  canActivate(route:ActivatedRouteSnapshot):boolean{
    console.log("Estoy en canactive y el result es "+this.isLogged());
    if(!this.isLogged()){
      this.router.navigate(["login"]);
      return false;
    }
    return true;
  };

  async init(){
    let u=null;
    try{
      u = await this.storage.getItem("user");
    }catch (err){
      u=null;
    }
    if(u!=null){
      this.user=u;
    }
  }

   

   public isLogged():boolean{
     if(this.user.token==-1){
       return false;
     }else{
       return true;
     }
   }

   public async logout(){
     let u = await this.google.logout();
     this.user={
       token: -1,
       name:'',
       avatar:''
     }
     await this.storage.setItem("user",this.user);
   }

   public async login(){
     try{
       let u =await this.google.login({});
       console.log(u)
       if(u){
         console.log("OK")
         this.user={
           token: u['email'],
           name: u['displayName'],
           avatar: u['imageUrl']
         }
         console.log(this.user);
       }
     }catch(err){
       this.user={
         token:-1,
         name:'',
         avatar:''
       }
     }
     await this.storage.setItem("user",this.user);
     return this.user;
   }

   
}
