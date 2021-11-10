import { Button, Card, Checkbox, Form, Switch } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import moment from 'moment'
import { useForm } from 'antd/lib/form/Form'
import Countdown from 'antd/lib/statistic/Countdown'
import shuffle from 'lodash/shuffle'
const CheckboxGroup = Checkbox.Group
const Item = Form.Item
interface IProp {
  config: QConfig
}

export const QBlock = (prop: IProp) => {
  const {
    config: { id, question, options },
  } = prop

  const [showComment, setShowComment] = useState(!1)

  return (
    <Card title={`#${id.padStart(3, '0')} ${question.text}`}>
      <Switch
        size="small"
        checked={showComment}
        onClick={() => setShowComment((value) => !value)}
      ></Switch>
      顯示註解
      <br/>
      {showComment && <>{question.comment}</>}
      <br />
      <Item name={['ans' + id]} initialValue={[]}>
        <CheckboxGroup options={options}></CheckboxGroup>
      </Item>
    </Card>
  )
}

type config = {
  num: number
  timeLimit: boolean
  timeSetup?: string
}

interface ITestForm {
  config: config
  qList: QConfig[]
  onFinish(params: Record<`ans${number}`, string[]>): void
}
export const TestForm = ({ onFinish, config, qList }: ITestForm) => {
  const [form] = useForm()
  const time = useMemo(() => {
    const timeCount = Date.now() + (+config.timeSetup! * 1000);
    console.log(config.timeSetup?.valueOf())
    return timeCount
  }, [config.timeSetup!])

  return (
    <Form form={form} onFinish={onFinish}>
      {config.timeLimit && (
        <Countdown
          value={time}
          onFinish={() => {
            form.validateFields().then((res) => {
              onFinish(res)
            })
          }}
          format="HH:mm:ss"
        />
      )}
      <br />
      {shuffle(qList).slice(0, config.num).map((ele) => {
        return <QBlock config={ele} key={ele.id} />
      })}
      <Button htmlType="submit">ok</Button>
    </Form>
  )
}
