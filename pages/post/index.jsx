// libraries
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
// common code data
import { codeData as code } from "data/codeData";
// axios
import axios from "axios";

export default function Post() {
  const router = useRouter();
  const { query } = router;

  // post 목록 데이터(count: 전체 목록, list: post 목록, last: 마지막 페이지이지 여부)
  const [data, setData] = useState({ count: 0, list: [], last: true });
  // page 정보
  const pageData = useRef({ page: 0, size: 5 });

  // post 목록 조회
  const getPostData = async () => {
    const queryString = new URLSearchParams(pageData.current);
    const categoryId = query.categoryId;
    const searchValue = query.searchValue;

    // categoryId가 존재할 때
    if (categoryId != undefined && categoryId != code.all.value) {
      queryString.append("categoryId", categoryId);
    }
    // searchValue가 존재할 때
    if (searchValue != undefined) {
      queryString.append("searchValue", searchValue);
    }

    const { data } = await axios.get(`/api/posts?${queryString.toString()}`);

    return data;
  };

  // 초기 데이터 조회 및 category id 변경됐을 경우 실행
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

  // html 태그 제거 함수
  const removeTags = (str) => {
    return str.replace(/<[^>]*>/g, "");
  };

  useEffect(() => {
    if (!router.isReady) return;
    init();
  }, [query]);

  return (
    <>
      <Divider />
      <List pt="0">
        {data.list.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "150px",
              textAlign: "center",
              color: "gray",
            }}
          >
            검색결과가 없습니다.
          </Box>
        ) : (
          <>
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
                          {removeTags(post.content)}
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
          </>
        )}
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
