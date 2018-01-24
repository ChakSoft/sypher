'use strict'

const { Stream } = require('stream')
const { createCipheriv, randomBytes } = require('crypto')
const { createGzip } = require('zlib')

/**
 * Cipher a data stream
 * @param {Stream} source Source stream
 * @param {Object} encrypter Encrypter created with createCipheriv
 * @param {Buffer} iv Initialization Vector
 * @return {Promise.<Object>} Promised result of the cipherization
 */
const cipherStream = (source, encrypter, iv) => {
  return new Promise((resolve, reject) => {
    const zipper = createGzip()
    const stream = source.pipe(zipper).pipe(encrypter)
    const data = []
    stream
      .on('data', (chunk) => {
        data.push(chunk)
      })
      .on('finish', () => {
        resolve({
          content : Buffer.concat(data),
          stream,
          iv,
        })
      })
      .on('error', (error) => {
        reject(error)
      })
  })
}

/**
 * Cipher common data (string or object)
 * @param {String|Object} source Source Data
 * @param {Object} encrypter Encrypter created by createCipheriv
 * @param {Buffer} iv Initialization Vector
 * @return {Promise.<Object>} Promised result of the cipherization
 */
const cipherData = (source, encrypter, iv) => {
  return new Promise((resolve) => {
    if (typeof source === 'object' && !(source instanceof Buffer)) {
      source = JSON.stringify(source)
    }
    let crypted = encrypter.update(source, 'utf8', 'hex')
    crypted += encrypter.final('hex')
    return resolve({
      content : crypted,
      iv,
    })
  })
}

/**
 * Module to create a ciphered string
 * @param {any} payload Payload to cipher
 * @param {String} algorithm Cipher algorithm
 * @param {Buffer} key Cipher key as a Buffer
 * @return {Promise.<Object>} Promise with object result (containing iv and ciphered data)
 */
const cipher = (payload, algorithm, key) => {
  if (typeof key === 'string') {
    key = Buffer.from(key, 'hex')
  }

  const iv = randomBytes(16)
  const encrypter = createCipheriv(algorithm, key, iv)

  if (payload instanceof Stream) {
    return cipherStream(payload, encrypter, iv)
  }
  return cipherData(payload, encrypter, iv)
}

module.exports = {
  cipher,
}
