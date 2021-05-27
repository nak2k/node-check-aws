import { readFile } from "fs/promises";
import { STS } from "aws-sdk";
import pkgDir = require('pkg-dir');

export interface CheckAwsConfiguration {
  accountIds: string[];
}

async function readConfiguration(): Promise<CheckAwsConfiguration> {
  const rootDir = await pkgDir();

  if (!rootDir) {
    throw new Error("package.json not found");
  }

  const pkgJsonPath = `${rootDir}/package.json`;
  const data = await readFile(pkgJsonPath, "utf8");
  const pkgJson = JSON.parse(data);

  const config: CheckAwsConfiguration = pkgJson["check-aws"];

  if (!config) {
    throw new Error(`The \`check-aws\` property not found in ${pkgJsonPath}`);
  }

  if (!Array.isArray(config.accountIds) || config.accountIds.length === 0) {
    throw new Error(`The \`check-aws.accountIds\` property must be an array contains at least one AWS Account ID`);
  }

  return config;
}

export async function checkAws() {
  const config = await readConfiguration();

  const sts = new STS();

  const data = await sts.getCallerIdentity({}).promise();

  if (!data.Account) {
    throw new Error("The AWS Account could not be get");
  }

  if (!config.accountIds.includes(data.Account)) {
    throw new Error(`The AWS Account ${data.Account} not allowed`);
  }
}
