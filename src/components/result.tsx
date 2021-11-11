import { Button, List, Result } from "antd";
import React from "react";
interface IProps {
  ansMapping: Map<string, QConfig>;
  ans: Record<string, string[]>;
  reset(tryAgain?: boolean): void;
}

export const ResultCom = (props: IProps) => {
  const { ans, ansMapping, reset } = props;
  const resultList = Object.entries(ans).map((ele) => ({
    source: ansMapping.get(ele[0])!,
    ans: ele[1],
    correct: ansMapping.get(ele[0])?.answer.join("") === ele[1].join(""),
  }));

  const errorAmount = resultList.filter((ele) => !ele.correct);
  return (
    <Result
      status={errorAmount.length ? "warning" : "success"}
      extra={
        !errorAmount.length ? (
          <Button onClick={() => reset(false)}>reset</Button>
        ) : (
          <Button
            onClick={() => {
              reset(true);
            }}
          >
            錯誤題目再試一次
          </Button>
        )
      }
      title={errorAmount.length ? `${errorAmount.length} 錯誤` : "全對"}
    >
      <List
        itemLayout="horizontal"
        dataSource={resultList.sort((a, b) => +a.correct - +b.correct)}
        renderItem={(ele) => (
          <List.Item>
            <List.Item.Meta
              title={
                <div>
                  <span>{ele.source.id}.</span>
                  <span
                    style={{
                      color: ele.correct ? "green" : "red",
                      margin: "0 10px",
                    }}
                  >
                    ({ele.source.answer})
                  </span>
                  <span>{ele.source.question.origin}</span>
                  <br />
                  你的答案: {ele.ans.join()}
                </div>
              }
              description={
                <pre>
                  {ele.source.options.map((opt) => {
                    const str = `${opt.value}: ${opt.label}`;
                    if (ele.ans.includes(opt.value) && ele.correct)
                      return <div style={{ color: "green" }}>{str}</div>;
                    if (
                      ele.ans.includes(opt.value) &&
                      ele.source.answer.includes(opt.value)
                    )
                      return <div style={{ color: "green" }}>{str}</div>;
                    if (ele.ans.includes(opt.value))
                      return <div style={{ color: "red" }}>{str}</div>;
                    else return <div>{str}</div>;
                  })}
                </pre>
              }
            />
          </List.Item>
        )}
      ></List>
    </Result>
  );
};
