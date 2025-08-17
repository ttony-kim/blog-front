// libraries
import {
  Box,
  Button,
  TextField,
  FormControl,
  MenuItem,
  FormHelperText,
  Select,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
// components
import Editor from "@component/Editor";
import AlertDialog from "@component/Component/AlertDialog";
import FileUploader from "@component/Component/FileUploader";
// common code data
import { codeData as code } from "data/codeData";
// axios
import axios from "api/axios";
import { createServerAxios } from "api/createAxiosSSR";

export async function getServerSideProps(context) {
  const axios = createServerAxios(context);
  const { id } = context.query;

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
    return { notFound: true }; // 게시물이 없을 경우 404 page
  }
}

export default function PostEdit({ post }) {
  const router = useRouter();
  const id = router.query.id;

  // 카테고리 목록
  const [categories, setCategories] = useState([
    { id: code.none.value, name: code.none.text },
  ]);
  // post content, title
  const [data, setData] = useState(post.content);
  const [title, setTitle] = useState(post.title);
  // 새로운 첨부파일 list
  const [newAttachFiles, setNewAttachFiles] = useState([]);
  // 삭제된 첨부파일 Id list
  const [deletdeFileIds, setDeletedFileIds] = useState([]);
  // 선택된 카테고리 정보
  const [categoryId, setCategoryId] = useState(-1);
  // error 메세지
  const [titleError, setTitleError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  // alert open 여부
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 카테고리 목록 조회
  const getCategoryList = async () => {
    const { data } = await axios.get("/api/categories");
    const updated = [{ id: code.none.value, name: code.none.text }, ...data];
    setCategories(updated);

    const found = updated.find((c) => c.id === post.category.id);
    if (found) {
      setCategoryId(post.category.id);
    }
  };

  // post 저장 event
  const handleSaveButton = async () => {
    // validation check
    if (!validate()) {
      return false;
    }

    if (confirm("저장하시겠습니까?")) {
      try {
        const formData = new FormData();

        formData.append("title", title);
        formData.append("content", data);
        formData.append("categoryId", categoryId);
        formData.append("deletedFileIds", deletdeFileIds);

        for (const file of newAttachFiles) {
          formData.append("files", file);
        }

        await axios.put(`/api/posts/${id}`, formData);

        alert("저장되었습니다.");
        router.push(`/post/${id}`);
      } catch (error) {
        setDialogOpen(true);
        setErrorMessage(error.message);
      }
    }
  };

  // validation check
  const validate = () => {
    let returnValue = true;
    // title 유효성 검사
    if (!!!title?.trim()) {
      setTitleError("Title을 입력하세요.");
      returnValue = false;
    } else {
      setTitleError("");
    }

    // 카테고리 유효성 검사
    if (categoryId === code.none.value || !!!categoryId) {
      setCategoryError("카테고리를 선택하세요.");
      returnValue = false;
    } else {
      setCategoryError("");
    }

    return returnValue;
  };

  // 카테고리 select 선택 시 change event
  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;

    setCategoryId(categoryId);
  };

  // 타이틀 입력 시 change event
  const handleTitleChange = (e) => {
    setTitle(() => e.target.value);
  };

  useEffect(() => {
    if (router.isReady) {
      getCategoryList();
    }
  }, [router.isReady]);

  return (
    <>
      <Box sx={{ minWidth: 120 }}>
        <FormControl
          size="small"
          sx={{ minWidth: 200 }}
          error={!!categoryError}
        >
          <Select
            id="categroy"
            value={categoryId}
            onChange={handleCategoryChange}
          >
            {categories &&
              categories.map((item) => {
                return (
                  <MenuItem
                    key={item.id}
                    value={item.id}
                    sx={{ fontSize: "small" }}
                  >
                    {item.name}
                  </MenuItem>
                );
              })}
          </Select>
          <FormHelperText>{categoryError}</FormHelperText>
        </FormControl>
      </Box>
      <Box m="10px">
        <TextField
          fullWidth
          id="title"
          variant="standard"
          value={title}
          onChange={handleTitleChange}
          placeholder="Title"
          error={titleError !== "" || false}
          helperText={titleError}
        />
      </Box>
      <Editor data={data} setData={setData} />
      <Box>
        <FileUploader
          initialFiles={post.attachments}
          onFilesChange={setNewAttachFiles}
          onDeletedIdsChange={setDeletedFileIds}
        />
      </Box>
      <Box sx={{ margin: "10px", display: "block", textAlign: "right" }}>
        <Button variant="contained" onClick={handleSaveButton} color="inherit">
          수정
        </Button>
        <Button onClick={() => router.push("/post")} color="inherit">
          취소
        </Button>
      </Box>
      <AlertDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={errorMessage}
      />
    </>
  );
}
