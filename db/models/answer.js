'use strict';
module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define('Answer', {
    content: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    questionId: DataTypes.INTEGER
  }, {});
  Answer.associate = function (models) {
    Answer.hasMany(models.Vote, { foreignKey: "userId" });
    Answer.belongsTo(models.Question, { foreignKey: "questionId" });
    Answer.belongsTo(models.User, { foreignKey: "userId" });
  };
  return Answer;
};