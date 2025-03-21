// libraries
import DeleteIcon from "@mui/icons-material/Delete";
import ModeIcon from "@mui/icons-material/Mode";
import { Box, Divider, IconButton, Paper, Typography } from "@mui/material";
import moment from "moment";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "contexts/AuthContext";
// axios
import axios from "api/axios";
// components
import AlertDialog from "@component/Component/AlertDialog";

export default function PostDetail() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  // post id 값
  const id = router.query.id;
  // post 상세 정보
  const [data, setData] = useState({
    title: "",
    content: "",
    createdDate: "",
    categoryName: "",
  });
  // alert open 여부
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 초기화 함수, post 상세 정보 조회
  const init = useCallback(async () => {
    const { data } = await axios.get(`/api/posts/${id}`);
    setData({
      title: data.title,
      content: data.content,
      createdDate: moment(data.createdDate).format("YYYY.M.DD HH:mm"),
      categoryName: data.categoryName,
    });
  }, [id]);

  // post 삭제 event
  const handlePostDelete = async () => {
    if (confirm("삭제하시겠습니까?")) {
      try {
        await axios.delete(`/api/posts/${id}`);
        alert("삭제되었습니다.");
        router.push("/post");
      } catch (error) {
        setDialogOpen(true);
        setErrorMessage(error.message);
      }
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
      {isLoggedIn && (
        <Box sx={{ margin: "10px", display: "block", textAlign: "right" }}>
          <IconButton
            onClick={() =>
              router.push({ pathname: "/post/edit", query: { id } })
            }
          >
            <ModeIcon />
          </IconButton>
          <IconButton onClick={handlePostDelete}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )}
      <AlertDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={errorMessage}
      />
    </>
  );
}
