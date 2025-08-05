// libraries
import DeleteIcon from "@mui/icons-material/Delete";
import ModeIcon from "@mui/icons-material/Mode";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuth } from "contexts/AuthContext";
import AttachFileIcon from "@mui/icons-material/AttachFile";
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
    return { notFound: true }; // 게시물이 없을 경우 404 page로 리턴
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

  // 첨부파일 다운로드 event
  const handleAttachmentDownload = async (id) => {
    await axios
      .get(`/api/attachment/download/${id}`, {
        responseType: "blob",
      })
      .then((response) => {
        const disposition = response.headers["content-disposition"];
        const match = disposition.match(/filename\*=UTF-8''(.+)/);
        let fileName = "unknown";

        if (match) {
          // 'filename*=' 일 경우
          fileName = decodeURIComponent(match[1]);
        } else {
          // 'filename=' 일 경우
          const fallbackMatch = disposition.match(/filename="(.+?)"/);
          if (fallbackMatch) fileName = fallbackMatch[1];
        }

        const blob = new Blob([response.data]);

        return { blob, fileName };
      })
      .then(({ blob, fileName }) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("다운로드 실패:", error);
        setDialogOpen(true);
        setErrorMessage("다운로드에 실패하였습니다.");
      });
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
            {post.category.name}
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
      <Box>
        {post.attachments.length > 0 && (
          <List sx={{ mt: 2 }}>
            {post.attachments.map((file, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => handleAttachmentDownload(file.id)}
                  sx={{ pl: 1, "&:hover": { backgroundColor: "#f5f5f5" } }}
                >
                  <ListItemIcon sx={{ minWidth: "32px" }}>
                    <AttachFileIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" noWrap>
                        {file.name}
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: 0.5 }}
                        >
                          · {(file.size / 1024).toFixed(1)} KB
                        </Typography>
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      <AlertDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={errorMessage}
      />
    </>
  );
}
