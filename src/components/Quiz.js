import React from 'react'
import Notifications, { notify } from 'react-notify-toast'
import { Link } from 'react-router-dom'
import Spinner from './Spinner'

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
    spellsArray: [],
    currentSpell: [],
    randomAnswers: null,
    isGoodOrBad: [],
    randomIndex: 0,
    questionType: '',
    score: 0,
    questionsLeft: 10,
    isPlaying: true,
    filteredSpells: [],
    ran1: 0,
    ran2: 0,
    ran3: 0
  }

  async componentDidMount() {
    try {
      const res = await getAllCharacters()
      const res2 = await getAllSpells()
      this.setState({ characters: res.data, spells: res2.data })
    } catch (err) {
      this.props.history.push('/not')
    }
    this.getGoodiesAndBaddies()
    this.getHouses()
    this.getSpells()
    this.nextQuestion()
  }

  // ? SETTING FILTERED ARRAYS

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

  // ? SETTING SPELLS ARRAY

  getSpells() {
    const spellsArray = this.state.spells
    this.setState({ spellsArray })
  }

  // ? CHOOSING WHICH QUESTION FORMAT

  nextQuestion = () => {
    console.log(this.state.questionsLeft)
    if (this.state.questionsLeft > 0) {
      this.setState({ correctAnswer: null })
      const nextQuestion = Math.floor(Math.random() * 3)
      if (nextQuestion === 1) {
        this.getRandomCharacter()
      } else if (nextQuestion === 2) {
        this.getRandomSpell()
      } else {
        this.getGoodBadQuestion()
      }
    } else this.setState({ isPlaying: false, question: '', questionType: '' })
  }

  // ? GOOD GUY BAD GUY QUESTION LOGIC

  getGoodBadQuestion() {
    const questionType = 'goodOrBad'
    const randomIndex = Math.floor(Math.random() * this.state.isGoodOrBad.length)
    const character = this.state.isGoodOrBad[randomIndex]
    const goodOrBad = character.deathEater === true ? 'Bad Guy' : 'Good Guy'
    const randomAnswers = ['Good Guy', 'Bad Guy']
    this.setState({ questionType, randomIndex, character, question: character.name, correctAnswer: goodOrBad, randomAnswers })
  }

  // ? HOUSE QUESTIONS LOGIC

  getRandomCharacter() {
    const questionType = 'house'
    const randomIndex = Math.floor(Math.random() * this.state.charactersWithHouses.length)
    const character = this.state.charactersWithHouses[randomIndex]
    const randomAnswers = ['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin']

    this.setState({ questionType, randomIndex, character, question: character.name, correctAnswer: character.house, randomAnswers })
  }

  // ? SPELLS QUESTIONS LOGIC

  getRandomSpell = () => {
    const questionType = 'spells'
    const randomIndex = Math.floor(Math.random() * this.state.spellsArray.length)
    const currentSpell = this.state.spellsArray[randomIndex]

    this.setState({ questionType, randomIndex, currentSpell, question: currentSpell.spell, correctAnswer: currentSpell.effect }, this.getRandomAnswers)
  }
  // check state
  // put in ternaries - this.state needs to exist
  // change state back to initial state?
  getRandomAnswers = () => {
    const randomAnswers = []
    const filteredSpells = this.state.spellsArray.filter(spell => spell.spell !== this.state.currentSpell.spell)
    const ran1 = Math.floor(Math.random() * filteredSpells.length)
    let ran2 = Math.floor(Math.random() * filteredSpells.length)
    while (ran2 === ran1) {
      ran2 = Math.floor(Math.random() * filteredSpells.length)
    }
    let ran3 = Math.floor(Math.random() * filteredSpells.length)
    while (ran3 === ran1 || ran3 === ran2) {
      ran3 = Math.floor(Math.random() * filteredSpells.length)
    }
    randomAnswers[0] = filteredSpells[ran1].effect
    randomAnswers[1] = filteredSpells[ran2].effect
    randomAnswers[2] = filteredSpells[ran3].effect
    const ranI = Math.floor(Math.random() * 4)
    randomAnswers.splice(ranI, 0, this.state.correctAnswer)
    this.setState({ randomAnswers })
  }


  //? RIGHT OR WRONG LOGIC

  handleChoice = event => {
    if (event.target.value === this.state.correctAnswer) {
      this.removeAnswer()
      this.setState({ questionsLeft: this.state.questionsLeft - 1, score: this.state.score + 10, randomAnswers: [], correctAnswer: null }, this.notifyCorrect)
    } else {
      this.removeAnswer()
      this.setState({ questionsLeft: this.state.questionsLeft - 1, randomAnswers: [], correctAnswer: null }, this.notifyWrong)
    }
  }

  removeAnswer() {
    const { questionType, charactersWithHouses, spellsArray, isGoodOrBad, randomIndex } = this.state
    if (questionType === 'house') {
      charactersWithHouses.splice(randomIndex, 1)
    } else if (questionType === 'spells') {
      spellsArray.splice(randomIndex, 1)
    } else isGoodOrBad.splice(randomIndex, 1)
    this.setState({ charactersWithHouses, spellsArray, isGoodOrBad })
  }

  notifyCorrect() {
    notify.show(`Correct! Your score is ${this.state.score}`, 'success', 2000)
    this.nextQuestion()
  }

  notifyWrong() {
    notify.show(`Wrong! Your score is ${this.state.score}`, 'error', 2000)
    this.nextQuestion()
  }

  render() {
    if (!this.state.randomAnswers) return <Spinner />
    const { question, questionType, isPlaying } = this.state
    return (
      <section className="hero is-fullheight quizhero">
        <div className="hero-body">
          <Notifications />
          <div className="container has-text-centered">
            <p className="title">{question} <br />
              <span className="subtitle">
                {`${questionType === 'spells' ? ' ...what does this spell do?' : ''}`}
                {`${questionType === 'house' ? ' ...which house does this person belong to?' : ''}`}
                {`${questionType === 'goodOrBad' ? ' ...is this person a Good Guy or a Bad Guy?' : ''}`}
              </span></p>
            <div className={`modal ${isPlaying ? '' : 'is-active'}`}>
              <div className="modal-background"></div>
              <div className="modal-card">
                <header className="modal-card-head">
                  <p className="modal-card-title">Quiz over! Your score is:</p>
                </header>
                <section className="modal-card-body">
                  <div>{this.state.score}</div>
                </section>
                <Link to="/" className="button is-fullwidth">Back to home</Link>
              </div>
            </div>
            <div className="buttons is-centered" >
              {this.state.randomAnswers.map((randomAnswer, id) => (
                <button key={id} className="button" onClick={this.handleChoice} value={randomAnswer}>{randomAnswer}</button>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default Quiz