import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Note } from '../note.model';
import { NotesService } from '../../notes/notes.service';
import { SnackService } from '../../services/snack.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NoteComponent implements OnInit {

  id: string;
  note: Note;
  options: Object;  
  editorContent: string;
  liveMode: boolean = false;
  contentChanged: boolean = false;
  updatedDate: any;
  quillConfig = {};
  public: boolean;

  constructor(private router: Router, private route: ActivatedRoute, public notesService: NotesService, public snackService: SnackService, public afAuth: AngularFireAuth) { 
    
  }  

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.notesService
      .getUserNote(this.id)
      .subscribe(note => (
        this.editorContent = note.content, 
        this.note = note, 
        console.log(note), 
        this.updatedDate = note.updatedDate.seconds * 1000, 
        this.public = note.public)
        );
    });     
  }

  debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  onContentChanged () {
    if (this.liveMode) {
      // this.debounce(function() {
      //   this.froalaUpdate(this.editorContent)
      // }, 250);       
      this.froalaUpdate(this.editorContent);
    } else {
      console.log('Live mode is not on. Content has not been saved.');
      this.checkSave();
    }
  }  

  checkSave() {
    if (this.editorContent != this.note.content) {
      this.contentChanged = true;
    } else {
      this.contentChanged = false;
    }
  }

  saveContent() {
    console.log(this.editorContent);
    this.froalaUpdate(this.editorContent);
    this.contentChanged = false;
    this.snackService.savedNote();
  }

  froalaUpdate(html: any) {
    console.log(this.id);
    this.notesService.updateContent(this.id, html);
    this.checkSave();
  }

  deleteNote() {
    const answer = window.confirm("Delete note?")
    if (answer) {
        //some code
        console.log(this.id);
        this.notesService.deleteNote(this.id)
        this.router.navigateByUrl('/');
    }
    else {
        //some code
    }
  }

  togglePrivacy(publicValue) {
    this.notesService.updateNote(this.id, {public: !publicValue});
  }

}
