// Dillon Koekemoer u23537052
import React from 'react';

/**
 * Renders text with clickable hashtags
 * @param {string} text - The text to parse
 * @param {function} onHashtagClick - Callback when hashtag is clicked
 * @returns {React.Fragment} - Rendered text with clickable hashtags
 */
export const renderTextWithHashtags = (text, onHashtagClick) => {
    if (!text) return text;

    // Regex to match hashtags (# followed by alphanumeric characters and underscores)
    const hashtagRegex = /#([a-zA-Z0-9_]+)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = hashtagRegex.exec(text)) !== null) {
        // Add text before the hashtag
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
        }

        // Add the clickable hashtag
        const hashtag = match[0];
        parts.push(
            <span
                key={`hashtag-${match.index}`}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onHashtagClick(hashtag);
                }}
                className="text-forge-yellow hover:text-forge-orange cursor-pointer font-semibold transition-colors duration-200 hover:underline"
            >
                {hashtag}
            </span>
        );

        lastIndex = match.index + match[0].length;
    }

    // Add any remaining text after the last hashtag
    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
};

/**
 * Extracts hashtags from text
 * @param {string} text - The text to extract hashtags from
 * @returns {string[]} - Array of hashtags without the # symbol
 */
export const extractHashtags = (text) => {
    if (!text) return [];
    const hashtagRegex = /#([a-zA-Z0-9_]+)/g;
    const hashtags = [];
    let match;

    while ((match = hashtagRegex.exec(text)) !== null) {
        hashtags.push(match[1]); // Extract without the # symbol
    }

    return hashtags;
};

/**
 * Renders hashtag badges that are clickable
 * @param {string[]} hashtags - Array of hashtags (without # symbol)
 * @param {function} onHashtagClick - Callback when hashtag is clicked
 * @returns {React.Fragment} - Rendered hashtag badges
 */
export const renderHashtagBadges = (hashtags, onHashtagClick) => {
    if (!hashtags || !Array.isArray(hashtags) || hashtags.length === 0) {
        return null;
    }

    return hashtags.map((tag, index) => (
        <span
            key={`badge-${tag}-${index}`}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onHashtagClick(`#${tag}`);
            }}
            className="px-3 py-1 bg-forge-yellow/20 text-forge-yellow rounded-full text-sm font-semibold border border-forge-yellow/30 cursor-pointer transition-all duration-300 hover:bg-forge-yellow hover:text-iron-dark hover:scale-105"
        >
            #{tag}
        </span>
    ));
};
