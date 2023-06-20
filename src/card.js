import React, { useState } from "react";
import {
  Card,
  CardTitle,
  CardText,
  CardActions,
  Button,
  CheckboxGroup,
  toast,
} from "@chatui/core";
import Utils from "./utils";

const utils = new Utils();

export default function QuestionMultiCard({ data, ctx, meta }) {
  const [value, setValue] = useState([]);
  const [options, setOptions] = useState(data);
  const [confirm, setConfirm] = useState(false);

  function handleChange(val) {
    setValue(val);
  }

  function handleConfirm() {
    if (value.length !== 0) {
      let new_options = options;
      for (let option of new_options) {
        option["disabled"] = true;
      }
      setOptions(new_options);

      setConfirm(true);

      utils.request(process.env.PATH_GET_QUESTION.format({id: 1}), "get").then((response) => {
        ctx.appendMessage(response);
      });
    } else {
      toast.fail("请选择至少一个选项！");
    }
  }

  return (
    <Card fluid>
      <CardTitle>Card title</CardTitle>
      <CardText>Card content</CardText>
      <CheckboxGroup
        value={value}
        options={options}
        onChange={handleChange}
        block
      />
      <CardActions>
        <Button color="primary" onClick={handleConfirm} disabled={confirm}>
          确认
        </Button>
      </CardActions>
    </Card>
  );
}
