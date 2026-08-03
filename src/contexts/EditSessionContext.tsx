import React, { createContext, useCallback, useContext, useMemo, useRef } from 'react';

type JsonLike = Record<string, unknown> | unknown[];

export type EditSessionState<TDraft extends JsonLike> = {
  page: string;
  isEditing: boolean;
  draft: TDraft;
  setDraft: (next: TDraft) => void;
  updateAtPath: (path: string, value: unknown) => void;
};

const EditSessionContext = createContext<EditSessionState<JsonLike> | null>(null);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function cloneContainer<T>(value: T): T {
  if (Array.isArray(value)) return [...value] as T;
  if (isPlainObject(value)) return { ...value } as T;
  return {} as T;
}

function setValueAtPath<TDraft extends JsonLike>(draft: TDraft, path: string, value: unknown): TDraft {
  const parts = path.split('.').filter(Boolean);
  if (parts.length === 0) return draft;

  const root = cloneContainer(draft);
  let cursor: Record<string, unknown> = root as Record<string, unknown>;
  let sourceCursor: unknown = draft;

  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i]!;
    const nextSource: unknown = (sourceCursor as Record<string, unknown> | undefined)?.[key];
    const next: unknown = cloneContainer(nextSource);
    cursor[key] = next;
    cursor = next as Record<string, unknown>;
    sourceCursor = nextSource;
  }

  cursor[parts[parts.length - 1]!] = value;
  return root;
}

export function useEditSession<TDraft extends JsonLike>() {
  return useContext(EditSessionContext) as unknown as EditSessionState<TDraft> | null;
}

export function EditSessionProvider<TDraft extends JsonLike>(props: {
  page: string;
  isEditing?: boolean;
  draft: TDraft;
  setDraft: (next: TDraft) => void;
  children: React.ReactNode;
}) {
  const { draft, setDraft, page, isEditing: isEditingProp, children } = props;
  const isEditing = isEditingProp ?? true;

  // Keep a live reference to the latest committed draft so that several
  // successive `updateAtPath` calls issued within the same synchronous block
  // (e.g. the Hero uploader which sets backgroundImage then clears
  // backgroundColor) compose against the latest draft instead of a stale
  // closure of `draft`, which used to make the second call overwrite
  // the first one.
  const draftRef = useRef<TDraft>(draft);
  draftRef.current = draft;

  const updateAtPath = useCallback(
    (path: string, value: unknown) => {
      const next = setValueAtPath(draftRef.current, path, value);
      // Keep the ref in sync synchronously so subsequent calls in the same
      // tick build on top of this update rather than on the stale draft.
      draftRef.current = next;
      setDraft(next);
    },
    [setDraft]
  );

  const value = useMemo<EditSessionState<TDraft>>(
    () => ({
      page,
      isEditing,
      draft,
      setDraft,
      updateAtPath,
    }),
    [page, isEditing, draft, setDraft, updateAtPath]
  );

  return <EditSessionContext.Provider value={value}>{children}</EditSessionContext.Provider>;
}
