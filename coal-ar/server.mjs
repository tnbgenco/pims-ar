import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve('public');
http.createServer(async(req,res)=>{try {const path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403).end();return;}const file=path===root?resolve(root,'index.html'):path;const data=await readFile(file);res.writeHead(200,{'Content-Type':({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.mind':'application/octet-stream','.svg':'image/svg+xml'})[extname(file)]||'application/octet-stream'}).end(data);}catch{res.writeHead(404).end('Not found');}}).listen(8080,'0.0.0.0',()=>console.log('Coal AR: http://localhost:8080'));
