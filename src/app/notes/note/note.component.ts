import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Note } from '../note.model';
import { NotesService } from '../../notes/notes.service';

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

  quillConfig = {};

  constructor(private route: ActivatedRoute, public notesService: NotesService) { 
    this.route.params.subscribe(params => {
      this.id = params['id'];
    }); 
  }  

  ngOnInit() {
    this.notesService
      .getUserNote(this.id)
      .subscribe(note => (this.editorContent = note.content, this.note = note));
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
    this.froalaUpdate(this.editorContent);
    this.contentChanged = false;
  }

  froalaUpdate(html: any) {
    this.notesService.updateContent(this.id, html);
    this.checkSave();
  }

}
