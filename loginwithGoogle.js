import "dotenv/config";
import jwt from "fastify/jwt";
import { OAuth2Client } from "google-auth-library";

export default async function LoginWithGoogle(fastify, opts) {
    
    app.get("/auth/google/callback", async (req, reply) => {
        try {
            const { code } = req.query;

            if (!code) {
                return reply.code(400).send({ error: "Missing code" });
            }

            const { tokens } = await client.getToken(code);
            client.setCredentials(tokens);

            const ticket = await client.verifyIdToken({
                idToken: tokens.id_token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            const { sub, email, name, picture } = payload;

            let user = await findUserByGoogleId(sub);

            if (!user) {
                user = await createUser({
                googleId: sub,
                email,
                name,
                picture,
            });
            }

            const token = app.jwt.sign({
                userId: user.id,
                email: user.email,
            });

            return reply.send({
                token,
                user,
            });

        } catch (error) {
            console.error("Google auth error:", error);

            return reply.code(500).send({
                error: "Authentication failed",
            });
        }
    });    
}

