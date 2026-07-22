import { ICourse } from './course';

export interface IPageCourse {
  content: Array<ICourse>;
  totalElements: number;
  totalPages: number;
  size: number;
  page: number;
}
