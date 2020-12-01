import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { getCookie, clearCookies } from 'components/support/Utils';
import { botUsername, apiEndPoint } from 'config';
import { StoreContext } from 'store/Store';
import Strings from 'language/Strings';
import { BotModerator, BotActive } from './BotAlerts';
import { TwitchPlayer } from './TwitchPlayer';
import { TwitchChat } from './TwitchChat';
import Layout from 'components/partials/Layout';
import Card from 'components/partials/Card';
import { Loader } from 'components/partials/Loader';
import { toast } from 'react-toastify';

const Channel = () => {
  const history = useHistory()

  const { state } = useContext(StoreContext)
  const [channel, setChannel] = useState('')
  const [isModerator, setModerator] = useState(true)
  const [botActive, setActive] = useState(false)

  useEffect(() => {
    document.title = 'xlllBot - ' + Strings.channel[state.lang]
    const fetchChannel = async () => {
      try {
        const data = await fetch(apiEndPoint + '/api/channel', {
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
        const channel = await data.json()

        setChannel(channel[0].name)
        if (!!channel[0].bot_active) setActive(true)
      } catch(e) {
        console.error(e)
      }
    }

    const fetchModerators = async () => {
      try {
        const data = await fetch(apiEndPoint + '/api/channel/mods', {
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
        const moderators = await data.json()

        if (moderators.length) {
          const botIsModerator = !!moderators.filter(i => i === botUsername.toLowerCase()).length

          setModerator(botIsModerator)
        }
      } catch(e) {
        console.error(e)
      }
    }

    fetchChannel()
    fetchModerators()
  }, [history, state.lang])

  const changeActive = (e) => {
    const bool = e.currentTarget.checked
    bool ? joinToChat() : leaveChat()
  }

  const joinToChat = () => {
    fetch(apiEndPoint + '/api/bot/join', {
      headers: {
        Authorization: 'Basic ' + btoa(getCookie('login') + ':' + getCookie('token'))
      }
    })
      .then(response => response.json())
      .then(data => {
        if (!data.error) {
          setActive(true)
          toast.success(Strings.botSuccessfullyJoinedToChat[state.lang])
        } else throw Error(data.error)
      })
      .catch(err => {
        setActive(false)
        toast.error(err ? err.message : Strings.failedToJoin[state.lang])
      })
  }

  const leaveChat = () => {
    fetch(apiEndPoint + '/api/bot/leave', {
      headers: {
        Authorization: 'Basic ' + btoa(getCookie('login') + ':' + getCookie('token'))
      }
    })
      .then(response => response.json())
      .then(data => {
        if (!data.error) {
          setActive(false)
          toast.success(Strings.botSuccessfullyLeftChat[state.lang])
        } else throw Error(data.error)
      })
      .catch(err => {
        setActive(false)
        toast.error(err ? err.message : Strings.failedToLeaveFromChat[state.lang])
      })
  }

  return (
    <Layout title={Strings.channel[state.lang]} subTitle={Strings.dashboard[state.lang]} videoLayout={true}>
      {!isModerator && <BotModerator botUsername={botUsername} />}

      <BotActive state={botActive} botUsername={botUsername} changeActive={changeActive} />

      <Card className="videos_inner">
        <div className="vid-main-wrapper">
          <div className="vid-container">
            {!!channel ? <TwitchPlayer channel={channel} /> : <Loader />}
          </div>

          <div className="vid-list-container">
            <ul>
              <ol id="vid-list" style={{ 'lineHeight': 0 }}>
                {!!channel && <TwitchChat channel={channel} />}
              </ol>
            </ul>
          </div>
        </div>
      </Card>
    </Layout>
  )
}

export default Channel;
