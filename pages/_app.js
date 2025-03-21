import { FullLayout, SimpleLayout } from "@component/layout/layout";
import "@styles/editor.css";
import "@styles/globals.css";
import "@styles/tiptap.css";
import { AuthProvider } from "contexts/AuthContext";
import "remixicon/fonts/remixicon.css";

function MyApp({ Component, pageProps }) {
  const Layout = Component.useSimpleLayout ? SimpleLayout : FullLayout;

  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}

export default MyApp;
