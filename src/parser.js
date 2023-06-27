import { TextMessage, CardMessage } from "./dao/message";
import Util from "./util";
import Scale from "./dao/scale";
import Question from "./dao/question";

const utils = new Util();

export function parser(response) {
    let url = response.config.url;
    let data = response.data;
    if (url.includes(process.env.PATH_GET_SCALE)) {
        return scale_parser(data);
    }
    else if (url.includes(process.env.PATH_GET_QUESTION.slice(0, -4))) {
        return question_parser(data);
    }
}

export function getQuestion(scale) {
    return utils.request(
      process.env.PATH_GET_QUESTION.replace("{id}", scale.questions[scale.index].question_id), "get"
    ).then((response) => {
      return parser(response);
    });
  }

async function scale_parser(response) {
    let scale;
    if (response.code == 200) {
        // 默认选取结果列表中的第一个量表
        response = response.data.result_list[0]
        console.log("执行响应处理：获取量表", response);
        scale = new Scale(response);
        console.log("执行响应处理：解析量表", scale);

        let question = await getQuestion(scale);
        return [
            new CardMessage("knowledge", { text: scale.description }),
            new CardMessage("QuestionSingle", { scale: scale, question: question })
        ]
    } else {
        return new TextMessage(`响应返回码异常：${response.code}`)
    }
}

function question_parser(response) {
    let question;
    if (response.code == 200) {
        response = response.data;
        console.log("执行响应处理：获取题目", response);
        question = new Question(response);
        console.log("执行响应处理：解析题目", question);
        return question;
    } else {
        return new TextMessage(`响应返回码异常：${response.code}`)
    }
}