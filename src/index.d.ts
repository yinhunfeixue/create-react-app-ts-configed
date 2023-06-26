

declare namespace API {
  type Response<T> = {
    code: number,
    data: T,
    msg?: string,
    total?: number
  }
  type InitProps = {
    addTab: (name: string, data?: Record<string, any>, _black?: boolean) => void
  }
}

declare namespace Component {
  interface CompoentProps {
    addTab: (name: string, data?: Record<string, any>, _black?: boolean) => void
  }
}

declare module '*.lees' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.png' {
  export default string
}

