import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditNotaPageRoutingModule } from './edit-nota-routing.module';

import { EditNotaPage } from './edit-nota.page';
import { TranslateModule } from '@ngx-translate/core';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EditNotaPageRoutingModule,
    TranslateModule,
    NgxQRCodeModule
  ],
  declarations: [EditNotaPage],
  exports:[TranslateModule]
})
export class EditNotaPageModule {}
