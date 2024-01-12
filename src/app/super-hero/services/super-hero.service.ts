import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Observable, map } from 'rxjs';
import { SuperHero } from '../models/super-hero.model';

export interface PaginationResponse {
  data: SuperHero[];
  totalCount?: number;
  links?: {
    first: string;
    next: string;
    last: string;
  };
}

@Injectable()
export class SuperHeroService {
  private readonly apiUrl = 'http://localhost:3000/api/v1/superheros';

  constructor(private readonly http: HttpClient) {}

  getAllSuperHeroes$(
    page: number,
    limit: number,
    name?: string | null,
    sort?: Sort | null
  ): Observable<PaginationResponse> {
    let params = new HttpParams().set('_page', page.toString()).set('_limit', limit.toString());

    if (name) {
      params = params.set('name_like', name);
    }

    if (sort) {
      const sortField = sort.active;
      const sortDirection = sort.direction;

      if (sortField && sortDirection) {
        params = params.set('_sort', sortField).set('_order', sortDirection);
      }
    }

    return this.http.get<SuperHero[]>(this.apiUrl, { params, observe: 'response' }).pipe(
      map((response: HttpResponse<SuperHero[]>) => {
        const totalCountHeader = response.headers.get('X-Total-Count');
        const totalCount = totalCountHeader ? Number(totalCountHeader) : 0;
        const linksHeader = response.headers.get('Link');
        const links = linksHeader ? this.parseLinkHeader(linksHeader) : {};

        const data = response.body ?? [];

        return {
          data,
          totalCount,
          links,
        } as PaginationResponse;
      })
    );
  }

  getSuperHeroById$(id: number): Observable<SuperHero> {
    const url = `${this.apiUrl}/${id}`;

    return this.http.get<SuperHero>(url);
  }

  createSuperHero$(superHero: SuperHero): Observable<SuperHero> {
    return this.http.post<SuperHero>(this.apiUrl, superHero);
  }

  updateSuperHero$(superHero: SuperHero): Observable<SuperHero> {
    const url = `${this.apiUrl}/${superHero.id}`;

    return this.http.put<SuperHero>(url, superHero);
  }

  deleteSuperHero$(id: number): Observable<SuperHero> {
    const url = `${this.apiUrl}/${id}`;

    return this.http.delete<SuperHero>(url);
  }

  private parseLinkHeader(header: string): Record<string, string> {
    const links: Record<string, string> = {};

    if (header) {
      const linkParts = header.split(',');

      linkParts.forEach((part) => {
        const linkMatch = part.match(/<([^>]+)>;\s*rel="([^"]+)"/);
        if (linkMatch && linkMatch.length === 3) {
          const url = linkMatch[1];
          const rel = linkMatch[2];

          links[rel] = url;
        }
      });
    }

    return links;
  }
}
