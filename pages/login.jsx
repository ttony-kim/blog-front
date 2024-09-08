import { useState } from "react";
import styles from "../styles/Login.module.css";

export default function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기에 로그인 로직을 구현하세요
    console.log("로그인 시도:", id, password);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Blog</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
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
  );
}

Login.useSimpleLayout = true;
