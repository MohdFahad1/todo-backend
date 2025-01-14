const { login } = require("../../src/controllers/AuthController");
const connectToMongo = require("../../src/db/db");
const initMiddleware = require("../../lib/initMiddleware");
const Cors = require("cors");

const cors = Cors({
  methods: ["POST", "OPTIONS"],
  origin: process.env.CLIENT_URL,
  credentials: true,
});

const runMiddleware = initMiddleware(cors);

export default async function handler(req, res) {
  await runMiddleware(req, res);

  if (req.method === "POST") {
    await connectToMongo();
    await login(req, res);
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
