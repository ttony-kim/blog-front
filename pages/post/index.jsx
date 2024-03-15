import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { codeData as code } from "data/codeData";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import moment from "moment";

export default function Post() {
  const [data, setData] = useState({ count: 0, list: [], last: true });
  const pageData = useRef({ page: 0, size: 5 });

  const router = useRouter();
  const { query } = router;

  // Post 목록 조회
  const getPostData = async () => {
    const queryString = new URLSearchParams(pageData.current);
    const categoryId = query.categoryId;

    // Category Id가 존재 할때
    if (categoryId != undefined && categoryId != code.all.value) {
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
      <Divider />
      <List pt="0">
        {data.list.map((post) => (
          <Box key={post.id}>
            <ListItem onClick={() => router.push(`/post/${post.id}`)}>
              <ListItemText
                primary={post.title}
                secondary={
                  <div>
                    <Typography
                      component="p"
                      variant="body2"
                      sx={{
                        lineHeight: "1.5",
                        minHeight: "3.5em",
                        maxHeight: "3.5em",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {post.content}
                    </Typography>
                    <Typography component="p" variant="caption">
                      {post.categoryName} ·{" "}
                      {moment(post.createdDate).format("YYYY.MM.DD")}
                    </Typography>
                  </div>
                }
              />
            </ListItem>
            <Divider />
          </Box>
        ))}
        {!data.last && (
          <Box mt="10px" sx={{ textAlign: "center" }}>
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
