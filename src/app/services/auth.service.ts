import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { ThemeService } from './theme.service';
import { UtilidadesService } from './utilidades.service';
import { TranslateService } from '@ngx-translate/core';



@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate{

  public user={
    token:-1,
    name:'',
    avatar:'',
    theme:-1,
    idiom:'',
  }

  constructor(private storage:NativeStorage, private google:GooglePlus, private router:Router,private utilS:UtilidadesService,private themeS:ThemeService,private translate:TranslateService ) {
    
   }
  canActivate(route:ActivatedRouteSnapshot):boolean{
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
      
      if(this.user.theme==1){
        this.themeS.enableDark();
      }
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
     
     let u = await this.google.logout().then((e)=>{
      this.themeS.enableLight();
      this.user={
        token: -1,
        name:'',
        avatar:'',
        theme:-1,
        idiom:'',
      }
       this.storage.setItem("user",this.user);
       this.router.navigate(["login"]);
    }).catch((err)=>{
      this.google.trySilentLogin({});
      this.google.logout();
      console.log(err);
      this.themeS.enableLight();
      this.router.navigate(["login"]);
      this.user={
        token: -1,
        name:'',
        avatar:'',
        theme:-1,
        idiom:''
      }
       this.storage.setItem("user",this.user);
    });
     
     
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
           avatar: u['imageUrl'],
           theme:-1,
           idiom:''
         }
         console.log(this.user);
       }
     }catch(err){
       this.user={
         token:-1,
         name:'',
         avatar:'',
         theme:-1,
         idiom:''
       }
     }
     await this.storage.setItem("user",this.user);
     return this.user;
   }

   async changeTheme(n:number){
    this.user.theme=n;
    await this.storage.setItem("user",this.user).then((e)=>{
    }).catch((err)=>{
     
    });
   }

   async changeIdiomaStorage(s:string){
    this.user.idiom=s;
    console.log(this.user);
    await this.storage.setItem("user",this.user).then((e)=>{
    }).catch((err)=>{
     
    });
   }


   
}
