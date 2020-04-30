import axios from 'axios'

const baseUrl = 'https://www.potterapi.com/v1'
const apiKey = '?key=$2a$10$SLAHotrJyfZAIYXMSplRZew5E88zjHb3myvtizMuA0AtOu/yhw6vG'

export const getAllCharacters = () => {
  return axios.get(`${baseUrl}/characters${apiKey}`)
}

export const getAllSpells = () => {
  return axios.get(`${baseUrl}/spells${apiKey}`)
}