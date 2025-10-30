// Dillon Koekemoer u23537052
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchInput = ({ value, onChange, placeholder }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    // Debounce autocomplete requests
    useEffect(() => {
        if (!value || value.trim().length < 2) {
            setSuggestions([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            try {
                const response = await fetch(
                    `http://localhost:3001/api/search/autocomplete?q=${encodeURIComponent(value)}`
                );
                if (response.ok) {
                    const data = await response.json();
                    setSuggestions(data.suggestions || []);
                    setShowSuggestions(true);
                }
            } catch (error) {
                console.error('Autocomplete error:', error);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [value]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSuggestionClick = (suggestion) => {
        if (suggestion.type === 'user') {
            navigate(`/profile/${suggestion.id}`);
        } else if (suggestion.type === 'project') {
            navigate(`/project/${suggestion.id}`);
        } else if (suggestion.type === 'hashtag') {
            navigate(`/search?q=${encodeURIComponent(suggestion.text)}`);
        }
        onChange('');
        setShowSuggestions(false);
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0) {
            if (e.key === 'Enter' && value.trim()) {
                navigate(`/search?q=${encodeURIComponent(value.trim())}`);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                    handleSuggestionClick(suggestions[selectedIndex]);
                } else if (value.trim()) {
                    navigate(`/search?q=${encodeURIComponent(value.trim())}`);
                    setShowSuggestions(false);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                setSelectedIndex(-1);
                break;
            default:
                break;
        }
    };

    const getSuggestionIcon = (type) => {
        switch (type) {
            case 'user':
                return '👤';
            case 'project':
                return '📁';
            case 'hashtag':
                return '#️⃣';
            default:
                return '🔍';
        }
    };

    return (
        <div ref={searchRef} className="relative max-w-sm w-full">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-forge-orange text-lg">🔍</div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder={placeholder}
                className="w-full pl-12 pr-4 py-3 border-2 border-forge-orange rounded-full bg-iron-light text-silver placeholder-ash-gray focus:border-forge-yellow focus:outline-none focus:ring-4 focus:ring-forge-orange/20 transition-all duration-300 shadow-forge"
            />

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-iron-dark border-2 border-forge-orange rounded-lg shadow-forge max-h-96 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={`${suggestion.type}-${suggestion.id || suggestion.text}-${index}`}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={`px-4 py-3 cursor-pointer transition-all duration-200 flex items-start gap-3 ${
                                index === selectedIndex
                                    ? 'bg-forge-orange/20 border-l-4 border-forge-orange'
                                    : 'hover:bg-iron-light border-l-4 border-transparent'
                            } ${index !== suggestions.length - 1 ? 'border-b border-ash-gray/30' : ''}`}
                        >
                            <span className="text-xl flex-shrink-0">
                                {getSuggestionIcon(suggestion.type)}
                            </span>
                            <div className="flex-1 min-w-0">
                                <div className="text-silver font-medium truncate text-sm">
                                    {suggestion.text}
                                </div>
                                {suggestion.subtitle && (
                                    <div className="text-ash-gray text-xs truncate">
                                        {suggestion.subtitle}
                                    </div>
                                )}
                            </div>
                            <span className="text-xs text-ash-gray flex-shrink-0 capitalize">
                                {suggestion.type}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchInput;