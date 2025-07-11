// libraries
import DeleteIcon from "@mui/icons-material/Delete";
import ModeIcon from "@mui/icons-material/Mode";
import { Box, Divider, IconButton, Paper, Typography } from "@mui/material";
import moment from "moment";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuth } from "contexts/AuthContext";
// axios
import axios from "api/axios";
import { createServerAxios } from "api/createAxiosSSR";
// components
import AlertDialog from "@component/Component/AlertDialog";

export async function getServerSideProps(context) {
  const axios = createServerAxios(context);
  const { id } = context.params;

  try {
    // post 상세 정보 조회
    const res = await axios.get(`${process.env.API_URL}/api/posts/${id}`);

    return {
      props: {
        post: res.data,
      },
    };
  } catch (error) {
    console.error(error.message);
    return { notFound: true };
  }
}

export default function PostDetail({ post }) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  // post id 값
  const id = router.query.id;
  // alert open 여부
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  return (
    <>
      <Paper elevation={0} sx={{ minHeight: "600px" }}>
        <Box textAlign="center">
          <Typography
            variant="subtitle2"
            onClick={() => router.push("/post")}
            gutterBottom
          >
            {post.categoryName}
          </Typography>
          <Typography variant="h3" gutterBottom>
            {post.title}
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            admin · {moment(post.createdDate).format("YYYY.MM.DD HH:mm")}
          </Typography>
        </Box>
        <Divider sx={{ margin: "20px 0px" }} />
        <div
          style={{ wordBreak: "break-all", overflowWrap: "break-word" }}
          dangerouslySetInnerHTML={{
            __html: post.content,
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
