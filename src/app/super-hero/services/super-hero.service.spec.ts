/* eslint-disable max-len */
import { HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Sort, SortDirection } from '@angular/material/sort';
import { PaginationResponse, SuperHeroService } from './super-hero.service';

describe('SuperHeroService', () => {
  let service: SuperHeroService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SuperHeroService],
    });
    service = TestBed.inject(SuperHeroService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create a new super hero', () => {
    const mockSuperHero = { id: 1, name: 'Superman', image: '', description: '' };

    service.createSuperHero$(mockSuperHero).subscribe((response) => {
      expect(response).toEqual(mockSuperHero);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/v1/superheros');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockSuperHero);
    req.flush(mockSuperHero);
  });

  it('should update an existing super hero', () => {
    const mockSuperHero = { id: 1, name: 'Superman', image: '', description: '' };

    service.updateSuperHero$(mockSuperHero).subscribe((response) => {
      expect(response).toEqual(mockSuperHero);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/v1/superheros/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockSuperHero);
    req.flush(mockSuperHero);
  });

  it('should delete a super hero by ID', () => {
    const mockSuperHero = { id: 1, name: 'Superman', image: '', description: '' };

    service.deleteSuperHero$(1).subscribe((response) => {
      expect(response).toEqual(mockSuperHero);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/v1/superheros/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(mockSuperHero);
  });

  it('should retrieve all super heroes with name filter and sorting', () => {
    const mockResponse: PaginationResponse = {
      data: [
        { id: 1, name: 'Superman', image: '', description: '' },
        { id: 2, name: 'Spider-Man', image: '', description: '' },
      ],
      totalCount: 2,
      links: {
        first: 'http://localhost:3000/api/v1/superheros?_page=1&_limit=10',
        next: 'http://localhost:3000/api/v1/superheros?_page=2&_limit=10',
        last: 'http://localhost:3000/api/v1/superheros?_page=3&_limit=10',
      },
    };

    const mockSort: Sort = { active: 'name', direction: 'asc' as SortDirection };

    service.getAllSuperHeroes$(1, 10, 'Super', mockSort).subscribe((response) => {
      expect(response.data).toEqual(mockResponse.data);
      expect(response.totalCount).toEqual(mockResponse.totalCount);
      expect(response.links).toEqual(mockResponse.links);
    });

    const req = httpMock.expectOne({
      method: 'GET',
      url: 'http://localhost:3000/api/v1/superheros?_page=1&_limit=10&name_like=Super&_sort=name&_order=asc',
    });
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse.data, {
      headers: new HttpHeaders({
        'X-Total-Count': '2',
        Link: '<http://localhost:3000/api/v1/superheros?_page=1&_limit=10>; rel="first", <http://localhost:3000/api/v1/superheros?_page=2&_limit=10>; rel="next", <http://localhost:3000/api/v1/superheros?_page=3&_limit=10>; rel="last"',
      }),
    });
  });
});
