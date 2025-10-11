const { Pool } = require("pg")

const localConnectionString = process.env.LOCAL_CONNECTION_STRING
const prodConnectionString = process.env.NEON_CONNECTION_STRING

module.exports = new Pool({
  connectionString: localConnectionString,
})
