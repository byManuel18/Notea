import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private traslator:TranslateService,private authS:AuthService) {}
  

  ngOnInit(){
    if(this.authS.user.idiom!=''){
      console.log('aqui');
      
      this.traslator.use(this.authS.user.idiom);
    }
  }

}
