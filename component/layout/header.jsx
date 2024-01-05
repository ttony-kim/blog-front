import {
  Box,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Select,
} from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";

import styles from "@styles/Layout.module.css";
import Link from "next/link";

export default function Header() {
  const [data, setData] = useState([{ id: 100, name: "전체" }]);

  const getCategory = async () => {
    await fetch(`/api/categories/all`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`${res.status} 에러가 발생했습니다.`);
        }
        return res.json();
      })
      .then((json) => {
        setData((prev) => [...prev, ...json]);
      });
  };

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <div className={styles.header}>
      <Box sx={{ marginRight: "auto" }}>
        <span>logo</span>
      </Box>
      <Box>
        <Link href="/post">
          <span>BLOG</span>
        </Link>
      </Box>
      <Box sx={{ marginLeft: "auto" }}></Box>
    </div>
  );
}
