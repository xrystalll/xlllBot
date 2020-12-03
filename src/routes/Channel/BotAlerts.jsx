import React, { useContext } from 'react';
import { StoreContext } from 'store/Store';
import Strings from 'support/Strings';
import Card from 'components/Card';
import Switch from 'components/Switch';

export const BotModerator = ({ botUsername }) => {
  const { state } = useContext(StoreContext)

  return (
    <Card>
      <div className="error_title">
        <div className="alert_info">
          <i className="material-icons-outlined">error_outline</i>
          {botUsername} {Strings.isNotAModeratorInTheChat[state.lang]}
        </div>
      </div>
    </Card>
  )
}

export const BotActive = ({ state: chekboxState, botUsername, changeActive }) => {
  const { state } = useContext(StoreContext)

  return (
    <Card>
      <div className={chekboxState ? 'success_title' : 'error_title'}>
        <div className="alert_info">
          <i className="material-icons-outlined">error_outline</i>
          <Switch onChange={changeActive.bind(this)} checked={chekboxState}>
            {chekboxState
              ? `${botUsername} ${Strings.connectedToChat[state.lang]}`
              : `${botUsername} ${Strings.isNotActiveClickToActivate[state.lang]}`
            }
          </Switch>
        </div>
      </div>
    </Card>
  )
}
