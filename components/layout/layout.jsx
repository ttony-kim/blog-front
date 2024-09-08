import Contents from "./contents";
import Footer from "./footer";
import Header from "./header";
import styles from "@styles/Layout.module.css";

export function FullLayout({ children }) {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.mainWrapper}>
        <main className={styles.main}>
          <Contents>{children}</Contents>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export function SimpleLayout({ children }) {
  return <Contents>{children}</Contents>;
}
