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
// common code data
import { codeData as code } from "data/codeData";

export default function PostRegister() {
  const router = useRouter();

  // 카테고리 목록
  const [categories, setCategories] = useState([
    { id: code.none.value, name: code.none.text },
  ]);
  // post content, title
  const [data, setData] = useState();
  const [title, setTitle] = useState("");
  // 선택된 카테고리 정보
  const [categoryId, setCategoryId] = useState(-1);
  // error 메세지
  const [titleError, setTitleError] = useState("");
  const [categoryError, setCategoryError] = useState("");

  // 카테고리 목록 조회
  const getCategoryList = async () => {
    await fetch(`/api/categories/all`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`${res.status} 에러가 발생했습니다.`);
        }
        return res.json();
      })
      .then((json) => {
        setCategories((prev) => [...prev, ...json]);
      });
  };

  // post 저장 event
  const handleSaveButton = async () => {
    // validation check
    if (!validate()) {
      return false;
    }

    if (confirm("저장하시겠습니까?")) {
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content: data, categoryId }),
      }).then(({ status }) => {
        if (status === 200) {
          alert("저장되었습니다.");
          router.push("/post");
        }
      });
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
          onChange={handleTitleChange}
          placeholder="Title"
          error={titleError !== "" || false}
          helperText={titleError}
        />
      </Box>
      <Editor setData={setData} />
      <Box sx={{ margin: "10px", display: "block", textAlign: "right" }}>
        <Button variant="contained" onClick={handleSaveButton} color="inherit">
          완료
        </Button>
      </Box>
    </>
  );
}
