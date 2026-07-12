import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import 'dotenv/config'
import { myLogger, myLogger2 } from './middleware';
import { prisma } from './lib/prisma';
import { generateTokenPair, verifyRefreshToken} from './lib/utils'

const app: Express = express();
app.use(express.json());
app.use(myLogger);
const port = 3000;

app.get('/', myLogger2, (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World!');
});

app.get('/users', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post('/users', async (req: Request, res: Response) => {
  const { email, name } = req.body;
  const user = await prisma.user.create({ data: { email, name } });
  res.status(201).json(user);
});

app.post('/login', (req: Request, res: Response) => {
  // Placeholder — replace with real credential check once you have a user store
  const { email } = req.body;
  const tokens = generateTokenPair({ userId: '1', email });
  res.json({ success: true, ...tokens });
});

app.post('/refresh', (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ success: false, message: 'refreshToken is required' });
    return;
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const tokens = generateTokenPair({ userId: payload.userId, email: payload.email });
    res.json({ success: true, ...tokens });
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});