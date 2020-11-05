import React, { useState, useEffect } from 'react';
import { apiEndPoint } from 'config';
import { CommandItem } from './CommandItem';
import Layout from 'components/partials/Layout';
import Card from 'components/partials/Card';
import { Loader } from 'components/partials/Loader';
import Errorer from 'components/partials/Errorer';

const AllCommand = () => {
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
    document.title = 'xlllBot - All Commands'
    const fetchGames = async () => {
      try {
        const data = await fetch(apiEndPoint + '/api/games')

        const items = await data.json()

        if (items.length > 0) {
          setItems(items)
        } else {
          setNoData(true)
        }
      } catch(e) {
        setNoData(true)
        console.error(e)
      }
    }

    fetchGames()
  }, [])

  return (
    <Layout title="General commands">
      <Card title="Commands list">
        {commands.all.map((item, index) => (
          <CommandItem key={index + '_all'} data={item} type="full" />
        ))}
        <h4 className="sub_header">For moderators and owner</h4>
        {commands.mods.map((item, index) => (
          <CommandItem key={index + '_mods'} data={item} type="full" />
        ))}
      </Card>

      <Card title="Short categores names list">
        {items.length > 0 ? (
          items.map(item => (
            <CommandItem key={item._id} data={item} type="short" />
          ))
        ) : (
          !noData ? <Loader /> : <Errorer message="Commands not exists" />
        )}
      </Card>
    </Layout>
  )
}

export default AllCommand;
