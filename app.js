import fastify from 'fastify';
import mysql from '@fastify/mysql';
import fastifyJwt from '@fastify/jwt';
import Login from './login.js';
import Server from './server.js';
import forgotpassword from './forgotpassword.js';
import SearchProducts from './SearchProducts.js';
import cors from '@fastify/cors';
import 'dotenv/config';


const app = fastify({ logger: true }); 

async function connectDB(instancia) {
  await instancia.register(mysql, {
    promise: true,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });
}



const start = async () => {
  try {
    await connectDB(app);

    await app.register(fastifyJwt, {
      secret: process.env.JWT_SECRET
    });

    await app.register(cors, { 
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTION'],
      allowedHeaders: ['Content-Type', 'Authorization']
    });

    await app.register(Login);
    console.log('✅ Login routes registered');

    await app.register(forgotpassword);
    console.log('✅ forgotpassword routes running')

    await app.register(Server);
    console.log('✅ Server running!');

    await app.register(SearchProducts);
    console.log('✅ SearchBar running!');

    const portToUse = process.env.PORT;

    // No app.js, depois do app.ready() ou antes do listen:
    await app.ready();
    console.log(app.printRoutes());

    await app.listen({ port: portToUse, host: '0.0.0.0'});
    
    console.log(`🚀 Servidor rodando em http://localhost:${portToUse}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};



start();