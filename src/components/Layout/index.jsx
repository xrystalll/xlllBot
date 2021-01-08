import { Link } from 'react-router-dom';
import './style.css';

const Layout = ({ title, subTitle, videoLayout, action, back, children }) => {
  const videoblock = videoLayout ? ' videoblock' : ''

  return (
    <div className="layout">
      <section id="main">
        <div className={'content--boxed-sm' + videoblock}>
          <header className="content__header">
            <h2>
              {title}
              {subTitle && back
                ? (
                  <small className="back">
                    <Link to={back}>
                      <i className="material-icons">arrow_back</i>
                      {subTitle}
                    </Link>
                  </small>
                ) : <small>{subTitle}</small>
              }
            </h2>
            {action || null}
          </header>
          {children}
        </div>
      </section>
    </div>
  )
}

export default Layout;
