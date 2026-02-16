import grpc from '@grpc/grpc-js';
import grpcloader from '@grpc/proto-loader';
import {Redis} from 'ioredis';
import path from 'path';

const PROTO_PATH  = path.join(import.meta.dirname, 'ratelimit.proto');
const protodefinition = grpcloader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(protodefinition).ratelimiter;

const redis = new Redis({
    port: 6001,
    host: 'localhost'
});
redis.on('connect', () => {
    console.log('Connected to Redis');
});
redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});


const MAX_REQUESTS = parseInt(process.env.MAX_REQUESTS || '10', 10);
const WINDOW_SIZE = parseInt(process.env.TIME_WINDOW || '60000', 10)/1000; // seconds

async function checklimit(call: any, callback: any) {
  const userId = call.request.userid;
  const key = `ratelimit:${userId}`;

  const luaScript = `
  local current = redis.call("INCR", KEYS[1])
  if current == 1 then
    redis.call("EXPIRE", KEYS[1], ARGV[1])
  end
  return current
  `;

  try {
    const current = await redis.eval(luaScript, 1, key, WINDOW_SIZE) as number;

    if (current <= MAX_REQUESTS) {
      callback(null, { count: current, allowed: 'true' });
    } else {
      callback(null, { count: current, allowed: 'false' });
    }
  } catch (error) {
    callback(error);
  }
}

function main(){
    const server = new grpc.Server();
    server.addService((proto as any).ratelimit.service, { Checklimit:checklimit });
    
    const PORT = 50051;
    server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err: any, port: any) => {
      if (err) {
        console.error('Failed to bind server:', err);
        return;
      }
     else
      console.log(`gRPC Server running on port ${PORT}`);
    });
}

main();


