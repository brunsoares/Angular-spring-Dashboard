import { Routes } from '@angular/router';
import { courseResolver } from './courses/course-form/course-resolver';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'courses',
    pathMatch: 'full',
  },
  {
    path: 'courses',
    children: [
      {
        path: '',
        loadComponent: () => import('./courses/courses').then((c) => c.Courses),
      },
      {
        path: 'new',
        loadComponent: () => import('./courses/course-form/course-form').then((c) => c.CourseForm),
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./courses/course-form/course-form').then((c) => c.CourseForm),
        resolve: {
          course: courseResolver,
        },
      },
    ],
  },
];
