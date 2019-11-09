import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from '../../services/header.service';
import { AngularFireAuth } from '@angular/fire/auth';

import { Note } from '../../notes/note.model';
import { NotesService } from '../../notes/notes.service';
import { NewNoteDialogComponent } from '../../elements/new-note-dialog/new-note-dialog.component';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  notes: Note[];

  constructor(public hs: HeaderService, public notesService: NotesService, public router: Router, public afAuth: AngularFireAuth, public dialog: MatDialog) {
    const _this = this;

    router.events.subscribe((val) => {
      _this.hs.closeMenu();
    });
  }

  ngOnInit() {
    this.notesService
      .getUserNotes()
      .subscribe(notes => (this.notes = notes));
  }

  newNote(): void {
    this.dialog.open(NewNoteDialogComponent, {
      width: '250px'
    });
  }

}
