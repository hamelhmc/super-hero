import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appUppercase]',
})
export class UppercaseDirective {
  constructor(
    private readonly el: ElementRef<HTMLInputElement>,
    private readonly renderer: Renderer2
  ) {}

  @HostListener('input', ['$event'])
  onInput(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;
    const currentValue = inputElement.value;
    const transformedValue = currentValue.toUpperCase();

    if (currentValue !== transformedValue) {
      this.renderer.setProperty(this.el.nativeElement, 'value', transformedValue);
      this.forceInputEvent();
    }
  }

  private forceInputEvent(): void {
    this.el.nativeElement.dispatchEvent(new Event('input'));
  }
}
