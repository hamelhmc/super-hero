import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SuperHero } from '../../models/super-hero.model';

@Component({
  selector: 'app-super-hero-form',
  templateUrl: './super-hero-form.component.html',
  styleUrls: ['./super-hero-form.component.css'],
})
export class SuperHeroFormComponent {
  @Output() createHero: EventEmitter<Partial<SuperHero>> = new EventEmitter<Partial<SuperHero>>();
  @Output() updateHero: EventEmitter<SuperHero> = new EventEmitter<SuperHero>();

  form: FormGroup;
  superHero!: SuperHero | null;

  constructor(
    private readonly formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SuperHeroFormComponent>,
    @Inject(MAT_DIALOG_DATA) data: { superHero: SuperHero | null } | null
  ) {
    this.form = this.buildForm();

    if (data?.superHero) {
      this.superHero = data.superHero;
      this.form.patchValue({
        name: this.superHero.name,
        description: this.superHero.description,
      });
    }
  }

  get formControls(): Record<string, AbstractControl<unknown, unknown>> {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.valid) {
      const newHero = {
        name: this.formControls['name'].value as string,
        description: this.formControls['description'].value as string,
      };

      if (this.superHero) {
        // Emitir evento para actualizar superhéroe
        this.updateHero.emit({
          ...this.superHero,
          ...newHero,
        });
      } else {
        // Emitir evento para crear nuevo superhéroe
        this.createHero.emit(newHero);
      }
      this.form.reset();
      this.closeDialog();
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  private buildForm(): FormGroup<{
    name: FormControl<string | null>;
    description: FormControl<string | null>;
  }> {
    return this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
    });
  }
}
