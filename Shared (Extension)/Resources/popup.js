/**
 * Dark Mode Extension Popup Script
 * Handles user interactions and manages dark mode settings per website
 */

// Dark mode states
const DARK_MODE_STATES = {
    OFF: 'off',
    ON: 'on',
    SYSTEM: 'system'
};

let currentTab = null;
let currentDomain = null;

/**
 * Initialize the popup when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', async () => {
    await initializePopup();
    setupEventListeners();
});

/**
 * Initialize popup with current tab info and settings
 */
async function initializePopup() {
    try {
        // Get current active tab
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        currentTab = tabs[0];
        
        if (currentTab && currentTab.url) {
            currentDomain = extractDomain(currentTab.url);
            document.getElementById('current-website').textContent = `Settings for: ${currentDomain}`;
            
            // Load and apply current settings
            await loadCurrentSettings();
        }
    } catch (error) {
        console.error('Error initializing popup:', error);
        document.getElementById('status-text').textContent = 'Error loading settings';
    }
}

/**
 * Extract domain from URL
 */
function extractDomain(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname;
    } catch {
        return 'Unknown';
    }
}

/**
 * Load current settings for the domain
 */
async function loadCurrentSettings() {
    try {
        const result = await browser.storage.local.get([currentDomain]);
        const setting = result[currentDomain] || DARK_MODE_STATES.SYSTEM;
        
        updateUI(setting);
        updateStatus(setting);
    } catch (error) {
        console.error('Error loading settings:', error);
        updateUI(DARK_MODE_STATES.SYSTEM);
    }
}

/**
 * Update UI to reflect current setting
 */
function updateUI(setting) {
    // Remove active class from all buttons
    document.querySelectorAll('.mode-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to current setting button
    const activeButton = {
        [DARK_MODE_STATES.ON]: 'dark-on',
        [DARK_MODE_STATES.OFF]: 'dark-off',
        [DARK_MODE_STATES.SYSTEM]: 'system-pref'
    }[setting];
    
    if (activeButton) {
        document.getElementById(activeButton).classList.add('active');
    }
}

/**
 * Update status text
 */
function updateStatus(setting) {
    const statusText = {
        [DARK_MODE_STATES.ON]: 'Dark mode is ON',
        [DARK_MODE_STATES.OFF]: 'Dark mode is OFF',
        [DARK_MODE_STATES.SYSTEM]: 'Following system preference'
    }[setting] || 'Unknown state';
    
    document.getElementById('status-text').textContent = statusText;
}

/**
 * Setup event listeners for buttons
 */
function setupEventListeners() {
    document.getElementById('dark-on').addEventListener('click', () => {
        setSetting(DARK_MODE_STATES.ON);
    });
    
    document.getElementById('dark-off').addEventListener('click', () => {
        setSetting(DARK_MODE_STATES.OFF);
    });
    
    document.getElementById('system-pref').addEventListener('click', () => {
        setSetting(DARK_MODE_STATES.SYSTEM);
    });
}

/**
 * Set dark mode setting for current domain
 */
async function setSetting(setting) {
    try {
        // Save setting to storage
        await browser.storage.local.set({ [currentDomain]: setting });
        
        // Update UI
        updateUI(setting);
        updateStatus(setting);
        
        // Send message to content script
        if (currentTab && currentTab.id) {
            await browser.tabs.sendMessage(currentTab.id, {
                action: 'updateDarkMode',
                setting: setting,
                domain: currentDomain
            });
        }
    } catch (error) {
        console.error('Error setting dark mode:', error);
        document.getElementById('status-text').textContent = 'Error saving settings';
    }
}
