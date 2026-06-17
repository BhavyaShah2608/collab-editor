import cors from 'cors';
import express from 'express';
import documentsRouter from './routes/documents';
import { env } from './config/env';

const localDevOrigins = [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/];

const app = express();

app.use(
  cors({
    origin: [env.clientUrl, ...localDevOrigins],
    credentials: true
  })
);
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_request, response) => {
  response.json({ ok: true });
});

app.use('/documents', documentsRouter);

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  const message = error instanceof Error ? error.message : 'Internal server error';
  response.status(500).json({ message });
});

export default app;