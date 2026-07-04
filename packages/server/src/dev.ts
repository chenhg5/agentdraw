import { startAgentDrawServer } from "./http.js";

const port = Number(process.env.AGENTDRAW_PORT ?? 3927);
const server = await startAgentDrawServer({ port });

console.log(`AgentDraw API listening on ${server.url}`);
