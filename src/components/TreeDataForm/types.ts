export interface TreeNode {
  id: string;
  name: string;
  value1: string;
  value2: string;
  value3: string;
  value4: string;
  value5: string;
  value6: string;
  value7: string;
  value8: string;
  value9: string;
  value10: string;
  status?: 'approved' | 'pending' | 'successed' | 'Failed';
  children?: TreeNode[];
}

export interface TreeDataFormProps {
  data: TreeNode[];
}

