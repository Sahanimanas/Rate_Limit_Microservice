# Distributed Rate Limiter Service

A high-performance, distributed rate-limiting microservice built with **Node.js**, **TypeScript**, and **gRPC**. This service utilizes **Redis** and **Lua scripting** to ensure atomic operations and prevent race conditions under heavy load.



##  Features
* **Ultra-Low Latency:** Uses **gRPC (HTTP/2)** for binary serialized communication, offering significantly better performance than traditional REST/JSON.
* **Atomic Operations:** Rate limiting logic is handled via **Redis Lua scripts**, ensuring thread safety and preventing "double-counting" during concurrent requests.
* **Scalable Architecture:** Designed as a standalone microservice that can be shared across multiple backend applications.
* **Type Safe:** Built with **TypeScript** and **Protocol Buffers** to enforce strict data contracts between client and server.

##  Tech Stack

* **Backend:** Node.js (v22+)
* **Language:** TypeScript
* **Communication:** gRPC (`@grpc/grpc-js`)
* **Database:** Redis (`ioredis`)
* **Containerization:** Docker

##  Project Structure

```text
ratelimitService/
├── proto/
│   └── ratelimit.proto    # gRPC service and message definitions
├── src/
│   ├── grpc_server.ts     # Main server logic & Redis integration
│   └── client.ts          # Test client for manual verification
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration