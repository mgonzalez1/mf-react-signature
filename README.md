# mf-react-signature

> Simulates the effect of painting on a canvas that is compatible with both the cursor and touch screens (smartphones, cell phones or mobiles).

[![NPM](https://img.shields.io/npm/v/mf-react-signature.svg)](https://www.npmjs.com/package/mf-react-signature) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save mf-react-signature
```

## Usage

```jsx
import React, { Component } from 'react'

import Signature from 'mf-react-signature'

export default class App extends Component {
  onChange(res) {
    res.then((signature) => {
      console.log({signature}); // {blob, dataUrl, line[]}

      const div = document.querySelector('#download');
      const saveImg = document.createElement('a');
      saveImg.href = signature.dataUrl;
      saveImg.download = "signature.png";
      saveImg.innerHTML = "Click to download"; 
      div.innerHTML = '';
      div.append(saveImg);
    });
  }

  render () {
    return (
      <div>
        <Signature 
          width={500}                           // Required
          height={250}                          // Required
          strokeStyle={'#000000'}               // Optional        
          background={'transparent'}            // Optional
          onChange={this.onChange.bind(this)}   // Required
        />
        <div id="download"></div>
      </div>
    )
  }
}
```

## License

MIT © [mgonzalez1](https://github.com/mgonzalez1)
