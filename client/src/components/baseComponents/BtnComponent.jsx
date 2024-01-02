import React from 'react'

const BtnComponent = ({ name, disable, fn }) => {
  return (
    <button
      id={name}
      disabled={disable}
      type="submit"
      onClick={(e) => fn(e, name)}
      className="flex w-full justify-center rounded-md bg-orange-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
    >
      {name}
    </button>
  )
}

export default BtnComponent