import { Box } from "@mui/material";

export default function Footer() {
  return (
    <Box sx={{ height: 70, position: "relative" }}>
      <span
        style={{
          position: "absolute",
          textAlign: "center",
          left: "50%",
          top: "50%",
        }}
      >
        Footer
      </span>
    </Box>
  );
}
