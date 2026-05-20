export default async function (fastify, opts) {

  fastify.post('/brands', async (request, reply) => {
    const { name } = request.body;

    if (!name) {
      return reply.status(400).send({ error: "Fill required fields!"})
    }

    try {
      await fastify.mysql.query('INSERT INTO brands(name) VALUES (?)', [name]);

      return reply.status(200).send({ message: "Brand added succesfully!"})
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: error.message})
    }
  });

  fastify.delete('/brands/:id', async (request, reply) => {
  const { id } = request.params;

  try {
    const [result] = await fastify.mysql.query('DELETE FROM brands WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return reply.status(404).send({ error: "Brand not found!" });
    }

    return reply.status(200).send({ message: "Brand deleted successfully!" });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: error.message });
  }
});

  fastify.post('/products', async (request, reply) => {
    const { products, brands_id} = request.body;

    if (!brands_id) {
      return reply.status(400).send({ error: "Require brands_id"})
    }

    if (!Array.isArray(products)) {
      return reply.status(404).send({ error: "Expected an array!" });
    }

    try {
      for (const product of products) {
        const { product_name } = product;
        if (!product_name) continue;
        await fastify.mysql.query(
          'INSERT INTO products (brands_id, product_name) VALUES (?, ?)',
          [brands_id, product_name]
        );
      }
      return reply.send({ message: "Products inserted successfully!" });
    } catch (err) {
      console.error(err);
      return reply.status(500).send({ error: "Server error" });
    }
  });

  fastify.get('/products', async (request, reply) => {
    const [products] = await fastify.mysql.query('SELECT p.id, p.product_name, v.url_image, v.price FROM products p JOIN products_variations v ON p.id = v.product_id WHERE v.id = (SELECT MIN(id) FROM products_variations WHERE product_id = p.id)');
    return products;
  });

  fastify.get('/products/:id', async (request, reply) => {
    const { id } = request.params;

    const [[product]] = await fastify.mysql.query(
      'SELECT * FROM products WHERE id = ?', [id]
    );

    const [variations] = await fastify.mysql.query(
      'SELECT * FROM products_variations WHERE product_id = ?', [id]
    );

    return { product, variations };
  });

  fastify.post('/products_variations', async (request, reply) => {
    const variations = request.body;

    try {
      for (const item of variations) {
        const { product_id, color, circle, url_image, storage, price } = item;
        if (!product_id || !color || !circle || !url_image || !storage || !price) continue;
        await fastify.mysql.query(
          'INSERT INTO products_variations (product_id, color, circle, url_image, storage, price) VALUES (?,?,?,?,?,?)',
          [product_id, color, circle, url_image, storage, price]
        );
      }
      return reply.status(201).send({ message: "All variations added!" });
    } catch (err) {
      return reply.status(500).send({ error: 'Error in the server!', details: err.message });
    }
  });

  fastify.get('/products/brand/:brand', async (request, reply) => {
  const { brand } = request.params;

  try {
    const [rows] = await fastify.mysql.query(
      `SELECT 
        p.id,
        p.product_name,
        pv.id        AS var_id,
        pv.color,
        pv.circle,
        pv.url_image,
        pv.storage,
        pv.price
      FROM brands b
      JOIN products p ON p.brands_id = b.id
      JOIN products_variations pv ON pv.product_id = p.id
      WHERE LOWER(b.name) = LOWER(?)
      ORDER BY p.id, pv.storage, pv.color`,
      [brand]
    );

    // Agrupar variações por produto
    const map = {};
    for (const row of rows) {
      if (!map[row.id]) {
        map[row.id] = {
          id: row.id,
          product_name: row.product_name,
          variations: []
        };
      }
      map[row.id].variations.push({
        id: row.var_id,
        color: row.color,
        circle: row.circle,
        url_image: row.url_image,
        storage: row.storage,
        price: Number(row.price)
      });
    }

    return reply.send(Object.values(map));
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ error: err.message });
  }
});
}