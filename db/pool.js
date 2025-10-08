const { Pool } = require("pg")

const localConnectionString = process.env.LOCAL_CONNECTION_STRING
const prodConnectionString = null

module.exports = new Pool({ connectionString: localConnectionString })
