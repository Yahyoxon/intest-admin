import React from 'react';

import '../style.scss'

const Search = ({ className, text, onSearch, value, setPage = () => {}}) => {
  return (
    <div className={`search-container ${className}`}>
      <input type='search' onChange={e => {
        onSearch(e.target.value);
        setPage(1);
      }} placeholder={text} value={value} />
    </div>
  );
};

export default Search;

