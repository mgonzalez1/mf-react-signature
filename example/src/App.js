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
