import React, { Component } from 'react';
import { getCookie } from 'components/support/Utils';
import { socket } from 'instance/Socket';
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
  _isMounted = false;
  constructor() {
    super();
    this.state = {
      response: [],
      playIndex: 0,
      playing: false,
      noData: false
    }
    this.onPlay = this.onPlay.bind(this)
    this.onPause = this.onPause.bind(this)
    this.chooseVideo = this.chooseVideo.bind(this)
    this.deleteVideo = this.deleteVideo.bind(this)
    this.skip = this.skip.bind(this)
  }

  componentDidMount() {
    document.title = 'xlllBot - Stream Dj'
    this._isMounted = true
    socket.emit('video_items', { channel: getCookie('login') })
    this.subscribeToEvents()
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  subscribeToEvents() {
    if (!this._isMounted) return

    socket.on('output_videos', (data) => {
      if (data.length > 0) {
        this.setState({ response: data })
      } else {
        this.setState({ noData: true })
      }
    })
    socket.on('new_video', (data) => {
      if (data.channel !== getCookie('login')) return

      this.setState({ response: [...this.state.response, data], noData: false })
    })
    socket.on('deteted', (data) => {
      this.setState({ response: this.state.response.filter(item => item._id !== data.id) })
      if (this.state.response.filter(item => item._id !== data.id).length === 0) {
        this.setState({ noData: true })
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
  }

  onPlay() {
    this.setState({ playing: true })
  }

  onPause() {
    this.setState({ playing: false })
  }

  onPlayPause() {
    if (player === undefined) return

    if (player.getPlayerState() === 1) player.pauseVideo()
    else player.playVideo()
  }

  chooseVideo(data) {
    if (!this._isMounted) return

    this.setState({ playIndex: Number(data.index) })

    if (player === undefined) return

    player.loadVideoById(data.id)
  }

  skip() {
    if (!this._isMounted) return

    const { response, playIndex } = this.state

    if (response.length === 0) return

    let thisIndex = playIndex + 1
    if (thisIndex >= response.length) thisIndex = 0
    this.setState({ playIndex: thisIndex })
    const id = response[thisIndex].yid

    if (player === undefined) return

    player.loadVideoById(id)
  }

  deleteVideo(id, e) {
    e.stopPropagation()
    socket.emit('delete_video', { id, channel: getCookie('login') })
  }

  render() {
    const { response, playIndex, playing, noData } = this.state
    const ytOptions = {
      height: '384',
      width: '560',
      playerVars: {
        autoplay: 0
      }
    }

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
                  videoId={response[0].yid}
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
