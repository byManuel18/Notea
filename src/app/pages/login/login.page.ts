import { Component, OnInit } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private google:GooglePlus, private authS:AuthService, private router:Router) { }

  ngOnInit() {
    console.log(this.authS.isLogged())
    if(this.authS.isLogged()){
      this.router.navigate(['/'])
    }
  }

  public async login(){
    /*
    this.google.login({}).then((respuesta)=>{
      console.log(respuesta);
    }).catch(err=>{
      console.log(err);
    })*/
    let u=await this.authS.login();
    if(u.token!=-1){
      this.router.navigate(['/'])
    }
  }
}
