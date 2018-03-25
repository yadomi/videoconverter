import React, { Component } from 'react';
import { DefaultPlayer as Video } from 'react-html5video';
import videos from './videos.json';
import { contains } from 'ramda';

import 'react-html5video/dist/styles.css';
import './App.css';

const withPublicDirectory = src => `/videos/${src}`;
const withAbsoluteURL = src => `${window.location.origin}/${src}`;

class App extends Component {

  state = {
    isSingle: false,
    videoId: null,
  }

  componentDidMount = () => {
    const { pathname } = window.location
    const regex = /^\/(\d*.mp4)$/
    const match = pathname.match(regex);
    if (match && match[1] && contains(match[1], videos)) {
      this.setState({
        isSingle: true,
        videoId: match[1]
      });
    }
  }

  _handleBack = () => {
    this.setState({
      isSingle: false,
      videoId: null,
    })
    window.history.pushState(null, document.title, window.location.origin)
  }

  _handleInputClick = event => {
    event.currentTarget.focus();
    event.currentTarget.select();
  }

  render() {
    const { isSingle, videoId } = this.state;
    return (
      <div className="App">
        <h1 onClick={this._handleBack}>Disruptive Blockchain Based Secure Video Sharer</h1>
        <div className="Container" data-is-single={isSingle}>
          {isSingle
            ? <div>
              <div className="Video" >
                <Video
                  controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']}
                  src={withPublicDirectory(videoId)} />
              </div>
              <input onClick={this._handleInputClick} value={withAbsoluteURL(videoId)} />
            </div>
            : videos.map((src, index) =>
              <div className="Meta" key={src}>
                <div className="Video" >
                  <Video
                    controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']}
                    src={withPublicDirectory(src)} />
                </div>
                <input onClick={this._handleInputClick} value={withAbsoluteURL(src)} />
              </div>
            )}
        </div>
      </div>
    );
  }
}

export default App;
