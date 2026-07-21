import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ICourse } from '../model/course';
import { CoursesService } from '../services/courses';

export const courseResolver: ResolveFn<ICourse> = (route, state): Observable<ICourse> => {
  const courseId = route.paramMap.get('id');
  if (courseId) {
    return inject(CoursesService).findById(courseId);
  }
  return of({ _id: '', name: '', category: '', lessons: [] } as ICourse);
};
