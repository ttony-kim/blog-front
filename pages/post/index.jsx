import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Post() {
  const [data, setData] = useState({ count: 0, list: [] });

  useEffect(() => {
    const f = async () => {
      await fetch("/api/posts")
        .then((res) => {
          if (!res.ok) {
            throw new Error(`${res.status} 에러가 발생했습니다.`);
          }
          return res.json();
        })
        .then((json) => {
          console.log(json);
          setData({ count: json.count, list: json.list });
        })
        .catch((error) => console.log(error.message));
    };
    f();
  }, []);

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <span>Category ({data.count})</span>
        <Link href="/post/edit">
          <IconButton aria-label="delete">
            <EditOutlinedIcon />
          </IconButton>
        </Link>
      </Box>
      <Divider />
      <List>
        {data.list.map((post) => (
          <>
            <ListItem key={post.id}>
              <ListItemText primary={post.title} secondary={post.content} />
            </ListItem>
            <Divider />
          </>
        ))}
      </List>
    </>
  );
}
