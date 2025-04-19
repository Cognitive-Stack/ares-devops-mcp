import { z } from "zod";
import { getConfig } from "../config/env";
import { AzureDevOpsService } from "../services/azure-devops";
import { ToolConfig } from "../types/tools";

const config = getConfig();
const azureDevOpsService = new AzureDevOpsService(config);

export const tools: ToolConfig[] = [
  {
    name: "create-repo",
    description: "Create a new repository in Azure DevOps",
    parameters: z.object({
      name: z.string().describe("Name of the repository to create"),
    }),
    execute: async (args) => {
      const repo = await azureDevOpsService.createRepository(args.name);
      return `Repository ${repo.name} created successfully with ID ${repo.id}`;
    },
  },
  {
    name: "list-repos",
    description: "List all repositories in the organization",
    parameters: z.object({}),
    execute: async () => {
      const repos = await azureDevOpsService.listRepositories();
      return JSON.stringify(repos, null, 2);
    },
  },
  {
    name: "get-branches",
    description: "List all branches of a repository",
    parameters: z.object({
      repositoryId: z.string().describe("ID of the repository"),
    }),
    execute: async (args) => {
      const branches = await azureDevOpsService.getBranches(args.repositoryId);
      return JSON.stringify(branches, null, 2);
    },
  },
  {
    name: "create-pull-request",
    description: "Create a pull request from one branch to another",
    parameters: z.object({
      repositoryId: z.string().describe("ID of the repository"),
      title: z.string().describe("Title of the pull request"),
      description: z.string().describe("Description of the pull request"),
      sourceBranch: z.string().describe("Source branch name"),
      targetBranch: z.string().describe("Target branch name"),
    }),
    execute: async (args) => {
      const pr = await azureDevOpsService.createPullRequest(
        args.repositoryId,
        args.title,
        args.description,
        args.sourceBranch,
        args.targetBranch
      );
      return `Pull request #${pr.pullRequestId} created successfully`;
    },
  },
  {
    name: "comment-on-pr",
    description: "Leave a comment on an existing pull request",
    parameters: z.object({
      repositoryId: z.string().describe("ID of the repository"),
      pullRequestId: z.number().describe("ID of the pull request"),
      comment: z.string().describe("Comment to add"),
      status: z.enum(['active', 'closed', 'fixed', 'pending', 'won\'t fix'])
        .default('active')
        .describe("Status of the comment thread")
    }),
    execute: async (args) => {
      await azureDevOpsService.commentOnPullRequest(
        args.repositoryId,
        args.pullRequestId,
        args.comment,
        args.status
      );
      return "Comment added successfully";
    },
  },
  {
    name: "get-commits",
    description: "Get commit history for a repository",
    parameters: z.object({
      repositoryId: z.string().describe("ID of the repository"),
      branch: z.string().describe("Branch name"),
    }),
    execute: async (args) => {
      const commits = await azureDevOpsService.getCommits(args.repositoryId, args.branch);
      return JSON.stringify(commits, null, 2);
    },
  },
  {
    name: "trigger-pipeline",
    description: "Trigger a CI pipeline with parameters",
    parameters: z.object({
      pipelineId: z.number().describe("ID of the pipeline"),
      parameters: z.record(z.any()).describe("Pipeline parameters"),
    }),
    execute: async (args) => {
      await azureDevOpsService.triggerPipeline(args.pipelineId, args.parameters);
      return "Pipeline triggered successfully";
    },
  },
  {
    name: "list-pipelines",
    description: "List all pipelines in the project",
    parameters: z.object({}),
    execute: async () => {
      const pipelines = await azureDevOpsService.listPipelines();
      return JSON.stringify(pipelines, null, 2);
    },
  },
]; 