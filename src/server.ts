import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import 'dotenv/config'
import { myLogger, myLogger2 } from './middleware';
import { prisma } from './lib/prisma';

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});