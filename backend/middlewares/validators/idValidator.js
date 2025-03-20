const { param } = require("express-validator");

const idValidator = [param("id").isInt({ min: 1 }).withMessage("Invalid ID")];

module.exports = { idValidator };
