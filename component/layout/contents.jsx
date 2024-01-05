import styles from "@styles/Layout.module.css";

export default function Contents({ Component, pageProps }) {
  return (
    <div className={styles.contents}>
      <div className={styles.components}>
        <Component {...pageProps} />
      </div>
    </div>
  );
}
