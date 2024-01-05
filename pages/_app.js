import Footer from "@component/layout/footer";
import Header from "@component/layout/header";
import Menu from "@component/layout/menu";

import Contents from "@component/layout/contents";
import styles from "@styles/Layout.module.css";
import "@styles/editor.css";
import "@styles/globals.css";
import "@styles/tiptap.css";
import "remixicon/fonts/remixicon.css";

function MyApp({ Component, pageProps }) {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.body}>
        <Contents Component={Component} pageProps={pageProps} />
        <Menu />
      </div>
      <Footer />
    </div>
  );
}

export default MyApp;
