import { inject, Service } from '@angular/core';
import { ICourse } from '../model/course';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

@Service()
export class CoursesService {
  private readonly _httpClient: HttpClient = inject(HttpClient);

  list(): Observable<Array<ICourse>> {
    return of<Array<ICourse>>([
      { _id: '1', name: 'Introduction to Angular', category: 'Frontend' },
      { _id: '2', name: 'Advanced TypeScript', category: 'Programming' },
      { _id: '3', name: 'Spring Boot Fundamentals', category: 'Backend' },
    ]);
  }
}
