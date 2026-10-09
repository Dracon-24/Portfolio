import {DatabaseSync} from 'node:sqlite';
import {mkdirSync,readdirSync,readFileSync} from 'node:fs';
mkdirSync('.local',{recursive:true});const db=new DatabaseSync('.local/coding-cache.sqlite');
// This explicit local migration command never runs during Worker requests.
db.exec('CREATE TABLE IF NOT EXISTS local_migrations (name TEXT PRIMARY KEY)');
for(const name of readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort()){
 if(db.prepare('SELECT name FROM local_migrations WHERE name=?').get(name))continue;
 db.exec('BEGIN');try{db.exec(readFileSync(`drizzle/${name}`,'utf8'));db.prepare('INSERT INTO local_migrations (name) VALUES (?)').run(name);db.exec('COMMIT');console.log(`Applied local migration ${name}`)}catch(e){db.exec('ROLLBACK');throw e}
}db.close();
