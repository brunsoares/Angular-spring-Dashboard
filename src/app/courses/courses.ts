import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { catchError, of, startWith, Subject, switchMap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { ICourse } from './model/course';
import { CoursesService } from './services/courses';
import { CategoryPipe } from '../shared/pipes/category-pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirm } from '../shared/components/dialog-confirm/dialog-confirm';

@Component({
  selector: 'app-courses',
  imports: [
    MatTableModule,
    MatCardModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    CategoryPipe,
    AsyncPipe,
  ],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses implements OnInit {
  courses$: Observable<Array<ICourse>>;
  readonly columns: Array<string> = ['name', 'category', 'actions'];

  private readonly _coursesService: CoursesService = inject(CoursesService);
  private readonly _reloadCourses$: Subject<void> = new Subject<void>();
  private readonly _snackBar: MatSnackBar = inject(MatSnackBar);
  private readonly _router: Router = inject(Router);
  private readonly _route: ActivatedRoute = inject(ActivatedRoute);
  private readonly _dialog: MatDialog = inject(MatDialog);
  constructor() {
    this.courses$ = this._reloadCourses$.pipe(
      startWith(void 0),
      switchMap(() => this.loadCourses()),
    );
  }

  ngOnInit(): void {}

  onAdd() {
    this._router.navigate(['new'], { relativeTo: this._route });
  }

  onEdit(course: ICourse) {
    this._router.navigate(['edit', course._id], { relativeTo: this._route });
  }

  onDelete(course: ICourse) {
    const dialogRef = this._dialog.open(DialogConfirm, {
      width: '400px',
      data: {
        message: `Tem certeza que deseja excluir o curso ${course.name}? `,
        title: 'Deletar curso?',
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.deleteCourse(course);
      }
    });
  }

  private loadCourses(): Observable<Array<ICourse>> {
    return this._coursesService.list().pipe(
      catchError((error) => {
        this._snackBar.open('Ops! Ocorreu um erro ao buscar os cursos.', 'Ok', { duration: 5000 });
        return of([]);
      }),
    );
  }

  private deleteCourse(course: ICourse) {
    this._coursesService.delete(course._id).subscribe({
      next: () => {
        this._snackBar.open('Curso excluído com sucesso', '', { duration: 3000 });
        this._reloadCourses$.next();
      },
      error: (error) => {
        this._snackBar.open('Erro ao excluir curso', 'Ok', { duration: 3000 });
      },
    });
  }
}
