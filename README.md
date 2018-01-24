# Sypher

Strong Cipherer and Decipherer for text, objects, streams and buffers

## Installation

```bash
git clone https://github.com/ChakSoft/sypher.git
cd sypher
yarn install --env=production
```

## Usage

### Cipher a text

```javascript
const { cipher } = require('sypher')

const password = 'password'
const key = '01976eaa057ba336a9478ddc5bd9a5dd4ebbdb3256f97c7d2f1ca7fee3e0d0eb'
cipher(password, 'aes-256-cbc', key).then(({ content, iv }) => {
  // Encrypted content is in `content`
  // Generated IV is in `iv`
})
```

### Cipher a stream

```javascript
const { cipher } = require('cypher')
const { createReadStream } = require('fs')

const source = createReadStream('test.txt')
const key = '01976eaa057ba336a9478ddc5bd9a5dd4ebbdb3256f97c7d2f1ca7fee3e0d0eb'

cipher(source, 'aes-256-cbc', key).then(({ content, stream, iv }) => {
  // Encrypted content is in `content`
  // Piping stream is in `stream
  // Generated IV is in `iv`
})
```

### Decipher a text

```javascript
const { decipher } = require('sypher')

const key = '01976eaa057ba336a9478ddc5bd9a5dd4ebbdb3256f97c7d2f1ca7fee3e0d0eb'
const iv = Buffer.from('11bef69d2d16fbb1', 'hex')
const ciphered = '...'

decipher(ciphered, 'aes-256-cbc', key, iv).then(({ content }) => {
  // Deciphered content is in `content`
})
```

### Decipher a stream

```javascript
const { decipher } = require('sypher')
const { createWriteStream } = require('fs')

const source = createReadStream('ciphered.txt')
const key = '01976eaa057ba336a9478ddc5bd9a5dd4ebbdb3256f97c7d2f1ca7fee3e0d0eb'
const iv = Buffer.from('11bef69d2d16fbb1', 'hex')

decipher(source, 'aes-256-cbc', key, iv).then(({ content, stream }) => {
  // Encrypted content is in `content`
  // Piping stream is in `stream`
})
```

# Licence

This software is release under the GPL-3.0 license. Please see the [LICENSE](blob/master/LICENSE) file for further information.
