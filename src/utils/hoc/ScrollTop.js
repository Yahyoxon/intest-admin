import React from 'react';
import isEqual from "lodash/isEqual";

const ScrollTop = (Component) => {

  const scrollToTop = () => {
    const c = document.documentElement.scrollTop || document.body.scrollTop;
    if (c > 0) {
      window.requestAnimationFrame(scrollToTop);
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: "auto"
      });
    }
  };

  class HOComponent extends React.Component {

    componentDidMount() {
      scrollToTop()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
      if(!isEqual(prevProps.match.params, this.props.match.params)){
        scrollToTop();
      }

    }

    render() {
      return <Component { ...this.props } />
    }
  }

  return HOComponent;
};

export default ScrollTop;