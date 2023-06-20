import React, { useEffect, useRef, useState } from "react";
import "./assets/styles.css";
import QuestionMultiCard from "./card";
import Utils from "./utils";

const utils = new Utils();

export default function App() {
  const wrapper = useRef();

  useEffect(() => {
    // const [canRecord, setCanRecord] = useState(true);

    const bot = new window.ChatSDK({
      root: wrapper.current,

      // 界面相关配置
      config: {
        navbar: {
          title: "DemoBot",
        },
        robot: {
          avatar: "//gw.alicdn.com/tfs/TB1U7FBiAT2gK0jSZPcXXcKkpXa-108-108.jpg",
        },
        messages: [
          {
            type: "text",
            content: {
              text: "Bot init message",
            },
          },
        ],
        // inputType: canRecord ? 'voice' : 'text',
      },

      // 请求配置
      requests: {
        send: function (msg) {
          if (msg.type === "text") {
            console.log(msg.content.text);
            let text = "default";
            let data = null;
            if (msg.content.text == "量表") {
              data = utils.request(process.env.PATH_GET_SCALE, "post", { paper_name: process.env.PHQ9 });
              console.log('data', data);
              if (data.code == "200") {
                data = data.data.result_list[0]
                return [
                  {
                    type: "text",
                    content: {
                      text: data.name,
                    },
                  }, {
                    type: "text",
                    content: {
                      text: data.description,
                    },
                  },
                  {
                    type: "text",
                    content: {
                      text: data.rules,
                    },
                  }
                ];
              }
            } else {
              return {
                type: "text",
                content: {
                  text: text,
                },
              };
            }


          }
        },
      },

      // 组件映射配置
      components: {
        "question-multi": QuestionMultiCard,
      },

      // makeRecorder({ ctx }) {
      //   return {
      //     canRecord,
      //     onStart() {
      //       // 开始录音
      //       // nativeInvoke('startVoiceRecognition');
      //     },
      //     onEnd() {
      //       // 停止录音
      //       // nativeInvoke('stopVoiceRecognition', (text) => {
      //       //   // 识别到文本
      //       //   ctx.postMessage({
      //       //     type: 'text',
      //       //     content: { text },
      //       //   });
      //       // });
      //     },
      //     onCancel() {
      //       // 录音
      //       // nativeInvoke('cancelVoiceRecognition');
      //     },
      //   };
      // }

    });

    bot.run();
  }, []);

  return <div style={{ height: "100%" }} ref={wrapper} />;
}
