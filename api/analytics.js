import db from "../_lib/db.js";

export default async (req, res) => {
  const out = { totalRuns:0, uniqueUsers:0, scripts:[] };
  for (const [id,data] of Object.entries(db.runs)) {
    out.totalRuns += data.total;
    out.uniqueUsers += data.users.size;
    const s = db.scripts.find(x=>x.id===id);
    out.scripts.push({ scriptId:id, name:s?.name||"deleted", total:data.total, fails:data.fails, last:data.last });
  }
  res.json(out);
};
