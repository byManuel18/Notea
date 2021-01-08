import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  render:Renderer2;

  constructor(private renderFactory:RendererFactory2,@Inject(DOCUMENT) private document:Document) { 
    this.render=this.renderFactory.createRenderer(null,null);
  }

  enableDark(){
    this.render.addClass(this.document.body,'dark-theme');
  }

  enableLight(){
    this.render.removeClass(this.document.body,'dark-theme');
  }
}
