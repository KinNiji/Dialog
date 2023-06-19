import React, { useEffect, useRef } from "react";
import "./assets/styles.css";
import QuestionMultiCard from "./card";
import Utils from "./utils";

const utils = new Utils();

export default function App() {
  const wrapper = useRef();

  useEffect(() => {
    const bot = new window.ChatSDK({
      root: wrapper.current,
      // 界面相关配置
      config: {
        navbar: {
          title: "智能助理",
        },
        robot: {
          avatar: "//gw.alicdn.com/tfs/TB1U7FBiAT2gK0jSZPcXXcKkpXa-108-108.jpg",
        },
        messages: [
          {
            type: "text",
            content: {
              text: "智能助理为您服务，请问有什么可以帮您？",
            },
          },
        ],
      },
      // 请求配置
      requests: {
        send: function (msg) {
          if (msg.type === "text") {
            console.log(msg.content.text);
            return utils.request("/api/dialog", "post", msg.content.text);
          }
        },
      },
      // 组件映射配置
      components: {
        "question-multi": QuestionMultiCard,
      },
    });

    bot.run();
  }, []);

  return <div style={{ height: "100%" }} ref={wrapper} />;
}
