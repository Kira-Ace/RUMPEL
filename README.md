# Rumpel - Organized File Structure

This is a beautifully designed study app UI built with React. The code has been organized following React best practices with a clean component hierarchy.

## 📁 Project Structure

```
src/
├── App.jsx                          # Main app component
├── components/
│   ├── common/                      # Shared, reusable components
│   │   ├── TopBar.jsx              # Header with logo, search, profile
│   │   ├── BottomNav.jsx           # Bottom navigation with FAB button
│   │   └── Toggle.jsx              # Reusable toggle switch component
│   └── screens/                     # Full-screen page components
│       ├── SplashScreen.jsx        # Animated splash/loading screen
│       ├── HomeScreen.jsx          # Dashboard with today's tasks & stats
│       ├── CalendarScreen.jsx      # Calendar with task management
│       ├── NotesScreen.jsx         # Notes/pinned items view
│       └── SettingsScreen.jsx      # User settings & profile
├── styles/
│   └── Styles.jsx                  # Global CSS in JSX component
└── utils/
    ├── constants.js                # App constants (MONTHS, DAYS, tasks, notes)
    └── dateUtils.js                # Date parsing & calendar logic functions
```

## 🎯 Key Features

- **Modular Components**: Each screen is a self-contained component
- **Utility Functions**: Date calculations isolated in `dateUtils.js`
- **Centralized Constants**: All hardcoded values in `constants.js`
- **Common Components**: Shared UI elements in the `common/` folder
- **Clean Styling**: All styles in one organized component

## 🚀 Usage

Import the main `App` component in your entry point:

```jsx
import App from './src/App.jsx';
```

## 📦 Dependencies

- React (useState, useEffect, useRef)
- lucide-react (icons)

## 🎨 Design System

The app uses a custom CSS color palette defined in `Styles.jsx`:
- Primary Orange: `#994700` / `#f47b20`
- Warm Peach/Cream backgrounds
- Brown accents
- Yellow highlights

---

**Ready to use!** Import `App` in your React project and enjoy the organized structure.
