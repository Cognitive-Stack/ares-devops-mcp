import axios from "axios";
import { AzureDevOpsConfig, Repository, Branch, PullRequest, Commit } from "../types/tools";

export class AzureDevOpsService {
  private config: AzureDevOpsConfig;
  private baseUrl: string;
  private apiVersion: string;

  constructor(config: AzureDevOpsConfig, apiVersion: string = "7.1") {
    this.config = config;
    this.baseUrl = `https://dev.azure.com/${config.organization}/${config.project}/_apis`;
    this.apiVersion = apiVersion;
  }

  private getHeaders() {
    return {
      Authorization: `Basic ${Buffer.from(`:${this.config.pat}`).toString("base64")}`,
      "Content-Type": "application/json",
    };
  }

  private getApiUrl(path: string): string {
    return `${this.baseUrl}${path}?api-version=${this.apiVersion}`;
  }

  async createRepository(name: string): Promise<Repository> {
    const response = await axios.post(
      this.getApiUrl("/git/repositories"),
      { name },
      { headers: this.getHeaders() }
    );
    return response.data;
  }

  async listRepositories(): Promise<Repository[]> {
    const response = await axios.get(
      this.getApiUrl("/git/repositories"),
      { headers: this.getHeaders() }
    );
    return response.data.value;
  }

  async getBranches(repositoryId: string): Promise<Branch[]> {
    const response = await axios.get(
      this.getApiUrl(`/git/repositories/${repositoryId}/refs`),
      { headers: this.getHeaders() }
    );
    return response.data.value;
  }

  async createPullRequest(
    repositoryId: string,
    title: string,
    description: string,
    sourceBranch: string,
    targetBranch: string
  ): Promise<PullRequest> {
    const response = await axios.post(
      this.getApiUrl(`/git/repositories/${repositoryId}/pullrequests`),
      {
        title,
        description,
        sourceRefName: `refs/heads/${sourceBranch}`,
        targetRefName: `refs/heads/${targetBranch}`,
      },
      { headers: this.getHeaders() }
    );
    return response.data;
  }

  async commentOnPullRequest(
    repositoryId: string,
    pullRequestId: number,
    comment: string,
    status: string = 'active'
  ): Promise<void> {
    await axios.post(
      this.getApiUrl(`/git/repositories/${repositoryId}/pullrequests/${pullRequestId}/threads`),
      {
        comments: [{ content: comment }],
        status: status
      },
      { headers: this.getHeaders() }
    );
  }

  async getCommits(repositoryId: string, branch: string): Promise<Commit[]> {
    const response = await axios.get(
      this.getApiUrl(`/git/repositories/${repositoryId}/commits`) + `&branch=${branch}`,
      { headers: this.getHeaders() }
    );
    return response.data.value;
  }

  async triggerPipeline(pipelineId: number, parameters: Record<string, any>): Promise<void> {
    await axios.post(
      this.getApiUrl(`/pipelines/${pipelineId}/runs`),
      { parameters },
      { headers: this.getHeaders() }
    );
  }

  async listPipelines(): Promise<any[]> {
    const response = await axios.get(
      this.getApiUrl("/pipelines"),
      { headers: this.getHeaders() }
    );
    return response.data.value;
  }
} 