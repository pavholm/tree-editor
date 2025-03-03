import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isFolderNode, Tree } from 'src/app/models/tree-item.model';
import { v4 as uuidv4 } from 'uuid';
import {
  addRandomFilesIntoTree,
  addRandomFoldersIntoTree,
  editNode,
  findNode,
  getRandomIcon,
  isAloneTopLevel,
  isParentOfChildNode,
  sortNode,
} from '../helpers/node.helpers';

const ROOT_TREE: Tree[] = [
  {
    id: uuidv4(),
    name: 'Root',
    type: 'folder',
    icon: getRandomIcon(),
    children: [],
  },
];

@Injectable({ providedIn: 'root' })
export class TreeService {
  private tree = new BehaviorSubject<Tree[]>(ROOT_TREE);
  tree$ = this.tree.asObservable();

  private selectedForEditingNode = new BehaviorSubject<Tree | null>(null);
  selectedForEditingNode$ = this.selectedForEditingNode.asObservable();

  constructor() {}

  selectForEditing(node: Tree) {
    this.selectedForEditingNode.next(node);
  }

  addRandomFolders(parentNodeId: string) {
    const currentTree = this.tree.getValue();
    const updatedTree = addRandomFoldersIntoTree(currentTree, parentNodeId);

    this.tree.next(sortNode(updatedTree));
  }

  addRandomFiles(parentNodeId: string) {
    const currentTree = this.tree.getValue();
    const updatedTree = addRandomFilesIntoTree(currentTree, parentNodeId);

    this.tree.next(sortNode(updatedTree));
  }

  editNode(nodeId: string, name: string, icon: string) {
    const currentTree = this.tree.getValue();
    const updatedTree = editNode(currentTree, nodeId, name, icon);

    this.tree.next(sortNode(updatedTree));
  }

  findNodeById(id: string): Tree | null {
    return findNode(id, this.tree.getValue());
  }

  removeNodeById(id: string) {
    function remove(id: string, tree: Tree[]): Tree[] {
      return tree
        .filter(node => node.id !== id)
        .map(node =>
          isFolderNode(node)
            ? { ...node, children: remove(id, node.children) }
            : node
        );
    }

    return remove(id, this.tree.getValue());
  }

  moveNode(nodeId: string, newParentId: string) {
    const currentTree = this.tree.getValue();
    const nodeToMove = this.findNodeById(nodeId);
    const updatedTree = this.removeNodeById(nodeId);
    const newParentNode = this.findNodeById(newParentId);

    if (isParentOfChildNode(currentTree, nodeId, newParentId)) {
      alert('Cannot move folder into own child');
      return;
    }

    if (isAloneTopLevel(currentTree, nodeId)) {
      alert('Last root folder');
      return;
    }

    if (!newParentNode || !isFolderNode(newParentNode)) {
      return;
    }

    function addNodeToParent(tree: Tree[]): Tree[] {
      return tree.map(node => {
        if (node.id === newParentId && isFolderNode(node)) {
          return { ...node, children: [...node.children, nodeToMove] };
        }

        return isFolderNode(node)
          ? { ...node, children: addNodeToParent(node.children) }
          : node;
      });
    }

    const tree = sortNode(addNodeToParent(updatedTree));
    this.tree.next(tree);
  }

  copyNode(nodeId: string, newParentId: string) {
    const nodeToCopy = this.findNodeById(nodeId);

    if (!nodeToCopy) {
      return;
    }

    function deepCopyWithNewIds(node: Tree): Tree {
      return {
        ...node,
        id: uuidv4(),
        children: isFolderNode(node)
          ? node.children.map(child => deepCopyWithNewIds(child))
          : [],
      };
    }

    const copiedNode = deepCopyWithNewIds(nodeToCopy);

    const newParentNode = this.findNodeById(newParentId);
    if (!newParentNode || !isFolderNode(newParentNode)) {
      return;
    }

    function addNodeToParent(tree: Tree[]): Tree[] {
      return tree.map(node => {
        if (node.id === newParentId && isFolderNode(node)) {
          return { ...node, children: [...node.children, copiedNode] };
        }

        return isFolderNode(node)
          ? { ...node, children: addNodeToParent(node.children) }
          : node;
      });
    }

    const tree = sortNode(addNodeToParent(this.tree.getValue()));
    return this.tree.next(tree);
  }
}
