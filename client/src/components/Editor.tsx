import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Heading from '@tiptap/extension-heading';
import Placeholder from '@tiptap/extension-placeholder';
import clsx from 'clsx';
import { useEffect } from 'react';
import type { DocumentContent } from '../types';

type Props = {
  content: DocumentContent;
  onChange: (content: DocumentContent) => void;
  onRemoteContent?: DocumentContent | null;
};

export function Editor({ content, onChange, onRemoteContent }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      Underline,
      Heading.configure({ levels: [1, 2, 3] }),
      Placeholder.configure({ placeholder: 'Start writing your document...' })
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'prose prose-slate min-h-[70vh] max-w-none rounded-3xl bg-white p-6 shadow-soft focus:outline-none sm:p-10'
      }
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getJSON() as DocumentContent);
    }
  });

  useEffect(() => {
  if (!editor || !content) return;

  const current = editor.getJSON();

  if (JSON.stringify(current) !== JSON.stringify(content)) {
    editor.commands.setContent(content, false);
  }
}, [editor, content]);

  if (!editor) {
    return <div className="rounded-3xl bg-white p-10 shadow-soft">Loading editor...</div>;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} label="Bold" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} label="Italic" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} label="Underline" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} label="H1" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} label="H2" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} label="Bullet List" />
      </div>
      <EditorContent editor={editor} />
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <div className="rounded-xl bg-slate-900 px-3 py-2 text-xs text-white">Formatting</div>
      </BubbleMenu>
    </div>
  );
}

function ToolbarButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'rounded-xl px-3 py-2 text-sm font-medium transition',
        active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      )}
    >
      {label}
    </button>
  );
}