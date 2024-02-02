import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import { useEffect, useState } from "react";

import styles from "@styles/Layout.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import { codeData as code } from "data/codeData";

export default function Header() {
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

  const router = useRouter();

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

  // 카테고리 별 Post Count 조회
  const getPostCount = async (categoryId) => {
    await fetch(`/api/posts/category/${categoryId}/count`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`${res.status} 에러가 발생했습니다.`);
        }
        return res.json();
      })
      .then((json) => {
        setSelectedCategory((prev) => ({ ...prev, postCount: json }));
      });
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

  // 관리 메뉴 버튼 Click event
  const handleButtonClick = () => {
    setIsVisible((prev) => !prev);
  };

  useEffect(() => {
    getCategoryList();
  }, []);

  return (
    <div className={styles.header}>
      <div style={{ position: "relative", float: "left" }}>
        <Avatar sx={{ float: "left", marginRight: "16px" }}>DS</Avatar>
        <Box sx={{ float: "left" }}>
          <Button
            onClick={handleButtonClick}
            sx={{ padding: 0, minWidth: 0, lineHeight: 0 }}
          >
            Hello
          </Button>
          {isVisible && (
            <Box
              sx={{
                width: "70%",
                maxWidth: 360,
                bgcolor: "background.paper",
                position: "absolute",
                border: "1px solid red",
              }}
            >
              <List>
                <ListItem disablePadding>
                  <ListItemButton sx={{ py: 0, minHeight: 19 }}>
                    <ListItemText
                      primary="관리"
                      primaryTypographyProps={{
                        color: "primary",
                        fontSize: 12,
                        textAlign: "center",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                <Divider />
                <ListItem disablePadding>
                  <ListItemButton sx={{ py: 0, minHeight: 19 }}>
                    <ListItemText
                      primary="글쓰기"
                      primaryTypographyProps={{
                        color: "primary",
                        fontSize: 12,
                        textAlign: "center",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                <Divider />
                <ListItem disablePadding>
                  <ListItemButton sx={{ py: 0, minHeight: 19 }}>
                    <ListItemText
                      primary="로그인/로그아웃"
                      primaryTypographyProps={{
                        color: "primary",
                        fontSize: 12,
                        textAlign: "center",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
          )}
          <p style={{ fontSize: "12px", margin: 0 }}>아무거나 블로그입니다.</p>
        </Box>
      </div>
      <div>
        <Link href="/post">
          {selectedCategory.id > 0 &&
            `${selectedCategory.name} (${selectedCategory.postCount})`}
        </Link>
      </div>
      <div>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <Select
            id="categroy"
            value={selectedCategory.id}
            sx={{ color: "red" }}
            onChange={handleSelectChange}
          >
            {categories &&
              categories.map((item) => {
                return (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      </div>
    </div>
  );
}
