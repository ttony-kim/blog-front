// libraries
import Giscus from "@giscus/react";
import { Divider } from "@mui/material";
import { useEffect, useState } from "react";

export default function Comments() {
  return (
    <>
      <Divider sx={{ my: 5 }} />
      <Giscus
        id="comments"
        repo={process.env.NEXT_PUBLIC_GISCUS_REPO}
        repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID}
        category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY}
        categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID}
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme="preferred_color_scheme"
        lang="ko"
        loading="lazy"
      />
    </>
  );
}
