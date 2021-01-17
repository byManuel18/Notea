import { Component, OnInit } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private google:GooglePlus, private authS:AuthService, private router:Router,private traslate:TranslateService) { }

  ngOnInit() {
    console.log(this.authS.isLogged())
    if(this.authS.isLogged()){
      console.log(this.authS.user.idiom);
      
      this.router.navigate(['/']);
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
