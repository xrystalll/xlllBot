import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { getCookie, clearCookies } from 'components/support/Utils';
import { apiEndPoint } from 'config';
import { StoreContext } from 'store/Store';
import Strings from 'language/Strings';
import { NewCommandItem } from './NewCommandItem';
import { CommandItem } from './CommandItem';
import Layout from 'components/partials/Layout';
import Card from 'components/partials/Card';
import Fab from 'components/partials/Fab';
import { Loader } from 'components/partials/Loader';
import Errorer from 'components/partials/Errorer';
import { toast } from 'react-toastify';

const Commands = () => {
  const history = useHistory()

  const { state } = useContext(StoreContext)
  const [showAdd, toggleAddState] = useState(false)
  const [noData, setNoData] = useState(false)
  const [items, setItems] = useState([])

  useEffect(() => {
    document.title = 'xlllBot - ' + Strings.commands[state.lang]
    const fetchCommands = async () => {
      try {
        const data = await fetch(apiEndPoint + '/api/commands/all', {
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
        } else {
          setNoData(true)
        }
      } catch(e) {
        setNoData(true)
        console.error(e)
      }
    }

    fetchCommands()
  }, [history, state.lang])

  const toggleAdd = () => {
    toggleAddState(!showAdd)
  }

  const deleteCommand = (id) => {
    fetch(apiEndPoint + '/api/commands/delete', {
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
          toast.success(Strings.commandSuccessfullyDeleted[state.lang])
        } else throw Error(data.error)
      })
      .catch(err => toast.error(err ? err.message : Strings.failedToDeleteCommand[state.lang]))
  }

  const addCommand = (props) => {
    fetch(apiEndPoint + '/api/commands/add', {
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
          setItems([data, ...items])
          toggleAdd()
          toast.success(Strings.commandSuccessfullyAdded[state.lang])
        } else throw Error(data.error)
      })
      .catch(err => toast.error(err ? err.message : Strings.failedToAddingCommand[state.lang]))
  }

  const editCommand = (props) => {
    fetch(apiEndPoint + '/api/commands/edit', {
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
          toast.success(Strings.commandSuccessfullyChanged[state.lang])
        } else throw Error(data.error)
      })
      .catch(err => toast.error(err ? err.message : Strings.failedToChangeCommand[state.lang]))
  }

  return (
    <Layout title={Strings.commands[state.lang]} subTitle={Strings.dashboard[state.lang]}>
      <Card title={Strings.commandsList[state.lang]} action={
        <Fab icon={showAdd ? 'close' : 'add'} title={Strings.addNewCommand[state.lang]} onClick={toggleAdd} />
      }>
        {showAdd && <NewCommandItem addCommand={addCommand} toggleAdd={toggleAdd} />}
        {items.length > 0 ? (
          items.map(item => (
            <CommandItem
              key={item._id}
              data={item}
              editCommand={editCommand}
              deleteCommand={deleteCommand}
            />
          ))
        ) : (
          !noData ? <Loader /> : <Errorer message={Strings.noCommandsYet[state.lang]} />
        )}
      </Card>
    </Layout>
  )
}

export default Commands;
