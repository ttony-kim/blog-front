import { Box } from "@mui/material";
import Header from "../component/layout/header";
import "../styles/globals.css";
import Footer from "../component/layout/footer";

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
