import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Editor from "@component/editor";
import { codeData as code } from "data/codeData";

export default function PostRegister() {
  // 카테고리 목록
  const [categories, setCategories] = useState([
    { id: code.none.value, name: code.none.text },
  ]);
  // 선택된 카테고리 정보
  const [selectedCategory, setSelectedCategory] = useState({
    id: -1,
    name: "",
    postCount: 0,
  });

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

  const router = useRouter();

  const [data, setData] = useState();
  const [title, setTitle] = useState("");

  const onClick = async () => {
    if (confirm("저장하시겠습니까?")) {
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content: data }),
      }).then(({ status }) => {
        if (status === 200) {
          alert("저장되었습니다.");
          router.push("/post");
        }
      });
    }
  };

  const onChange = (e) => {
    setTitle(e.target.value);
  };

  // 카테고리 Select 선택 시 Change event
  const handleSelectChange = (event) => {
    const categoryId = event.target.value;
    const { name } = categories.find((data) => data.id == categoryId);

    setSelectedCategory((prev) => ({ ...prev, id: categoryId, name }));
    getPostCount(categoryId);

    router.push({
      pathname: "/post",
      query: { categoryId },
    });
  };

  useEffect(() => {
    getCategoryList();
  }, []);

  return (
    <>
      <Box sx={{ minWidth: 120 }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <Select
            id="categroy"
            value={selectedCategory.id}
            onChange={handleSelectChange}
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
        </FormControl>
      </Box>
      <Box m="10px">
        <TextField
          fullWidth
          id="title"
          variant="standard"
          onChange={onChange}
          placeholder="Title"
          error={title === ""}
          helperText={title === "" ? "Title을 입력해주세요." : ""}
        />
      </Box>
      <Editor setData={setData} />
      <Box sx={{ margin: "10px", display: "block", textAlign: "right" }}>
        <Button variant="contained" onClick={onClick} color="inherit">
          완료
        </Button>
      </Box>
    </>
  );
}
