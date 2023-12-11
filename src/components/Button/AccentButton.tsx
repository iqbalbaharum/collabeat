interface ButtonProp {
  className?: string
  name?: string
  onClick: any
  icon?: React.ReactNode
  disabled?: boolean
  color?: string
  textColor?: string
}

const AccentButton = ({ name, onClick, icon, className, disabled, color, textColor }: ButtonProp) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`relative ring-1 ring-white/30 shadow-white inline-flex items-center justify-center px-4 py-3 overflow-hidden font-medium text-black transition duration-300 ease-out rounded-md group hover:ring-1 hover:ring-black ${
        className ?? ''
      } ${disabled ? 'cursor-not-allowed bg-slate-500' : 'bg-white cursor-pointer'}`}
    >
      <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-700"></span>
      <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-green-100 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
      <span className="relative text-white flex flex-col items-center justify-center gap-1">
        {icon}
        <span className="text-yellow-900">{name}</span>
      </span>
    </button>
  )
}

export default AccentButton
