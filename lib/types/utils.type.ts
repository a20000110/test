export type ObserveElementFunction = (target: IntersectionObserverEntry["target"]) => void

export type BaseAxiosResponse<D extends any> = {
  code: number
  data: D
  message: string
}
