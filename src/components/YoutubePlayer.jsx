import React, { Component } from 'react';
import { StoreContext } from 'store/Store';
import Strings from 'support/Strings';
import { getCookie } from 'support/Utils';
import { socket } from 'support/Socket';
import { Loader } from 'components/Loader';
import Errorer from 'components/Errorer';
import YouTube from 'react-youtube';
import Draggable from 'react-draggable';

let player
class YouTubePlayer extends Component {
  static contextType = StoreContext;
  _isMounted = false;
  ownClose = false
  constructor() {
    super();

    this.onPlayerReady = this.onPlayerReady.bind(this)
    this.onPlay = this.onPlay.bind(this)
    this.onPause = this.onPause.bind(this)
    this.skip = this.skip.bind(this)
    this.hideMiniPlayer = this.hideMiniPlayer.bind(this)
  }

  componentDidMount() {
    this._isMounted = true
    this.subscribeToEvents()
  }

  componentWillUnmount() {
    if (player !== undefined) {
      if (this.ownClose) {
        this.context.dispatch({ type: 'SET_TIME', payload: 0 })
      } else {
        this.context.dispatch({ type: 'SET_TIME', payload: player.getCurrentTime() })
      }
    }
    this._isMounted = false
  }

  subscribeToEvents() {
    if (!this._isMounted) return

    socket.on('skip', (data) => {
      if (data.channel !== getCookie('login')) return
      if (player === undefined) return
      if (player.getPlayerState() !== 1) return

      this.skip()
    })
  }

  onPlayerReady(e) {
    player = e.target
    if (this.context.state.time > 0) {
      player.seekTo(this.context.state.time)
      player.playVideo()
    }
  }

  onPlay() {
    this.context.dispatch({ type: 'SET_PLAYING', payload: true })
  }

  onPause() {
    this.context.dispatch({ type: 'SET_PLAYING', payload: false })
  }

  onPlayPause() {
    if (player === undefined) return

    if (player.getPlayerState() === 1) player.pauseVideo()
    else player.playVideo()
  }

  skip() {
    if (!this._isMounted) return

    const { response, playIndex } = this.context.state

    if (response.length === 0) return

    let thisIndex = playIndex + 1
    if (thisIndex >= response.length) thisIndex = 0

    this.context.dispatch({ type: 'SET_INDEX', payload: thisIndex })

    const id = response[thisIndex].yid

    if (player === undefined) return

    player.loadVideoById(id)
    setTimeout(() => {
      player.playVideo()
    }, 500)
  }

  hideMiniPlayer() {
    this.ownClose = true
    this.context.dispatch({ type: 'SET_PLAYING', payload: false })
    this.context.dispatch({ type: 'SET_MINI', payload: false })
  }

  render() {
    const { response, playIndex, noData, lang } = this.context.state
    const ytOptions = {
      width: '560',
      height: '384',
      playerVars: {
        autoplay: true
      }
    }
    const initId = response.length > 0 ? response[playIndex].yid : 0

    return (
      <Draggable>
        <div className="vid-container sticky">
          <div className="mini_overlay">
            <i className="material-icons close_mini" onClick={this.hideMiniPlayer} title={Strings.closeMiniplayer[lang]}>close</i>
          </div>
          {response.length > 0 ? (
            <YouTube
              opts={ytOptions}
              videoId={initId}
              containerClassName="iframe"
              onPlay={this.onPlay}
              onPause={this.onPause}
              onReady={this.onPlayerReady}
              onEnd={this.skip}
            />
          ) : (
            !noData ? <Loader /> : <Errorer message={Strings.noVideosYet[lang]} size={96} />
          )}
        </div>
      </Draggable>
    )
  }
}

export default YouTubePlayer;
