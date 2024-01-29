import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export default function Post() {
  const [data, setData] = useState({ count: 0, list: [], last: true });
  const pageData = useRef({ page: 0, size: 5 });

  const router = useRouter();
  const { query } = router;

  const getPostData = async () => {
    const queryString = new URLSearchParams(pageData.current);
    const categoryId = query.categoryId;

    // Category Id가 존재 할때
    if (categoryId != undefined && categoryId != 100) {
      // 이후 조건 수정 필요
      queryString.append("categoryId", categoryId);
    }

    const resultData = await fetch(`/api/posts?${queryString.toString()}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`${res.status} 에러가 발생했습니다.`);
        }
        return res.json();
      })
      .then((json) => {
        return json;
      })
      .catch((error) => console.log(error.message));

    return resultData;
  };

  // 초기 데이터 조회 및 Category Id 변경됐을 경우 실행
  const init = async () => {
    // 페이지 0으로 초기화
    pageData.current.page = 0;
    const resultData = await getPostData();

    // 리스트 새로 생성
    setData(() => ({
      count: resultData.totalElements,
      list: resultData.content,
      last: resultData.last,
    }));
  };

  // 더보기 버튼 클릭 시 실행
  const handleMoreClick = async () => {
    // 다음 페이지 조회
    pageData.current.page += 1;
    const resultData = await getPostData();

    // 기존 리스트에 더하기
    setData((prev) => ({
      count: resultData.totalElements,
      list: [...prev.list, ...resultData.content],
      last: resultData.last,
    }));
  };

  useEffect(() => {
    if (!router.isReady) return;
    init();
  }, [query]);

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <span>Category ({data.count})</span>
        <Link href="/post/register">
          <IconButton aria-label="delete">
            <EditOutlinedIcon />
          </IconButton>
        </Link>
      </Box>
      <Divider />
      <List>
        {data.list.map((post) => (
          <Box key={post.id}>
            <ListItem onClick={() => router.push(`/post/${post.id}`)}>
              <ListItemText primary={post.title} secondary={post.content} />
            </ListItem>
            <Divider />
          </Box>
        ))}
        {!data.last && (
          <Box sx={{ textAlign: "center", margin: "10px" }}>
            <Button
              variant="contained"
              onClick={handleMoreClick}
              color="inherit"
            >
              더보기
            </Button>
          </Box>
        )}
      </List>
    </>
  );
}
