const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.fetchAsString = [oracledb.CLOB];
const connectDb = async () =>{
    try {
      connection = await oracledb.getConnection({
        user: "TUBES",
        password: "TUBES",
        connectString: "localhost/xe"
      });
      return connection;
    } catch (err) {
      return false;
    }
}

module.exports = {connectDb};