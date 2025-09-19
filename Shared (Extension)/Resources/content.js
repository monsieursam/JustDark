/**
 * Dark Mode Extension Content Script
 * Applies dark mode CSS to web pages based on user settings
 */

// Dark mode CSS styles
const darkModeCSS = `
  :root {
    --dark-bg: #000000;
    --dark-surface: #121212;
    --dark-primary: #1f1f1f;
    --dark-secondary: #2d2d2d;
    --dark-text-primary: #e0e0e0;
    --dark-text-secondary: #a0a0a0;
    --dark-border: #333333;
  }

  html, body {
    background-color: var(--dark-bg) !important;
    color: var(--dark-text-primary) !important;
  }

  div, section, article, aside, nav, main, header, footer, ul {
    background-color: var(--dark-bg) !important;
    color: var(--dark-text-primary) !important;
    border-color: var(--dark-border) !important;
  }

  p, span, h1, h2, h3, h4, h5, h6, a, li, td, th {
    color: var(--dark-text-primary) !important;
  }

  a:visited {
    color: var(--dark-text-secondary) !important;
  }

  input, textarea, select, button, em {
    background-color: var(--dark-primary) !important;
    color: var(--dark-text-primary) !important;
    border-color: var(--dark-border) !important;
  }

  img, video {
    filter: brightness(0.85) !important;
  }

  /* Invert certain elements that might look better inverted */
  .invert-in-dark {
    filter: invert(1) hue-rotate(180deg) !important;
  }
`;

// Dark mode states
const DARK_MODE_STATES = {
    OFF: 'off',
    ON: 'on',
    SYSTEM: 'system'
};

let styleElement = null;
let currentDomain = null;

/**
 * Initialize content script
 */
(async function initialize() {
    currentDomain = window.location.hostname;
    await loadAndApplySettings();

    // Listen for system theme changes
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addListener(handleSystemThemeChange);
    }
})();

/**
 * Load settings from storage and apply dark mode if needed
 */
async function loadAndApplySettings() {
    try {
        const result = await browser.storage.local.get([currentDomain]);
        const setting = result[currentDomain] || DARK_MODE_STATES.SYSTEM;
        applyDarkModeSetting(setting);
    } catch (error) {
        console.error('Error loading dark mode settings:', error);
        // Default to system preference on error
        applyDarkModeSetting(DARK_MODE_STATES.SYSTEM);
    }
}

/**
 * Apply dark mode setting
 */
function applyDarkModeSetting(setting) {
    let shouldApplyDarkMode = false;

    switch (setting) {
        case DARK_MODE_STATES.ON:
            shouldApplyDarkMode = true;
            break;
        case DARK_MODE_STATES.OFF:
            shouldApplyDarkMode = false;
            break;
        case DARK_MODE_STATES.SYSTEM:
            shouldApplyDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            break;
    }

    if (shouldApplyDarkMode) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
}

/**
 * Enable dark mode by injecting CSS
 */
function enableDarkMode() {
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'eclipse-dark-mode-styles';
        styleElement.textContent = darkModeCSS;
        document.head.appendChild(styleElement);
    }
}

/**
 * Disable dark mode by removing CSS
 */
function disableDarkMode() {
    if (styleElement) {
        styleElement.remove();
        styleElement = null;
    }
}

/**
 * Handle system theme changes for system preference mode
 */
async function handleSystemThemeChange() {
    try {
        const result = await browser.storage.local.get([currentDomain]);
        const setting = result[currentDomain] || DARK_MODE_STATES.SYSTEM;

        // Only react to system changes if we're in system mode
        if (setting === DARK_MODE_STATES.SYSTEM) {
            applyDarkModeSetting(setting);
        }
    } catch (error) {
        console.error('Error handling system theme change:', error);
    }
}

/**
 * Listen for messages from popup
 */
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateDarkMode' && request.domain === currentDomain) {
        applyDarkModeSetting(request.setting);
        sendResponse({ success: true });
    }
    return true; // Keep message channel open for async response
});

/**
 * Listen for storage changes (in case settings are changed from another tab)
 */
browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes[currentDomain]) {
        const newSetting = changes[currentDomain].newValue;
        if (newSetting) {
            applyDarkModeSetting(newSetting);
        }
    }
});
