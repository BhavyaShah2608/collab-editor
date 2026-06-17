# Collab Editor

Minimal real-time collaborative document editor with React, TypeScript, Vite, Express, Socket.io, and MongoDB.

## Features

- Create shareable documents with unique URLs
- Real-time multi-user editing
- Auto-save every 2 seconds after changes
- Minimal rich text formatting with Tiptap
- Rename documents inline
- Document list with last modified timestamps

## Project Structure

- client: Vite React app
- server: Express API, Socket.io realtime layer, MongoDB models

## Local Setup

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file from `.env.example`

3. Start both apps

```bash
npm run dev
```

## Environment Variables

Client:

- `VITE_API_URL`
- `VITE_SOCKET_URL`

Server:

- `PORT`
- `MONGODB_URI`

## Deployment

- Build the client and server with `npm run build`
- Deploy the server to a Node.js host
- Point `MONGODB_URI` to a managed MongoDB deployment
- Deploy the client to static hosting and set `VITE_API_URL` and `VITE_SOCKET_URL` to the server URL
