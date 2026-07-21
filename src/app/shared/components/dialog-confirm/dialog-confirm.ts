import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-confirm',
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './dialog-confirm.html',
  styleUrl: './dialog-confirm.scss',
})
export class DialogConfirm {
  readonly dialogRef: MatDialogRef<DialogConfirm> = inject(MatDialogRef<DialogConfirm>);
  readonly data: DialogConfirmData = inject<DialogConfirmData>(MAT_DIALOG_DATA);

  onCloseDialog(result: boolean): void {
    this.dialogRef.close(result);
  }
}

export interface DialogConfirmData {
  message: string;
  title: string;
}
