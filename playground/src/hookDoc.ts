import type { ComponentType } from 'react';

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

/** Optional catalog labels shown in nav and browse UI (e.g. newly shipped hooks). */
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
  Demo: ComponentType;
  example: string;
}

export type HookEntry = Omit<HookDoc, 'description'>;
