// libraries
import { Box, Button, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

// components
import Editor from "@component/Editor";

export default function PostEdit() {
  const router = useRouter();
  const id = router.query.id;

  const [data, setData] = useState("");
  const [title, setTitle] = useState("");

  const init = useCallback(async () => {
    await fetch(`/api/posts/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`${res.status} 에러가 발생했습니다.`);
        }
        return res.json();
      })
      .then((json) => {
        setTitle(() => json.title);
        setData(() => json.content);
      });
  }, [id]);

  const onClick = async () => {
    if (confirm("저장하시겠습니까?")) {
      await fetch(`/api/posts/${id}`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content: data }),
      }).then(({ status }) => {
        if (status === 200) {
          alert("저장되었습니다.");
          router.push(`/post/${id}`);
        }
      });
    }
  };

  const onChange = (e) => {
    setTitle(() => e.target.value);
  };

  useEffect(() => {
    if (router.isReady) {
      init();
    }
  }, [init, router.isReady]);

  return (
    <>
      <Box sx={{ margin: "10px" }}>
        <TextField
          fullWidth
          id="title"
          label="Title"
          variant="standard"
          value={title}
          onChange={onChange}
        />
      </Box>
      <Editor data={data} setData={setData} />
      <Box sx={{ margin: "10px", display: "block", textAlign: "right" }}>
        <Button variant="contained" onClick={onClick} color="inherit">
          수정
        </Button>
        <Button onClick={() => router.push("/post")} color="inherit">
          취소
        </Button>
      </Box>
    </>
  );
}
