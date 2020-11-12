import React, { Component } from 'react';
import { getCookie } from 'components/support/Utils';
import { socket } from 'instance/Socket';
import { StoreContext } from 'store/Store';
import YouTube from 'react-youtube';
import { Loader } from 'components/partials/Loader';
import Errorer from 'components/partials/Errorer';

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

    if (player === undefined) return

    player.pauseVideo()
  }

  render() {
    const { response, playIndex, noData } = this.context.state
    const ytOptions = {
      height: '384',
      width: '560',
      playerVars: {
        autoplay: true
      }
    }
    const initId = response.length > 0 ? response[playIndex].yid : 0

    return (
      <div className="vid-container sticky">
        <i className="material-icons close_mini" onClick={this.hideMiniPlayer}>close</i>
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
          !noData ? <Loader /> : <Errorer message="No videos yet" />
        )}
      </div>
    )
  }
}

export default YouTubePlayer;
