'use strict'

const { Stream } = require('stream')
const { createDecipheriv } = require('crypto')
const { createGunzip } = require('zlib')

/**
 * Deciphers a stream
 * @param {Stream} payload Incoming stream
 * @param {Object} decrypter Decipherer created with createDecipheriv
 * @return {Promise.<Object>} Promised result of the decipherization
 */
const decipherStream = (payload, decrypter) => {
  return new Promise((resolve, reject) => {
    const unzipper = createGunzip()
    const stream = payload.pipe(decrypter).pipe(unzipper)
    const data = []
    stream
      .on('data', (chunk) => {
        data.push(chunk)
      })
      .on('finish', () => {
        resolve({
          content : Buffer.concat(data),
          stream,
        })
      })
      .on('error', (err) => {
        reject(err)
      })
  })
}

/**
 * Deciphers common data (string payload) and returns it as a string or an object if JSON
 * @param {String} payload Ciphered string payload
 * @param {Object} decrypter Decipherer created with createDecipheriv
 * @return {Promise.<Object>} Promised result of the decipherization
 */
const decipherData = (payload, decrypter) => {
  return new Promise((resolve) => {
    let uncrypted = decrypter.update(payload, 'hex', 'utf8')
    uncrypted += decrypter.final('utf8')

    if (uncrypted.startsWith('{') && uncrypted.endsWith('}')) {
      try {
        uncrypted = JSON.parse(uncrypted)
      } catch (err) {}
    }
    resolve({
      content : uncrypted,
    })
  })
}

/**
 * Deciphers data from a source payload
 * @param {Stream|String} payload Payload as a stream or a ciphered string
 * @param {String} algorithm Chosen algorithm for the cipherization
 * @param {Buffer} key Buffer key
 * @param {Buffer} iv Initialization vector
 * @return {Promise.<Object>} Promised result of the decipherization
 */
const decipher = (payload, algorithm, key, iv) => {
  if (typeof key === 'string') {
    key = Buffer.from(key, 'hex')
  }

  const decrypter = createDecipheriv(algorithm, key, iv)

  if (payload instanceof Stream) {
    return decipherStream(payload, decrypter)
  }
  return decipherData(payload, decrypter)
}

module.exports = {
  decipher,
}
