import React from 'react'
import Notifications, { notify } from 'react-notify-toast'

import { getAllSpells } from '../lib/api'

class Spells extends React.Component {
  state = {
    spells: [],
    currentSpell: [],
    correctAnswer: null,
    randomSpells: ['', '', '', ''],
    score: 0
  }
 
  async componentDidMount() {
    try {
      const res = await getAllSpells()
      this.setState({ spells: res.data })
    } catch (err) {
      console.log(err)
    }
    this.getRandomSpell()
    this.getRandomAnswers()
  }
  
  getRandomSpell() {
    const random = Math.floor(Math.random() * this.state.spells.length)
    const currentSpell = this.state.spells[random]
    this.setState({ currentSpell: currentSpell, correctAnswer: currentSpell.effect })
  }

  getRandomAnswers() {
    const filteredSpells = this.state.spells.filter(spell => spell.spell !== this.state.currentSpell.spell )
    const randomSpells = []
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
    randomSpells[0] = filteredSpells[ran1].effect
    randomSpells[1] = filteredSpells[ran2].effect
    randomSpells[2] = filteredSpells[ran3].effect
    const ranI = Math.floor(Math.random() * 4)
    randomSpells.splice(ranI, 0, this.state.correctAnswer)
    console.log(randomSpells)
    this.setState({ randomSpells })
  }


  handleChoice = event => {
    if (event.target.value === this.state.correctAnswer) {
      this.setState({ score: this.state.score + 10 })
      return notify.show('Correct!')
    } else {
      notify.show('Wrong!')
    }
  }

  render() {
    if (!this.state.currentSpell) return null
    const { correctAnswer, currentSpell, score } = this.state
    console.log(correctAnswer)
    console.log(score)
    console.log(this.state.randomSpells)
    return (
      <section>
        <Notifications />
        <h1>Harry Potter API</h1>
        <p>{currentSpell.spell}</p>
        <button className="button is-danger" onClick={this.handleChoice} value={this.state.randomSpells[0]}>{this.state.randomSpells[0]}</button>
        <button className="button is-warning" onClick={this.handleChoice} value={this.state.randomSpells[1]}>{this.state.randomSpells[1]}</button>
        <button className="button is-link" onClick={this.handleChoice} value={this.state.randomSpells[2]}>{this.state.randomSpells[2]}</button>
        <button className="button is-success" onClick={this.handleChoice} value={this.state.randomSpells[3]}>{this.state.randomSpells[3]}</button>
      </section>
    )
  }
}

export default Spells