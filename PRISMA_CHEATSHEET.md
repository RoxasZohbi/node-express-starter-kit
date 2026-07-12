# Adding a new table — cheatsheet

1. **Define the model** in `prisma/schema.prisma`:
   ```prisma
   model Product {
     id        Int      @id @default(autoincrement())
     name      String
     price     Int
     createdAt DateTime @default(now())
   }
   ```

2. **Generate + apply the migration**:
   ```bash
   npm run prisma:migrate -- --name add_product
   ```
   This creates `prisma/migrations/<timestamp>_add_product/` and regenerates the Prisma client.

3. **Use it in a route** (`src/server.ts` or wherever), import the shared client:
   ```ts
   import { prisma } from './lib/prisma';

   app.get('/products', async (req: Request, res: Response) => {
     const products = await prisma.product.findMany();
     res.json(products);
   });

   app.post('/products', async (req: Request, res: Response) => {
     const { name, price } = req.body;
     const product = await prisma.product.create({ data: { name, price } });
     res.status(201).json(product);
   });
   ```
   Model name in `schema.prisma` is `Product` → client property is lowercase `prisma.product`.

4. **Verify**:
   ```bash
   npm run dev
   curl -X POST localhost:3000/products -H "Content-Type: application/json" -d '{"name":"Widget","price":100}'
   curl localhost:3000/products
   ```

## Common query shapes
```ts
prisma.product.findUnique({ where: { id } })
prisma.product.findMany({ where: { name: { contains: 'wid' } } })
prisma.product.update({ where: { id }, data: { price: 200 } })
prisma.product.delete({ where: { id } })
```

## Notes
- Never hand-edit an already-applied migration — change the schema and run `prisma:migrate` again for a new one.
- `npm run prisma:studio` opens a GUI to browse/edit table data.
