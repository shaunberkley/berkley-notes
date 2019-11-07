import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { switchMap, map } from 'rxjs/operators';
import { Note } from './note.model';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) {}

  /**
   * Creates a new note
   */
  async createNote(data: Note) {
    const user = await this.afAuth.auth.currentUser;
    return this.db.collection('notes').add({
      ...data,
      uid: user.uid,
      createdDate: new Date(),
      updatedDate: new Date(),
    });
  }

  /**
   * Updates a note's content
   */
  async updateContent(id, content) {
    console.log(content);
    const user = await this.afAuth.auth.currentUser;
    return this.db.collection('notes')
    .doc<Note>(id).update({
      content: content,
      lastUpdatedUser: user.uid,
      updatedDate: new Date()
    });
  }

  /**
   * Get all notes owned by current user
   */
  getUserNotes() {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db
            .collection<Note>('notes', ref =>
              ref.where('uid', '==', user.uid).orderBy('updatedDate', 'desc')
            )
            .valueChanges({ idField: 'id' });
        } else {
          return [];
        }
      }),
      // map(notes => notes.sort((a, b) => a.priority - b.priority))
    );
  }

  /**
   * Get specific note
   */
  getUserNote(note) {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db
            .collection('notes')
            .doc<Note>(note).valueChanges();
        } else {
          return [];
        }
      }),
      // map(notes => notes.sort((a, b) => a.priority - b.priority))
    );
  }

  /**
   * Run a batch write to change the priority of each Note for sorting
   */
  sortNotes(notes: Note[]) {
    const db = firebase.firestore();
    const batch = db.batch();
    const refs = notes.map(b => db.collection('notes').doc(b.id));
    refs.forEach((ref, idx) => batch.update(ref, { priority: idx }));
    batch.commit();
  }

  /**
   * Delete Note
   */
  deleteNote(noteId: string) {
    return this.db
      .collection('notes')
      .doc(noteId)
      .delete();
  }

  /**
   * Updates the tasks on Note
   */
  // updateTasks(boardId: string, tasks: Task[]) {
  //   return this.db
  //     .collection('notes')
  //     .doc(boardId)
  //     .update({ tasks });
  // }

  /**
   * Remove a specifc task from the Note
   */
  // removeTask(boardId: string, task: Task) {
  //   return this.db
  //     .collection('notes')
  //     .doc(boardId)
  //     .update({
  //       tasks: firebase.firestore.FieldValue.arrayRemove(task)
  //     });
  // }
}