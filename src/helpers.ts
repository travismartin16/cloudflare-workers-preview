import { exec, ExecOptions } from '@actions/exec';

interface NPXCommandOptions {
  command: string[];
  options?: ExecOptions;
}

export const execNpxCommand = async ({
  command,
  options,
}: NPXCommandOptions): Promise<void> => {
  let myOutput = '';
  const exitCode = await exec(`npx`, ['-y', ...command], {
    listeners: {
      stdout: (stdoutData: Buffer) => {
        myOutput += stdoutData.toString();
      },
    },
    ...(options || {}),
  });
  if (exitCode > 0 && myOutput && !myOutput.includes('Success')) {
    throw new Error(myOutput);
  }
};

export const wranglerPublish = async (
  workingDirectory: string,
  environment: string,
  cloudflareAccount: string,
  cfApiToken: string,
) => {
  const wrangler = '@cloudflare/wrangler';
  await execNpxCommand({
    command: [wrangler, 'publish', '-e', environment],
    options: {
      cwd: workingDirectory,
      env: {
        CF_API_TOKEN: cfApiToken,
        CF_ACCOUNT_ID: cloudflareAccount,
      },
    },
  });
};

export const wranglerTeardown = async (
  cloudflareAccount: string,
  cfApiToken: string,
  environment: string,
) => {
  const api = 'https://api.cloudflare.com/client/v4/accounts';
  const url = `${api}/${cloudflareAccount}/workers/scripts/${environment}`;
  const authHeader = `Authorization: Bearer ${cfApiToken}`;

  return await exec('curl', ['-X', 'DELETE', url, '-H', authHeader]);
};

export const formatImage = ({
  buildingLogUrl,
  imageUrl,
}: {
  buildingLogUrl: string;
  imageUrl: string;
}) => {
  return `<a href="${buildingLogUrl}"><img width="300" src="${imageUrl}"></a>`;
};

export const getCommentFooter = () => {
  return '<sub>[cloudflare-workers-preview](https://github.com/shidil/cloudflare-workers-preview)</sub>';
};
