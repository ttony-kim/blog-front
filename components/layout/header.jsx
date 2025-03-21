// libraries
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "contexts/AuthContext";
// custom css
import styles from "@styles/Layout.module.css";
// common code data
import { codeData as code } from "data/codeData";
// axios
import axios from "api/axios";

export default function Header() {
  const router = useRouter();
  const { logout, isLoggedIn } = useAuth();

  // 카테고리 목록
  const [categories, setCategories] = useState([
    { id: code.all.value, name: code.all.text },
  ]);
  // 선택된 카테고리 정보
  const [selectedCategory, setSelectedCategory] = useState({
    id: -1,
    name: "",
    postCount: 0,
  });
  // 관리 메뉴 visible 여부
  const [isVisible, setIsVisible] = useState(false);

  // 카테고리 목록 조회
  const getCategoryList = async () => {
    const { data } = await axios.get("/api/categories/all");
    setCategories((prev) => [...prev, ...data]);
  };

  // 카테고리 별 post count 조회
  const getPostCount = async (categoryId) => {
    const { data } = await axios.get(`/api/posts/category/${categoryId}/count`);
    setSelectedCategory((prev) => ({ ...prev, postCount: data }));
  };

  // 카테고리 select 선택 시 change event
  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    const { name } = categories.find((data) => data.id == categoryId);

    setSelectedCategory((prev) => ({ ...prev, id: categoryId, name }));
    getPostCount(categoryId);

    router.push({
      pathname: "/post",
      query: { categoryId },
    });
  };

  // 관리 메뉴 버튼 click event
  const handleNavMenuClick = () => {
    setIsVisible((prev) => !prev);
  };

  // 관리 메뉴 아이템 버튼 click event
  const handleNavMenuItemClick = (url) => {
    router.push(url);
    handleNavMenuClick();
  };

  useEffect(() => {
    getCategoryList();
  }, []);

  return (
    <header className={styles.header}>
      <Stack direction="row">
        <IconButton onClick={() => router.push("/")}>
          <Avatar>DS</Avatar>
        </IconButton>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="flex-start"
        >
          <Button
            onClick={handleNavMenuClick}
            sx={{ padding: 0, lineHeight: 1, minWidth: 0, color: "#666" }}
          >
            Hello
          </Button>
          {isVisible && (
            <Box
              sx={{
                top: 40,
                width: "70%",
                maxWidth: 100,
                bgcolor: "background.paper",
                position: "absolute",
                border: "1px solid #ebebeb",
              }}
            >
              <List>
                {isLoggedIn && (
                  <>
                    <ListItem disablePadding>
                      <ListItemButton sx={{ py: 0, minHeight: 19 }}>
                        <ListItemText
                          primary="관리"
                          primaryTypographyProps={{
                            color: "primary",
                            fontSize: 12,
                            textAlign: "center",
                            color: "#666",
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                    <Divider />
                  </>
                )}
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{ py: 0, minHeight: 19 }}
                    onClick={() => {
                      isLoggedIn
                        ? handleNavMenuItemClick("/post/register")
                        : handleNavMenuItemClick("/login");
                    }}
                  >
                    <ListItemText
                      primary="글쓰기"
                      primaryTypographyProps={{
                        color: "primary",
                        fontSize: 12,
                        textAlign: "center",
                        color: "#666",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                <Divider />
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{ py: 0, minHeight: 19 }}
                    onClick={() =>
                      isLoggedIn ? logout() : handleNavMenuItemClick("/login")
                    }
                  >
                    <ListItemText
                      primary={isLoggedIn ? "로그아웃" : "로그인"}
                      primaryTypographyProps={{
                        color: "primary",
                        fontSize: 12,
                        textAlign: "center",
                        color: "#666",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
          )}
          <p style={{ fontSize: "11px", margin: 0, color: "#aaa" }}>
            아무거나 블로그입니다.
          </p>
        </Box>
      </Stack>
      <Box sx={{ m: "0 auto" }}>
        <p>
          {selectedCategory.id > 0 &&
            `${selectedCategory.name} (${selectedCategory.postCount})`}
        </p>
      </Box>
      <Stack direction="row" alignItems="center">
        <FormControl sx={{ minWidth: 120 }} size="small">
          <Select
            id="categroy"
            value={selectedCategory.id}
            sx={{ color: "#666", fontSize: "small" }}
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
        </FormControl>
      </Stack>
    </header>
  );
}
