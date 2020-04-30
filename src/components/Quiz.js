import React from 'react'
import Notifications, { notify } from 'react-notify-toast'

import { getAllCharacters } from '../lib/api'
import { getAllSpells } from '../lib/api'

class Quiz extends React.Component {
  state = {
    question: null,
    character: null,
    characters: [],
    charactersWithHouses: [],
    correctAnswer: null,
    spells: [],
    currentSpell: [],
    randomAnswers: null,
    isGoodOrBad: [],
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
    this.getGoodiesAndBaddies()
    this.nextQuestion()
  }

  // ? Setting Filtered Arrays

  getGoodiesAndBaddies() {
    const isGoodOrBad = this.state.characters.filter(character => {
      return character.deathEater === true || character.orderOfThePhoenix === true || character.dumbledoresArmy === true
    })
    this.setState({ isGoodOrBad })
  }

  getHouses() {
    const charactersWithHouses = this.state.characters.filter(character => {
      return typeof (character.house) !== 'undefined' ? true : false
    })
    this.setState({ charactersWithHouses })
  }

  // ? CHOOSING WHICH QUESTION FORMAT

  nextQuestion() {
    this.setState({ correctAnswer: null })
    const nextQuestion = Math.floor(Math.random() * 3)
    if (nextQuestion === 1) {
      this.getRandomCharacter()
    } else if (nextQuestion === 2) {
      this.getRandomSpell()
    } else {
      this.getGoodBadQuestion()
    }
  }

  // ? GOOD GUY BAD GUY QUESTION LOGIC

  getGoodBadQuestion() {
    const random = Math.floor(Math.random() * this.state.isGoodOrBad.length)
    const character = this.state.isGoodOrBad[65]
    const goodOrBad = character.deathEater === true ? 'Bad Guy' : 'Good Guy'
    const randomAnswers = ['Good Guy', 'Bad Guy']
    this.setState({ character, question: character.name, correctAnswer: goodOrBad, randomAnswers })
  }

  // ? HOUSE QUESTIONS LOGIC

  getRandomCharacter() {
    const random = Math.floor(Math.random() * this.state.charactersWithHouses.length)
    const character = this.state.charactersWithHouses[random]
    const randomAnswers = ['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin']

    this.setState({ character, question: character.name, correctAnswer: character.house, randomAnswers })
  }

  // ? SPELLS QUESTIONS LOGIC

  getRandomSpell() {
    const random = Math.floor(Math.random() * this.state.spells.length)
    const currentSpell = this.state.spells[random]
    
    this.setState({ currentSpell, question: currentSpell.spell, correctAnswer: currentSpell.effect }, this.getRandomAnswers)
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

  //? RIGHT OR WRONG LOGIC

  handleChoice = event => {
    if (event.target.value === this.state.correctAnswer) {
      notify.show('Correct!')
      this.setState({ randomAnswers: [], correctAnswer: null })
    } else {
      notify.show('Wrong!')
      this.setState({ randomAnswers: [], correctAnswer: null })
    } this.nextQuestion()
  }

  correctNotify() {
    notify.show(`Correct! Your score is ${this.state.score}`)
  }


  render() {
    if (!this.state.randomAnswers) return null
    const { correctAnswer, score, question } = this.state
    console.log(correctAnswer)
    console.log(score)
    return (
      <section>
        <Notifications />
        <h1>Harry Potter API</h1>
        <p>{question}</p>
        <p></p>
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