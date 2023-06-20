import axios from "axios";

export default class Utils {
  async request(path, method, params=null) {
    return new Promise((resolve, reject) => {
      axios({
        url: `//${process.env.BACK_END_HOST}:${process.env.BACK_END_PORT}${path}`,
        method: method,
        data: params,
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
