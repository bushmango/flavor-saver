import { _ } from './imports/lodash'

function log(...x) {
  if (console && console.log) {
    console.log('flavor-saver', ...x)
  }
}

type ArrayOfKeys<T> = Array<keyof T>

export interface IFlavorSaver<T> {
  localStorageKey: string
  // fields: [keyof T]
  save: (t: T) => void
  restore: (t: T) => T
}

export function create<T>(
  key: string,
  version: string,
  fields?: ArrayOfKeys<T>
): IFlavorSaver<T> {
  const localStorageKey = key + ':' + version
  return {
    localStorageKey: localStorageKey,
    save: (t: T) => {
      save(t, localStorageKey, fields)
    },
    restore: (t: T) => {
      return restore(t, localStorageKey, fields)
    },
  }
}

function save<T>(t: T, localStorageKey, fields?: ArrayOfKeys<T>) {
  if (typeof localStorage !== 'undefined') {
    let picked = t
    if (fields) {
      picked = _.pick(t, fields)
    }
    localStorage.setItem(localStorageKey, JSON.stringify(picked))
  }
}

function restore<T>(t: T, localStorageKey, fields?: ArrayOfKeys<T>) {
  if (typeof localStorage !== 'undefined') {
    try {
      let stored = localStorage.getItem(localStorageKey)
      if (stored) {
        // Get only picked fields
        let parsed = JSON.parse(stored)
        let picked = parsed
        if (fields) {
          picked = _.pick(parsed, fields)
        }
        return _.assign({}, t, picked)
      }
    } catch (err) {
      log('Error loading state from localStorage: ' + localStorageKey)
    }
  }
}
