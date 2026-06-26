const idSchema = require("../validation/id.schema")

class Validation {
  body(schema) {
    return (req, res, next) => {
      const { success, error } = schema.safeParse(req.body);
      if (!success) {
        return res.status(400).json({
          errors: error.issues.map((issue) => ({
            field: issue.path[0],
            message: issue.message,
          })),
        });
      }

      next();
    };
  }
  id(req, res, next) {
    const { success, error } = idSchema.safeParse(req.params.id);
    if (!success) {
      return res.status(400).json({
        errors: error.issues.map((issue) => ({
          field: "id",
          message: issue.message,
        })),
      });
    }

    next();
  }
}

module.exports = new Validation();
