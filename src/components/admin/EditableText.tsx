import React, { useMemo, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useEditSession } from '@/contexts/EditSessionContext';

type Props = {
  path: string;
  value: string;
  as?: keyof JSX.IntrinsicElements;
  multiline?: boolean;
  className?: string;
};

const EditableText: React.FC<Props> = ({ path, value, as, multiline = false, className }) => {
  const session = useEditSession<Record<string, unknown> | unknown[]>();
  const ref = useRef<
    (HTMLDivElement & HTMLSpanElement & HTMLHeadingElement & HTMLParagraphElement & HTMLQuoteElement) | null
  >(null);

  const isEditing = !!session?.isEditing;

  const baseClasses = useMemo(
    () =>
      cn(
        isEditing &&
          'outline-none ring-1 ring-primary/40 focus:ring-primary/70 rounded-md px-1 -mx-1 cursor-text',
        className
      ),
    [className, isEditing]
  );

  const Tag = (as || (multiline ? 'div' : 'span')) as 'cite' | 'div' | 'h2' | 'h3' | 'h4' | 'p' | 'span';

  return (
    <Tag
      ref={ref}
      className={baseClasses}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        if (!session) return;
        const next = e.currentTarget.innerText;
        if (next !== value) {
          session.updateAtPath(path, next);
        }
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        if (!isEditing) return;
        if (!multiline && e.key === 'Enter') {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
      }}
    >
      {value}
    </Tag>
  );
};

export default EditableText;
