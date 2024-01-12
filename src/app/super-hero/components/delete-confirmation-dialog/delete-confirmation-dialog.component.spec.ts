import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppModule } from 'src/app/app.module';
import { SuperHero } from '../../models/super-hero.model';
import { SuperHeroModule } from '../../super-hero.module';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog.component';

describe('DeleteConfirmationDialogComponent', () => {
  let component: DeleteConfirmationDialogComponent;
  let fixture: ComponentFixture<DeleteConfirmationDialogComponent>;
  let testData: SuperHero;
  const dialogMock = {
    close: jasmine.createSpy('close'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SuperHeroModule, AppModule],
      declarations: [DeleteConfirmationDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: testData },
      ],
    });

    fixture = TestBed.createComponent(DeleteConfirmationDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit deleteHero event on confirm', () => {
    spyOn(component.deleteHero, 'emit');
    component.confirm();
    expect(component.deleteHero.emit).toHaveBeenCalledWith(testData);
  });

  it('should close dialog with true on confirm', () => {
    component.confirm();
    expect(dialogMock.close).toHaveBeenCalled();
  });

  it('should close dialog with false on cancel', () => {
    component.cancel();
    expect(dialogMock.close).toHaveBeenCalled();
  });
});
