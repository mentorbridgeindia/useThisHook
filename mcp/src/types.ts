export interface ApiField {
  name: string;
  type: string;
  description: string;
  defaultValue?: string;
  optional?: boolean;
}

export interface HookApi {
  signature: string;
  explanation: string;
  arguments: ApiField[];
  returns: {
    type: string;
    description: string;
    fields?: ApiField[];
  };
  caveats?: string[];
}

export type HookCategory = 'State' | 'Browser' | 'App';

export type HookTag = 'New';

export interface HookDoc {
  id: string;
  name: string;
  summary: string;
  whenToUse: string;
  category: HookCategory;
  tags?: HookTag[];
  description: string;
  api: HookApi;
  example: string;
  playgroundUrl: string;
  import: string;
}

export interface HookCatalogFile {
  hooks: HookDoc[];
}

export interface HookListItem {
  id: string;
  name: string;
  summary: string;
  category: HookCategory;
  tags?: HookTag[];
  whenToUse: string;
  playgroundUrl: string;
}
