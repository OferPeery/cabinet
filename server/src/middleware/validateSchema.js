const validate = (schema, value) => {
  if (schema) {
    const { error } = schema.validate(value);
    if (error) {
      throw error;
    }
  }
};

export const validateSchema = (schema) => {
  return (req, res, next) => {
    try {
      validate(schema.query, req.query);
      validate(schema.params, req.params);
      validate(schema.body, req.body);
    } catch (error) {
      return res.status(422).send({ message: error.details[0].message });
    }

    next();
  };
};
