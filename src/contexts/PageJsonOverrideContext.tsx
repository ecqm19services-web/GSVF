import React, { createContext, useContext, useMemo } from 'react';

type OverridesMap = Record<string, unknown>;

const PageJsonOverrideContext = createContext<OverridesMap | null>(null);

export function PageJsonOverrideProvider(props: {
  overrides: OverridesMap;
  children: React.ReactNode;
}) {
  const value = useMemo(() => props.overrides, [props.overrides]);
  return <PageJsonOverrideContext.Provider value={value}>{props.children}</PageJsonOverrideContext.Provider>;
}

export function usePageJsonOverride<T>(page: string): T | null {
  const overrides = useContext(PageJsonOverrideContext);
  if (!overrides) return null;
  const value = overrides[page];
  return (value as T) ?? null;
}
