import React from 'react';

const SearchInput = ({ value, onChange, placeholder }) => {
    return (
        <div className="search-container">
            <div className="search-icon">🔍</div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="search-input"
            />
        </div>
    );
};

export default SearchInput;