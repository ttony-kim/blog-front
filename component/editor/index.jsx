import Dropcursor from "@tiptap/extension-dropcursor";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./menuBar";

export default function Editor() {
  const editor = useEditor({
    extensions: [StarterKit, Highlight, TaskList, TaskItem, Image, Dropcursor],
    content: `<p>Hello World! 🌎️</p>`,
  });

  return (
    <>
      <div className="editor">
        {editor && <MenuBar editor={editor} />}
        <EditorContent editor={editor} className="editor-content" />
      </div>
    </>
  );
}
