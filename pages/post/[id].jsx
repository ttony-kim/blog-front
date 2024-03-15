// libraries
import DeleteIcon from "@mui/icons-material/Delete";
import ModeIcon from "@mui/icons-material/Mode";
import { Box, Divider, IconButton, Paper, Typography } from "@mui/material";
import moment from "moment";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export default function PostDetail() {
  const router = useRouter();
  // post id 값
  const id = router.query.id;
  // post 상세 정보
  const [data, setData] = useState({
    title: "",
    content: "",
    createdDate: "",
    categoryName: "",
  });

  // 초기화 함수, post 상세 정보 조회
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
          createdDate: moment(json.createdDate).format("YYYY.M.DD HH:mm"),
          categoryName: json.categoryName,
        });
      });
  }, [id]);

  // post 삭제 event
  const handlePostDelete = async () => {
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

  const test = () => {
    console.log("test");
  };

  useEffect(() => {
    if (router.isReady) {
      init();
    }
  }, [init, router.isReady]);

  return (
    <>
      <Paper elevation={0} sx={{ minHeight: "600px" }}>
        <Box textAlign="center">
          <Typography
            variant="subtitle2"
            onClick={() => router.push("/post")}
            gutterBottom
          >
            {data.categoryName}
          </Typography>
          <Typography variant="h3" gutterBottom>
            {data.title}
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            admin · {data.createdDate}
          </Typography>
        </Box>
        <Divider sx={{ margin: "20px 0px" }} />
        <div
          style={{ wordBreak: "break-all", overflowWrap: "break-word" }}
          dangerouslySetInnerHTML={{
            __html: data.content,
          }}
        />
      </Paper>
      <Box sx={{ margin: "10px", display: "block", textAlign: "right" }}>
        <IconButton
          onClick={() => router.push({ pathname: "/post/edit", query: { id } })}
        >
          <ModeIcon />
        </IconButton>
        <IconButton onClick={handlePostDelete}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </>
  );
}
