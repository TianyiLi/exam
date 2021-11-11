import { Button, List, Result } from "antd";
import React from "react";
interface IProps {
  ansMapping: Map<string, QConfig>;
  ans: Record<string, string[]>;
  reset(tryAgain?: boolean): void;
}

export const ResultCom = (props: IProps) => {
  const { ans, ansMapping, reset } = props;
  console.log(ans);
  const resultList = Object.entries(ans)
    .filter(([key, ans]) => {
      return ansMapping.get(key)?.answer.join("") !== ans.join("");
    })
    .map((ele) => ({ source: ansMapping.get(ele[0])!, ans: ele[1] }));

  return (
    <Result
      status={resultList.length ? "warning" : "success"}
      extra={
        !resultList.length ? (
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
      title={resultList.length ? `${resultList.length} 錯誤` : "全對"}
    >
      <List
        itemLayout="horizontal"
        dataSource={resultList}
        renderItem={(ele) => (
          <List.Item>
            <List.Item.Meta
              title={
                <div>
                  <span>{ele.source.id}.</span>
                  <span style={{ color: "red", margin: "0 10px" }}>
                    ({ele.source.answer})
                  </span>
                  <span>{ele.source.question.origin}</span>
                  <br />
                  你的答案: {ele.ans.join()}
                </div>
              }
              description={
                <pre>
                  {ele.source.options
                    .map((ele) => `${ele.value}: ${ele.label}`)
                    .join("\n")}
                </pre>
              }
            />
          </List.Item>
        )}
      ></List>
    </Result>
  );
};
