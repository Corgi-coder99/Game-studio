import http from 'node:http';
import {englishText} from '../english.mjs';
import {fileURLToPath} from 'node:url';
import {OnlineService} from './service.mjs';
import {serveGameFile} from '../server.mjs';
export function createOnlineServer({database=process.env.GAME_DATABASE||'online/data/world.sqlite',publicOrigin=process.env.PUBLIC_ORIGIN||'',clock}={}){
 const service=new OnlineService(database,clock?{now:clock}:{}),secure=publicOrigin.startsWith('https://');
 const server=http.createServer(async(req,res)=>{
 const path=new URL(req.url,'http://localhost').pathname;
 if(!path.startsWith('/api/'))return serveGameFile(req,res,true);
 res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('X-Content-Type-Options','nosniff');
 const reply=(status,value)=>{res.writeHead(status);res.end(JSON.stringify(value));};
 try{
  if(path==='/api/health'&&req.method==='GET')return reply(200,{online:true,edition:'shared-world-preview'});
  if(req.method==='POST'){
   const origin=req.headers.origin,expected=publicOrigin||`http://${req.headers.host}`;
   if(origin&&origin!==expected||req.headers['x-game-request']!=='1'||!req.headers['content-type']?.startsWith('application/json'))return reply(403,{error:'Same-origin game requests only.'});
  }
  let body={};if(req.method==='POST'){let size=0,chunks=[];for await(const part of req){size+=part.length;if(size>16384)return reply(413,{error:'Request too large.'});chunks.push(part);}try{body=JSON.parse(Buffer.concat(chunks).toString());}catch{return reply(400,{error:'Invalid JSON.'});}}
  const token=req.headers.cookie?.split(';').map(x=>x.trim()).find(x=>x.startsWith('tm_session='))?.slice(11),id=service.identify(token),ip=req.socket.remoteAddress;
  if(['/api/register','/api/login'].includes(path)&&req.method==='POST'){service.limit(ip,'auth',20);if(path==='/api/register'&&secure&&(!process.env.REGISTRATION_CODE||body.invitation!==process.env.REGISTRATION_CODE))return reply(403,{error:'A valid invitation code is required for this test server.'});const session=path==='/api/register'?await service.register(body.username,body.password):await service.login(body.username,body.password);res.setHeader('Set-Cookie',`tm_session=${session.token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=604800${secure?'; Secure':''}`);return reply(200,service.snapshot(session.id));}
  if(!id)return reply(401,{error:'Sign in to your online account.'});
  if(path==='/api/world'&&req.method==='GET')return reply(200,service.snapshot(id));
  if(path==='/api/logout'&&req.method==='POST'){service.logout(token);res.setHeader('Set-Cookie',`tm_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure?'; Secure':''}`);return reply(200,{signedOut:true});}
  if(path==='/api/command'&&req.method==='POST'){service.limit(id,'commands',600);return reply(200,service.command(id,body));}
  return reply(404,{error:'Unknown endpoint.'});
 }catch(error){reply(error.status||400,{error:error.message?.startsWith('SQLITE')?'Unable to complete request.':englishText(error.message||'Unable to complete request.')});}
 });
 const timer=setInterval(()=>{try{service.tick();}catch(e){console.error('World tick failed:',e.message);}},1000);timer.unref();server.on('close',()=>{clearInterval(timer);service.close();});return {server,service};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){const port=Number(process.env.PORT||3000),{server}=createOnlineServer();server.listen(port,process.env.HOST||'127.0.0.1',()=>console.log(`Heavenly Mandate online world listening on ${port}`));}
