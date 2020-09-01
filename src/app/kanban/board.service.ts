import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Board, Task } from './board.model';
import { switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) { }

  // create user board
  async createBoard(data: Board): Promise<any> {
    const user = await this.afAuth.currentUser;
    return this.db.collection('boards').add({
      ...data,
      uid: user.uid,
      tasks: [{ description: 'Hello', label: 'yellow' }]
    });
  }


  /**
   * Delete board
   */
  deleteBoard(boardIb: string): any {
    return this.db.collection('boards')
      .doc(boardIb)
      .delete();
  }


  /**
   * Update Task on board
   */
  updateTasks(boardId: string, tasks: Task[]): any {
    return this.db.collection('boards')
      .doc(boardId)
      .update({ tasks });
  }

  /**
   * remove a task
   */
  removeTask(boardId: string, task: Task): any {
    return this.db
      .collection('boards')
      .doc(boardId)
      .update({
        task: firebase.firestore.FieldValue.arrayRemove(task)
      });
  }

  /**
   * Get all boards owned by current user
   */
  getUserBoards(): any {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db
            .collection<Board>('boards', ref =>
              ref.where('uid', '==', user.uid).orderBy('priority')
            )
            .valueChanges({ idField: 'id' });
        } else {
          return [];
        }
      })
    );
  }

  /**
   * Run a batch write to change the priority of each board for sorting
   */
  sortBoards(boards: Board[]): any {
    const db = firebase.firestore();
    const batch = db.batch();
    const refs = boards.map(b => db.collection('boards').doc(b.id));
    refs.forEach((ref, idx) => batch.update(ref, { priority: idx }));
    batch.commit();
  }

}
