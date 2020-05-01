import React from 'react'
import { Link } from 'react-router-dom'

import Footer from './Footer'

const Home = () => (
  <section className="hero is-fullheight is-warning">
    <div className="hero-body">
      <div className="container">
        <div className="hero-img"></div>
        <p className="title is-1 has-text-centered has-text-black">
          The Harry Potter Quiz
        </p>
        <div className="has-text-centered">
          <Link to='/quiz' className="button has-text-white has-background-dark">Play the quiz</Link>
        </div>
      </div>
    </div>
    <div className="hero-foot">
      <Footer />
    </div>
  </section>
)


export default Home