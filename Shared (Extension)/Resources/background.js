/**
 * Dark Mode Extension Background Script
 * Handles extension lifecycle and coordination between components
 */

// Dark mode states
const DARK_MODE_STATES = {
    OFF: 'off',
    ON: 'on',
    SYSTEM: 'system'
};

/**
 * Handle extension installation
 */
browser.runtime.onInstalled.addListener((details) => {
    console.log('Eclipse Dark Mode Extension installed:', details.reason);
    
    if (details.reason === 'install') {
        // Set default settings on first install
        initializeDefaultSettings();
    }
});

/**
 * Initialize default settings for new installation
 */
async function initializeDefaultSettings() {
    try {
        // Check if we already have any settings
        const allSettings = await browser.storage.local.get();
        
        // If no settings exist, this is a fresh install
        if (Object.keys(allSettings).length === 0) {
            console.log('Setting up default dark mode preferences');
            // Default to system preference - no need to set anything
            // as the content script defaults to SYSTEM when no setting is found
        }
    } catch (error) {
        console.error('Error initializing default settings:', error);
    }
}

/**
 * Handle messages from content scripts and popup
 */
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Background received message:', request);
    
    switch (request.action) {
        case 'getDarkModeSetting':
            handleGetDarkModeSetting(request, sendResponse);
            return true; // Keep message channel open for async response
            
        case 'setDarkModeSetting':
            handleSetDarkModeSetting(request, sendResponse);
            return true;
            
        case 'getAllSettings':
            handleGetAllSettings(sendResponse);
            return true;
            
        default:
            console.log('Unknown action:', request.action);
            sendResponse({ error: 'Unknown action' });
    }
});

/**
 * Handle getting dark mode setting for a domain
 */
async function handleGetDarkModeSetting(request, sendResponse) {
    try {
        const domain = request.domain;
        if (!domain) {
            sendResponse({ error: 'Domain not provided' });
            return;
        }
        
        const result = await browser.storage.local.get([domain]);
        const setting = result[domain] || DARK_MODE_STATES.SYSTEM;
        
        sendResponse({ setting: setting });
    } catch (error) {
        console.error('Error getting dark mode setting:', error);
        sendResponse({ error: error.message });
    }
}

/**
 * Handle setting dark mode setting for a domain
 */
async function handleSetDarkModeSetting(request, sendResponse) {
    try {
        const { domain, setting } = request;
        
        if (!domain || !setting) {
            sendResponse({ error: 'Domain or setting not provided' });
            return;
        }
        
        if (!Object.values(DARK_MODE_STATES).includes(setting)) {
            sendResponse({ error: 'Invalid setting value' });
            return;
        }
        
        await browser.storage.local.set({ [domain]: setting });
        sendResponse({ success: true });
        
    } catch (error) {
        console.error('Error setting dark mode setting:', error);
        sendResponse({ error: error.message });
    }
}

/**
 * Handle getting all settings
 */
async function handleGetAllSettings(sendResponse) {
    try {
        const allSettings = await browser.storage.local.get();
        sendResponse({ settings: allSettings });
    } catch (error) {
        console.error('Error getting all settings:', error);
        sendResponse({ error: error.message });
    }
}

/**
 * Handle storage changes and notify relevant tabs
 */
browser.storage.onChanged.addListener(async (changes, areaName) => {
    if (areaName !== 'local') return;
    
    // Notify all tabs about storage changes
    try {
        const tabs = await browser.tabs.query({});
        
        for (const [domain, change] of Object.entries(changes)) {
            const relevantTabs = tabs.filter(tab => {
                try {
                    const tabDomain = new URL(tab.url).hostname;
                    return tabDomain === domain;
                } catch {
                    return false;
                }
            });
            
            // Send update message to relevant tabs
            for (const tab of relevantTabs) {
                try {
                    await browser.tabs.sendMessage(tab.id, {
                        action: 'updateDarkMode',
                        setting: change.newValue,
                        domain: domain
                    });
                } catch (error) {
                    // Tab might not be ready or have content script loaded
                    console.log('Could not send message to tab:', tab.id, error.message);
                }
            }
        }
    } catch (error) {
        console.error('Error notifying tabs of storage changes:', error);
    }
});
