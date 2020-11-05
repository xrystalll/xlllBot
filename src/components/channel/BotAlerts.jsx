import React from 'react';
import Card from 'components/partials/Card';
import Switch from 'components/partials/Switch';

export const BotModerator = ({ botUsername }) => {
  return (
    <Card>
      <div className="error_title">
        <div className="alert_info">
          <i className="material-icons-outlined">error_outline</i>
          {botUsername} не является модератором в чате!
        </div>
      </div>
    </Card>
  )
}

export const BotActive = ({ state, botUsername, changeActive }) => {
  return (
    <Card>
      <div className={state ? 'success_title' : 'error_title'}>
        <div className="alert_info">
          <i className="material-icons-outlined">error_outline</i>
          <Switch onChange={changeActive.bind(this)} checked={state}>
            {state ? `${botUsername} подключен к чату` : `${botUsername} не активен! Нажмите чтобы активировать`}
          </Switch>
        </div>
      </div>
    </Card>
  )
}
