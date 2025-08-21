import axios from "axios";

const instance = axios.create({
  params: {},
  timeout: 1000,
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response.status;

      if (status === 401) {
        // 로그인 실패 처리
        console.error("로그인 실패:", error.response.statusText);
      }
    } else {
      // 네트워크 오류 등의 예외사항
      console.error("로그인 에러:", error);
    }

    return Promise.reject(error);
  }
);

export default instance;
