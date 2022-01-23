import { exec, ExecOptions } from '@actions/exec';

interface NPXCommandOptions {
  command: string[];
  workingDirectory?: string;
}

export const execNpxCommand = async ({
  command,
  workingDirectory,
}: NPXCommandOptions): Promise<void> => {
  let myOutput = '';
  const options: ExecOptions = {
    listeners: {
      stdout: (stdoutData: Buffer) => {
        myOutput += stdoutData.toString();
      },
    },
    cwd: workingDirectory,
  };
  await exec(`npx`, ['-y', ...command], options);
  if (myOutput && !myOutput.includes('Success')) {
    throw new Error(myOutput);
  }
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
