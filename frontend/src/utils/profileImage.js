// Dillon Koekemoer u23537052
// Utility functions for profile image handling

export const getProfileImageStyle = (picture) => {
    if (!picture) {
        return {
            background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
        };
    }

    // Check if it's a placeholder
    if (picture.startsWith('placeholder-')) {
        const color = picture.replace('placeholder-', '');
        return {
            background: `linear-gradient(135deg, #${color} 0%, #${color}dd 100%)`,
        };
    }

    // It's an uploaded image
    return {
        backgroundImage: `url(http://localhost:3001${picture})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    };
};

export const isPlaceholderImage = (picture) => {
    return !picture || picture.startsWith('placeholder-');
};
