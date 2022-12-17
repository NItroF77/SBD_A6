const oracledb = require('oracledb');
const {connectDb} = require('../config/database.js');
const connection = connectDb();
const generateID = async (entity,id,condition) =>{
    let temp = await getRow(entity,condition);
    let digit = 10 - id.length - temp.length;
    let sRow = parseInt(temp) + 1;
    console.log(temp,id,sRow);
    return id + "0".repeat(digit) + sRow.toString();
}

const getData = async (sql, binds) =>{
  console.log(connection);
  options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
    autoCommit: true,
    resultSet: true
  };
  try {
    let row;
    let rows = [];
    const tempQuery = await connection.execute(sql, binds, options);
    const tempResult = tempQuery.resultSet;
    while ((row = await tempResult.getRow())) {
      rows.push(row);
    }
    await tempResult.close();
    console.log(rows);
    return rows;
  }
  catch (err) {
    console.log(err);
    return false;
  }
}

const insertData = async(sql, binds) => {
  options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
    autoCommit: true,
    resultSet: true
  };
  try {
    if (binds.length <= 1) {
      if (binds.length == 1) { binds = binds[0]; }
      const rows = await connection.execute(sql, binds, options);
    }
    else {
      options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
        autoCommit: true,
        resultSet: true,
        bindDefs: [
          { type: oracledb.STRING, maxSize:15 },
          { type: oracledb.STRING, maxSize:15 }
        ]
      };
      const rows = await connection.executeMany(sql, binds, options);
    }
    return true;
  }
  catch (err) {
    console.log(err);
    return false;
  }
}

const getRow = async(table,condition) =>{
  sql = `select count(*) as total from ${table} ${condition}`;
  options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
    autoCommit: true,
    resultSet: true
  };
  try {
    let temp = await connection.execute(sql);
    return JSON.parse(JSON.stringify(temp))["rows"][0].TOTAL.toString();
  }
  catch (err) {
    console.log(err);
  }
}

module.exports = {generateID,getData,getRow,insertData}