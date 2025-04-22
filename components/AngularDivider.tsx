const AngularDivider = () => {
  return (
    <div className="relative w-full h-24 overflow-hidden">
      <svg
        className="absolute w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0L50 12L100 0V24H0V0Z" fill="rgba(255, 255, 255, 0.1)" />
      </svg>
    </div>
  )
}

export default AngularDivider
