import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {refreshSnapshot} from '../server/pages-snapshot';
import {parseDashboard} from '../src/data/codingStatsView';
import {projects} from '../src/data/projects';
let previous;
try{previous=parseDashboard(JSON.parse(await readFile('.local/pages-stats.json','utf8')))}catch{
 try{const response=await fetch('https://dracon-24.github.io/Portfolio/api/coding-stats.json',{signal:AbortSignal.timeout(10000)});if(response.ok)previous=parseDashboard(await response.json())}catch{}
}
const snapshot=await refreshSnapshot(previous);
await mkdir('.local',{recursive:true});
await mkdir('dist/client/api',{recursive:true});
await writeFile('.local/pages-stats.json',JSON.stringify(snapshot));
await writeFile('dist/client/api/coding-stats.json',JSON.stringify(snapshot));
for(const project of projects){const directory=`dist/client/projects/${project.slug}`;await mkdir(directory,{recursive:true});await copyFile('dist/client/index.html',`${directory}/index.html`)}
await copyFile('dist/client/index.html','dist/client/404.html');
await writeFile('dist/client/.nojekyll','');
console.log(JSON.stringify(snapshot.profiles.map(p=>({platform:p.platform,status:p.status,fetchedAt:p.fetchedAt,error:p.error}))));
