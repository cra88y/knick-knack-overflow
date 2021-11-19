'use strict';
module.exports = (sequelize, DataTypes) => {
  const Question_Vote = sequelize.define('Question_Vote', {
    userId: DataTypes.INTEGER,
    questionId: DataTypes.INTEGER,
    voteType: DataTypes.BOOLEAN
  }, {});
  Question_Vote.associate = function(models) {
    Question_Vote.belongsTo(models.User, { foreignKey: "userId" });
    Question_Vote.belongsTo(models.Question, { foreignKey: "questionId" });
  };
  return Question_Vote;
};
