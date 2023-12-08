import { z } from 'zod'
import { keywordSchema } from '../libs/zod'
import { api } from './axios'

type Keyword = z.infer<typeof keywordSchema>

export function ngrams(
  array: Keyword[],
  _numGrams?: number,
  _minOccurrences?: number,
  _lowercase?: boolean,
  _startEnd?: boolean,
  _removeStopWords?: boolean,
  _useStemming?: boolean
) {
  const numRows = array.length

  // Configuration
  const minOccurrences = _minOccurrences || 1
  const numGrams = _numGrams || 1
  const lowercase = _lowercase && true
  const startEnd = _startEnd && true
  const useStemming = _useStemming || false
  const removeStopWords = _removeStopWords || true
  const reAllowedChars = new RegExp("[^A-Za-z0-9 '’]+", 'gi') // TODO
  // prettier-ignore
  const stopWordsArray = [ "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from", "further", "had", "has", "have", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "it", "it's", "its", "itself", "let's", "me", "more", "most", "my", "myself", "nor", "of", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "she'd", "she'll", "she's", "should", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "we", "we'd", "we'll", "we're", "we've", "were", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "would", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves" ];

  const ngramsArray = []

  const ngramsResults: {
    [key: string]: number
  } = {}
  const ngramsScores: {
    [key: string]: {
      volume: number
      difficulty: number
      position: number
      source: string
    }[]
  } = {}
  const ngramsSource: {
    [key: string]: string[]
  } = {}

  // Iterate over each row in input array
  for (let col = 0; col < 1; col++) {
    for (let row = 0; row < numRows; row++) {
      // Split cell content into words
      let words = []

      const url = new URL(array[row].url, 'https://example.com/')
      const score = {
        volume: array[row].volume,
        difficulty: array[row].difficulty,
        position: array[row].position,
        source: url.hostname,
      }

      let cleanValue = clean_string(
        array[row].keyword,
        reAllowedChars,
        stopWordsArray,
        lowercase,
        removeStopWords,
        useStemming
      )

      words = cleanValue.split(' ')

      // Add START&END params
      if (numGrams >= 2 && startEnd) {
        words.unshift('START')
        words.push('END')
      }

      // Iterate through words/grams and count
      for (let j = 0; j < words.length - numGrams + 1; j++) {
        // Generate ngram combinations, eg. for 2 generates bigrams from a given string
        let gramsArray = []
        let grams = []
        for (let k = 0; k <= numGrams - 1; k++) {
          gramsArray.push(words[j + k])
        }
        grams[j] = gramsArray.join(' ') // Creates the ngram string

        if (ngramsResults.hasOwnProperty(grams[j])) {
          ngramsResults[grams[j]] += 1 // +1 the ngram if it already exists
        } else {
          ngramsResults[grams[j]] = 1 // create the value if it doesn't exist
        }

        // Append to scores array
        if (
          ngramsScores.hasOwnProperty(grams[j]) &&
          Array.isArray(ngramsScores[grams[j]])
        ) {
          ngramsScores[grams[j]].push(score)
        } else {
          ngramsScores[grams[j]] = [score]
        }
      }
    }
  }

  // Convert Dictionary to 2d array
  let arrayNgramResults = []
  for (let key in ngramsResults) {
    // Check if the property/key is defined in the object itself, not in parent
    if (
      ngramsResults.hasOwnProperty(key) &&
      key != '' &&
      ngramsResults[key] >= minOccurrences
    ) {
      arrayNgramResults.push([key, ngramsResults[key]])
    }
  }

  // Convert Dictionary to 2d array
  let arrayNgramScores = []

  for (let key in ngramsScores) {
    // Check if the property/key is defined in the object itself, not in parent
    if (
      ngramsScores.hasOwnProperty(key) &&
      key != '' &&
      ngramsResults[key] >= minOccurrences
    ) {
      const avgScore = calc_average(ngramsScores[key].map((e) => e.volume))
      const avgDifficulty = calc_average(
        ngramsScores[key].map((e) => e.difficulty)
      )
      const avgPosition = calc_average(ngramsScores[key].map((e) => e.position))
      const sources = ngramsScores[key].map((e) => e.source).reduce((acc, cur) => {
        if (acc.indexOf(cur) === -1) {
          acc.push(cur)
        }
        return acc
      }
      , [] as string[])
      arrayNgramScores.push({
        keyword: key,
        sources,
        occurences: ngramsResults[key],
        averageVolume: avgScore,
        averageDifficulty: avgDifficulty,
        averagePosition: avgPosition,
      })
    }
  }

  // Sorting by occurrences
  return arrayNgramScores.sort((a, b) => {
    return b.occurences - a.occurences
  })
}

function clean_string(
  input_string: string,
  reAllowedChars: RegExp,
  stopWordsArray: string[],
  lowercase?: boolean,
  removeStopWords?: boolean,
  useStemming?: boolean
) {
  var cleanValue = input_string
  cleanValue = typeof cleanValue === 'string' ? cleanValue : ''
  cleanValue = lowercase ? cleanValue.toLowerCase() : cleanValue

  cleanValue = cleanValue.replace('’', "'") // TODO create a separate normalization function
  cleanValue = cleanValue.replace(/\s+/g, ' ') // Whitespace spaces into single space
  cleanValue = cleanValue.replace(reAllowedChars, '') // TODO Review this

  if (removeStopWords) {
    var wordsArray = cleanValue.split(' ')
    var cleanWordsArray = []
    for (var w = 0; w < wordsArray.length; w++) {
      if (stopWordsArray.indexOf(wordsArray[w]) == -1) {
        cleanWordsArray.push(wordsArray[w])
      }
    }
    cleanValue = cleanWordsArray.join(' ')
  }

  if (useStemming) {
    var wordsArray = cleanValue.split(' ')
    var cleanWordsArray = []
    for (var w = 0; w < wordsArray.length; w++) {
      cleanWordsArray.push(wordsArray[w])
      // cleanWordsArray.push(stemmer(wordsArray[w]));
    }
    cleanValue = cleanWordsArray.join(' ')
  }

  cleanValue = cleanValue.replace(/[0-9]+/g, 'NUM') // Replace Numbers with 'NUM'
  cleanValue = cleanValue.replace(/\s\s+/g, ' ') // Double spaces into single space

  return cleanValue.trim()
}

function compare_ngram_arrays(a: number[], b: number[]) {
  return b[1] - a[1]
}

function calc_average(array: number[]) {
  let sumScore = 0
  for (let i = 0; i < array.length; i++) {
    sumScore = sumScore + array[i]
  }
  let avgScore = sumScore / array.length;

  return Math.ceil(avgScore)
}
