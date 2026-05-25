export default async function SearchProducts(fastify) {
    fastify.get('/api/products', async (request, reply) => {
        const { search = "" } = request.query;
        if (!search.trim()) return reply.send([]);

        const termo = `%${search.trim()}%`;

        console.log("Searching for: ", termo);

        const [products] = await fastify.mysql.query('SELECT id, product_name FROM products WHERE product_name LIKE ? ORDER BY product_name DESC LIMIT 8', [termo]);

        console.log("Result: ", products);
        return reply.send(products);
    });

    fastify.get('/api/products/search', async (request, reply) => {
        const { q = "", pages = 1, limit = 20 } = request.query;
        if (!q.trim()) return reply.send({result:[], total: 0 });

        const termo = `%${q.trim()}%`;
        const offset = (Number(pages) - 1) * Number(limit);

        const [[{total}], [products]] = await Promise.all([
            fastify.mysql.query('SELECT COUNT(*) AS total FROM products WHERE product_name LIKE ?', [termo]),
            fastify.mysql.query('SELECT id, product_name FROM products WHERE product_name LIKE ? ORDER BY product_name DESC LIMIT ? OFFSET ?', [termo, Number(limit), offset])
        ]);

        return reply.send({
            results: products,
            total,
            page: Number(pages),
            totalPageNumber: Math.ceil(total/Number(limit))
        });
    })
}