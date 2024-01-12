import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SuperHero } from '../../models/super-hero.model';
import { SuperHeroService } from '../../services/super-hero.service';

@Component({
  selector: 'app-super-hero-detail',
  templateUrl: './super-hero-detail.component.html',
  styleUrls: ['./super-hero-detail.component.css'],
})
export class SuperHeroDetailComponent implements OnInit {
  heroId!: number;
  heroDetail!: SuperHero;
  isLoading = false;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly superHeroService: SuperHeroService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.heroId = Number(params['id']);
      this.loadHeroDetail();
    });
  }

  loadHeroDetail(): void {
    this.isLoading = true;
    this.superHeroService.getSuperHeroById$(this.heroId).subscribe({
      next: (heroDetail: SuperHero) => {
        this.heroDetail = heroDetail;
        this.isLoading = false;
      },
      error: (error: unknown) => {
        this.isLoading = false;
        console.error('Error retrieving super hero detail:', error);
      },
    });
  }
}
