import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Subscription, of, throwError } from 'rxjs';
import { ShareModule } from 'src/app/share/share.module';
import { SuperHero } from '../../models/super-hero.model';
import { SuperHeroService } from '../../services/super-hero.service';
import { SuperHeroModule } from '../../super-hero.module';
import { SuperHeroDetailComponent } from './super-hero-detail.component';

describe('SuperHeroDetailComponent', () => {
  let component: SuperHeroDetailComponent;
  let fixture: ComponentFixture<SuperHeroDetailComponent>;
  const dialogMock = {
    close: jasmine.createSpy('close'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuperHeroDetailComponent],
      imports: [ShareModule, SuperHeroModule, RouterTestingModule],
      providers: [{ provide: MatDialogRef, useValue: dialogMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperHeroDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load hero detail on initialization', () => {
    const mockHeroId = 1;
    const mockHeroDetail: SuperHero = { id: 1, name: 'Superman', description: '', image: '' };
    const superHeroService = TestBed.inject(SuperHeroService);
    spyOn(superHeroService, 'getSuperHeroById$').and.returnValue(of(mockHeroDetail));

    component.heroId = mockHeroId;
    component.ngOnInit();

    fixture.detectChanges();
    expect(component.heroDetail).toEqual(mockHeroDetail);
  });

  it('should handle error when loading hero detail', () => {
    const mockHeroId = 1;
    const mockErrorMessage = 'Error retrieving super hero detail';
    const mockError = new HttpErrorResponse({
      error: new ErrorEvent('Error', { error: new Error(mockErrorMessage) }),
      status: 0,
      statusText: 'Unknown Error',
      url: `http://localhost:3000/api/v1/superheros/${mockHeroId}`,
    });
    const superHeroService = TestBed.inject(SuperHeroService);
    spyOn(superHeroService, 'getSuperHeroById$').and.returnValue(throwError(() => mockError));

    const consoleErrorSpy = spyOn(console, 'error').and.callFake((...args: any[]) => {
      expect(args[1]).toBe(mockError);
    });

    component.heroId = mockHeroId;
    component.ngOnInit();

    fixture.detectChanges();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('should assign heroId from route params', () => {
    const mockHeroId = 1;
    const mockRouteParams = { id: '1' };
    const route = TestBed.inject(ActivatedRoute);
    const subscribeSpy = spyOn(route.params, 'subscribe').and.callFake(
      (callback: (params: any) => void) => {
        callback(mockRouteParams);

        return { unsubscribe: jasmine.createSpy('unsubscribe') } as unknown as Subscription;
      }
    );

    component.ngOnInit();

    expect(component.heroId).toBe(mockHeroId);
    expect(subscribeSpy).toHaveBeenCalled();
  });
});
