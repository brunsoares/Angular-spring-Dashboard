import { Routes } from '@angular/router';

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
    ],
  },
];
