import React, { useState, useEffect, useContext } from 'react';
import { apiEndPoint } from 'config';
import { StoreContext } from 'store/Store';
import Strings from 'support/Strings';
import { CommandItem } from './CommandItem';
import Layout from 'components/Layout';
import Card from 'components/Card';
import { Loader } from 'components/Loader';
import Errorer from 'components/Errorer';

const AllCommand = () => {
  const { state } = useContext(StoreContext)
  const [init, setInit] = useState(true)
  const [items, setItems] = useState([])
  const [noData, setNoData] = useState(false)
  const commands = {
    all: [{
      name: '!up or !time or !uptime',
      text: 'Stream duration'
    }, {
      name: '!old or !oldfag or !followage <username or empty>',
      text: 'Channel follow period'
    }, {
      name: '!ping',
      text: 'Game "Ping Pong"'
    }, {
      name: '!size',
      text: 'Game "Size"'
    }, {
      name: '!sr <youtube link>',
      text: 'Video request'
    }],
    mods: [{
      name: '!mute, !timeout <username> <duration or empty>',
      text: 'Timeout user'
    }, {
      name: '!ban, !permit <username> <reason or empty>',
      text: 'Permanent ban user'
    }, {
      name: '!unban <username>',
      text: 'Unban user'
    }, {
      name: '!skip',
      text: 'Skip played video'
    }, {
      name: '!game <full game name or short>',
      text: 'Set stream category. Short name is in the list below'
    }, {
      name: '!title <text>',
      text: 'Set stream name'
    }, {
      name: '!poll or !vote <Question | variant1 | variant2 | ...>',
      text: 'Create Strawpoll vote'
    }]
  }

  useEffect(() => {
    document.title = 'xlllBot - ' + Strings.allCommands[state.lang]
    const fetchGames = async () => {
      try {
        const data = await fetch(apiEndPoint + '/api/games')

        const items = await data.json()

        if (items.length > 0) {
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

    init && fetchGames()
  }, [state.lang, init])

  return (
    <Layout title={Strings.generalCommands[state.lang]}>
      <Card title={Strings.commandsList[state.lang]}>
        {commands.all.map((item, index) => (
          <CommandItem key={index + '_all'} data={item} type="full" />
        ))}
        <h4 className="sub_header">{Strings.forModeratorsAndOwner[state.lang]}</h4>
        {commands.mods.map((item, index) => (
          <CommandItem key={index + '_mods'} data={item} type="full" />
        ))}
      </Card>

      <Card title={Strings.shortCategoresNamesList[state.lang]}>
        {items.length > 0 ? (
          items.map(item => (
            <CommandItem key={item._id} data={item} type="short" />
          ))
        ) : (
          !noData ? <Loader /> : <Errorer message={Strings.noShortNames[state.lang]} />
        )}
      </Card>
    </Layout>
  )
}

export default AllCommand;
