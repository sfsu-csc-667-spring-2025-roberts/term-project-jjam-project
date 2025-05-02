[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=18572614)

## Stuff i worked on today 4/30-mazen  if any of tihs sucks plz dm meeeee and we can fix/cook

- Worked on persistent game state saving and loading for Crazy 8s  
- Worked on "Game History & Rejoin" feature for real-time resilience  
- Worked on move handler for playing cards and drawing cards  
- Worked on exposing game state to the frontend for UI rehydration  
- Worked on lobby "Rejoin" button for active games  
- Worked on WebSocket logic for reconnects and state sync  
- Worked on test scripts and manual test instructions  
- Worked on TypeScript lint errors and code clarity  

# Crazy 8s - Term Project JJAM

## Setup Instructions

Welcome to the Crazy 8s project! This guide will help you get the project up and running quickly.

### Prerequisites

*   Node.js (version 16 or higher)
*   npm (version 7 or higher) or yarn

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd term-project-jjam-project-main
    ```

2.  Install dependencies using npm or yarn:

    **npm:**

    ```bash
    npm install
    ```

    **yarn:**

    ```bash
    yarn install
    ```

### Development

1.  Start the development server:

    ```bash
    npm start
    ```

    or

    ```bash
    yarn start
    ```

### Building

1.  Build the project for production:

    ```bash
    npm run build
    ```

    or

    ```bash
    yarn build
    ```

### Project Structure

```
term-project-jjam-project-main
├── src                 # Source code directory
│   ├── components      # Reusable UI components
│   ├── pages           # Application pages/views
│   ├── utils           # Utility functions and helpers
│   ├── App.js          # Main application component
│   └── index.js        # Entry point of the application
├── public              # Public assets (images, fonts, etc.)
├── package.json        # Project dependencies and scripts
├── README.md           # Project documentation
└── ...               # Other configuration files
```

*   `src/components`: This directory contains reusable UI components used throughout the application. Each component is typically a self-contained module with its own logic and styling.
*   `src/pages`: This directory contains the main pages or views of the application. Each page represents a specific route or section of the application.
*   `src/utils`: This directory contains utility functions and helper modules that are used across the application. These functions can include formatting, data manipulation, or any other reusable logic.
*   `App.js`: This is the main application component that serves as the root of the application. It typically defines the main layout and routing.
*   `index.js`: This is the entry point of the application where the application is initialized and rendered into the DOM.

### Additional Information

*   Refer to the project documentation for more details on the architecture and features.
