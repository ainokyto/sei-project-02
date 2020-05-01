import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Home from './components/Home'
import Quiz from './components/Quiz'
import Error from './components/Error'

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/quiz" component={Quiz} />
        <Route path="/*" component={Error} />
      </Switch>
    </BrowserRouter>
  )
}

export default App