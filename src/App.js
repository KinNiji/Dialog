import React, { useEffect, useRef } from "react";
import "./assets/styles.css";
import Util from "./util";
import { parser } from "./parser";
import { BaseInfo, QuestionSingle } from "./components/card";
import { SystemMessage, CardMessage, TextMessage } from "./dao/message";

const utils = new Util();

const SCALES = {
  "PHQ-9": "一般健康问卷",
  "GAD-7": "一般焦虑量表",
  ISI: "睡眠情况问卷",
  PSS: "压力知觉量表",
};

export default function App() {
  const wrapper = useRef();

  useEffect(() => {
    const bot = new window.ChatSDK({
      root: wrapper.current,

      // 界面相关配置
      config: {
        // i18n，当前语言，支持 en-US: 英文 zh-CN: 中文
        lang: "zh-CN",
        // 导航栏
        navbar: {
          title: "DemoBot",
        },
        // 机器人信息
        robot: {},
        // 用户信息
        user: {
          uuid: utils.uuid(),
          scales: Object.keys(SCALES),
        },
        // 初始化消息
        messages: [new SystemMessage("DemoBot开始运行")],
        // 快捷短语
        quickReplies: [],
        // 输入框占位符
        placeholder: "",
        // 侧边栏
        sidebar: "",
        // 工具栏
        toolbar: [],
        // 一进页面发消息
        query: "心理筛查",
        // text: 文本输入
        // voice：语音输入
        inputType: "text",
      },

      // 请求配置
      requests: {
        send: function (msg) {
          console.log("触发请求", msg);
          if (msg.type === "text") {
            if (msg.content.text === "心理筛查") {
              return new CardMessage("BaseInfo");
            } else if (Object.keys(SCALES).includes(msg.content.text)) {
              if (bot.config.user.scales.includes(msg.content.text)) {
                return utils.request(
                  process.env.PATH_GET_SCALE,
                  "post",
                  { paper_name: SCALES[msg.content.text] },
                  bot.appRef.current.getCtx()
                );
              } else {
                return new TextMessage("该量表已经填写过");
              }
            }
            return new TextMessage("这是一条服务端返回默认的数据");
          }
        },
      },

      // 其它处理函数配置
      handlers: {
        // 埋点
        track(data) {
          console.log("埋点", data);
        },
        // 消息数据后处理函数
        parseResponse(response, requestType) {
          console.log("触发响应处理", response);
          if (requestType === "send" && response.data) {
            return parser(response);
          }
          return response;
        },
      },

      // 组件映射配置
      components: {
        BaseInfo: BaseInfo,
        QuestionSingle: QuestionSingle,
        HorizontalTilingSingle: {
          name: "HorizontalTilingSingle",
          url: "//g.alicdn.com/alime-components/slot/0.1.3/index.js",
        },
      },

      makeRecorder({ ctx }) {
        return {
          // 是否支持语音输入，
          canRecord: true,
          onStart() {
            console.log("开始录音");
          },
          onEnd() {
            console.log("停止录音");
            // 识别到文本后要 ctx.postMessage
          },
          onCancel() {
            console.log("取消录音");
          },
        };
      },
    });

    bot.run();
  }, []);

  return <div style={{ height: "100%" }} ref={wrapper} />;
}
