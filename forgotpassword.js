import bcrypt from "bcrypt";
import transporter from "./mail.js";

export default async function forgotPassword(fastify, opts) {

  fastify.post('/forgot-password', async (request, reply) => {
    const { email } = request.body;

    try {
      const [users] = await fastify.mysql.query(
        "SELECT * FROM login WHERE email = ?",
        [email]
      );

      if (users.length === 0) {
        return reply.status(404).send({
          error: "User not found!"
        });
      }

      const code = Math.floor(100000 + Math.random() * 900000);

      await fastify.mysql.query(
        "UPDATE login SET reset_code = ? WHERE email = ?",
        [code, email]
      );

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "FORGOT YOUR PASSWORD?",
        text: `Your code is: ${code}\nDo not share your code!`
      });

      return reply.send({
        message: "Code sent!"
      });

    } catch (err) {
      console.error(err);

      return reply.status(500).send({
        error: "Server error!"
      });
    }
  });

  fastify.post('/verify-code', async (request, reply) => {
    const { email, code } = request.body;

    try {
      const [user] = await fastify.mysql.query(
        "SELECT * FROM login WHERE email = ? AND reset_code = ?",
        [email, code]
      );

      if (user.length === 0) {
        return reply.status(400).send({
          message: "Invalid code!"
        });
      }

      return reply.send({
        message: "Correct code ✅"
      });

    } catch (err) {
      console.error(err);

      return reply.status(500).send({
        error: "Server error!"
      });
    }
  });

  fastify.post('/reset-password', async (request, reply) => {
    const { email, newPassword } = request.body;

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await fastify.mysql.query(
        "UPDATE login SET password = ?, reset_code = NULL WHERE email = ?",
        [hashedPassword, email]
      );

      return reply.send({
        message: "Password changed ✅"
      });

    } catch (err) {
      console.error(err);

      return reply.status(500).send({
        error: "Server error!"
      });
    }
  });
}