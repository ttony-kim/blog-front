import { Box } from "@mui/material";
import Header from "../component/layout/header";
import Footer from "../component/layout/footer";

import "remixicon/fonts/remixicon.css";
import "../styles/globals.css";
import "../styles/tiptap.css";
import "../styles/editor.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />
      <Box sx={{ width: 800, margin: "auto" }}>
        <Component {...pageProps} />
      </Box>
      <Footer />
    </>
  );
}

export default MyApp;
