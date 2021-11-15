'use strict';
module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    userId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    title: DataTypes.STRING
  }, {});
  Question.associate = function (models) {
    Question.belongsTo(models.User, { foreignKey: "userId" });
    Question.hasMany(models.Answer, { foreignKey: "questionId" });
  };
  return Question;
};