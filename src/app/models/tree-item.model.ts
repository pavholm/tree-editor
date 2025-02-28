export type NodeType = 'file' | 'folder';

export type File = {
  id: string;
  name: string;
  type: NodeType;
  icon: string;
};

export type Folder = {
  id: string;
  name: string;
  type: NodeType;
  icon: string;
  children: Tree[];
};

export type Tree = File | Folder;

export function isFolderNode(node: File | Folder): node is Folder {
  return node.type === 'folder';
}
