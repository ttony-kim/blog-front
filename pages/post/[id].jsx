import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import { STATIC_STATUS_PAGES } from "next/dist/shared/lib/constants";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export default function PostDetail() {
  const router = useRouter();
  const id = router.query.id;

  const [data, setData] = useState({ title: "", content: "", createdDate: "" });

  const init = useCallback(async () => {
    await fetch(`/api/posts/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`${res.status} 에러가 발생했습니다.`);
        }
        return res.json();
      })
      .then((json) => {
        setData({
          title: json.title,
          content: json.content,
          createdDate: json.createdDate,
        });
      });
  }, [id]);

  const handleDelete = async () => {
    if (confirm("삭제하시겠습니까?")) {
      await fetch(`/api/posts/${id}`, { method: "delete" }).then(
        ({ status }) => {
          if (status === 200) {
            alert("삭제되었습니다.");
            router.push("/post");
          }
        }
      );
    }
  };

  useEffect(() => {
    if (router.isReady) {
      init();
    }
  }, [init, router.isReady]);

  return (
    <>
      <Paper elevation={0} sx={{ minHeight: "600px" }}>
        <Typography variant="h3">{data.title}</Typography>
        <Typography variant="subtitle2" gutterBottom>
          <b>admin</b> · {data.createdDate}
        </Typography>
        <Divider />
        <div
          dangerouslySetInnerHTML={{
            __html: data.content,
          }}
        />
      </Paper>
      <Box sx={{ margin: "10px", display: "block", textAlign: "right" }}>
        <Button
          variant="contained"
          onClick={() => router.push({ pathname: "/post/edit", query: { id } })}
          color="inherit"
        >
          수정
        </Button>
        <Button variant="contained" onClick={handleDelete} color="inherit">
          삭제
        </Button>
        <Button onClick={() => router.push("/post")} color="inherit">
          목록
        </Button>
      </Box>
    </>
  );
}
