import React, { Component } from 'react';
import { getCookie } from 'components/support/Utils';
import { socket } from 'instance/Socket';
import { StoreContext } from 'store/Store';
import YouTube from 'react-youtube';
import CustomScrollbar from '../support/CustomScrollbar';
import { VideoItem } from './VideoItem';
import Layout from 'components/partials/Layout';
import Card from 'components/partials/Card';
import Fab from 'components/partials/Fab';
import { Loader } from 'components/partials/Loader';
import Errorer from 'components/partials/Errorer';

let player
class Videos extends Component {
  static contextType = StoreContext;
  _isMounted = false;
  constructor() {
    super();

    this.onPlayerReady = this.onPlayerReady.bind(this)
    this.onPlay = this.onPlay.bind(this)
    this.onPause = this.onPause.bind(this)
    this.chooseVideo = this.chooseVideo.bind(this)
    this.deleteVideo = this.deleteVideo.bind(this)
    this.skip = this.skip.bind(this)
  }

  componentDidMount() {
    document.title = 'xlllBot - Stream Dj'
    this._isMounted = true
    this.context.dispatch({ type: 'SET_MINI', payload: false })
    this.subscribeToEvents()
    socket.emit('video_items', { channel: getCookie('login') })
  }

  componentWillUnmount() {
    if (this.context.state.playing) {
      this.context.dispatch({ type: 'SET_MINI', payload: true })
    }
    if (player !== undefined) {
      this.context.dispatch({ type: 'SET_TIME', payload: player.getCurrentTime() })
    }
    this._isMounted = false
  }

  subscribeToEvents() {
    if (!this._isMounted) return

    socket.on('output_videos', (data) => {
      if (data.length > 0) {
        this.context.dispatch({ type: 'SET_VIDEOS', payload: data })
      } else {
        this.context.dispatch({ type: 'SET_ERROR', payload: true })
      }
    })
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
      if (this.context.state.playing) {
        player.playVideo()
      } else {
        player.pauseVideo()
      }
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

  chooseVideo(data) {
    if (!this._isMounted) return

    this.context.dispatch({ type: 'SET_INDEX', payload: Number(data.index) })

    if (player === undefined) return

    player.loadVideoById(data.id)
    setTimeout(() => {
      player.playVideo()
    }, 500)
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

  deleteVideo(id, e) {
    e.stopPropagation()
    socket.emit('delete_video', { id, channel: getCookie('login') })
  }

  render() {
    const { response, playIndex, playing, noData } = this.context.state
    const ytOptions = {
      height: '384',
      width: '560',
      playerVars: {
        autoplay: 0
      }
    }
    const initId = response.length > 0 ? response[playIndex].yid : 0

    return (
      <Layout
        title="Stream Dj"
        subTitle="Dashboard"
        videoLayout={true}
        action={
          <div className="controls">
            <Fab icon={playing ? 'pause' : 'play_arrow'} title="Play/Pause" onClick={this.onPlayPause} className="inheader" />
            <Fab icon="skip_next" title="Skip" onClick={this.skip} className="inheader small" />
          </div>
        }
      >
        <Card className="videos_inner">
          <div className="vid-main-wrapper">
            <div className="vid-container">
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

            <div className="vid-list-container">
              <CustomScrollbar className="view">
                <ul>
                  <ol id="vid-list">
                    {response.length > 0 && (
                      response.map((item, index) => (
                        <VideoItem
                          key={item._id}
                          index={index}
                          playIndex={playIndex}
                          data={item}
                          chooseVideo={this.chooseVideo}
                          deleteVideo={this.deleteVideo}
                        />
                      ))
                    )}
                  </ol>
                </ul>
              </CustomScrollbar>
            </div>
          </div>
        </Card>
      </Layout>
    )
  }
}

export default Videos;
