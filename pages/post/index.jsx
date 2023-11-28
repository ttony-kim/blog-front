import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Post() {
  const [data, setData] = useState({ count: 0, list: [], last: true });
  const [page, setPage] = useState({ page: 0, size: 5 });
  const router = useRouter();

  const getData = useCallback(async () => {
    const queryString = new URLSearchParams(page).toString();

    await fetch(`/api/posts?${queryString}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`${res.status} 에러가 발생했습니다.`);
        }
        return res.json();
      })
      .then((json) => {
        setData((prev) => ({
          count: json.totalElements,
          list: [...prev.list, ...json.content],
          last: json.last,
        }));
      })
      .catch((error) => console.log(error.message));
  }, [page]);

  const handleMoreClick = () => {
    setPage((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  useEffect(() => {
    getData();
  }, [getData]);

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
