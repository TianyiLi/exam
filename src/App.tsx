import React, { useEffect, useState } from 'react'
import 'antd/dist/antd.min.css'
import './App.css'
import data from './data.json'
import { Steps } from 'antd'
import { Config } from './components/config'
import { TestForm } from './components/q-block'
import { ResultCom } from './components/result'
enum Stage {
  start,
  progress,
  end,
}

const formatData = data.map<QConfig>((ele) => {
  const [_, id, answer, question] = ele.question.match(
    /^(\d+)\.\((\w+)\)(.+)$/
  )!
  const comments = question.match(/\[(.*?)]/g)!
  return {
    id,
    answer: answer.split(''),
    question: {
      text: question.match(/^(.+?)\[.+/)![1],
      comment: [comments[0], comments[1]].join(),
      origin: question,
    },
    options: ele.select.map((option) => {
      const value = option.slice(0, 1)
      const label = option.slice(2)
      return { value, label }
    }),
  }
})

const steps = [{ title: '設定' }, { title: '考題' }, { title: 'Ans' }]

const hashBlock = new Map(formatData.map((ele) => [`ans${ele.id}`, ele]))

function App() {
  const [step, setStep] = useState(Stage.start)
  const [config, setConfig] = useState<{
    num: number
    timeLimit: boolean
    timeSetup?: string
  }>({
    timeLimit: false,
    num: 50,
  })
  const [ans, setAns] = useState<null | Record<string, string[]>>(null)

  return (
    <div className="App">
      <Steps current={step} className="limit-width">
        {steps.map((i) => (
          <Steps.Step key={i.title} />
        ))}
      </Steps>
      <br />
      <br />
      <br />
      {step === Stage.start && (
        <Config
          onFinish={(c) => {
            setConfig(c)

            setStep(Stage.progress)
          }}
          initValue={config}
        />
      )}
      {step === Stage.progress && (
        <TestForm
          onFinish={(result) => {
            setAns(result)
            setStep(Stage.end)
          }}
          config={config}
          qList={formatData}
        />
      )}
      {step === Stage.end && (
        <ResultCom
          ans={ans || {}}
          ansMapping={hashBlock}
          reset={() => setStep(Stage.start)}
        />
      )}
    </div>
  )
}

export default App
