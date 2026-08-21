import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

let schemaReady
function ensureSchema() {
  if (!schemaReady) {
    schemaReady = sql`
      create table if not exists products (
        id          bigint generated always as identity primary key,
        name        text not null,
        description text,
        price       numeric(10, 2) not null check (price >= 0),
        created_at  timestamptz not null default now()
      )
    `
  }
  return schemaReady
}

function isAuthorized(req) {
  const token = req.headers['x-admin-token']
  return Boolean(token) && token === process.env.ADMIN_TOKEN
}

export default async function handler(req, res) {
  await ensureSchema()

  if (req.method === 'GET') {
    const products = await sql`select id, name, description, price from products order by created_at desc`
    res.status(200).json(products)
    return
  }

  if (!isAuthorized(req)) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  if (req.method === 'POST') {
    const { name, description, price } = req.body
    if (!name || price === undefined || price === null) {
      res.status(400).json({ error: 'name and price are required' })
      return
    }
    const [product] = await sql`
      insert into products (name, description, price)
      values (${name}, ${description ?? null}, ${price})
      returning id, name, description, price
    `
    res.status(201).json(product)
    return
  }

  if (req.method === 'PUT') {
    const { id, name, description, price } = req.body
    if (!id) {
      res.status(400).json({ error: 'id is required' })
      return
    }
    const [product] = await sql`
      update products
      set name = coalesce(${name}, name),
          description = coalesce(${description}, description),
          price = coalesce(${price}, price)
      where id = ${id}
      returning id, name, description, price
    `
    if (!product) {
      res.status(404).json({ error: 'Product not found' })
      return
    }
    res.status(200).json(product)
    return
  }

  if (req.method === 'DELETE') {
    const id = req.query.id
    if (!id) {
      res.status(400).json({ error: 'id is required' })
      return
    }
    await sql`delete from products where id = ${id}`
    res.status(204).end()
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}
