import { Sequelize } from "sequelize";
import mysql2 from "mysql2";

const host = process.env.NEXT_PUBLIC_DB_HOST as string;
const name = process.env.NEXT_PUBLIC_DB_NAME as string;
const pwd = process.env.NEXT_PUBLIC_DB_PASSWORD as string;
const user = process.env.NEXT_PUBLIC_DB_USER as string;

function connectDatabase() {
  if (!global.db) {
    global.db = new Sequelize(user, name, pwd, {
      host,
      dialect: "mysql",
      dialectModule: mysql2,
      logging: true,
      timezone: "+08:00",
      pool: {
        max: 20,
        min: 0,
        idle: 10 * 1000,
        acquire: 30 * 1000
      },
      dialectOptions: {
        dateStrings: true,
        typeCast: true
      }
    });
    console.log("新的数据库实例链接");
  } else {
    console.log("重用现有数据库连接");
  }
  return global.db;
}

export default connectDatabase;
