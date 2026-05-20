export default async function(fastify) {
    fastify.post('/carrinho', async (request, reply) => {
        const { product } = request.body;

        try {
            const [products] = await fastify.mysql.query('SELECT p.id, p.products_name, v.color, v.url_image, v.storage, v.price FROM products WHERE product_name = ?', [product]);

            if (product.length >= 1) {
                const sum = Number(product) + 1;
            } else if (product.length == 0) {
                const add = Number(product);
            }
        } catch (error) {
            return reply.starus(500).send({error: "Error adding product"})
        }
    })
}