// custom css
import styles from "@styles/Layout.module.css";

export default function Contents({ children }) {
  return <section className={styles.contents}>{children}</section>;
}
