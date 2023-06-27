import axios from "axios";

import { TextMessage, CardMessage } from "./dao/message";

export default class Util {
  uuid() {
    var temp_url = URL.createObjectURL(new Blob());
    var uuid = temp_url.toString();
    URL.revokeObjectURL(temp_url);
    return uuid.substring(uuid.lastIndexOf("/") + 1);
  }

  list2slot(data) {
    let scales = { hideShortcuts: true, list: [] };
    for (let scale of data) {
      scales.list.push({ title: scale });
    }
    return scales;
  }

  async request(path, method, params = null, ctx = null) {
    console.log("执行请求", path, method, params);
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
        console.log("请求执行成功", response);
        return response;
      })
      .catch((error) => {
        console.error("请求执行失败", error);
        error = [
          {
            type: "text",
            content: {
              text: `请求失败, 请检查网络及参数\npath:${path}\nmethod: ${method}`,
            },
          },
        ];
        if (path.includes(process.env.PATH_GET_SCALE)) {
          error.push(new TextMessage("请选择量表进行作答:"));
          error.push(
            new CardMessage("slot", this.list2slot(ctx.uiConfig.user.scales))
          );
        }
        return error;
      });
  }
}
