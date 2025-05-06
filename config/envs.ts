import * as dotenv from "dotenv";
import * as Joi from "joi";

dotenv.config();

const envSchema = Joi.object({
  ENV: Joi.string().valid("dev", "prod", "test", "main").required(),
  AWS_ACCOUNT: Joi.string().required(),
  AWS_REGION: Joi.string().required(),
  GITHUB_ARN_CONNECTION: Joi.string().required(),
  GITHUB_OWNER: Joi.string().required(),
  GITHUB_REPOSITORY: Joi.string().required(),
}).required();

const envs = {
  ENV: "dev",
  AWS_ACCOUNT: process.env.AWS_ACCOUNT,
  AWS_REGION: process.env.AWS_REGION,
  GITHUB_ARN_CONNECTION: process.env.GITHUB_ARN_CONNECTION,
  GITHUB_OWNER: process.env.GITHUB_OWNER,
  GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY,
};

const { error } = envSchema.validate(envs);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

console.log(envs);

export { envs };
