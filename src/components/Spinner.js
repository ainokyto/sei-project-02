import React from 'react'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import Loader from 'react-loader-spinner'

const Spinner = () => {
  return (
    <div className="Loading">
      <Loader type="BallTriangle" color="#000" height={100} width={100} timeout={2000} />
    </div>
  )
}

export default Spinner