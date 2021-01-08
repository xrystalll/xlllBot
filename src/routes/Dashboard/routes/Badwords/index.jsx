import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { apiEndPoint } from 'config';
import { StoreContext } from 'store/Store';
import Strings from 'support/Strings';
import { getCookie, clearCookies } from 'support/Utils';
import { NewBadwordItem } from './NewBadwordItem';
import { BadwordItem } from './BadwordItem';
import Layout from 'components/Layout';
import Card from 'components/Card';
import Fab from 'components/Fab';
import { Loader } from 'components/Loader';
import Errorer from 'components/Errorer';
import { toast } from 'react-toastify';

const Badwords = () => {
  const history = useHistory()

  const { state } = useContext(StoreContext)
  const [init, setInit] = useState(true)
  const [showAdd, toggleAddState] = useState(false)
  const [noData, setNoData] = useState(false)
  const [items, setItems] = useState([])

  useEffect(() => {
    document.title = 'xlllBot - ' + Strings.badwords[state.lang]
    const fetchBadwords = async () => {
      try {
        const data = await fetch(apiEndPoint + '/api/words/all', {
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

    init && fetchBadwords()
  }, [history, state.lang, init])

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
          toast.success(Strings.badwordSuccessfullyDeleted[state.lang])
        } else throw Error(data.error)
      })
      .catch(err => toast.error(err ? err.message : Strings.failedToDeleteBadword[state.lang]))
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
          toast.success(Strings.badwordSuccessfullyAdded[state.lang])
        } else throw Error(data.error)
      })
      .catch(err => toast.error(err ? err.message : Strings.failedToAddingBadword[state.lang]))
  }

  return (
    <Layout title={Strings.badwords[state.lang]} subTitle={Strings.dashboard[state.lang]}>
      <Card title={Strings.badwordsList[state.lang]} action={
        <Fab icon={showAdd ? 'close' : 'add'} title={Strings.addNewBadword[state.lang]} onClick={toggleAdd} />
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
          !noData ? <Loader /> : <Errorer message={Strings.noBadwordsYet[state.lang]} />
        )}
      </Card>
    </Layout>
  )
}

export default Badwords;
