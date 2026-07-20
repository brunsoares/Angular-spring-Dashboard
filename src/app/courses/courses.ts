import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { catchError, of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { ICourse } from './model/course';
import { CoursesService } from './services/courses';
import { CategoryPipe } from '../shared/pipes/category-pipe';

@Component({
  selector: 'app-courses',
  imports: [
    MatTableModule,
    MatCardModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
    CategoryPipe,
    AsyncPipe,
  ],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses implements OnInit {
  courses$: Observable<Array<ICourse>>;
  columns: Array<string> = ['name', 'category'];

  private readonly _coursesService: CoursesService = inject(CoursesService);
  private readonly _snackBar: MatSnackBar = inject(MatSnackBar);
  constructor() {
    this.courses$ = this._coursesService.list().pipe(
      catchError((error) => {
        this._snackBar.open('Ops! Ocorreu um erro ao buscar os cursos.', 'Ok', { duration: 5000 });
        return of([]);
      }),
    );
  }

  ngOnInit(): void {}
}
