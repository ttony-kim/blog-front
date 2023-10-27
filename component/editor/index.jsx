import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./menuBar";
import css from "styled-jsx/css";

const style = css`
  .editor {
    background-color: #fff;
    border: 3px solid #0d0d0d;
    border-radius: 0.75rem;
    color: #0d0d0d;
    display: flex;
    flex-direction: column;
    max-height: 26rem;
    height: 500px;
  }

  .editor__content {
    flex: 1 1 auto;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 1.25rem 1rem;
    -webkit-overflow-scrolling: touch;
  }
`;

export default function Editor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello World! 🌎️</p>",
  });

  return (
    <div className="editor">
      {editor && <MenuBar editor={editor} />}
      <div className="editor__content">
        <EditorContent editor={editor} />
      </div>
      <style jsx>{style}</style>
    </div>
  );
}
