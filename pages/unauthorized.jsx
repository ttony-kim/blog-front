// libraries
import styles from "@styles/Unauthorized.module.css";
import { useAuth } from "contexts/AuthContext";
import { useState } from "react";
import { useRouter } from "next/router";
// components
import AlertDialog from "@component/Component/AlertDialog";

export default function Unauthorized() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  // alert open 여부
  const [dialogOpen, setDialogOpen] = useState(false);

  // 페이지 이동 event
  const handlePageMove = (url) => {
    router.push(url);
  };

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>접근 제한</h1>
        <div className={styles.messageBox}>
          <p className={styles.message}>이 페이지에 접근할 권한이 없습니다.</p>
        </div>
        <div className={styles.form}>
          {!isLoggedIn ? (
            <button
              onClick={() => handlePageMove("/login")}
              className={styles.button}
            >
              로그인
            </button>
          ) : (
            <button onClick={() => router.back()} className={styles.button}>
              이전 페이지로
            </button>
          )}
          <button
            onClick={() => handlePageMove("/")}
            className={`${styles.button} ${styles.secondaryButton}`}
          >
            Home
          </button>
        </div>
      </div>
      <AlertDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={"오류가 발생했습니다."}
      />
    </>
  );
}

Unauthorized.useSimpleLayout = true;
