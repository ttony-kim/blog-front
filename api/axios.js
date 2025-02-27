import axios from "axios";

const instance = axios.create({
  params: {},
  timeout: 1000,
});

// 요청 인터셉처 추가
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
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
    const { status } = error.response;
    console.log(`${status} 에러가 발생했습니다.`);

    return Promise.reject(error);
  }
);

export default instance;
