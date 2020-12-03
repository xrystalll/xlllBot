import React from 'react';
import '././style.css';

const Layout = ({ title, subTitle, videoLayout, action, children }) => {
  const videoblock = videoLayout ? ' videoblock' : ''

  return (
    <div className="layout">
      <section id="main">
        <div className={'content--boxed-sm' + videoblock}>
          <header className="content__header">
            <h2>{title} {!!subTitle && <small>{subTitle}</small>}</h2>
            {!!action && action}
          </header>
          {children}
        </div>
      </section>
    </div>
  )
}

export default Layout;
