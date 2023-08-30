interface CountdownProp {
  text: string
}

const LoadingIndicator = (props: CountdownProp) => {
  return (
    <div className="h-120 w-120 absolute inset-x-0 mx-auto flex items-center justify-center">
      <div className="bg-pink animate-pulse rounded-full px-3 py-2 text-center text-lg font-medium leading-none text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        {props.text}
      </div>
    </div>
  )
}

export default LoadingIndicator
