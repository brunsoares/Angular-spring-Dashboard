import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormArray,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../services/courses';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICourse } from '../model/course';
import { ILesson } from '../model/lesson';

@Component({
  selector: 'app-course-form',
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
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
    this.getCourse();
    console.log(this.form.value);
  }

  private createForm(course: ICourse = { _id: '', name: '', category: '', lessons: [] }) {
    this.form = this._formBuilder.group({
      _id: [course._id],
      name: [course.name, [Validators.required, Validators.maxLength(100)]],
      category: [course.category, [Validators.required]],
      lessons: this._formBuilder.array(this.retriveLessons(course), Validators.required),
    });
  }

  private retriveLessons(course: ICourse): Array<FormGroup> {
    const lessons: Array<FormGroup> = [];
    if (course.lessons && course.lessons.length > 0) {
      course.lessons.forEach((lesson) => {
        lessons.push(this.createLessonFormGroup(lesson));
      });
    } else {
      lessons.push(this.createLessonFormGroup());
    }
    return lessons;
  }

  private createLessonFormGroup(
    lesson: ILesson = { _id: '', name: '', youtubeUrl: '' },
  ): FormGroup {
    return this._formBuilder.group({
      _id: [lesson._id],
      name: [lesson.name, [Validators.required, Validators.maxLength(100)]],
      youtubeUrl: [lesson.youtubeUrl, [Validators.required, Validators.maxLength(20)]],
    });
  }

  private getCourse() {
    const course = this._route.snapshot.data['course'] as ICourse;
    this.createForm(course);
  }

  private redirectToList() {
    if (this.form.value._id) {
      this._router.navigate(['../../'], { relativeTo: this._route });
    } else {
      this._router.navigate(['../'], { relativeTo: this._route });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this._coursesService.save(this.form.value).subscribe({
        next: (course) => {
          this._snackBar.open('Curso salvo com sucesso', '', { duration: 3000 });
          this.redirectToList();
        },
        error: (error) => {
          this._snackBar.open('Erro ao salvar curso', 'Ok', {
            duration: 3000,
          });
        },
      });
    } else {
      this.form.markAllAsTouched();
      this._snackBar.open('Formulário inválido. Verifique os campos obrigatórios.', '', {
        duration: 2000,
      });
    }
  }

  onCancel() {
    this.redirectToList();
    this.form.reset();
  }

  getErrorMessage(fieldName: string, isFormArray: boolean): string {
    let field;
    if (isFormArray) {
      const lessonsFormArray = this.form.get('lessons') as UntypedFormArray;
      field = lessonsFormArray.controls
        .find((lesson) => lesson.get(fieldName)?.invalid)
        ?.get(fieldName);
    } else {
      field = this.form.get(fieldName);
    }
    if (field?.hasError('required')) {
      return 'Campo obrigatório';
    }
    if (field?.hasError('maxlength')) {
      const requiredLength = field.getError('maxlength').requiredLength;
      return `O campo deve ter no máximo ${requiredLength} caracteres`;
    }
    return '';
  }

  getLessonsFormArray() {
    return (<UntypedFormArray>this.form.get('lessons')).controls;
  }

  addNewLesson() {
    const lessonsFormArray = this.form.get('lessons') as UntypedFormArray;
    lessonsFormArray.push(this.createLessonFormGroup());
  }

  removeLesson(index: number) {
    const lessonsFormArray = this.form.get('lessons') as UntypedFormArray;
    lessonsFormArray.removeAt(index);
  }
}
