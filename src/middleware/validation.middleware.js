const userSchema = require("../validation/user.schema");

function validation(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    console.log(result);
    if (!result.success) {
      return res.status(400).json({
        errors: result.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      });
    }
    req.body = result.data;

    next();
  };
}

module.exports = validation;
