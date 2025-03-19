import styles from "@styles/Login.module.css";
import { useRouter } from "next/router";
import { useState } from "react";
// axios
import authAxios from "api/authAxios";
// components
import AlertDialog from "@component/Component/AlertDialog";

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
      const { data: token } = await authAxios.post("/api/login", {
        email,
        password,
      });

      if (token) {
        localStorage.setItem("token", token);
        router.push({ pathname: "/post" });
      } else {
        console.error("토큰이 비어있습니다.");
        setDialogOpen(true);
      }
    } catch (error) {
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
