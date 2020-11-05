import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getCookie, clearCookies } from 'components/support/Utils';
import { apiEndPoint } from 'config';
import { NewBadwordItem } from './NewBadwordItem';
import { BadwordItem } from './BadwordItem';
import Layout from 'components/partials/Layout';
import Card from 'components/partials/Card';
import Fab from 'components/partials/Fab';
import { Loader } from 'components/partials/Loader';
import Errorer from 'components/partials/Errorer';
import { toast } from 'react-toastify';

const Badwords = () => {
  const history = useHistory()

  const [showAdd, toggleAddState] = useState(false)
  const [noData, setNoData] = useState(false)
  const [items, setItems] = useState([])

  useEffect(() => {
    document.title = 'xlllBot - Badwords'
    const fetchBadwords = async () => {
      try {
        const data = await fetch(apiEndPoint + '/api/words/all', {
          headers: {
            Authorization: 'Basic ' + btoa(getCookie('login') + ':' + getCookie('token'))
          }
        })
        if (data.status === 401) {
          clearCookies()
          toast.error('You are not authorized')
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

    fetchBadwords()
  }, [history])

  const toggleAdd = () => {
    toggleAddState(!showAdd)
  }

  const deleteBadword = (id) => {
    fetch(apiEndPoint + '/api/words/delete', {
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
          toast.success('Badword successfully deleted')
        } else throw Error(data.error)
      })
      .catch(err => toast.error(err ? err.message : 'Failed to delete badword'))
  }

  const addBadword = (props) => {
    fetch(apiEndPoint + '/api/words/add', {
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
          toast.success('Badword successfully added')
        } else throw Error(data.error)
      })
      .catch(err => toast.error(err ? err.message : 'Failed to adding badword'))
  }

  return (
    <Layout title="Badwords" subTitle="Dashboard">
      <Card title="Badwords list" action={
        <Fab icon={showAdd ? 'close' : 'add'} title="Add new badword" onClick={toggleAdd} />
      }>
        {showAdd && <NewBadwordItem addBadword={addBadword} toggleAdd={toggleAdd} />}

        {items.length > 0 ? (
          items.map(item => (
            <BadwordItem
              key={item._id}
              data={item}
              deleteBadword={deleteBadword}
            />
          ))
        ) : (
          !noData ? <Loader /> : <Errorer message="No badwords yet" />
        )}
      </Card>
    </Layout>
  )
}

export default Badwords;
