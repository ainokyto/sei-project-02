import React from 'react'
import Notifications, { notify } from 'react-notify-toast'

import { getAllCharacters } from '../lib/api'
import { getAllSpells } from '../lib/api'

class Quiz extends React.Component {
  state = {
    character: null,
    characters: [],
    charactersWithHouses: [],
    correctAnswer: null,
    spells: [],
    currentSpell: [],
    randomAnswers: ['', '', '', ''],
    score: 0
  }

  async componentDidMount() {
    try {
      const res = await getAllCharacters()
      const res2 = await getAllSpells()
      this.setState({ characters: res.data, spells: res2.data })
    } catch (err) {
      console.log(err)
    }
    this.getHouses()
    this.getRandomCharacter()
  }

  // Button logic either Houses or Spells - map them
  // randomAnswers - refactor to randomAnswers to contain the relevant logic

  // Functions Related to Houses Questions

  getHouses() {
    const charactersWithHouses = this.state.characters.filter(character => {
      return typeof (character.house) !== 'undefined' ? true : false
    })
    this.setState({ charactersWithHouses })
  }

  getRandomCharacter() {
    const random = Math.floor(Math.random() * this.state.charactersWithHouses.length)
    const character = this.state.charactersWithHouses[random]
    const randomAnswers = ['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin']
    this.setState({ character, correctAnswer: character.house, randomAnswers })
  }

  // Functions related to Spells Questions

  getRandomSpell() {
    const random = Math.floor(Math.random() * this.state.spells.length)
    const currentSpell = this.state.spells[random]
    this.setState({ currentSpell: currentSpell, correctAnswer: currentSpell.effect })
  }

  getRandomAnswers() {
    const filteredSpells = this.state.spells.filter(spell => spell.spell !== this.state.currentSpell.spell)
    const randomAnswers = []
    const ran1 = Math.floor(Math.random() * 150)
    let ran2 = Math.floor(Math.random() * 150)
    while (ran2 === ran1) {
      ran2 = Math.floor(Math.random() * 150)
    }
    console.log(ran2)
    let ran3 = Math.floor(Math.random() * 150)
    while (ran3 === ran1 || ran3 === ran2) {
      ran3 = Math.floor(Math.random() * 150)
    }
    console.log(ran1, ran2, ran3)
    randomAnswers[0] = filteredSpells[ran1].effect
    randomAnswers[1] = filteredSpells[ran2].effect
    randomAnswers[2] = filteredSpells[ran3].effect
    const ranI = Math.floor(Math.random() * 4)
    randomAnswers.splice(ranI, 0, this.state.correctAnswer)
    console.log(randomAnswers)
    this.setState({ randomAnswers })
  }



  // Function to determine if answer clicked is right or wrong

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
        <div className="buttons" >
          {this.state.randomAnswers.map((randomAnswer, id) => (
            <button key={id} className="button" onClick={this.handleChoice} value={randomAnswer}>{randomAnswer}</button>
          ))}
        </div>
      </section>
    )
  }
}

export default Quiz