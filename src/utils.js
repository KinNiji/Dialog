import axios from "axios";

export default class Utils {
  async request(url, method, q) {
    return new Promise((resolve, reject) => {
      axios({
        url: `//${process.env.HOST_NAME}:${process.env.BACK_END_PORT}${url}`,
        method: method,
        data: {
          q: q,
        },
      })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    })
      .then((response) => {
        console.log("Success:", response);
        return response.data;
      })
      .catch((error) => {
        console.error("Error:", error);
        return {
          type: "text",
          content: {
            text: "发生错误，请重试。",
          },
        };
      });
  }
}
