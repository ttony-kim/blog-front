// libraries
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "contexts/AuthContext";
// custom css
import styles from "@styles/Layout.module.css";
// common code data
import { codeData as code } from "data/codeData";
// axios
import axios from "api/axios";
// components
import AlertDialog from "@component/Component/AlertDialog";

export default function Header() {
  const router = useRouter();
  const { logout, isLoggedIn } = useAuth();

  // 카테고리 목록
  const [categories, setCategories] = useState([
    { id: code.all.value, name: code.all.text },
  ]);
  // 선택된 카테고리 ID
  const [selectedCategoryId, setSelectedCategoryId] = useState(-1);
  // 관리 메뉴 visible 여부
  const [isVisible, setIsVisible] = useState(false);
  // 검색어
  const [searchValue, setSearchValue] = useState("");
  // 상위 타이틀 정보
  const [displayTitle, setDisplayTitle] = useState({
    isVisible: false,
    title: "",
    count: 0,
  });
  // alert open 여부
  const [dialogOpen, setDialogOpen] = useState(false);

  // 카테고리 목록 조회
  const getCategoryList = async () => {
    const { data } = await axios.get("/api/categories/all");
    setCategories((prev) => [...prev, ...data]);
  };

  // post count 조회
  const getPostCount = async ({ categoryId, searchValue }) => {
    const { data } = await axios.get("/api/posts/count", {
      params: {
        categoryId,
        searchValue,
      },
    });

    return data;
  };

  const updateDisplayTitle = (isVisible, title, count) => {
    setDisplayTitle({
      isVisible,
      title,
      count,
    });
  };

  // 카테고리 select 선택 시 change event
  const handleCategoryChange = async (event) => {
    const categoryId = event.target.value;
    const { name } = categories.find((data) => data.id == categoryId);

    setSelectedCategoryId(categoryId);
    if (categoryId > 0) {
      const count = await getPostCount({ categoryId });
      updateDisplayTitle(true, name, count);
    } else {
      updateDisplayTitle(false, "", 0);
    }

    router.push({
      pathname: "/post",
      query: { ...(categoryId > 0 && { categoryId }) },
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

  // post 검색 기능 event
  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    if (!searchValue.trim()) {
      setDialogOpen(true);
      return;
    }

    const count = await getPostCount({ searchValue });
    updateDisplayTitle(true, "검색결과", count);

    // 카테고리 ID 초기화
    setSelectedCategoryId(-1);

    router.push({
      pathname: "/post",
      query: { searchValue },
    });
  };

  useEffect(() => {
    getCategoryList();
  }, []);

  return (
    <>
      <header className={styles.header}>
        <Stack direction="row" sx={{ width: 400 }}>
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
            {displayTitle.isVisible &&
              `${displayTitle.title} (${displayTitle.count})`}
          </p>
        </Box>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ width: 400, marginRight: "10px" }}
        >
          <Paper
            component="form"
            sx={{
              p: "1px 4px",
              m: "4px",
              display: "flex",
              alignItems: "center",
              width: 200,
              height: 36,
            }}
            variant="outlined"
            onSubmit={handleSearchSubmit}
          >
            <IconButton type="submit" sx={{ p: "5px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1, fontSize: "small" }}
              placeholder="Search"
              inputProps={{ "aria-label": "search google maps" }}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </Paper>
          <FormControl sx={{ minWidth: 120 }} size="small">
            <Select
              id="categroy"
              value={selectedCategoryId}
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
      <AlertDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={"검색어를 입력해주세요."}
      />
    </>
  );
}
