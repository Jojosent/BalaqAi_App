import { createServer } from 'node:http';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { createHandler } from './app.js';

initializeApp({ credential: applicationDefault(), projectId: process.env.FIREBASE_PROJECT_ID || 'balaqaidb' });
const server = createServer(createHandler({ auth: getAuth(), database: getFirestore(), allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:8081,http://localhost:8082').split(',') }));
server.requestTimeout = 15_000;
const port = Number(process.env.PORT || 3001);
server.listen(port, process.env.HOST || '127.0.0.1', () => console.log(`BalaqAi API listening on port ${port}`));
