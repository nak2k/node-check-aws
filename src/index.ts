import { readFile } from "fs/promises";
import { GetCallerIdentityCommand, STSClient } from "@aws-sdk/client-sts";
import pkgDir = require('pkg-dir');

/**
 * Configuration for the check-aws package.
 */
export interface CheckAwsConfiguration {
  /**
   * List of valid AWS Account IDs.
   */
  accountIds: string[];
}

/**
 * Read the configuration from the package.json file.
 * 
 * @returns 
 */
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

/**
 * Check the AWS Account ID.
 * 
 * @param accountIds List of valid AWS Account IDs.
 *               If not provided, it will be read from the package.json file.
 */
export async function checkAws(...accountIds: string[]) {
  if (accountIds.length === 0) {
    const config = await readConfiguration();
    accountIds = config.accountIds;
  }

  const sts = new STSClient({});

  const data = await sts.send(new GetCallerIdentityCommand({}));

  if (!data.Account) {
    throw new Error("The AWS Account could not be get");
  }

  if (!accountIds.includes(data.Account)) {
    throw new Error(`The AWS Account ${data.Account} not allowed`);
  }
}
