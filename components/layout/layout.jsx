// css
import Contents from "./contents";
import Footer from "./footer";
import Header from "./header";
import styles from "@styles/Layout.module.css";
// libraries
import { CategoryProvider } from "contexts/CategoryContext";

export function FullLayout({ children }) {
  return (
    <div className={styles.container}>
      <CategoryProvider>
        <Header />
        <div className={styles.mainWrapper}>
          <main className={styles.main}>
            <Contents>{children}</Contents>
          </main>
        </div>
        <Footer />
      </CategoryProvider>
    </div>
  );
}

export function SimpleLayout({ children }) {
  return <Contents>{children}</Contents>;
}
