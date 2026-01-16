const { pool } = require('../database/db')

class CacheManager {
  constructor() {
    this.cache = new Map()
    this.ttl = 5 * 60 * 1000
  }

  set(key, value, ttl = this.ttl) {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttl,
    })
  }

  get(key) {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  has(key) {
    return this.get(key) !== null
  }

  delete(key) {
    return this.cache.delete(key)
  }

  clear() {
    this.cache.clear()
  }

  async getOrSet(key, factory, ttl = this.ttl) {
    const cached = this.get(key)
    if (cached !== null) {
      return cached
    }

    const value = await factory()
    this.set(key, value, ttl)
    return value
  }

  cleanup() {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key)
      }
    }
  }
}

const cacheManager = new CacheManager()

setInterval(() => {
  cacheManager.cleanup()
}, 60 * 1000)

module.exports = {
  CacheManager,
  cacheManager,
}
