const { Sequelize } = require("sequelize");

class Database {
  constructor() {
    this.sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_USER_PASSWORD, {
      host: process.env.DB_HOST,
      port: 3306,
      dialect: "mysql",
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      dialectOptions: {
          socketPath: '/var/run/mysqld/mysqld.sock',
      }
    });
  }

  async connect() {
    try {
      await this.sequelize.authenticate();
      await this.sequelize.sync();
      await this.sequelize.sync({ alter: true, drop: false });
      console.log("Connection to the database has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }
}

module.exports = new Database();
