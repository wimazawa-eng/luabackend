import db from "../../_lib/db.js";

export default async (req, res) => {
  const { scriptId } = req.query;
  const key = req.url.split('key=')[1];          // ultra-simple parser
  if (!key) return res.status(401).json({error:"license key required"});

  const lic = db.licenses.find(l=>l.key===key && l.scriptId===scriptId);
  if (!lic || Date.now()>lic.expires) return res.status(403).json({error:"invalid or expired key"});
  if (lic.seats && lic.used>=lic.seats) return res.status(403).json({error:"seat limit reached"});

  lic.used++;
  const run = db.runs[scriptId];
  run.total++;
  run.users.add(req.headers['x-real-ip']||'unknown');
  run.last = new Date().toISOString();

  const script = db.scripts.find(s=>s.id===scriptId);
  if (!script) return res.status(404).json({error:"script not found"});

  // return dummy obfuscated payload
  res.setHeader('Content-Type','text/plain');
  res.send(`-- LuaProtect loader\n-- script: ${script.name}\nrequire(0xBADC0DE)`);
};
