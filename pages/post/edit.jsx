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
import { useCallback, useEffect, useState } from "react";
// components
import Editor from "@component/Editor";
// common code data
import { codeData as code } from "data/codeData";
// axios
import axios from "api/axios";

export default function PostEdit() {
  const router = useRouter();
  const id = router.query.id;

  // 카테고리 목록
  const [categories, setCategories] = useState([
    { id: code.none.value, name: code.none.text },
  ]);
  // post content, title
  const [data, setData] = useState("");
  const [title, setTitle] = useState("");
  // 선택된 카테고리 정보
  const [categoryId, setCategoryId] = useState(-1);
  // error 메세지
  const [titleError, setTitleError] = useState("");
  const [categoryError, setCategoryError] = useState("");

  // 카테고리 목록 조회
  const getCategoryList = async () => {
    const { data } = await axios.get("/api/categories/all");
    setCategories((prev) => [...prev, ...data]);
  };

  // 초기화 함수, post 상세 정보 조회
  const init = useCallback(async () => {
    const { data } = await axios.get(`/api/posts/${id}`);

    setTitle(() => data.title);
    setData(() => data.content);
    setCategoryId(() => data.categoryId);
  }, [id]);

  // post 저장 event
  const handleSaveButton = async () => {
    // validation check
    if (!validate()) {
      return false;
    }

    if (confirm("저장하시겠습니까?")) {
      await axios.put(`/api/posts/${id}`, { title, content: data, categoryId });

      alert("저장되었습니다.");
      router.push(`/post/${id}`);
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
      init();
    }
  }, [init, router.isReady]);

  return (
    <>
      <Box sx={{ minWidth: 120 }}>
        <FormControl size="small" sx={{ minWidth: 200 }} error={categoryError}>
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
          error={titleError !== "" || false}
          helperText={titleError}
        />
      </Box>
      <Editor data={data} setData={setData} />
      <Box sx={{ margin: "10px", display: "block", textAlign: "right" }}>
        <Button variant="contained" onClick={handleSaveButton} color="inherit">
          수정
        </Button>
        <Button onClick={() => router.push("/post")} color="inherit">
          취소
        </Button>
      </Box>
    </>
  );
}
