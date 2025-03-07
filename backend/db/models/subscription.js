'use strict';
const { sequelize } = require('../../config/database');

const subscription = sequelize.define('subscription', {}, {
    freezeTableName: true,
    timestamps: true,
    updatedAt: false
});

module.exports = subscription;