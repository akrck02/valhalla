import { ValhallaError } from "../errors.js"

/** Something kept in a collection: anything with an id of its own. */
export interface Item {
  id: string
}

/**
 * A list of items kept in the browser's own storage under one key, so they never leave the
 * computer. Tasks and notes are each one.
 */
export interface Collection<T extends Item> {
  /** The storage key, such as "valhalla.tasks". */
  key: string
  /** Says whether a stored value is a whole item; anything else is left out when loading. */
  isItem: (value: unknown) => value is T
  /** The error code when an item to change or delete is not there. */
  notFound: string
}

/** Reads the saved items; an empty or damaged store gives no items rather than breaking the app. */
export function loadItems<T extends Item>(storage: Storage, collection: Collection<T>): T[] {
  const saved = storage.getItem(collection.key)
  if (saved === null) {
    return []
  }
  try {
    const parsed: unknown = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed.filter(collection.isItem) : []
  } catch {
    return [] // a damaged store is lost, not fatal: the next save writes a good one
  }
}

/** Saves every item. */
export function saveItems<T extends Item>(storage: Storage, collection: Collection<T>, items: T[]): void {
  storage.setItem(collection.key, JSON.stringify(items))
}

/** Saves a changed item in the place of the one with its id. */
export function updateItem<T extends Item>(storage: Storage, collection: Collection<T>, item: T): void {
  const items = loadItems(storage, collection)
  items[indexOf(items, collection, item.id)] = item
  saveItems(storage, collection, items)
}

/** Deletes the item with this id. */
export function deleteItem<T extends Item>(storage: Storage, collection: Collection<T>, id: string): void {
  const items = loadItems(storage, collection)
  items.splice(indexOf(items, collection, id), 1)
  saveItems(storage, collection, items)
}

function indexOf<T extends Item>(items: T[], collection: Collection<T>, id: string): number {
  const index = items.findIndex(item => item.id === id)
  if (index === -1) {
    throw new ValhallaError(collection.notFound, `there is no item ${id} in ${collection.key}`)
  }
  return index
}
