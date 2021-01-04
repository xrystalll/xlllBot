import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { apiEndPoint } from 'config';
import { StoreContext } from 'store/Store';
import Strings from 'support/Strings';
import { getCookie, clearCookies } from 'support/Utils';
import { NewInviteItem } from './NewInviteItem';
import { InviteItem } from './InviteItem';
import Layout from 'components/Layout';
import Card from 'components/Card';
import Fab from 'components/Fab';
import { Loader } from 'components/Loader';
import Errorer from 'components/Errorer';
import { toast } from 'react-toastify';

const Invites = () => {
  const history = useHistory()

  const { state } = useContext(StoreContext)
  const [init, setInit] = useState(true)
  const [showAdd, toggleAddState] = useState(false)
  const [noData, setNoData] = useState(false)
  const [items, setItems] = useState([])

  useEffect(() => {
    document.title = 'xlllBot - ' + Strings.invites[state.lang]

    if (!state.admin) {
      history.push('/')
      return
    }

    const fetchInvites = async () => {
      try {
        const data = await fetch(apiEndPoint + '/api/admin/invite/all', {
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

    init && fetchInvites()
  }, [history, state.lang, state.admin, init])

  const toggleAdd = () => {
    toggleAddState(!showAdd)
  }

  const deleteInvite = (id) => {
    fetch(apiEndPoint + '/api/admin/invite/delete', {
      method: 'PUT',
      headers: {
        Authorization: 'Basic ' + btoa(getCookie('login') + ':' + getCookie('token')),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    })
      .then(response => response.json())
      .then(data => {
        if (!data.error) {
          setItems(items.filter(item => item._id !== id))
          if (items.filter(item => item._id !== id).length === 0) {
            setItems([])
            setNoData(true)
          }
          toast.success(Strings.inviteSuccessfullyDeleted[state.lang])
        } else throw Error(data.error)
      })
      .catch(err => toast.error(err ? err.message : Strings.failedToDeleteInvite[state.lang]))
  }

  const addInvite = (props) => {
    fetch(apiEndPoint + '/api/admin/invite/add', {
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
          setNoData(false)
          setItems([data.doc, ...items])
          toggleAdd()
          toast.success(Strings.inviteSuccessfullyAdded[state.lang])
        } else throw Error(data.error)
      })
      .catch(err => toast.error(err ? err.message : Strings.failedToAddingInvite[state.lang]))
  }

  return (
    <Layout title={Strings.invites[state.lang]} subTitle={Strings.adminPanel[state.lang]} back="/admin">
      <Card title={Strings.invitesList[state.lang]} action={
        <Fab icon={showAdd ? 'close' : 'add'} title={Strings.addNewInvite[state.lang]} onClick={toggleAdd} />
      }>
        {showAdd && <NewInviteItem addInvite={addInvite} toggleAdd={toggleAdd} />}

        {items.length > 0 ? (
          items.map(item => (
            <InviteItem
              key={item._id}
              data={item}
              deleteInvite={deleteInvite}
            />
          ))
        ) : (
          !noData ? <Loader /> : <Errorer message={Strings.noInvitesYet[state.lang]} />
        )}
      </Card>
    </Layout>
  )
}

export default Invites;
