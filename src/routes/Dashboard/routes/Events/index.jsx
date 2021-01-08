import { Component } from 'react';
import { StoreContext } from 'store/Store';
import Strings from 'support/Strings';
import { getCookie } from 'support/Utils';
import { socket } from 'support/Socket';
import { EventItem } from './EventItem';
import Layout from 'components/Layout';
import Card from 'components/Card';
import { Loader } from 'components/Loader';
import Errorer from 'components/Errorer';
import { toast } from 'react-toastify';

class Events extends Component {
  static contextType = StoreContext;
  _isMounted = false;
  constructor() {
    super();
    this.state = {
      response: [],
      noData: false,
      showClear: false
    }
  }

  componentDidMount() {
    document.title = 'xlllBot - ' + Strings.events[this.context.state.lang]
    this._isMounted = true
    this.subscribeToEvents()
    socket.emit('event_items', { channel: getCookie('login') })
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  subscribeToEvents() {
    if (!this._isMounted) return

    socket.on('output_events', (data) => {
      if (data.length > 0) {
        this.setState({ response: data.reverse(), showClear: true })
      } else {
        this.setState({ noData: true })
      }
    })
    socket.on('events_deleted', (data) => {
      this.setState({ showClear: false })

      if (data.deletedCount > 0) {
        this.setState({ response: [], noData: true })
        toast.success(Strings.oldEventsSuccessfullyDeleted[this.context.state.lang])
      } else {
        toast.info(Strings.nothingToClear[this.context.state.lang])
      }
    })
    socket.on('new_event', (data) => {
      if (data.channel === getCookie('login')) {
        this.setState({ response: [data, ...this.state.response], noData: false })
      }
    })
  }

  deleteEvents() {
    socket.emit('delete_events', { channel: getCookie('login') })
  }

  render() {
    const { response, showClear, noData } = this.state
    const clearVis = showClear ? '' : ' none'

    return (
      <Layout title={Strings.events[this.context.state.lang]} subTitle={Strings.dashboard[this.context.state.lang]}>
        <Card title={Strings.chatEventsByLast24Hrs[this.context.state.lang]} action={
          !noData && (
            <div className={`clear${clearVis}`} onClick={this.deleteEvents}>
              <i className="material-icons-outlined">delete</i>
              <span>{Strings.deleteAllEvents[this.context.state.lang]}</span>
            </div>
          )
        }>
          {response.length > 0 ? (
            response.map(item => (
              <EventItem key={item._id} data={item} />
            ))
          ) : (
            !noData ? <Loader /> : <Errorer message={Strings.noEventsYet[this.context.state.lang]} />
          )}
        </Card>
      </Layout>
    )
  }
}

export default Events;
