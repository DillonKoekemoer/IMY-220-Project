// Dillon Koekemoer u23537052
import React from 'react';

const SearchInput = ({ value, onChange, placeholder }) => {
    return (
        <div className="relative max-w-sm">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-forge-orange text-lg">🔍</div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-12 pr-4 py-3 border-2 border-forge-orange rounded-full bg-iron-light text-silver placeholder-ash-gray focus:border-forge-yellow focus:outline-none focus:ring-4 focus:ring-forge-orange/20 transition-all duration-300 shadow-forge"
            />
        </div>
    );
};

export default SearchInput;