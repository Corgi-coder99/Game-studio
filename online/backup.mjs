import {DatabaseSync,backup} from 'node:sqlite';
import {mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
const source=process.env.GAME_DATABASE||'online/data/world.sqlite',destination=process.argv[2];
if(!destination)throw new Error('Usage: node online/backup.mjs /private/path/world-backup.sqlite');
mkdirSync(dirname(destination),{recursive:true});const db=new DatabaseSync(source,{readOnly:true});try{await backup(db,destination);console.log('Consistent database backup created. Store it outside the game server.');}finally{db.close();}
