const connection = require('./connection');

const getAll = async () => {
  const db = await connection();
  return db.collection('messages').find().toArray();
};

const setNew = async (dataForCreate) => {
  const db = await connection();
  return db.collection('messages').insertOne(dataForCreate).then(({ ops }) => ops[0]);
};
module.exports = {
  getAll,
  setNew,
};
