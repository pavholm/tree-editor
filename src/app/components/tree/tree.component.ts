import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { isFolderNode, Tree } from 'src/app/models/tree-item.model';
import { TreeService } from 'src/app/services/tree.service';

@Component({
  selector: 'tree',
  templateUrl: 'tree.component.html',
  styleUrls: ['./tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class TreeComponent {
  @Input() node: Tree;

  isFolderNode = isFolderNode;

  constructor(public treeService: TreeService) {}

  editNode(event: MouseEvent, node: Tree) {
    event.stopPropagation();

    this.treeService.selectForEditing(node);
  }

  selectNode(event: MouseEvent, id: string) {
    event.stopPropagation();

    this.treeService.handleMovingClick(id, event.shiftKey);
  }

  addRandomFiles(event: Event, nodeId: string) {
    event.stopPropagation();
    this.treeService.addRandomFiles(nodeId);
  }

  addRandomFolders(event: Event, nodeId: string) {
    event.stopPropagation();
    this.treeService.addRandomFolders(nodeId);
  }
}
