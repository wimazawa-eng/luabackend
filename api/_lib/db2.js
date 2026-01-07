// ultra-light in-memory store (swap for Neon later)
const db = {
  scripts:  [],
  licenses: [],
  runs:     {}   // {scriptId:{total:0,fails:0,users:Set(),last:null}}
};
export default db;
