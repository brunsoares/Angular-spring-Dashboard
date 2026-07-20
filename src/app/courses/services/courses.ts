import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { first, Observable } from 'rxjs';
import { ICourse } from '../model/course';

@Service()
export class CoursesService {
  private readonly _baseUrl: string = '/api/courses';
  private readonly _httpClient: HttpClient = inject(HttpClient);

  list(): Observable<Array<ICourse>> {
    return this._httpClient.get<Array<ICourse>>(this._baseUrl).pipe(first());
  }

  save(course: ICourse): Observable<ICourse> {
    return this._httpClient.post<ICourse>(this._baseUrl, course);
  }
}
