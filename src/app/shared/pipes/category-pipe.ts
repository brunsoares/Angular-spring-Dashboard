import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'category',
})
export class CategoryPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'Frontend':
        return 'code';
      case 'Backend':
        return 'terminal_2';
      case 'Programming':
        return 'computer';
      default:
        return value;
    }
  }
}
