// Require Packages
const unset = require('lodash/unset');

module.exports = function(db, params, options) {
  
  // Fetch Entry
  let fetched = db.query(`SELECT * FROM ${options.table} WHERE ID = ${params.id}`)
  if (!fetched) return false; // If empty, return null
  else fetched = JSON.parse(fetched.json);
  try { fetched = JSON.parse(fetched) } catch (e) {}
  
  // Check if the user wants to delete a prop inside an object
  if (typeof fetched === 'object' && params.ops.target) {
    unset(fetched, params.ops.target);
    fetched = JSON.stringify(fetched);
    db.query(`UPDATE ${options.table} SET json = ${fetched} WHERE ID = ${params.id}`);
    return true;
  }
  else if (params.ops.target) throw new TypeError('Target is not an object.');
  else db.query(`DELETE FROM ${options.table} WHERE ID = ${params.id}`);
  
  // Resolve
  return true;
  
}
