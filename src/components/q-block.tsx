import { Button, Card, Checkbox, Form, Switch } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { useForm } from "antd/lib/form/Form";
import Countdown from "antd/lib/statistic/Countdown";
import shuffle from "lodash/shuffle";
const CheckboxGroup = Checkbox.Group;
const Item = Form.Item;
interface IProp {
  config: QConfig;
}

export const QBlock = (prop: IProp) => {
  const {
    config: { id, question, options },
  } = prop;

  const [showComment, setShowComment] = useState(!1);

  return (
    <Card title={`#${id.padStart(3, "0")} ${question.text}`}>
      <Switch
        size="small"
        checked={showComment}
        onClick={() => setShowComment((value) => !value)}
      ></Switch>
      顯示註解
      <br />
      {showComment && <>{question.comment}</>}
      <br />
      <Item name={["ans" + id]} initialValue={[]}>
        <CheckboxGroup
          options={options.map((ele) => ({
            ...ele,
            label: `${ele.value}: ${ele.label}`,
          }))}
        ></CheckboxGroup>
      </Item>
    </Card>
  );
};

type config = {
  num: number;
  timeLimit: boolean;
  timeSetup?: string;
  isAgain: boolean;
  testNoTestYet: boolean;
};

interface ITestForm {
  config: config;
  qList: QConfig[];
  ansMapping: Map<string, QConfig>;
  ans: Record<`ans${number | string}`, string[]> | null;
  onFinish(params: Record<`ans${number | string}`, string[]>): void;
}
export const TestForm = ({
  onFinish,
  config,
  qList,
  ans,
  ansMapping,
}: ITestForm) => {
  const [form] = useForm();
  const time = useMemo(() => {
    const timeCount = Date.now() + +config.timeSetup! * 60 * 1000;
    console.log(config.timeSetup?.valueOf());
    return timeCount;
  }, [config.timeSetup!]);

  const list = useMemo(() => {
    if (config.isAgain && ans) {
      const resultList = Object.entries(ans)
        .filter(([key, ans]) => {
          return ansMapping.get(key)?.answer.join("") !== ans.join("");
        })
        .map((ele) => ansMapping.get(ele[0])!);
      return resultList;
    } else if (config.testNoTestYet) {
      const localAns: Record<string, string[]> = JSON.parse(
        localStorage.getItem("ans") || "{}"
      );
      const notTest = (() => {
        const _k = Object.keys(localAns);
        if (_k.length)
          return qList.filter((ele) => !_k.includes(`ans${ele.id}`));
        else return qList;
      })();
      return notTest
    } else {
      return qList;
    }
  }, [qList, ans, config.isAgain]);

  return (
    <Form form={form} onFinish={onFinish} initialValues={{}}>
      {config.timeLimit && (
        <Countdown
          value={time}
          onFinish={() => {
            form.validateFields().then((res) => {
              onFinish(res);
            });
          }}
          format="HH:mm:ss"
        />
      )}
      <br />
      {shuffle(list)
        .slice(0, config.num)
        .map((ele) => {
          return <QBlock config={ele} key={ele.id} />;
        })}
      <Button htmlType="submit">ok</Button>
    </Form>
  );
};
