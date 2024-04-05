import Footer from "@component/Layout/Footer";
import Header from "@component/Layout/Header";

import Contents from "@component/Layout/Contents";
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
      </div>
      <Footer />
    </div>
  );
}

export default MyApp;
