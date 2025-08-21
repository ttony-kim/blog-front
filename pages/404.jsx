// libraries
import styles from "@styles/ErrorPage.module.css";
import { useRouter } from "next/router";

export default function Error404() {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>페이지를 찾을 수 없습니다.</h1>
      <div className={styles.messageBox}>
        <p className={styles.message}>
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          <br />
          문제가 지속되면 관리자에게 문의해 주세요.
        </p>
      </div>
      <div className={styles.form}>
        <button onClick={() => router.back()} className={styles.button}>
          이전 페이지로
        </button>
      </div>
    </div>
  );
}

Error404.useSimpleLayout = true;
