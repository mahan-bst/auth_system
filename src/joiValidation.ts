import Joi from "joi";

const schema = Joi.object({
  username: Joi.string().required().alphanum().min(4).max(20),
  password: Joi.string()
    .required()
    .pattern(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).{6,30}$/),
  email: Joi.string()
    .required()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "ir"] } }),
});

export default schema;
