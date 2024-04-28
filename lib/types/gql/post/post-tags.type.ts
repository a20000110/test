export interface GqlPostTagsInterface {
  tags: Tags;
}

interface Tags {
  nodes: GqlPostTagsNodeInterface[];
}

export interface GqlPostTagsNodeInterface {
  id: string;
  name: string;
  slug: string;
}
