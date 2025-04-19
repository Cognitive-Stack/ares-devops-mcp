import { z } from "zod";
import { AzureDevOpsConfig } from "../types/tools";

const envSchema = z.object({
  AZURE_DEVOPS_ORG: z.string(),
  AZURE_DEVOPS_PROJECT: z.string(),
  AZURE_DEVOPS_PAT: z.string(),
  TRANSPORT_TYPE: z.enum(["stdio", "sse"]).default("stdio"),
  PORT: z.string().default("8080"),
});

export const getConfig = (): AzureDevOpsConfig & { transportType: string; port: string } => {
  const env = envSchema.parse(process.env);
  
  return {
    organization: env.AZURE_DEVOPS_ORG,
    project: env.AZURE_DEVOPS_PROJECT,
    pat: env.AZURE_DEVOPS_PAT,
    transportType: env.TRANSPORT_TYPE,
    port: env.PORT,
  };
}; 