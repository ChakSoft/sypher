/* eslint-disable no-undef */

'use strict'

const { Stream } = require('stream')
const { createReadStream } = require('fs')
const { cipher, decipher } = require('../lib')

const ALGORITHM = 'aes-256-cbc'
const KEY = 'f67cfaf045021a8634177f55e91688f5e403ee844aaa997f70b59c7d5af80f1b'

let content = null
let stream = null
let iv = null

test('Cipher a stream', async (done) => {
  try {
    const source = createReadStream('test.txt')
    const result = await cipher(source, ALGORITHM, KEY)
    content = result.content
    iv = result.iv
    stream = result.stream
    expect(iv instanceof Buffer).toBe(true)
    expect(iv.length).toBe(16)
    expect(stream instanceof Stream).toBe(true)
    done()
  } catch (err) {
    done(err)
  }
})

test('Decipher a text', async (done) => {
  try {
    const result = await decipher(stream, ALGORITHM, KEY, iv)
    expect(result.content).toBe('password')
    done()
  } catch (err) {
    done(err)
  }
})
