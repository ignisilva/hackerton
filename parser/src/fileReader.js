const date = new Date();

const fileName = `hackerton_${date.getFullYear()}${
  date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
}${date.getDate()}`;

const data = require(`../jsonFiles/${fileName}`);

console.log(data);
