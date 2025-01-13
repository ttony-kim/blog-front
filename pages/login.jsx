import { useState } from "react";
import styles from "@styles/Login.module.css";
import { useRouter } from "next/router";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

const AlertDialog = ({ open, onClose, title }) => (
  <Dialog open={open} onClose={onClose} aria-labelledby="alert-dialog-title">
    <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
    <DialogActions>
      <Button onClick={onClose} autoFocus>
        닫기
      </Button>
    </DialogActions>
  </Dialog>
);

export default function Login() {
  const router = useRouter();

  // 로그인 정보
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // alert open 여부
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const token = await response.text();
        if (token) {
          localStorage.setItem("token", token);
          router.push({ pathname: "/post" });
        } else {
          console.error("토큰이 비어있습니다.");
          setDialogOpen(true);
        }
      } else {
        // 로그인 실패 처리
        console.error("로그인 실패:", response.statusText);
        setDialogOpen(true);
      }
    } catch (error) {
      // 네트워크 오류 등의 예외사항
      console.error("로그인 에러:", error);
      setDialogOpen(true);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>Blog</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            로그인
          </button>
        </form>
      </div>
      <AlertDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={"로그인에 실패하였습니다."}
      />
    </>
  );
}

Login.useSimpleLayout = true;
