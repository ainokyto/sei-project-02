# Harry Potter API Quiz - GA Project Two

My second dev project for the Software Engineering Immersive course, a React app pair-coded with GA classmate [Alex Wheldon](https://github.com/awheldon) in a 48-hour hackathon.

The app has been deployed with Netlify and is available [here](https://harrypotterquiz.netlify.app).

## Brief: Build a React application that consumes any public API 

## Timeframe:

48 hours.

## Getting started

1. Access the source code via the 'Clone or download' button 
2. In CLI, run `yarn` on the root level to install dependencies
3. Run `yarn start` to run program in your local environment

## Technologies used:

* React.js
* Javascript (ES6)
* HTML5
* SCSS
* [PotterAPI](https://www.potterapi.com)
* Axios
* Insomnia REST Client
* Yarn
* react-router-dom
* react-notify-toast
* react-loader-spinner
* Bulma CSS Framework

## Demonstration of the App Flow

![harry-potter-api-quiz](./src/assets/screenshots/quiz.gif)

***

The Quiz has three question types: <i>Is N.N. Good Or Bad</i>, <i>Which House Does N.N. Belong To</i>, and <i>What Does This Spell Do</i>. After each question, a toast notifies player whether they were correct or false and displays their current score. The quiz goes on for ten questions, when the quiz is over player lands on a module displaying their result and a button to redirect them to home.

## Process

We started by prospecting free APIs on the Internet, and settled on a Harry Potter API that lists the dataset of 195 characters and 151 spells in J.K. Rowling's Wizarding World. After hooking into the API with Insomnia REST Client to inspect the dataset, we soon settled on the idea of building a trivia quiz that extracts the questions, options and answers from the dataset.

We then took the following steps:
* Creating the app’s wireframes.
* Writing out and planning the pseudo code.
* Creating the main page and necessary components in React: home, quiz, footer, loader spinner and error page.
* Building a router with react-router-dom for a native feel.
* Creating the quiz flow and game logic - this, as anticipated, took the vast majority of our time. 
* To style our page, we used a mix of Bulma and SCSS.

## Styling

We decided to go with Bulma CSS Framework for some out-of-the-box styling to manage our time. Serif fonts don't seem to be very en vogue in web development at the moment, but we thought they fit the theme nicely and they work well in this kind of clean and slick interface. The rest of the styling we wanted to keep quite minimal but fun to allow the user interface to be as clear and intuitive as possible. 

## Quiz Logic

As mentioned above, the quiz has three question types: 
* <i>N.N. ...Good Guy Or Bad Guy?</i> 
* <i> N.N. ...Which House Do They Belong To?</i> 
* <i>What Does This Spell Do?</i> 
Each question has four options of which one is correct and three are randomly pulled from an array of that question type's options.

In the PotterAPI Characters dataset, not all objects had a key-value pair for `house` to signify their Hogwarts house, or `deathEater`, `dumbledoresArmy` or `orderOfThePhoenix` to signify whether they were to be classed as a 'Good Guy' or a 'Bad Guy'. We filtered through the dataset to find the objects that made the cut:

```javascript
// FILTERING GOOD GUYS AND BAD GUYS

getGoodiesAndBaddies = () => {
  const isGoodOrBad = this.state.characters.filter(character => {
    return character.deathEater === true || character.orderOfThePhoenix === true ||character.dumbledoresArmy === true
  })
  this.setState({ isGoodOrBad })
}
```

Then it was just a matter of pulling a random name from the array, and giving the player options to choose from: 

```javascript 
// GOOD GUY BAD GUY QUESTION LOGIC

getGoodBadQuestion = () => {
  const questionType = 'goodOrBad'
  const randomIndex = Math.floor(Math.random() * this.state.isGoodOrBad.length)
  const character = this.state.isGoodOrBad[randomIndex]
  const goodOrBad = character.deathEater === true ? 'Bad Guy' : 'Good Guy'
  const options = ['Good Guy', 'Bad Guy']

  this.setState({ questionType, randomIndex, character, question: character.name,correctAnswer: goodOrBad, options })
}
```

For Spells, creating the quiz questions was fairly straightforward, but seeing that the actual phrasing for this question type is 'What Does This Spell Do?' a bit more work was required for the question logic. The options would have to change dynamically, so we filtered the Spells dataset to extract three spell effects by random to work as our false options. We're then inserting the correct answer into a random index in the options array:

```javascript
// SPELLS QUESTION LOGIC

getRandomSpell = () => {
  const questionType = 'spells'
  const randomIndex = Math.floor(Math.random() * this.state.spellsArray.length)
  const currentSpell = this.state.spellsArray[randomIndex]
  this.setState({ questionType, randomIndex, currentSpell, question: currentSpellspell, correctAnswer: currentSpell.effect }, this.getOptions)
}

getOptions = () => {
  const options = []
  const filteredSpells = this.state.spellsArray.filter(spell => spell.spell !== this.statecurrentSpell.spell)
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
```

And finally, some logic to decipher whether an answer was correct or false, where we also mutate the question arrays to guarantee no repeat questions:

```javascript
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
```

### Challenges

Building our first React app from scratch provided a fair amount of challenges, and getting comfortable with the asynchronous nature of state changes was definitely the most taxing part of the project. After finishing the majority of our game logic, state asynchronicity was our big gotcha - a fair chunk of our time was spent on figuring out how to get everything to happen in the correct order - until we discovered asynchronous callbacks.

### Wins

Having previously built a game as a solo project, I found pair-coding very beneficial. Creating logic in particular was very efficient as Alex and I were able to bounce off ideas with each other thus being able to work through any blockers fairly efficiently.

## Future features

Hackathon code is rarely elegant or sophisticated, and this project is no exception - the code is quick and dirty and would definitely benefit from some refactoring. PotterAPI has plenty more data to go around to satisfy all the trivia thirsty Potterheads out there. The quiz could be fleshed out a bit more with adding more question types based on the data objects, for example `ministryOfMagic`, `bloodStatus`, `species`, `boggart`.

## Key learnings

This project hugely added my knowledge about accessing and leveraging API endpoints. Also the project improved my technical communication massively: as we did a pair-coding hackathon remotely, any challenges, communication or otherwise, were a challenge to overcome, and we did just that.
