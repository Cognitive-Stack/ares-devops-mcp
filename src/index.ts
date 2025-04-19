import { FastMCP } from "fastmcp";
import { tools } from "./tools/azure-devops-tools";
import { Tool } from "./types/tools";
import { getConfig } from "./config/env";

const config = getConfig();

const server = new FastMCP({
  name: "atlas-datahub-mcp",
  version: "1.0.0",
});

// Register all tools
tools.forEach((tool) => {
  (server.addTool as Tool)(tool);
});

// Start the server
if (config.transportType === "sse") {
  server.start({
    transportType: "sse",
    sse: {
      endpoint: "/sse",
      port: parseInt(config.port, 10),
    },
  });
} else {
  server.start({
    transportType: "stdio",
  });
} 