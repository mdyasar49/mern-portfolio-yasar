/**
 * Brand theme configuration and loader management.
 */

window.BRAND_THEME = {
    primary: '#33ccff',
    accent: '#ff3366',
    dark: '#010409',
    darkGray: '#161B22'
};

/**
 * Removes the initial loading screen.
 */
window.removeBrandLoader = function () {
    const loader = document.getElementById('brandLoader');

    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
        }, 100);
    }
};
