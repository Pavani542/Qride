# Qride

Qride is a mobile application bootstrapped with [Expo](https://expo.dev/) and built with React Native. It leverages modern authentication using Clerk and secure token storage, and is structured for scalability and maintainability. 

## Features

- **Expo Managed Workflow**: Quick development and easy deployment.
- **Clerk Authentication**: Seamless authentication using Clerk, with secure token storage via `expo-secure-store`.
- **Typed Navigation**: Uses a custom navigator with support for typed routes.
- **Custom Splash and App Icon**: Preconfigured splash screen and icons for iOS, Android, and web.
- **Font Management**: Custom fonts included (`SpaceMono-Regular`).
- **Light UI Theme**: Default user interface style set to light mode.
- **Environment Variable Support**: Reads secrets and config from `.env`.

## Project Structure

```
.
├── App.tsx
├── app.json
├── .env
├── .gitignore
├── assets/
│   ├── fonts/
│   │   └── SpaceMono-Regular.ttf
│   └── images/
│       ├── adaptive-icon.png
│       ├── appacella-logo-black.png
│       └── ... (other images)
├── src/
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   ├── components/
│   │   └── common/
│   └── ... (other source files)
└── public/
```

## Getting Started

### Prerequisites

- Node.js >= 16.x
- Expo CLI: `npm install -g expo-cli`

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Pavani542/Qride.git
   cd Qride
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables:
   - Copy the example `.env` file or create your own:
     ```
     EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-key
     ```
   - **Do NOT commit real secrets to the repository.**

4. Run the application:
   ```sh
   expo start
   ```

### Environment Variables

- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key for authentication.

### Folder Details

- **assets/fonts/**: Custom fonts for the app (e.g., SpaceMono-Regular.ttf).
- **assets/images/**: App icons, splash screens, logos.
- **src/components/**: Common React Native components used throughout the app.
- **src/navigation/**: Application navigators (e.g., AppNavigator).
- **public/**: (If used) Static public assets for web builds.

### Expo & Build Configuration

- The Expo configuration is in `app.json`, including icon paths, splash configuration, plugins, and additional project metadata.
- Plugins used: `expo-router`, `expo-splash-screen`, `expo-font`, `expo-web-browser`, `expo-secure-store`.

### Security

- **.env** is used for environment variables and should never be committed with secrets.
- `.gitignore` excludes node modules, build outputs, debug logs, and local environment files.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE) (if applicable)

## Acknowledgments

- [Expo](https://expo.dev/)
- [Clerk](https://clerk.com/)
- [React Native](https://reactnative.dev/)
