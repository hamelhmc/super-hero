import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppModule } from 'src/app/app.module';
import { SuperHeroModule } from '../../super-hero.module';
import { SuperHeroFormComponent } from './super-hero-form.component';

describe('SuperHeroFormComponent', () => {
  let component: SuperHeroFormComponent;
  let fixture: ComponentFixture<SuperHeroFormComponent>;
  const dialogMock = {
    close: () => {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperHeroModule, AppModule],
      declarations: [SuperHeroFormComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogMock,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { superHero: null },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperHeroFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on construction', () => {
    expect(component.form).toBeDefined();
    expect(component.form.controls['name'].value).toEqual('');
    expect(component.form.controls['description'].value).toEqual('');
  });

  it('should emit createHero event on submit() when superHero is not provided', () => {
    spyOn(component.createHero, 'emit');
    const name = 'Superman';
    const description = 'Man of Steel';
    component.form.controls['name'].setValue(name);
    component.form.controls['description'].setValue(description);
    component.onSubmit();
    expect(component.createHero.emit).toHaveBeenCalledWith({
      name,
      description,
    });
    expect(component.form.controls['name'].value).toEqual(null);
    expect(component.form.controls['description'].value).toEqual(null);
  });

  it('should emit updateHero event on submit() when superHero is provided', () => {
    spyOn(component.updateHero, 'emit');
    const name = 'Superman';
    const description = 'Man of Steel';
    const superHero = { name: 'Batman', description: 'The Dark Knight', id: 1, image: '' };
    component.superHero = superHero;
    component.form.controls['name'].setValue(name);
    component.form.controls['description'].setValue(description);
    component.onSubmit();
    expect(component.updateHero.emit).toHaveBeenCalledWith({
      ...superHero,
      name,
      description,
    });
    expect(component.form.controls['name'].value).toEqual(null);
    expect(component.form.controls['description'].value).toEqual(null);
  });

  it('should close the dialog on closeDialog()', () => {
    spyOn(component.dialogRef, 'close');
    component.closeDialog();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });
});
