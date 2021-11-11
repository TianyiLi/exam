/// <reference types="vite/client" />

declare module 'data.json' {
  type data = {
    question: string
    select: string[]
  }
  const list: data[]
  export default list
}

declare type QConfig = {
  id: string
  answer: string[]
  lastAnswer?: string[]
  question: {
    text: string
    comment: string
    origin: string
  }
  options: { value: string; label: string }[]
}
