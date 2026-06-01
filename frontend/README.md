This repository hosts a full-stack dashboard designed to track top upcoming tech events in the San Jose and broader San Francisco Bay Area, query them using a unified GraphQL API, and automatically create dedicated schedules via the Google Calendar API.

Built with React, Apollo Client, and GraphQL, it delivers a highly responsive, real-time booking and scheduling hub for developer conferences and tech expos.
🚀 System Architecture Overview

The system architecture utilizes a React frontend that queries an Apollo Server middleware. The GraphQL server aggregates local tech events data and interacts directly with the Google Calendar REST API through OAuth2 validation to programmatically construct user calendars.

+-----------------------------------+
|            React UI               |
|  (Event Dashboard & OAuth Auth)   |
+-----------------------------------+
                 │
  GraphQL Queries│  Apollo Client
  & Mutations    ▼
+-----------------------------------+
|           Apollo Server           |
| (Resolvers & Schema Coordination)  |
+-----------------------------------+
        │                     │
        ▼ Local Data          ▼
+---------------+     +---------------------------+
| San Jose Tech |     |    Google Calendar API    |
| Events DB     |     | (Auto-generated Calendars)|
+---------------+     +---------------------------+

🛠️ Tech Stack & Key Dependencies
Frontend

    React (v18+) – Component-driven UI.

    Apollo Client – Manages state, queries, and mutations with local cache optimization.

    TailwindCSS – Clean, modern UI styling.

Backend / Middleware

    Apollo Server – Handles the GraphQL schema definition and entry points.

    Google APIs Client Library (googleapis) – Handles OAuth2 authentication workflows and CRUD actions on calendar segments.



# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
