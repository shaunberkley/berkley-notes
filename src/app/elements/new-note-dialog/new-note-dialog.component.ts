import { Component, OnInit } from '@angular/core';
import { NotesService } from '../../notes/notes.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new-note-dialog',
  templateUrl: './new-note-dialog.component.html',
  styleUrls: ['./new-note-dialog.component.scss']
})
export class NewNoteDialogComponent implements OnInit {

  constructor(public notesService: NotesService, public dialogRef: MatDialogRef<NewNoteDialogComponent>, public router: Router) { }

  ngOnInit() {
  }

  createNote(title) {
    this.notesService.createNote({title: title}).then(e => {this.router.navigateByUrl('/note/' + e.id)});
    this.dialogRef.close();
  }

}
