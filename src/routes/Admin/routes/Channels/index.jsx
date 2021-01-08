import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { apiEndPoint } from 'config';
import { StoreContext } from 'store/Store';
import Strings from 'support/Strings';
import { getCookie, clearCookies } from 'support/Utils';
import { ChannelItem } from './ChannelItem';
import Layout from 'components/Layout';
import Card from 'components/Card';
import { Loader } from 'components/Loader';
import Errorer from 'components/Errorer';
import { toast } from 'react-toastify';

const Channels = () => {
  const history = useHistory()

  const { state } = useContext(StoreContext)
  const [init, setInit] = useState(true)
  const [noData, setNoData] = useState(false)
  const [items, setItems] = useState([])

  useEffect(() => {
    document.title = 'xlllBot - ' + Strings.allChannels[state.lang]

    if (!state.admin) {
      history.push('/')
      return
    }

    const fetchChannels = async () => {
      try {
        const data = await fetch(apiEndPoint + '/api/admin/channels/all', {
          headers: {
            Authorization: 'Basic ' + btoa(getCookie('login') + ':' + getCookie('token'))
          }
        })
        if (data.status === 401) {
          clearCookies()
          toast.error(Strings.youAreNotAuthorized[state.lang])
          history.push('/')
          return
        }
        const items = await data.json()

        if (items.length > 0) {
          items.reverse()
          setItems(items)
          setInit(false)
        } else {
          setNoData(true)
        }
      } catch(e) {
        setNoData(true)
        console.error(e)
      }
    }

    init && fetchChannels()
  }, [history, state.lang, state.admin, init])

  return (
    <Layout title={Strings.allChannels[state.lang]} subTitle={Strings.adminPanel[state.lang]} back="/admin">
      <Card title={Strings.channelsList[state.lang]}>
        {items.length > 0 ? (
          items.map(item => (
            <ChannelItem
              key={item._id}
              data={item}
            />
          ))
        ) : (
          !noData ? <Loader /> : <Errorer message={Strings.noChannelsYet[state.lang]} />
        )}
      </Card>
    </Layout>
  )
}

export default Channels;
