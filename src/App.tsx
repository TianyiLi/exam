import React, { useEffect, useState } from "react";
import "antd/dist/antd.min.css";
import "./App.css";
import data from "./data.json";
import { Button, Col, Modal, Row, Steps } from "antd";
import { Config } from "./components/config";
import { TestForm } from "./components/q-block";
import { ResultCom } from "./components/result";
enum Stage {
  start,
  progress,
  end,
}

const formatData = data.map<QConfig>((ele) => {
  const [_, id, answer, question] = ele.question.match(
    /^(\d+)\.\((\w+)\)(.+)$/
  )!;
  const comments = question.match(/\[(.*?)]/g)!;
  return {
    id,
    answer: answer.split(""),
    question: {
      text: question.match(/^(.+?)\[.+/)![1],
      comment: [comments[0], comments[1]].join(),
      origin: question,
    },
    options: ele.select.map((option) => {
      const value = option.slice(0, 1);
      const label = option.slice(2);
      return { value, label };
    }),
  };
});

const steps = [{ title: "設定" }, { title: "考題" }, { title: "Ans" }];

const hashBlock = new Map(formatData.map((ele) => [`ans${ele.id}`, ele]));
function App() {
  const [step, setStep] = useState(Stage.start);
  const [config, setConfig] = useState<{
    num: number;
    timeLimit: boolean;
    timeSetup?: string;
    testNoTestYet: boolean;
    isAgain: boolean;
  }>({
    timeLimit: false,
    num: 50,
    isAgain: false,
    testNoTestYet: false
  });
  const [ans, setAns] = useState<null | Record<string, string[]>>(null);
  function getModal() {
    const localAns: Record<string, string[]> = JSON.parse(
      localStorage.getItem("ans") || "{}"
    );
    const read = Object.keys(localAns).length;
    const correct = Object.entries(localAns).filter(([key, ans]) => {
      return hashBlock.get(key)?.answer.join("") === ans.join("");
    }).length;
    const notTest = (() => {
      const _k = Object.keys(localAns);
      if (_k.length)
        return formatData.filter((ele) => !_k.includes(`ans${ele.id}`));
      else return formatData;
    })();
    Modal.info({
      closable: true,
      title: "已經答題數目 / 正確回答題 / 尚未練習題目",
      content: (
        <>
          <h3>已經答題數目: {read}</h3>
          <h3>正確回答題: {correct}</h3>
          <h3>尚未練習題目: {notTest.length}</h3>
          <div className="overflow-true">
            <Row>
              {notTest.map((ele) => (
                <Col span={3} key={ele.id}>
                  #{ele.id}
                </Col>
              ))}
            </Row>
          </div>
        </>
      ),
    });
  }
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("ans") || "{}");
    localStorage.setItem("ans", JSON.stringify({ ...data, ...ans }));
  }, [ans]);
  return (
    <div className="App">
      <Steps current={step} className="limit-width">
        {steps.map((i) => (
          <Steps.Step key={i.title} />
        ))}
      </Steps>
      <br />
      <div style={{ textAlign: "center" }}>
        <Button onClick={getModal}>目前進度</Button>
      </div>
      <br />
      <br />
      {step === Stage.start && (
        <Config
          onFinish={(c) => {
            setConfig({ ...c, isAgain: false });
            setAns(null);
            setStep(Stage.progress);
          }}
          initValue={config}
        />
      )}
      {step === Stage.progress && (
        <TestForm
          ansMapping={hashBlock}
          onFinish={(result) => {
            setAns(result);
            setStep(Stage.end);
          }}
          ans={ans}
          config={config}
          qList={formatData}
        />
      )}
      {step === Stage.end && (
        <ResultCom
          ans={ans || {}}
          ansMapping={hashBlock}
          reset={(isAgain) => {
            if (!isAgain) setStep(Stage.start);
            else {
              setStep(Stage.progress);
              setConfig((config) => ({ ...config, isAgain }));
            }
          }}
        />
      )}
    </div>
  );
}

export default App;
