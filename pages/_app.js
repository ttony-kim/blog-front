import { FullLayout, SimpleLayout } from "@component/layout/layout";
import "@styles/editor.css";
import "@styles/globals.css";
import "@styles/tiptap.css";
import "remixicon/fonts/remixicon.css";

function MyApp({ Component, pageProps }) {
  const Layout = Component.useSimpleLayout ? SimpleLayout : FullLayout;

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
