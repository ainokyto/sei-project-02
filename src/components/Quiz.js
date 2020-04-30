import React from 'react'
import Notifications, { notify } from 'react-notify-toast'

import { getAllCharacters } from '../lib/api'

class Quiz extends React.Component {
  state = {
    character: null,
    characters: [],
    charactersWithHouses: [],
    correctAnswer: null,
    score: 0
  }
 
  async componentDidMount() {
    try {
      const res = await getAllCharacters()
      this.setState({ characters: res.data })
    } catch (err) {
      console.log(err)
    }
    this.getHouses()
    this.getRandomCharacter()
  }

  getHouses() {
    const charactersWithHouses = this.state.characters.filter(character => {
      return typeof(character.house) !== 'undefined' ? true : false
    })
    this.setState({ charactersWithHouses })
  }
  
  getRandomCharacter() {
    const random = Math.floor(Math.random() * this.state.charactersWithHouses.length)
    const character = this.state.charactersWithHouses[random]
    this.setState({ character: character, correctAnswer: character.house })
  }

  handleChoice = event => {
    if (event.target.value === this.state.correctAnswer) {
      this.setState({ score: this.state.score + 10 })
      return this.correctNotify()
    } else {
      notify.show('Wrong!')
    } this.getRandomCharacter()
  }

  correctNotify() {
    notify.show(`Correct! Your score is ${this.state.score}`)
  }




  // check for macth on buttonClick and correct answer


  render() {
    if (!this.state.character) return null
    const { correctAnswer, character, score } = this.state
    console.log(correctAnswer)
    console.log(score)
    return (
      <section>
        <Notifications />
        <h1>Harry Potter API</h1>
        <p>{character.name}</p>
        <button className="button is-danger" onClick={this.handleChoice} value="Gryffindor">Gryffindor</button>
        <button className="button is-warning" onClick={this.handleChoice} value="Hufflepuff">Hufflepuff</button>
        <button className="button is-link" onClick={this.handleChoice} value="Ravenclaw">Ravenclaw</button>
        <button className="button is-success" onClick={this.handleChoice} value="Slytherin">Slytherin</button>
      </section>
    )
  }
}

export default Quiz