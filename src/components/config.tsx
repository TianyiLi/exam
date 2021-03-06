import { Button, Form, Input, Modal, Switch, TimePicker } from "antd";
import React from "react";
type config = {
  num: number;
  timeLimit: boolean;
  timeSetup?: string;
  testNoTestYet: boolean;
};
export const Config = ({
  onFinish,
  initValue,
}: {
  initValue: config;
  onFinish: (params: config) => void;
}) => {
  return (
    <div className="limit-width">
      <Form
        onFinish={(value) => {
          console.log(value);
          value.num = +value.num;
          onFinish(value);
        }}
        initialValues={initValue}
      >
        <h2>設定</h2>
        <Form.Item>
          <Button
            onClick={() => {
              localStorage.removeItem("ans");
              Modal.success({
                content: '成功'
              });
            }}
          >
            清理記錄
          </Button>
        </Form.Item>
        <Form.Item label="題目數量" name={["num"]}>
          <Input type="number" max="500" />
        </Form.Item>
        <Form.Item
          valuePropName="checked"
          label="測試尚未測試的題目"
          name={["testNoTestYet"]}
        >
          <Switch />
        </Form.Item>
        <Form.Item
          valuePropName="checked"
          label="要時間限制"
          name={["timeLimit"]}
        >
          <Switch />
        </Form.Item>

        <Form.Item dependencies={["timeLimit"]}>
          {(form) => {
            return form.getFieldValue(["timeLimit"]) ? (
              <Form.Item name={["timeSetup"]}>
                <Input type="number" placeholder="分" />
              </Form.Item>
            ) : null;
          }}
        </Form.Item>
        <Button htmlType="submit">Confirm</Button>
      </Form>
    </div>
  );
};
