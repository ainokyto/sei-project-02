import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => (
  <section className="hero is-fullheight-with-navbar is-warning">
    <div className="hero-body">
      <div className="container">
        <p className="title is-1 has-text-centered has-text-black">
          The Harry Potter Quiz
        </p>
        <Link to='/quiz' className="button">Play the quiz</Link>
      </div>
    </div>
  </section>
)


export default Home