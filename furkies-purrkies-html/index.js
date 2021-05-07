import kebabCase from 'lodash/kebabCase.js';
import startCase from 'lodash/startCase.js';
import last from 'lodash/last.js';
import padStart from 'lodash/padStart.js';

import path from "path";
import { existsSync } from "fs";
import { mkdir, readFile, writeFile, copyFile } from "fs/promises";

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

export default main;

async function main({destination}){

  const delimiter = '-';
  const prefix = 'furkies-purrkies';
  const postfix = 'poetry';
  const ix = JSON.parse((await readFile(path.join(destination, 'index.json'))).toString());
  const number = padStart(ix.data.length+1, 4, 0);
  const id = kebabCase([prefix, postfix, number].join(delimiter));
  const title = startCase([prefix, postfix, number].join(delimiter));
  const image = kebabCase([postfix, number, 'illustration'].join(delimiter)) + '.jpg';
  const artwork = 'https://example.com';
  const audio = kebabCase([postfix, number].join(delimiter)) + '.mp3';
  const date = (new Date()).toISOString();
  const configuration = { id, title, date, image, artwork, audio };

  ix.data.push(id);

  const content = `
<div class="section">
  <p>Line 1</p>
  <p>Line 2</p>
</div>

<div class="section">
  <p>Line 1</p>
  <p>Line 2</p>
</div>
  `.trim();

  if(existsSync(path.join(destination, id))) throw new Error('Problem, the new directory appears to already exists, program crashed to prevent damage.');
  await mkdir(path.join(destination, id), { recursive: true });
  await mkdir(path.join(destination, id, 'files'), { recursive: true });
  await mkdir(path.join(destination, id, 'cache'), { recursive: true });
  await writeFile(path.join(destination, id, 'configuration.json'), JSON.stringify(configuration, null, '  '));
  await copyFile(path.join(destination, id, 'configuration.json'), path.join(destination, id, 'cache', 'configuration.json'));
  await writeFile(path.join(destination,id,  'content.html'), content);
  await copyFile(path.join(path.dirname(__dirname), 'samples', 'illustration.jpg'),path.join(destination, id, 'files', image));
  await copyFile(path.join(path.dirname(__dirname), 'samples', 'audio.mp3'),path.join(destination, id, 'files', audio));
  await writeFile(path.join(destination, 'index.json'), JSON.stringify(ix, null, '  '));
}
