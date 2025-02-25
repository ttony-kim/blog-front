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
    const { status } = error.response;
    console.log(`${status} 에러가 발생했습니다.`);

    return Promise.reject(error);
  }
);

export default instance;
