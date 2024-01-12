/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UppercaseDirective } from './uppercase.directive';

@Component({
  template: '<input type="text" appUppercase />',
})
class TestComponent {}

describe('UppercaseDirective', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent, UppercaseDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges(); // initial binding
  });

  it('should convert input value to uppercase', () => {
    const inputValue = 'test string';
    const inputElement = fixture.debugElement.query(By.directive(UppercaseDirective)).nativeElement;
    const event = new Event('input');

    inputElement.value = inputValue;
    inputElement.dispatchEvent(event);
    fixture.detectChanges();

    expect(inputElement.value).toBe(inputValue.toUpperCase());
  });
});
