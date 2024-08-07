import {Directive, ElementRef, forwardRef, HostListener} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Directive({
  selector: '[appContentEditableValueAccessor]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContentEditableValueAccessorDirective),
      multi: true,
    },
  ]
})
export class ContentEditableValueAccessorDirective implements ControlValueAccessor{
  constructor(private el: ElementRef) {
    console.log('Directive initialized');
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    console.log('onInput called');
    const target = event.target as HTMLElement;
    this.onChange(target.innerText);
  }

  @HostListener('blur')
  onBlur() {
    console.log('onBlur called');
    this.onTouched();
  }

  writeValue(value: any): void {
    console.log('writeValue called with value:', value);
    this.el.nativeElement.innerText = value || '';
  }

  registerOnChange(fn: any): void {
    console.log('registerOnChange called');
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    console.log('registerOnTouched called');
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    console.log('setDisabledState called with isDisabled:', isDisabled);
    this.el.nativeElement.contentEditable = !isDisabled;
  }
}
