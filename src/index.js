import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from './styles.css'

export default class Signature extends Component {

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    lineWidth: PropTypes.number,
    strokeStyle: PropTypes.string,
    background: PropTypes.string,
  }

  static defaultProps = {
    lineWidth: 1,
    strokeStyle: '#000000',
    background: 'transparent'
  }

  constructor(props) {
    super(props);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.endPaintEvent = this.endPaintEvent.bind(this);

    this.isPainting = false;
    this.strokeStyle = this.props.strokeStyle;
    this.prevPos = { offsetX: 0, offsetY: 0 };
    this.line = [];

    this.position = null;
  }

  componentDidMount() {
    // Here we set up the properties of the canvas element. 
    this.canvas.width = this.props.width;
    this.canvas.height = this.props.height;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = this.props.lineWidth;
    this.position = this.canvas.getBoundingClientRect();
  }

  onMouseDown({ nativeEvent }) {
    this.isPainting = true;
    
    if (nativeEvent.changedTouches == undefined) {
      const { offsetX, offsetY } = nativeEvent;
      this.prevPos = { offsetX, offsetY };
    } else {
      // Touch
      const { pageX, pageY } = nativeEvent.changedTouches[0];
      const offsetX = pageX - this.position.x;
      const offsetY = pageY - this.position.y;
      this.prevPos = { offsetX, offsetY };
    }
  }

  onMouseMove({ nativeEvent }) {    
    if (this.isPainting) {
      let positionData, offSetData;

      if (nativeEvent.changedTouches == undefined) {
        // Mouse
        const { offsetX, offsetY } = nativeEvent;
        offSetData = { offsetX, offsetY };
        // Set the start and stop position of the paint event.
        positionData = {
          start: { ...this.prevPos },
          stop: { ...offSetData },
        };
      } else {
        // Touch
        const { pageX, pageY } = nativeEvent.changedTouches[0];
        const offsetX = pageX - this.position.x;
        const offsetY = pageY - this.position.y;

        offSetData = { offsetX, offsetY };
        // Set the start and stop position of the paint event.
        positionData = {
          start: { ...this.prevPos },
          stop: { ...offSetData },
        };
      }
            
      // Add the position to the line array
      this.line = this.line.concat(positionData);
      this.paint(this.prevPos, offSetData, this.userStrokeStyle);
    }
  }
  

  endPaintEvent() {
    if (this.isPainting) {
      this.isPainting = false;
      this.props.onChange(this.toBlob());
    }
  }

  toBlob() {
    return new Promise((resolve, reject) => {
      try {
        this.canvas.toBlob((blob) => {
          const newImg = document.createElement("img"),
                url = URL.createObjectURL(blob);
        
          newImg.onload = () => {
            // no longer need to read the blob so it's revoked
            URL.revokeObjectURL(url);

            resolve({
              blob: blob,
              dataUrl: this.canvas.toDataURL(),
              line: this.line
            });  
          };
        
          newImg.src = url;

        }, 'image/png');
      } catch (error) {

        reject(error);
        
      }
    })
  }

  paint(prevPos, currPos, strokeStyle) {
    const { offsetX, offsetY } = currPos;
    const { offsetX: x, offsetY: y } = prevPos;

    this.ctx.beginPath();
    this.ctx.strokeStyle = strokeStyle;
    // Move the the prevPosition of the mouse
    this.ctx.moveTo(x, y);
    // Draw a line to the current position of the mouse
    this.ctx.lineTo(offsetX, offsetY);
    // Visualize the line using the strokeStyle
    this.ctx.stroke();
    this.prevPos = { offsetX, offsetY };
  }

  render() {
    const { background } = this.props;
    return (
      <canvas
        id="mf-react-signature"
        ref={(ref) => (this.canvas = ref)}
        onMouseDown={this.onMouseDown}
        onMouseLeave={this.endPaintEvent}
        onMouseUp={this.endPaintEvent}
        onMouseMove={this.onMouseMove}
        onTouchStart={this.onMouseDown}
        onTouchMove={this.onMouseMove}
        onTouchEnd={this.endPaintEvent}
        onTouchCancel={this.endPaintEvent}
        style={{ background }}
      />
    )
  }
}
