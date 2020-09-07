const Sequelize = require("sequelize");

module.exports = sequelize.define("Scrape", {
  id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  url: {
    type: Sequelize.STRING(191),
  },
  content: {
    type: Sequelize.TEXT(),
  },
  user_id: Sequelize.INTEGER(11),
});
