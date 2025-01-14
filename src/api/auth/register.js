const { register } = require("../../src/controllers/authController");
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
    await register(req, res);
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
