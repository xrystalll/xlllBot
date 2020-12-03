import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { apiEndPoint } from 'config';
import { StoreContext } from 'store/Store';
import Strings from 'support/Strings';
import { getCookie, clearCookies } from 'support/Utils';
import { SettingItem } from './SettingItem';
import Layout from 'components/Layout';
import Card from 'components/Card';
import { Loader } from 'components/Loader';
import Errorer from 'components/Errorer';
import { toast } from 'react-toastify';

const Settings = () => {
  const history = useHistory()

  const { state } = useContext(StoreContext)
  const [init, setInit] = useState(true)
  const [items, setItems] = useState([])
  const [noData, setNoData] = useState(false)

  useEffect(() => {
    document.title = 'xlllBot - ' + Strings.settings[state.lang]
    const fetchSettings = async () => {
      try {
        const data = await fetch(apiEndPoint + '/api/settings/all', {
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
          setItems(items.sort((a, b) => a.sort - b.sort))
          setInit(false)
        } else {
          setNoData(true)
        }
      } catch(e) {
        setNoData(true)
        console.error(e)
      }
    }

    init && fetchSettings()
  }, [history, state.lang, init])

  const changeSetting = (props) => {
    fetch(apiEndPoint + '/api/settings/toggle', {
      method: 'PUT',
      headers: {
        Authorization: 'Basic ' + btoa(getCookie('login') + ':' + getCookie('token')),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(props)
    })
      .then(response => response.json())
      .then(data => {
        if (!data.error) {
          toast.success(Strings.settingsSuccessfullySaved[state.lang])
        } else throw Error(data.error)
      })
      .catch(err => toast.error(err ? err.message : Strings.failedToSaveSettings[state.lang]))
  }

  return (
    <Layout title={Strings.settings[state.lang]} subTitle={Strings.dashboard[state.lang]}>
      <Card title={Strings.settingsList[state.lang]}>
        {items.length > 0 ? (
          items.map(item => (
            <SettingItem key={item._id} data={item} changeSetting={changeSetting} />
          ))
        ) : (
          !noData ? <Loader /> : <Errorer message={Strings.noSettings[state.lang]} />
        )}
      </Card>
    </Layout>
  )
}

export default Settings;
