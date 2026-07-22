import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { first, Observable } from 'rxjs';
import { ICourse } from '../model/course';
import { IPageCourse } from '../model/page-course';

@Service()
export class CoursesService {
  private readonly _baseUrl: string = '/api/courses';
  private readonly _httpClient: HttpClient = inject(HttpClient);

  list(page: number, size: number): Observable<IPageCourse> {
    return this._httpClient
      .get<IPageCourse>(`${this._baseUrl}?page=${page}&size=${size}`)
      .pipe(first());
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
