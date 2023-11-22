import { Divider, Paper, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PostDetail() {
  const router = useRouter();
  const [data, setData] = useState({ title: "", content: "", createdDate: "" });

  const init = async () => {
    const id = router.query.id;

    await fetch(`/api/posts/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`${res.status} 에러가 발생했습니다.`);
        }
        return res.json();
      })
      .then((json) => {
        setData({
          title: json.title,
          content: json.content,
          createdDate: json.createdDate,
        });
        console.log(json);
      });
  };

  useEffect(() => {
    if (router.isReady) {
      init();
    }
  }, []);

  return (
    <Paper elevation={0}>
      <Typography variant="h3">{data.title}</Typography>
      <Typography variant="subtitle2" gutterBottom>
        <b>admin</b> · {data.createdDate}
      </Typography>
      <Divider />
      <div
        dangerouslySetInnerHTML={{
          __html: data.content,
        }}
      />
      <div
        dangerouslySetInnerHTML={{
          __html: data.content,
        }}
      />
      <div
        dangerouslySetInnerHTML={{
          __html: data.content,
        }}
      />
      <div
        dangerouslySetInnerHTML={{
          __html: data.content,
        }}
      />
      <div
        dangerouslySetInnerHTML={{
          __html: data.content,
        }}
      />
    </Paper>
  );
}
