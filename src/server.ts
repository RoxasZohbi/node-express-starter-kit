import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import 'dotenv/config'
import { myLogger, myLogger2 } from './middleware';

const app: Express = express();
app.use(myLogger);
const port = 3000;

app.get('/', myLogger2, (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});