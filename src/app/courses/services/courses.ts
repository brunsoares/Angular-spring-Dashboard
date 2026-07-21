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

  findById(courseId: string): Observable<ICourse> {
    return this._httpClient.get<ICourse>(`${this._baseUrl}/${courseId}`).pipe(first());
  }

  save(course: ICourse): Observable<ICourse> {
    if (course._id) {
      return this.update(course);
    } else {
      return this.create(course);
    }
  }

  delete(courseId: string): Observable<void> {
    return this._httpClient.delete<void>(`${this._baseUrl}/${courseId}`);
  }

  private create(course: ICourse): Observable<ICourse> {
    return this._httpClient.post<ICourse>(this._baseUrl, course);
  }

  private update(course: ICourse): Observable<ICourse> {
    return this._httpClient.put<ICourse>(`${this._baseUrl}/${course._id}`, course);
  }
}
