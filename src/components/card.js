import React, { useState } from "react";
import {
  Card,
  CardTitle,
  CardMedia,
  CardContent,
  CardText,
  CardActions,
  Input,
  Button,
  RadioGroup,
  toast,
} from "@chatui/core";
import { getQuestion } from "../parser";
import { TextMessage, CardMessage } from "../dao/message";
import Util from "../util";

const utils = new Util();

export function BaseInfo({ data, ctx, meta }) {
  const [gender, setGender] = useState();
  const gender_option = [
    { label: "男", value: "male" },
    { label: "女", value: "female" },
  ];
  const [age, setAge] = useState();
  const [confirm, setConfirm] = useState(false);

  async function handleConfirm() {
    if (gender && age) {
      if (isNaN(age) || age < 1 || age > 120) {
        toast.fail("请输入合理的年龄！");
      } else {
        setConfirm(true);
        ctx.appendMessage(new TextMessage("请选择量表进行作答:"));
        ctx.appendMessage(
          new CardMessage("slot", utils.list2slot(ctx.uiConfig.user.scales))
        );
      }
    } else {
      toast.fail("请完成所有的内容！");
    }
  }

  return (
    <Card>
      <CardTitle>
        <b>信息收集</b>
      </CardTitle>
      <CardContent>
        <p>性别</p>
        <RadioGroup
          value={gender}
          options={gender_option}
          onChange={(val) => setGender(val)}
          disabled={confirm}
        />
        <p>年龄</p>
        <Input
          value={age}
          onChange={(val) => setAge(val)}
          placeholder="请输入年龄..."
          disabled={confirm}
        />
      </CardContent>
      <CardActions>
        <Button
          color="primary"
          block={false}
          onClick={handleConfirm}
          disabled={confirm}
        >
          确认
        </Button>
      </CardActions>
    </Card>
  );
}

export function QuestionSingle({ data, ctx, meta }) {
  let scale = data.scale;
  let question = data.question;

  const [index] = useState(scale.index + 1);
  const [value, setValue] = useState();
  const [options, setOptions] = useState(question.options);
  const [optionTrack, setOptionTrack] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const [start] = useState(Date.now());

  function handleChange(val) {
    setOptionTrack(optionTrack.concat(val));
    console.log("选项改变", value, val);
    setValue(val);
  }

  async function handleConfirm() {
    if (value !== undefined) {
      for (let option of options) {
        option["disabled"] = true;
      }
      setOptions(options);

      setConfirm(true);
      scale.index += 1;
      if (scale.index < scale.questions.length) {
        console.log(`选项轨迹：${optionTrack} 响应时间：${Date.now() - start}`);
        question = await getQuestion(scale);
        ctx.appendMessage(
          new CardMessage("QuestionSingle", {
            scale: scale,
            question: question,
          })
        );
      } else {
        ctx.appendMessage(new TextMessage(scale.name + "量表填写完成！"));
        ctx.uiConfig.user.scales.splice(
          ctx.uiConfig.user.scales.indexOf(scale.abb),
          1
        );
        if (ctx.uiConfig.user.scales.length > 0) {
          ctx.appendMessage(new TextMessage("请继续选择量表进行作答:"));
          ctx.appendMessage(
            new CardMessage("slot", utils.list2slot(ctx.uiConfig.user.scales))
          );
        } else {
          ctx.appendMessage(new TextMessage("全部量表填写完成！"));
        }
      }
    } else {
      toast.fail("请选择一个选项！");
    }
  }

  return (
    <Card size="xl">
      <CardTitle>
        <b>
          {scale.name}
          &nbsp;&nbsp;
          {index}/{scale.questions.length}
        </b>
      </CardTitle>
      {question.pic_path && <CardMedia image={question.pic_path} />}
      <CardText>{question.text}</CardText>
      <CardContent>
        <RadioGroup value={value} options={options} onChange={handleChange} />
      </CardContent>
      <CardActions>
        <Button
          color="primary"
          block={false}
          onClick={handleConfirm}
          disabled={confirm}
        >
          确认
        </Button>
      </CardActions>
    </Card>
  );
}
