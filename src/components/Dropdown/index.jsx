import React, { useState, useEffect, useRef, useContext } from 'react';
import { StoreContext } from 'store/Store';
import Strings from 'support/Strings';
import CustomScrollbar from 'components/CustomScrollbar';
import { CSSTransition } from 'react-transition-group';
import '././style.css';

const DropdownItem = ({ onClick, data, setActiveMenu, goToMenu, leftIcon, rightIcon, header, children }) => {
  const dropHeader = header ? ' drop-header' : ''

  const click = () => {
    goToMenu && setActiveMenu(goToMenu)

    onClick && onClick(data)
  }

  return (
    <span className={'menu-item' + dropHeader} onClick={click}>
      {leftIcon && (
        <span className="icon-button">
          <i className="material-icons">{leftIcon}</i>
        </span>
      )}
      {children}
      {rightIcon && (
        <span className="icon-right">
          <i className="material-icons">{rightIcon}</i>
        </span>
      )}
    </span>
  )
}

const DropdownMenu = ({ login }) => {
  const { state, dispatch } = useContext(StoreContext)
  const [activeMenu, setActiveMenu] = useState('main')
  const [menuHeight, setMenuHeight] = useState(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    setMenuHeight(dropdownRef.current?.querySelector('.menu').offsetHeight + 16)
  }, [])

  const calcHeight = (el) => {
    const height = el.offsetHeight
    setMenuHeight(height + 16)
  }

  const setLanguage = (data) => {
    dispatch({ type: 'SET_LANG', payload: data.lang })
  }

  const goTo = (data) => {
    const win = window.open(data.url, '_blank')
    win.focus()
  }

  return (
    <div className="dropdown" style={{ height: menuHeight }} ref={dropdownRef}>
      <CustomScrollbar className="navigation__menu">

        <CSSTransition
          in={activeMenu === 'main'}
          timeout={300}
          classNames="menu-primary"
          unmountOnExit
          onEnter={calcHeight}
        >
          <div className="menu">
            <DropdownItem
              leftIcon="account_circle"
              onClick={goTo}
              data={{ url: 'https://twitch.tv/' + login }}
            >
              <div className="menu-item-title">{Strings.openTwitchProfile[state.lang]}</div>
            </DropdownItem>
            <DropdownItem
              leftIcon="language"
              rightIcon="chevron_right"
              goToMenu="language"
              setActiveMenu={setActiveMenu}
            >
              <div className="menu-item-title">{Strings.language[state.lang]}</div>
            </DropdownItem>
          </div>
        </CSSTransition>

        <CSSTransition
          in={activeMenu === 'language'}
          timeout={300}
          classNames="menu-secondary"
          unmountOnExit
          onEnter={calcHeight}>
          <div className="menu">
            <DropdownItem
              goToMenu="main"
              leftIcon="arrow_back"
              setActiveMenu={setActiveMenu}
              header
            >
              <div className="menu-item-title">{Strings.language[state.lang]}</div>
            </DropdownItem>
            <DropdownItem
              goToMenu="main"
              onClick={setLanguage}
              data={{ lang: 'ru'}}
              rightIcon={state.lang === 'ru' ? 'done' : '' }
              setActiveMenu={setActiveMenu}
            >
              <div className="menu-item-title">{Strings.russian[state.lang]}</div>
            </DropdownItem>
            <DropdownItem
              goToMenu="main"
              onClick={setLanguage}
              data={{ lang: 'en'}}
              rightIcon={state.lang === 'en' ? 'done' : '' }
              setActiveMenu={setActiveMenu}
            >
              <div className="menu-item-title">{Strings.english[state.lang]}</div>
            </DropdownItem>
          </div>
        </CSSTransition>

      </CustomScrollbar>
    </div>
  )
}

const Dropdown = ({ login, logo }) => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    open && document.addEventListener('click', handleOutsideClick, false)
    return () => {
      document.removeEventListener('click', handleOutsideClick, false)
    }
  }, [open])

  const handleOutsideClick = (e) => {
    if (!e.target.closest('.dropdown')) {
      setOpen(false)
    }
  }

  const openDropdown = () => {
    setOpen(!open)
  }

  return (
    <ul className="top-menu">
      <li className="top-menu__profile">
        <div className="nav-item" onClick={openDropdown}>
          <span className="userName">{login || ''}</span>
          <div className="userPhoto" style={{ 'backgroundImage': `url(${logo || ''})` }} />
        </div>

        {open && <DropdownMenu login={login} />}
      </li>
    </ul>
  )
}

export default Dropdown;
