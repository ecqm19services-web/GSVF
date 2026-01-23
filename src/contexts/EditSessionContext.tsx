import React, { createContext, useCallback, useContext, useMemo } from 'react';

type JsonLike = Record<string, unknown> | unknown[];

export type EditSessionState<TDraft extends JsonLike> = {
  page: string;
  isEditing: boolean;
  draft: TDraft;
  setDraft: (next: TDraft) => void;
  updateAtPath: (path: string, value: unknown) => void;
};

const EditSessionContext = createContext<EditSessionState<any> | null>(null);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function cloneContainer(value: unknown): any {
  if (Array.isArray(value)) return [...value];
  if (isPlainObject(value)) return { ...value };
  return {};
}

function setValueAtPath<TDraft extends JsonLike>(draft: TDraft, path: string, value: unknown): TDraft {
  const parts = path.split('.').filter(Boolean);
  if (parts.length === 0) return draft;

  const root: any = cloneContainer(draft);
  let cursor: any = root;
  let sourceCursor: any = draft;

  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i]!;
    const nextSource = sourceCursor?.[key];
    const next = cloneContainer(nextSource);
    cursor[key] = next;
    cursor = next;
    sourceCursor = nextSource;
  }

  cursor[parts[parts.length - 1]!] = value;
  return root as TDraft;
}

export function useEditSession<TDraft extends JsonLike>() {
  return useContext(EditSessionContext) as EditSessionState<TDraft> | null;
}

export function EditSessionProvider<TDraft extends JsonLike>(props: {
  page: string;
  isEditing?: boolean;
  draft: TDraft;
  setDraft: (next: TDraft) => void;
  children: React.ReactNode;
}) {
  const isEditing = props.isEditing ?? true;

  const updateAtPath = useCallback(
    (path: string, value: unknown) => {
      props.setDraft(setValueAtPath(props.draft, path, value));
    },
    [props]
  );

  const value = useMemo<EditSessionState<TDraft>>(
    () => ({
      page: props.page,
      isEditing,
      draft: props.draft,
      setDraft: props.setDraft,
      updateAtPath,
    }),
    [props.page, isEditing, props.draft, props.setDraft, updateAtPath]
  );

  return <EditSessionContext.Provider value={value}>{props.children}</EditSessionContext.Provider>;
}
