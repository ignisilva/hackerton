const datas = require("./fileReader");
const transformer = require("./transformer");

const app = async () => {
  await transformer(datas);
};

app();
