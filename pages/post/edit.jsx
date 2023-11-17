import { Box, Button, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import Editor from "../../component/editor";

export default function PostEdit() {
  const [data, setData] = useState();
  const [title, setTitle] = useState("");

  const router = useRouter();

  const onClick = async () => {
    if (confirm("저장하시겠습니까?")) {
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content: data }),
      }).then(({ status }) => {
        if (status === 200) {
          alert("저장되었습니다.");
          router.push("/post");
        }
      });
    }
  };

  const onChange = (e) => {
    setTitle(e.target.value);
  };

  return (
    <>
      <Box sx={{ margin: "10px" }}>
        <TextField
          fullWidth
          id="title"
          label="Title"
          variant="standard"
          onChange={onChange}
        />
      </Box>
      <Editor setData={setData} />
      <Box sx={{ margin: "10px", display: "block", textAlign: "right" }}>
        <Button variant="contained" onClick={onClick} color="inherit">
          저장
        </Button>
        <Button onClick={() => router.push("/post")} color="inherit">
          취소
        </Button>
      </Box>
    </>
  );
}
