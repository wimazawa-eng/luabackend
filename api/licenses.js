import db from "../_lib/db.js";
import { randomUUID } from "crypto";

export default async (req, res) => {
  if (req.method === "GET") return res.json(db.licenses);

  if (req.method === "POST") {
    const { scriptId, seats = 0, days = 30 } = await req.body;
    if (!scriptId) return res.status(400).json({error:"missing scriptId"});
    const key = randomUUID().replace(/-/g,"").slice(0,24).toUpperCase();
    const expires = Date.now() + days * 864e5;
    db.licenses.push({ key, scriptId, seats, expires, used:0 });
    return res.json({ key, expires });
  }

  if (req.method === "DELETE") {
    const { key } = req.query;
    db.licenses = db.licenses.filter(l => l.key !== key);
    return res.status(204).end();
  }
  res.status(405).end();
};
