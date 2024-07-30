import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver, ComponentRef,
  ContentChild,
  ElementRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {NgIf, NgTemplateOutlet} from "@angular/common";
import {OneMoreComponent} from "../one-more/one-more.component";

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [
    NgIf,
    NgTemplateOutlet
  ],
  templateUrl: './example.component.html',
  styleUrl: './example.component.css'
})
export class ExampleComponent{
@ViewChild('dynamicContainer',{read: ViewContainerRef,static: true}) container!: ViewContainerRef;

componentRef!: ComponentRef<OneMoreComponent>;

createComponent(){
  this.container.clear();
  this.componentRef = this.container.createComponent(OneMoreComponent);
}

destroyComponent(){
  if(this.componentRef){
    this.componentRef.destroy();
  }
}
}
