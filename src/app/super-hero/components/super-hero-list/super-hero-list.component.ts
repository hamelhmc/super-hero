import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, combineLatest, of as observableOf } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { SuperHero } from '../../models/super-hero.model';
import { PaginationResponse, SuperHeroService } from '../../services/super-hero.service';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { SuperHeroFormComponent } from '../super-hero-form/super-hero-form.component';

@Component({
  selector: 'app-super-hero-list',
  templateUrl: './super-hero-list.component.html',
  styleUrls: ['./super-hero-list.component.css'],
})
export class SuperHeroListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns = ['name', 'description', 'actions'];
  dataSource: MatTableDataSource<SuperHero>;
  heroes: SuperHero[] = [];

  totalCount = 0;

  isLoadingResults = true;

  filterSubject$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  dialogRef: MatDialogRef<SuperHeroFormComponent> | null = null;

  onLine = false;

  constructor(public superHeroService: SuperHeroService, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<SuperHero>(this.heroes);
  }

  ngAfterViewInit(): void {
    this.loadData();
  }

  loadData(): void {
    combineLatest([
      this.sort.sortChange.pipe(startWith(null)),
      this.paginator.page.pipe(startWith(null)),
      this.filterSubject$.pipe(debounceTime(300), distinctUntilChanged()),
    ])
      .pipe(
        switchMap(([sortChange, page, filterValue]) => {
          this.isLoadingResults = true;
          const pageIndex = filterValue ? 1 : this.paginator.pageIndex + 1;
          const pageSize = page ? page.pageSize : this.paginator.pageSize;

          return this.superHeroService.getAllSuperHeroes$(
            pageIndex,
            pageSize,
            filterValue,
            sortChange
          );
        }),
        catchError(() => observableOf(null))
      )
      .subscribe((response: PaginationResponse | null) => {
        this.isLoadingResults = false;
        if (response === null) {
          this.heroes = [];
          this.totalCount = 0;
        } else {
          this.onLine = true;
          this.heroes = response.data;
          this.totalCount = response.totalCount ?? 0;
        }

        this.dataSource.data = this.heroes;
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterSubject$.next(filterValue);
  }

  openCreate(): void {
    this.dialogRef = this.dialog.open(SuperHeroFormComponent);
    this.dialogRef.componentInstance.createHero.subscribe((newHero: SuperHero) => {
      if (this.onLine) {
        this.createHeroAPI(newHero);
      } else {
        this.createHeroLocally(newHero);
      }
    });
  }

  createHeroLocally(newHero: SuperHero): void {
    this.isLoadingResults = true;
    newHero.id = this.generateTempId();
    this.heroes.push(newHero);
    this.totalCount += 1;
    this.dataSource.data = this.heroes;
    this.isLoadingResults = false;
  }

  createHeroAPI(newHero: SuperHero): void {
    this.isLoadingResults = true;
    this.superHeroService.createSuperHero$(newHero).subscribe({
      next: () => {
        if (this.dialogRef) {
          this.dialogRef.close();
          this.loadData();
        }
      },
      error: (error: unknown) => {
        console.error('Error creating super hero:', error);
      },
    });
  }

  openEditHero(hero: SuperHero): void {
    this.dialogRef = this.dialog.open(SuperHeroFormComponent, {
      data: {
        superHero: hero,
      },
    });

    this.dialogRef.componentInstance.updateHero.subscribe((updatedHero: SuperHero) => {
      if (this.onLine) {
        this.updateHeroAPI(updatedHero);
      } else {
        this.updateHeroLocally(updatedHero);
      }
    });
  }

  updateHeroLocally(updatedHero: SuperHero): void {
    this.isLoadingResults = true;

    const index = this.heroes.findIndex((hero) => hero.id === updatedHero.id);
    if (index !== -1) {
      this.heroes[index] = updatedHero;
      this.dataSource.data = this.heroes;
    }

    this.isLoadingResults = false;
  }

  updateHeroAPI(updatedHero: SuperHero): void {
    this.isLoadingResults = true;
    this.superHeroService.updateSuperHero$(updatedHero).subscribe({
      next: () => {
        if (this.dialogRef) {
          this.dialogRef.close();
          this.loadData();
        }
      },
      error: (error: unknown) => {
        console.error('Error updating super hero:', error);
      },
    });
  }

  openConfirmDeleteHero(hero: SuperHero): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = hero;

    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, dialogConfig);

    dialogRef.componentInstance.deleteHero.subscribe((superHero: SuperHero) => {
      if (this.onLine) {
        this.deleteHeroAPI(superHero);
      } else {
        this.deleteHeroLocally(superHero);
      }
    });
  }

  deleteHeroLocally(hero: SuperHero): void {
    this.isLoadingResults = true;
    this.heroes = this.heroes.filter((h) => h.id !== hero.id);
    this.totalCount -= 1;
    this.dataSource.data = this.heroes;
    this.isLoadingResults = false;
  }

  deleteHeroAPI(hero: SuperHero): void {
    this.isLoadingResults = true;
    this.superHeroService.deleteSuperHero$(hero.id).subscribe({
      next: () => {
        this.loadData();
      },
      error: (error: unknown) => {
        console.error('Error updating super hero:', error);
      },
    });
  }

  private generateTempId(): number {
    return Date.now();
  }
}
