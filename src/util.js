import axios from "axios";

export default class Util {

  async request(path, method, params = null) {
    console.log("执行请求", path, method, params)
    return new Promise((resolve, reject) => {
      axios({
        url: `//${process.env.BACK_END_HOST}:${process.env.BACK_END_PORT}${path}`,
        method: method,
        data: params,
      }).then((response) => {
        resolve(response);
      }).catch((error) => {
        reject(error);
      });
    }).then((response) => {
      console.log("请求执行成功", response);
      return response;
    }).catch((error) => {
      console.error("请求执行失败", error);
      return {
        type: "text",
        content: {
          text: `请求失败, 请检查网络及参数\npath:${path}\nmethod: ${method}`,
        },
      };
    });
  }

  uuid() {
    var temp_url = URL.createObjectURL(new Blob());
    var uuid = temp_url.toString(); 
    URL.revokeObjectURL(temp_url);
    return uuid.substring(uuid.lastIndexOf("/") + 1);
  }

  
}
