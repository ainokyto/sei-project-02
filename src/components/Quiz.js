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
    correctAnswer: null,
    options: null,
    characters: [],
    charactersWithHouses: [],
    spells: [],
    spellsArray: [],
    currentSpell: [],
    isGoodOrBad: [],
    randomIndex: 0,
    score: 0,
    questionsLeft: 10,
    questionType: '',
    isPlaying: true
  }

  componentDidMount = async () => {
    try {
      const res = await getAllCharacters()
      const res2 = await getAllSpells()
      this.setState({ characters: res.data, spells: res2.data })
      this.quizStart()
    } catch (err) {
      this.props.history.push('/not')
    }
  }
  
  quizStart = () => {
    this.getGoodiesAndBaddies()
    this.getHouses()
    this.getSpells()
    this.nextQuestion()
  }

  // ? SETTING FILTERED ARRAYS
  
  getGoodiesAndBaddies = () => {
    const isGoodOrBad = this.state.characters.filter(character => {
      return character.deathEater === true || character.orderOfThePhoenix === true || character.dumbledoresArmy === true
    })
    this.setState({ isGoodOrBad })
  }

  getHouses = () => {
    const charactersWithHouses = this.state.characters.filter(character => {
      return typeof (character.house) !== 'undefined' ? true : false
    })
    this.setState({ charactersWithHouses })
  }

  // ? SETTING SPELLS ARRAY

  getSpells = () => {
    const spellsArray = this.state.spells
    this.setState({ spellsArray })
  }

  // ? CHOOSING WHICH QUESTION FORMAT

  nextQuestion = () => {
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

  getGoodBadQuestion = () => {
    const questionType = 'goodOrBad'
    const randomIndex = Math.floor(Math.random() * this.state.isGoodOrBad.length)
    const character = this.state.isGoodOrBad[randomIndex]
    const goodOrBad = character.deathEater === true ? 'Bad Guy' : 'Good Guy'
    const options = ['Good Guy', 'Bad Guy']
    this.setState({ questionType, randomIndex, character, question: character.name, correctAnswer: goodOrBad, options })
  }

  // ? HOUSE QUESTIONS LOGIC

  getRandomCharacter = () => {
    const questionType = 'house'
    const randomIndex = Math.floor(Math.random() * this.state.charactersWithHouses.length)
    const character = this.state.charactersWithHouses[randomIndex]
    const options = ['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin']

    this.setState({ questionType, randomIndex, character, question: character.name, correctAnswer: character.house, options })
  }

  // ? SPELLS QUESTIONS LOGIC

  getRandomSpell = () => {
    const questionType = 'spells'
    const randomIndex = Math.floor(Math.random() * this.state.spellsArray.length)
    const currentSpell = this.state.spellsArray[randomIndex]
    this.setState({ questionType, randomIndex, currentSpell, question: currentSpell.spell, correctAnswer: currentSpell.effect }, this.getOptions)
  }

  getOptions = () => {
    const options = []
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
    options[0] = filteredSpells[ran1].effect
    options[1] = filteredSpells[ran2].effect
    options[2] = filteredSpells[ran3].effect
    const ranI = Math.floor(Math.random() * 4)
    options.splice(ranI, 0, this.state.correctAnswer)
    this.setState({ options })
  }


  //? RIGHT OR WRONG LOGIC

  handleChoice = event => {
    if (event.target.value === this.state.correctAnswer) {
      this.removeAnswer()
      this.setState({ questionsLeft: this.state.questionsLeft - 1, score: this.state.score + 10, options: [], correctAnswer: null }, this.notifyCorrect)
    } else {
      this.removeAnswer()
      this.setState({ questionsLeft: this.state.questionsLeft - 1, options: [], correctAnswer: null }, this.notifyWrong)
    }
  }

  removeAnswer = () => {
    const { questionType, charactersWithHouses, spellsArray, isGoodOrBad, randomIndex } = this.state
    if (questionType === 'house') {
      charactersWithHouses.splice(randomIndex, 1)
    } else if (questionType === 'spells') {
      spellsArray.splice(randomIndex, 1)
    } else isGoodOrBad.splice(randomIndex, 1)
    this.setState({ charactersWithHouses, spellsArray, isGoodOrBad })
  }

  notifyCorrect = () => {
    notify.show(`Correct! Your score is ${this.state.score}`, 'success', 1000)
    this.nextQuestion()
  }

  notifyWrong = () => {
    notify.show(`Wrong! Your score is ${this.state.score}`, 'error', 1000)
    this.nextQuestion()
  }

  render() {
    if (!this.state.options) return <Spinner />
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
            {questionType === 'spells' && 
              <div className="buttons is-centered spellbuttons" >
                {this.state.options.map((option, id) => (
                  <button key={id} className="button has-text-white has-background-dark is-half" onClick={this.handleChoice} value={option}>{option}</button>
                ))}
              </div>}
            {questionType === 'house' && 
              <div className="buttons is-centered" >
                {this.state.options.map((option, id) => (
                  <button key={id} 
                    className={(option === 'Gryffindor' && 'button is-danger') || 
                    (option === 'Hufflepuff' && 'button is-warning') ||
                    (option === 'Ravenclaw' && 'button is-link') ||
                    (option === 'Slytherin' && 'button is-success')} 
                    onClick={this.handleChoice} 
                    value={option}>{option}</button>
                ))}
              </div>}
            {questionType === 'goodOrBad' && 
              <div className="buttons is-centered" >
                {this.state.options.map((option, id) => (
                  <button key={id} className="button has-text-white has-background-dark" onClick={this.handleChoice} value={option}>{option}</button>
                ))}
              </div>}
          </div>
          <div className={`modal ${isPlaying ? '' : 'is-active'}`}>
            <div className="modal-background"></div>
            <div className="modal-card">
              <header className="modal-card-head has-text-centered">
                <p className="modal-card-title">Quiz over! Your score is:</p>
              </header>
              <section className="modal-card-body has-text-centered">
                <div className="score is-large">{this.state.score}</div>
              </section>
              <Link to="/" className="button">Back to home</Link>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default Quiz