import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { isFolderNode, Tree } from 'src/app/models/tree-item.model';
import { TreeService } from 'src/app/services/tree.service';
import { BehaviorSubject } from 'rxjs';

const DRAG_DATA_KEY = 'nodeId';

@Component({
  selector: 'tree',
  templateUrl: 'tree.component.html',
  styleUrls: ['./tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class TreeComponent implements AfterViewInit {
  @Input() node: Tree;

  @ViewChild('nodeRef') nodeRef: ElementRef<HTMLElement>;

  isDraggingOverNode$ = new BehaviorSubject<boolean>(false);

  isFolderNode = isFolderNode;

  constructor(public treeService: TreeService) {}

  ngAfterViewInit() {
    this.markAllNodeChildrenAsDraggable();
  }

  editNode(event: MouseEvent, node: Tree) {
    event.stopPropagation();

    this.treeService.selectForEditing(node);
  }

  addRandomFiles(event: Event, nodeId: string) {
    event.stopPropagation();
    this.treeService.addRandomFiles(nodeId);
  }

  addRandomFolders(event: Event, nodeId: string) {
    event.stopPropagation();
    this.treeService.addRandomFolders(nodeId);
  }

  onDragStart(event: DragEvent, node: Tree) {
    event.stopPropagation();

    if (!event.dataTransfer) {
      return;
    }

    const nodeTitleClass = isFolderNode(node) ? '.folder-title' : '.file-title';
    const previewElement =
      this.nodeRef.nativeElement.querySelector(nodeTitleClass);

    if (previewElement) {
      event.dataTransfer.setDragImage(previewElement, 0, 0);
    }

    event.dataTransfer.effectAllowed = event.shiftKey ? 'copy' : 'move';
    event.dataTransfer.setData(DRAG_DATA_KEY, node.id);
  }

  onDragOver(event: DragEvent, node: Tree) {
    event.preventDefault();
    event.stopPropagation();

    if (!event.dataTransfer) {
      return;
    }

    event.dataTransfer.dropEffect = event.shiftKey ? 'copy' : 'move';

    if (isFolderNode(node)) {
      this.isDraggingOverNode$.next(node.id === this.node.id);
    }
  }

  onDragLeave(node: Tree) {
    this.isDraggingOverNode$.next(node.id !== this.node.id);
  }

  onDrop(event: DragEvent, node: Tree) {
    event.stopPropagation();

    if (!event.dataTransfer) {
      return;
    }

    const targetNodeId = event.dataTransfer.getData(DRAG_DATA_KEY);

    if (event.shiftKey) {
      this.treeService.copyNode(targetNodeId, node.id);
    } else {
      this.treeService.moveNode(targetNodeId, node.id);
    }

    event.dataTransfer.clearData(DRAG_DATA_KEY);
    this.isDraggingOverNode$.next(false);
  }

  private markAllNodeChildrenAsDraggable() {
    this.nodeRef.nativeElement.querySelectorAll('*').forEach(child => {
      child.setAttribute('draggable', 'true');
    });
  }
}
