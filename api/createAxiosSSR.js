import axios from "axios";
import nookies from "nookies";

export function createServerAxios(context) {
  const token = nookies.get(context).token;

  const instance = axios.create({
    baseURL: process.env.API_URL,
    params: {},
    timeout: 60000,
  });

  // 요청 인터셉터 추가
  instance.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  // 응답 인터셉터 추가
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      let errorMessage = "오류가 발생했습니다.";
      if (error.response) {
        const { status } = error.response;
        console.log(`${status} 에러가 발생했습니다.`);

        if (status === 401) {
          localStorage.removeItem("token");
          errorMessage = "접근 권한이 필요합니다. 로그인 후 이용해주세요.";
        }
      }

      return Promise.reject({
        message: errorMessage,
      });
    }
  );

  return instance;
}
