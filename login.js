import bcrypt from 'bcrypt';
import fp from 'fastify-plugin';
import { z } from 'zod';

async function LoginRoutes(fastify, opts) {
  if (!fastify.jwt) {
    throw new Error('The @fastify/jwt plugin was not loaded in app.js');
  }

  const verifyToken = async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      return reply.status(401).send({ error: "Access denied!" });
    }
  };

  const loginSchema = z.object({
    email: z.string().email(1),
    password: z.string().min(6)
  });

  const signinSchema = z.object({
    name: z.string().min(1),
    surname: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6)
  });

  fastify.post('/login', async (request, reply) => {
    const result = loginSchema.safeParse(request.body);

    if (!result.success) {
      return reply.status(400).send({
        error: result.error.errors
      });
    }

    const { email, password } = result.data;

    try {
      const [row] = await fastify.mysql.query(
        'SELECT * FROM login WHERE email = ?', 
        [email]
      );

      if (row.length === 0) {
        return reply.status(404).send({ error: "Invalid email or password!" });
      }

      const user = row[0];

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return reply.status(401).send({ error: "Invalid email or password!" });
      }
      
      const token = fastify.jwt.sign(
        { id: user.id, name: user.name },
        { expiresIn: '1d' }
      );

      return reply.send({ 
        message: "Login successful",
        token
      });

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      return reply.status(500).send({ error: 'Error in the server!' });
    }
  });

  fastify.post('/register', async (request, reply) => {    
    const result = signinSchema.safeParse(request.body);

    if (!result.success) {
      return reply.status(400).send({
        error: result.error.errors
      });
    }

    const { name, surname, email, password } = result.data;

    try {
      const [existingUser] = await fastify.mysql.query(
        'SELECT id FROM login WHERE email = ?', 
        [email]
      );

      if (existingUser.length > 0) {
        return reply.status(409).send({ error: "Email already registered!" });
      }

      const hash = await bcrypt.hash(password, 10);

      await fastify.mysql.query(
        'INSERT INTO login (name, surname, email, password) VALUES (?,?,?,?)', 
        [name, surname, email, hash]
      );

      return reply.status(201).send({ message: "User created successfully!" });

    } catch (err) {
      console.error("SIGNIN ERROR:", err);
      return reply.status(500).send({ error: "Error in the server!" });
    }
  });

  fastify.get('/me', { preHandler: verifyToken }, async (request, reply) => {
    try {
      const userId = request.user.id;

      const [rows] = await fastify.mysql.query(
        'SELECT id, name, surname, email FROM login WHERE id = ?', 
        [userId]
      );

      return rows[0];
    } catch (err) {
      return reply.status(500).send({ error: "Error in the server!" });
    }
  });
}

export default fp(LoginRoutes);