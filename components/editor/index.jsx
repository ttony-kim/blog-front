// libraries
import Dropcursor from "@tiptap/extension-dropcursor";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
// components
import MenuBar from "./MenuBar";

export default function Editor({ data, setData }) {
  // editor 생성
  const editor = useEditor({
    extensions: [StarterKit, Highlight, TaskList, TaskItem, Image, Dropcursor],
    content: "",
    onUpdate: ({ editor }) => {
      setData(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(data);
    }
  }, [editor, data]);

  return (
    <>
      <div className="editor">
        {editor && <MenuBar editor={editor} />}
        <EditorContent editor={editor} className="editor-content" />
      </div>
    </>
  );
}
