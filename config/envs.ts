import * as dotenv from "dotenv";
import * as Joi from "joi";

dotenv.config();

const envSchema = Joi.object({
  ENV: Joi.string().valid("dev", "prod", "test", "main").required(),
  AWS_ACCOUNT: Joi.string().required(),
  AWS_REGION: Joi.string().required(),
}).required();

const envs = {
  ENV: "dev",
  AWS_ACCOUNT: process.env.AWS_ACCOUNT,
  AWS_REGION: process.env.AWS_REGION,
};

const { error } = envSchema.validate(envs);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

console.log(envs);

export { envs };
