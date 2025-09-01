// libraries
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
// components
import Editor from "@component/Editor";
import AlertDialog from "@component/Component/AlertDialog";
import FileUploader from "@component/Component/FileUploader";
import ConfirmDialog from "@component/Component/ConfirmDialog";
// common code data
import { codeData as code } from "data/codeData";
// axios
import axios from "api/axios";

export default function PostRegister() {
  const router = useRouter();

  // 카테고리 목록
  const [categories, setCategories] = useState([
    { id: code.none.value, name: code.none.text },
  ]);
  // post content, title
  const [data, setData] = useState();
  const [title, setTitle] = useState("");
  // 첨부파일 list
  const [attachFiles, setAttachFiles] = useState([]);
  // 선택된 카테고리 정보
  const [categoryId, setCategoryId] = useState(-1);
  // error 메세지
  const [titleError, setTitleError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  // confirm open 여부
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  // alert Dialog 정보
  const [alertDialog, setAlertDialog] = useState({
    open: false,
    message: "",
  });

  // 카테고리 목록 조회
  const getCategoryList = async () => {
    const { data } = await axios.get("/api/categories");
    setCategories((prev) => [...prev, ...data]);
  };

  // post 저장 event
  const handlePostSave = async () => {
    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("content", data);
      formData.append("categoryId", categoryId);

      for (const file of attachFiles) {
        formData.append("files", file);
      }

      await axios.post("/api/posts", formData);

      setAlertDialog({ open: true, message: "저장되었습니다" });
      router.push("/post");
    } catch (error) {
      setAlertDialog({ open: true, message: error.message });
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
    setTitle(e.target.value);
  };

  useEffect(() => {
    getCategoryList();
  }, []);

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
          onChange={handleTitleChange}
          placeholder="Title"
          error={titleError !== "" || false}
          helperText={titleError}
        />
      </Box>
      <Editor setData={setData} />
      <Box>
        <FileUploader onFilesChange={setAttachFiles} />
      </Box>
      <Box sx={{ margin: "10px", display: "block", textAlign: "right" }}>
        <Button
          variant="contained"
          onClick={() => {
            if (!validate()) return false;
            setConfirmDialogOpen(true);
          }}
          color="inherit"
        >
          완료
        </Button>
      </Box>

      {/* Confirm & Alert Dialog */}
      <ConfirmDialog
        open={confirmDialogOpen}
        title="게시글 저장"
        content="저장 하시겠습니까?"
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handlePostSave}
      />
      <AlertDialog
        open={alertDialog.open}
        onClose={() => setAlertDialog({ ...alertDialog, open: false })}
        title={alertDialog.message}
      />
    </>
  );
}
