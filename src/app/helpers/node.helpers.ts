import { isFolderNode, Tree } from 'src/app/models/tree-item.model';
import { ICONS } from '../models/icons.const';
import { v4 as uuidv4 } from 'uuid';
import { generate as generateRandomWord } from 'random-words';

export function getRandomIcon() {
  const randomIndex = Math.floor(Math.random() * ICONS.length);

  return ICONS[randomIndex];
}

export function findNode(id: string, tree: Tree[]): Tree | null {
  for (let node of tree) {
    if (node.id === id) {
      return node;
    }

    if (isFolderNode(node)) {
      const foundNode = findNode(id, node.children);

      if (foundNode) {
        return foundNode;
      }
    }
  }

  return null;
}

export function addRandomFoldersIntoTree(
  nodeTree: Tree[],
  parentNodeId: string
): Tree[] {
  return nodeTree.map(node => {
    if (isFolderNode(node)) {
      if (node.id === parentNodeId) {
        const newFolders = Array.from({ length: 50 }, () => {
          return {
            id: uuidv4(),
            name: generateRandomWord(),
            icon: getRandomIcon(),
            type: 'folder',
            children: [],
          };
        });

        return {
          ...node,
          children: [...node.children, ...newFolders],
        };
      }

      return {
        ...node,
        children: addRandomFoldersIntoTree(node.children, parentNodeId),
      };
    }
    return node;
  });
}

export function addRandomFilesIntoTree(
  nodeTree: Tree[],
  parentNodeId: string
): Tree[] {
  return nodeTree.map(node => {
    if (isFolderNode(node)) {
      if (node.id === parentNodeId) {
        const newFiles = Array.from({ length: 50 }, () => {
          return {
            id: uuidv4(),
            name: generateRandomWord(),
            icon: getRandomIcon(),
            type: 'file',
          };
        });

        return {
          ...node,
          children: [...node.children, ...newFiles],
        };
      }

      return {
        ...node,
        children: addRandomFilesIntoTree(node.children, parentNodeId),
      };
    }
    return node;
  });
}

export function editNode(
  nodeTree: Tree[],
  nodeId: string,
  folderName: string,
  icon: string
): Tree[] {
  return nodeTree.map(node => {
    if (node.id === nodeId) {
      return {
        ...node,
        name: folderName,
        icon: icon,
      };
    }

    if (isFolderNode(node)) {
      return {
        ...node,
        children: editNode(node.children, nodeId, folderName, icon),
      };
    }
    return node;
  });
}

export function sortNode(nodes: Tree[]): Tree[] {
  return nodes
    .toSorted((a, b) => {
      if (a.type === 'folder' && b.type === 'folder') {
        return a.name.localeCompare(b.name);
      }

      if (a.type === 'file' && b.type === 'file') {
        return a.name.localeCompare(b.name);
      }

      return a.type === 'folder' ? -1 : 1;
    })
    .map(node => {
      return isFolderNode(node)
        ? { ...node, children: sortNode(node.children) }
        : node;
    });
}

export function isAloneTopLevel(currentTree: Tree[], nodeId: string) {
  return currentTree.length === 1 && currentTree[0].id === nodeId;
}

export function isParentOfChildNode(
  currentTree: Tree[],
  nodeId: string,
  newParentId: string
): boolean {
  const node = findNode(nodeId, currentTree);

  if (!node || !isFolderNode(node)) {
    return false;
  }

  return !!findNode(newParentId, node.children);
}
