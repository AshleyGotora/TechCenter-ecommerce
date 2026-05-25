export default async function CartRoutes(fastify) {

  fastify.post('/cart', async (request, reply) => {
    const { variation_id, quantity = 1 } = request.body
    const user = request.user

    try {
      const [existing] = await fastify.mysql.query(
        'SELECT * FROM cart WHERE user_id = ? AND variation_id = ?',
        [user.id, variation_id]
      )

      if (existing.length > 0) {
        await fastify.mysql.query(
          'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND variation_id = ?',
          [quantity, user.id, variation_id]
        )
      } else {
        await fastify.mysql.query(
          'INSERT INTO cart (user_id, variation_id, quantity) VALUES (?, ?, ?)',
          [user.id, variation_id, quantity]
        )
      }

      return reply.status(201).send({ message: 'Added to cart!' })
    } catch (err) {
      return reply.status(500).send({ error: err.message })
    }
  })

  fastify.get('/cart', async (request, reply) => {
    const user = request.user

    try {
      const [rows] = await fastify.mysql.query(`
        SELECT 
          c.id,
          c.quantity,
          p.product_name,
          v.color,
          v.circle,
          v.url_image,
          v.storage,
          v.price
        FROM cart c
        JOIN products_variations v ON v.id = c.variation_id
        JOIN products p ON p.id = v.product_id
        WHERE c.user_id = ?
      `, [user.id])

      return reply.send(rows)
    } catch (err) {
      return reply.status(500).send({ error: err.message })
    }
  })

  fastify.delete('/cart/:id', async (request, reply) => {
    const { id } = request.params
    const user = request.user

    try {
      const [result] = await fastify.mysql.query(
        'DELETE FROM cart WHERE id = ? AND user_id = ?',
        [id, user.id]
      )

      if (result.affectedRows === 0) {
        return reply.status(404).send({ error: 'Item not found!' })
      }

      return reply.send({ message: 'Removed from cart!' })
    } catch (err) {
      return reply.status(500).send({ error: err.message })
    }
  })

fastify.patch('/cart/:id', async (request, reply) => {
  const { id } = request.params
  const user = request.user

  try {
    const [existing] = await fastify.mysql.query(
      'SELECT * FROM cart WHERE id = ? AND user_id = ?',
      [id, user.id]
    )

    if (existing.length === 0) {
      return reply.status(404).send({ error: 'Item not found!' })
    }

    if (existing[0].quantity <= 1) {
      await fastify.mysql.query(
        'DELETE FROM cart WHERE id = ? AND user_id = ?',
        [id, user.id]
      )
      return reply.send({ message: 'Item removed from cart!' })
    }

    await fastify.mysql.query(
      'UPDATE cart SET quantity = quantity - 1 WHERE id = ? AND user_id = ?',
      [id, user.id]
    )

    return reply.send({ message: 'Quantity decreased!' })

  } catch (err) {
    return reply.status(500).send({ error: err.message })
  }
})
}