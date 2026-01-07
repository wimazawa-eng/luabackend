import db from "../_lib/db.js";
import { randomUUID } from "crypto";

export default async (req, res) => {
  if (req.method === "GET") return res.json(db.scripts);

  if (req.method === "POST") {
    const { name, code } = await req.body;        // Vercel parses JSON automatically
    if (!name || !code) return res.status(400).json({error:"missing fields"});
    const id  = randomUUID();
    const key = randomUUID();
    const url = `https://${req.headers.host}/api/load/${id}`;
    const created = new Date().toISOString();
    db.scripts.push({ id, name, url, key, created });
    db.runs[id] = { total:0, fails:0, users:new Set(), last:null };
    return res.json({ id, name, url, key, created });
  }
  res.status(405).end();
};
