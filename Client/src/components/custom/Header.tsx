import React from 'react'
import { FaRobot } from 'react-icons/fa'

const Header = () => {
  return (
    <header className="flex justify-between items-center mb-20">
    <div className="flex items-center">
      <FaRobot className="text-orange-500 text-2xl mr-2" />
      <h1 className="text-xl font-bold text-white">
        br<span className="text-orange-500">AI</span>n buddy
      </h1>
    </div>
  </header>
  )
}

export default Header
