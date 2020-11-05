import React from 'react';
import Header from 'components/partials/Header';
import Footer from 'components/partials/Footer';
import '././style.css';

const Layout = ({ title, subTitle, videoLayout, action, children }) => {
  const videoblock = videoLayout ? ' videoblock' : ''

  return (
    <div className="layout">
      <Header />

      <section id="main">
        <div className={'content--boxed-sm' + videoblock}>
          <header className="content__header">
            <h2>{title} {!!subTitle && <small>{subTitle}</small>}</h2>
            {!!action && action}
          </header>
          {children}
        </div>

        <Footer />

      </section>
    </div>
  )
}

export default Layout;
