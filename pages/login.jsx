// libraries
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuth } from "contexts/AuthContext";
import { Box, Button, TextField, Typography } from "@mui/material";
// axios
import authAxios from "api/authAxios";
// components
import AlertDialog from "@component/Component/AlertDialog";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  // 로그인 정보
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // alert open 여부
  const [dialogOpen, setDialogOpen] = useState(false);
  // error 메세지
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // 로그인 버튼 submit event
  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation check
    if (!validate()) {
      return false;
    }

    try {
      const { data: token } = await authAxios.post("/api/login", {
        email,
        password,
      });

      if (!token) {
        throw new Error("토큰이 비어있습니다.");
      }

      login(token);
      router.push({ pathname: "/post" });
    } catch (error) {
      console.error(error?.message || "알 수 없는 오류가 발생했습니다");
      setDialogOpen(true);
    }
  };

  // validation check
  const validate = () => {
    let retrunValue = true;
    // email 유효성 검사
    if (!email?.trim()) {
      setEmailError("Email을 입력하세요.");
      retrunValue = false;
    } else {
      setEmailError("");
    }

    // password 유효성 검사
    if (!password?.trim()) {
      setPasswordError("Password를 입력하세요.");
      retrunValue = false;
    } else {
      setPasswordError("");
    }

    return retrunValue;
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          height: "100vh",
          backgroundColor: "#ffffff",
          paddingTop: "20vh",
        }}
      >
        <Typography
          variant="h1"
          sx={{
            color: "#666666",
            mb: 3,
          }}
        >
          Blog
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            width: 300,
            gap: 1,
          }}
        >
          <TextField
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="small"
            error={emailError !== "" || false}
            helperText={emailError}
          />
          <TextField
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="small"
            error={passwordError !== "" || false}
            helperText={passwordError}
          />
          <Button
            type="submit"
            sx={{
              mt: "8px",
              padding: "10px",
              fontSize: "18px",
              color: "#ffffff",
              backgroundColor: "#d9d9d9",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#bfbfbf",
              },
            }}
          >
            로그인
          </Button>
        </Box>
      </Box>
      <AlertDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={"로그인에 실패하였습니다."}
      />
    </>
  );
}

Login.useSimpleLayout = true;
