import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../services/courses';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-course-form',
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
  ],
  templateUrl: './course-form.html',
  styleUrl: './course-form.scss',
})
export class CourseForm {
  form: FormGroup = new FormGroup({});
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _coursesService = inject(CoursesService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _snackBar = inject(MatSnackBar);

  constructor() {
    this.createForm();
  }

  private createForm() {
    this.form = this._formBuilder.group({
      name: [''],
      category: [''],
    });
  }

  onSubmit() {
    this._coursesService.save(this.form.value).subscribe({
      next: (course) => {
        this._snackBar.open('Curso salvo com sucesso', '', { duration: 3000 });
        this._router.navigate(['../'], { relativeTo: this._route });
      },
      error: (error) => {
        this._snackBar.open('Erro ao salvar curso', 'Ok', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      },
    });
  }

  onCancel() {
    this.form.reset();
    this._router.navigate(['../'], { relativeTo: this._route });
  }
}
