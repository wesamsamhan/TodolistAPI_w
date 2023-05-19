const mongoose = require("mongoose");
const dbconfigration =  () => {
  mongoose
    .connect(`${process.env.DB_URL}`)
    .then((connection) => {
      console.log(`connecting host => ${connection.connection.host}`);
    })
    .catch((error) => {
      console.log(`error connecting ${error}`);
    });
};

module.exports = dbconfigration;