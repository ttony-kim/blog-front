import styles from "@styles/Layout.module.css";

export default function Contents({ Component, pageProps }) {
  return (
    <div className={styles.contents}>
      <Component {...pageProps} />
    </div>
  );
}
