import { AsyncPipe } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, startWith, Subject, switchMap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { DialogConfirm } from '../shared/components/dialog-confirm/dialog-confirm';
import { CategoryPipe } from '../shared/pipes/category-pipe';
import { ICourse } from './model/course';
import { CoursesService } from './services/courses';
import { IPageCourse } from './model/page-course';

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
    MatPaginatorModule,
    CategoryPipe,
    AsyncPipe,
  ],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses {
  pageCourses$: Observable<IPageCourse>;
  pageSize: number = 5;
  pageIndex: number = 0;
  readonly columns: Array<string> = ['name', 'category', 'actions'];

  private readonly _coursesService: CoursesService = inject(CoursesService);
  private readonly _reloadCourses$: Subject<void> = new Subject<void>();
  private readonly _snackBar: MatSnackBar = inject(MatSnackBar);
  private readonly _router: Router = inject(Router);
  private readonly _route: ActivatedRoute = inject(ActivatedRoute);
  private readonly _dialog: MatDialog = inject(MatDialog);

  @ViewChild('paginator', { static: true }) paginator!: MatPaginator;
  constructor() {
    this.pageCourses$ = this._reloadCourses$.pipe(
      startWith(void 0),
      switchMap(() => this.loadCourses()),
    );
  }

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

  onPageChange(page: PageEvent) {
    this.pageIndex = page.pageIndex;
    this.pageSize = page.pageSize;
    this._reloadCourses$.next();
  }

  private loadCourses(): Observable<IPageCourse> {
    return this._coursesService.list(this.pageIndex, this.pageSize).pipe(
      catchError((error) => {
        this._snackBar.open('Ops! Ocorreu um erro ao buscar os cursos.', 'Ok', { duration: 5000 });
        return of({} as IPageCourse);
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
