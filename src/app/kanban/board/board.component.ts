import { Component, OnInit, Input } from '@angular/core';
import { BoardService } from '../board.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  @Input() board;
  constructor(private boardService: BoardService) { }

  ngOnInit(): void {
  }

  taskDrop(event: CdkDragDrop<string[]>): any {
    moveItemInArray(this.board.tasks, event.previousIndex, event.currentIndex);
    this.boardService.updateTasks(this.board.id, this.board.tasks);
  }


}
