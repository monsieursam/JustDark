# JustDark

A Safari web extension that provides intelligent dark mode functionality for websites across iOS and macOS platforms.

## Overview

JustDark is a Safari extension that automatically applies dark mode styling to websites, giving users control over their browsing experience. The extension offers per-website settings and can follow system preferences for seamless integration with your device's appearance settings.

## Features

- **Universal Dark Mode**: Applies dark styling to any website
- **Per-Website Control**: Individual settings for each domain
- **System Integration**: Follows macOS/iOS system appearance preferences
- **Cross-Platform**: Works on both iOS and macOS Safari
- **Intelligent Styling**: Uses CSS custom properties for consistent theming
- **Media Optimization**: Automatically adjusts image and video brightness
- **Persistent Settings**: Remembers your preferences across browsing sessions

## Project Structure

```
JustDark/
├── JustDark.xcodeproj/          # Xcode project configuration
├── Shared (App)/                # Shared app components
│   ├── ViewController.swift     # Main view controller
│   ├── Assets.xcassets/         # App icons and assets
│   └── Resources/               # Web resources and styling
├── Shared (Extension)/          # Safari extension code
│   ├── SafariWebExtensionHandler.swift  # Native messaging handler
│   └── Resources/               # Extension resources
│       ├── manifest.json        # Extension manifest
│       ├── content.js          # Content script for dark mode
│       ├── popup.html          # Extension popup interface
│       ├── popup.js            # Popup functionality
│       ├── popup.css           # Popup styling
│       ├── background.js       # Background script
│       └── _locales/           # Localization files
├── iOS (App)/                   # iOS-specific app files
├── iOS (Extension)/             # iOS-specific extension files
├── macOS (App)/                 # macOS-specific app files
└── macOS (Extension)/           # macOS-specific extension files
```

## Installation

### Prerequisites

- Xcode 12.0 or later
- iOS 14.0+ or macOS 11.0+
- Safari 14.0+

### Building from Source

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd JustDark
   ```

2. **Open in Xcode**:
   ```bash
   open JustDark.xcodeproj
   ```

3. **Select your target**:
   - For iOS: Select "iOS (App)" scheme
   - For macOS: Select "macOS (App)" scheme

4. **Build and run**:
   - Press `Cmd+R` to build and run the app
   - The app will install the Safari extension automatically

### Enabling the Extension

#### macOS
1. Open Safari
2. Go to Safari → Preferences → Extensions
3. Find "JustDark" and enable it
4. Grant necessary permissions when prompted

#### iOS
1. Open Settings app
2. Go to Safari → Extensions
3. Find "JustDark" and enable it
4. Grant necessary permissions when prompted

## Usage

### Basic Controls

The extension provides three modes accessible through the Safari toolbar button:

- **Dark Mode On**: Forces dark mode for the current website
- **Dark Mode Off**: Disables dark mode for the current website
- **System Preference**: Follows your device's system appearance setting

### Per-Website Settings

JustDark remembers your preference for each website domain. Settings are automatically saved and applied when you revisit the site.

### Popup Interface

Click the JustDark icon in Safari's toolbar to access:
- Current dark mode status
- Quick toggle buttons
- Website-specific settings
- Current domain information

## Technical Details

### Dark Mode Implementation

The extension uses CSS custom properties to create a consistent dark theme:

```css
:root {
  --dark-bg: #000000;
  --dark-surface: #121212;
  --dark-primary: #1f1f1f;
  --dark-secondary: #2d2d2d;
  --dark-text-primary: #e0e0e0;
  --dark-text-secondary: #a0a0a0;
  --dark-border: #333333;
}
```

### Key Components

- **Content Script** (`content.js`): Injects dark mode CSS into web pages
- **Popup Interface** (`popup.html/js`): Provides user controls
- **Background Script** (`background.js`): Manages extension lifecycle
- **Native Handler** (`SafariWebExtensionHandler.swift`): Bridges web extension and native app

### Storage

Settings are stored using the browser's storage API with the following structure:
- Domain-specific preferences
- Global extension settings
- System preference synchronization

## Development

### Code Structure

The project follows Safari Web Extension standards with:
- Manifest V3 compliance
- TypeScript-style JSDoc comments
- Modular CSS architecture
- Cross-platform Swift code

### Key Files

- `manifest.json`: Extension configuration and permissions
- `content.js`: Main dark mode logic and CSS injection
- `popup.js`: User interface interactions
- `SafariWebExtensionHandler.swift`: Native messaging bridge

### Building for Distribution

1. Archive the project in Xcode
2. Export for distribution (App Store or Developer ID)
3. The extension will be bundled with the host app

## Permissions

JustDark requires the following permissions:
- **Storage**: To save per-website preferences
- **Active Tab**: To apply dark mode to the current page
- **All URLs**: To work on any website

## Browser Compatibility

- Safari 14.0+ (macOS Big Sur and later)
- Safari on iOS 14.0+
- Safari Web Extensions API

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both iOS and macOS
5. Submit a pull request

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

```
Copyright 2024 JustDark

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

## Support

For issues and feature requests, please use the project's issue tracker.

---

**Note**: This extension modifies website appearance using CSS. Some websites with complex styling may require manual adjustments or may not work perfectly with the dark mode implementation.