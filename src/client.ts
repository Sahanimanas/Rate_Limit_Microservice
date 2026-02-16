import grpc from '@grpc/grpc-js';
import grpcloader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.join(import.meta.dirname, 'ratelimit.proto');
const protodefinition = grpcloader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(protodefinition).ratelimiter;
const client = new (proto as any).ratelimit('localhost:50051', grpc.credentials.createInsecure());

async function testRatelimit(userId:number = 1) {
    client.checklimit({ userid: userId }, (err: any, response: any) => {
      if (err) {
        console.error('Error:', err);
      } else {
        console.log(`Request: User ${userId} - Count: ${response.count}, Allowed: ${response.allowed}`);
      }
    });
  // Give time for all requests to complete
  setTimeout(() => {
    process.exit(0);
  }, 1000);
}


testRatelimit(1);