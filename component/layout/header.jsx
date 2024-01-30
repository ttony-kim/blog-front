import { FormControl, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";

import styles from "@styles/Layout.module.css";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Header() {
  const [data, setData] = useState([{ id: 100, name: "전체" }]);
  const [category, setCategory] = useState(100);
  const router = useRouter();

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

  const handleChange = (event) => {
    setCategory(event.target.value);
    router.push({
      pathname: "/post",
      query: { categoryId: event.target.value },
    });
  };

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <div className={styles.header}>
      <div>a</div>
      <div>
        <Link href="/post">Blog</Link>
      </div>
      <div>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <Select
            id="categroy"
            value={category}
            sx={{ color: "red" }}
            onChange={handleChange}
          >
            {data &&
              data.map((item) => {
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
