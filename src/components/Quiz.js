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
    spellsArray: [],
    currentSpell: [],
    randomAnswers: null,
    isGoodOrBad: [],
    randomIndex: 0,
    questionType: '',
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

  nextQuestion() {
    console.log(this.state.isGoodOrBad.length, this.state.spellsArray.length, this.state.charactersWithHouses.length)
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

  getRandomSpell() {
    const questionType = 'spells'
    const randomIndex = Math.floor(Math.random() * this.state.spellsArray.length)
    const currentSpell = this.state.spellsArray[randomIndex]
    
    this.setState({ questionType, randomIndex, currentSpell, question: currentSpell.spell, correctAnswer: currentSpell.effect }, this.getRandomAnswers)
  }

  getRandomAnswers() {
    const filteredSpells = this.state.spellsArray.filter(spell => spell.spell !== this.state.currentSpell.spell)
    const randomAnswers = []
    const ran1 = Math.floor(Math.random() * 150)
    let ran2 = Math.floor(Math.random() * 150)
    while (ran2 === ran1) {
      ran2 = Math.floor(Math.random() * 150)
    }
    let ran3 = Math.floor(Math.random() * 150)
    while (ran3 === ran1 || ran3 === ran2) {
      ran3 = Math.floor(Math.random() * 150)
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
      notify.show('Correct!')
      this.removeAnswer()
      this.setState({ randomAnswers: [], correctAnswer: null })
    } else {
      notify.show('Wrong!')
      this.removeAnswer()
      this.setState({ randomAnswers: [], correctAnswer: null })
    } this.nextQuestion()
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