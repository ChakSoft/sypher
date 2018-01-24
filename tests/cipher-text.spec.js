/* eslint-disable no-undef */

'use strict'

const { cipher, decipher } = require('../lib')

const ALGORITHM = 'aes-256-cbc'
const KEY = 'f67cfaf045021a8634177f55e91688f5e403ee844aaa997f70b59c7d5af80f1b'

let content = null
let iv = null

test('Cipher a text', async (done) => {
  try {
    const password = 'password'
    const result = await cipher(password, ALGORITHM, KEY)
    content = result.content
    iv = result.iv
    expect(typeof content).toBe('string')
    expect(iv instanceof Buffer).toBe(true)
    expect(iv.length).toBe(16)
    done()
  } catch (err) {
    done(err)
  }
})

test('Decipher a text', async (done) => {
  try {
    const result = await decipher(content, ALGORITHM, KEY, iv)
    expect(result.content).toBe('password')
    done()
  } catch (err) {
    done(err)
  }
})
