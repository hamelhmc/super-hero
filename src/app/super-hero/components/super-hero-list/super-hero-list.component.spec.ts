/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable rxjs/finnish */
import { ChangeDetectorRef, EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { AppModule } from 'src/app/app.module';
import { SuperHero } from '../../models/super-hero.model';
import { SuperHeroService } from '../../services/super-hero.service';
import { SuperHeroModule } from '../../super-hero.module';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { SuperHeroFormComponent } from '../super-hero-form/super-hero-form.component';
import { SuperHeroListComponent } from './super-hero-list.component';

describe('SuperHeroListComponent', () => {
  let component: SuperHeroListComponent;
  let fixture: ComponentFixture<SuperHeroListComponent>;
  let superHeroService: SuperHeroService;
  let dialog: MatDialog;

  const mockDialog = {
    close: () => {},
    open: () => {},
  };

  const heroes: SuperHero[] = [
    { id: 1, name: 'Superman', description: 'Man of steel', image: '' },
    { id: 2, name: 'Batman', description: 'The Dark Knight', image: '' },
  ];

  const superHeroServiceStub = {
    getAllSuperHeroes$: jasmine
      .createSpy('getAllSuperHeroes$')
      .and.returnValue(of({ data: heroes, totalCount: heroes.length })),
    createSuperHero$: jasmine
      .createSpy('createSuperHero$')
      .and.callFake((newHero: SuperHero) => of(newHero)),
    updateSuperHero$: jasmine
      .createSpy('updateSuperHero$')
      .and.callFake((updatedHero: SuperHero) => of(updatedHero)),
    deleteSuperHero$: jasmine.createSpy('deleteSuperHero$').and.callFake((id: number) => of(id)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SuperHeroModule,
        AppModule,
        BrowserAnimationsModule,
        MatTableModule,
        MatDialogModule,
      ],
      declarations: [
        SuperHeroListComponent,
        SuperHeroFormComponent,
        DeleteConfirmationDialogComponent,
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialog },
        { provide: MatDialog, useValue: mockDialog },
        { provide: SuperHeroService, useValue: superHeroServiceStub },
      ],
    }).compileComponents();

    superHeroService = TestBed.inject(SuperHeroService);
    dialog = TestBed.inject(MatDialog);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperHeroListComponent);
    component = fixture.componentInstance;
    component.dialogRef = TestBed.inject(MatDialogRef<SuperHeroFormComponent>);
    component.sort = new MatSort();
    component.paginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
    component.ngAfterViewInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load superheroes correctly on init', () => {
    spyOn(component, 'loadData');
    component.ngAfterViewInit();
    expect(component.loadData).toHaveBeenCalled();
  });

  it('should create super hero using API when online', () => {
    component.onLine = true;

    const newHero: SuperHero = {
      id: 3,
      name: 'Wonder Woman',
      description: 'Amazon Princess',
      image: '',
    };

    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
    dialogRefSpyObj.componentInstance = { createHero: new EventEmitter<Partial<SuperHero>>() };

    spyOn(dialog, 'open').and.returnValue(dialogRefSpyObj);
    const createHeroAPISpy = spyOn(component, 'createHeroAPI');

    component.openCreate();

    dialogRefSpyObj.componentInstance.createHero.emit(newHero);

    expect(createHeroAPISpy).toHaveBeenCalledWith(newHero);
  });

  it('should create super hero locally when offline', () => {
    component.onLine = false;

    const newHero: SuperHero = {
      id: 3,
      name: 'Wonder Woman',
      description: 'Amazon Princess',
      image: '',
    };

    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
    dialogRefSpyObj.componentInstance = { createHero: new EventEmitter<Partial<SuperHero>>() };

    spyOn(dialog, 'open').and.returnValue(dialogRefSpyObj);
    const createHeroLocallySpy = spyOn(component, 'createHeroLocally');

    component.openCreate();

    dialogRefSpyObj.componentInstance.createHero.emit(newHero);

    expect(createHeroLocallySpy).toHaveBeenCalledWith(newHero);
  });

  it('should update super hero using API when online', () => {
    component.onLine = true;

    const updatedHero: SuperHero = {
      id: 1,
      name: 'Updated Superman',
      description: 'Updated Man of steel',
      image: '',
    };

    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
    dialogRefSpyObj.componentInstance = { updateHero: new EventEmitter<Partial<SuperHero>>() };

    spyOn(dialog, 'open').and.returnValue(dialogRefSpyObj);
    const updateHeroAPISpy = spyOn(component, 'updateHeroAPI');

    component.openEditHero(updatedHero);

    dialogRefSpyObj.componentInstance.updateHero.emit(updatedHero);

    expect(updateHeroAPISpy).toHaveBeenCalledWith(updatedHero);
  });

  it('should update super hero locally when offline', () => {
    component.onLine = false;

    const updatedHero: SuperHero = {
      id: 1,
      name: 'Updated Superman',
      description: 'Updated Man of steel',
      image: '',
    };

    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
    dialogRefSpyObj.componentInstance = { updateHero: new EventEmitter<Partial<SuperHero>>() };

    spyOn(dialog, 'open').and.returnValue(dialogRefSpyObj);
    const updateHeroLocallySpy = spyOn(component, 'updateHeroLocally');

    component.openEditHero(updatedHero);

    dialogRefSpyObj.componentInstance.updateHero.emit(updatedHero);

    expect(updateHeroLocallySpy).toHaveBeenCalledWith(updatedHero);
  });

  it('should delete super hero using API when online', () => {
    component.onLine = true;

    const heroToDelete: SuperHero = {
      id: 2,
      name: 'Batman',
      description: 'The Dark Knight',
      image: '',
    };

    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
    dialogRefSpyObj.componentInstance = { deleteHero: new EventEmitter<Partial<SuperHero>>() };

    spyOn(dialog, 'open').and.returnValue(dialogRefSpyObj);
    const deleteHeroAPISpy = spyOn(component, 'deleteHeroAPI');

    component.openConfirmDeleteHero(heroToDelete);

    dialogRefSpyObj.componentInstance.deleteHero.emit(heroToDelete);

    expect(deleteHeroAPISpy).toHaveBeenCalledWith(heroToDelete);
  });

  it('should delete super hero locally when offline', () => {
    component.onLine = false;

    const heroToDelete: SuperHero = {
      id: 2,
      name: 'Batman',
      description: 'The Dark Knight',
      image: '',
    };

    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
    dialogRefSpyObj.componentInstance = { deleteHero: new EventEmitter<Partial<SuperHero>>() };

    spyOn(dialog, 'open').and.returnValue(dialogRefSpyObj);
    const deleteHeroLocallySpy = spyOn(component, 'deleteHeroLocally');

    component.openConfirmDeleteHero(heroToDelete);

    dialogRefSpyObj.componentInstance.deleteHero.emit(heroToDelete);

    expect(deleteHeroLocallySpy).toHaveBeenCalledWith(heroToDelete);
  });
  it('should filter superheroes', () => {
    const filterValue = 'batman';
    const event = {
      target: {
        value: filterValue,
      },
    } as unknown as Event;

    component.applyFilter(event);

    expect(component.filterSubject$.getValue()).toBe(filterValue);
  });

  it('should handle sort change', () => {
    const previousActive = component.sort.active;
    const previousDirection = component.sort.direction;

    component.sort.active = 'name';
    component.sort.direction = 'desc';
    component.sort.sortChange.emit();

    expect(component.sort.active).not.toBe(previousActive);
    expect(component.sort.direction).not.toBe(previousDirection);
  });

  it('should delete super hero locally when offline', () => {
    component.onLine = false;

    const heroToDelete: SuperHero = {
      id: 2,
      name: 'Batman',
      description: 'The Dark Knight',
      image: '',
    };

    const previousTotalCount = component.totalCount;

    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
    dialogRefSpyObj.componentInstance = { deleteHero: new EventEmitter<Partial<SuperHero>>() };

    spyOn(dialog, 'open').and.returnValue(dialogRefSpyObj);
    const deleteHeroLocallySpy = spyOn(component, 'deleteHeroLocally');

    component.openConfirmDeleteHero(heroToDelete);

    dialogRefSpyObj.componentInstance.deleteHero.emit(heroToDelete);

    expect(deleteHeroLocallySpy).toHaveBeenCalledWith(heroToDelete);
    expect(component.totalCount).toBe(previousTotalCount);
  });

  it('should create super hero locally', () => {
    component.onLine = false;

    const newHero: SuperHero = {
      id: 3,
      name: 'Wonder Woman',
      description: 'Amazon Princess',
      image: '',
    };

    const previousHeroesLength = component.heroes.length;
    const previousTotalCount = component.totalCount;

    component.createHeroLocally(newHero);

    expect(component.heroes.length).toBe(previousHeroesLength + 1);
    expect(component.totalCount).toBe(previousTotalCount + 1);
    expect(component.heroes[component.heroes.length - 1]).toEqual(newHero);
  });

  it('should update super hero locally', () => {
    component.onLine = false;
    component.heroes = [...heroes];
    const updatedHero: SuperHero = {
      id: 1,
      name: 'Updated Superman',
      description: 'Updated Man of steel',
      image: '',
    };

    component.updateHeroLocally(updatedHero);

    const updatedHeroIndex = component.heroes.findIndex((hero) => hero.id === updatedHero.id);

    expect(component.heroes[updatedHeroIndex]).toEqual(updatedHero);
  });

  it('should delete super hero locally', () => {
    component.onLine = false;
    component.heroes = [...heroes];
    const heroToDelete: SuperHero = {
      id: 2,
      name: 'Batman',
      description: 'The Dark Knight',
      image: '',
    };

    component.deleteHeroLocally(heroToDelete);

    expect(component.heroes.some((hero) => hero.id === heroToDelete.id)).toBe(false);
  });
});
