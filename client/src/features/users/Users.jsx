import React from 'react'
import { useSelector } from 'react-redux'

const users = () => {
  const users = useSelector(state => state.user)
  return (
    <div className="p-4 bg-gray-100">
      <h1 className='text-xl font-bold mb-10'>Users : </h1>
      <div className="w-70">
        {
          users.map((user) => {
            return (
              <div key={user.id} className="p-4 m-2 bg-white shadow-md rounded-lg border border-gray-200">
                <h1 className="text-lg font-semibold text-gray-800">id :{user.id}</h1>
                <h2>{user.name}</h2>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default users