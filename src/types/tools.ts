"use strict";

import { z } from "zod";
import { FastMCP } from "fastmcp";

export type ToolConfig = {
  name: string;
  description: string;
  parameters: z.ZodObject<any>;
  execute: (args: any) => Promise<string>;
};

export type Tool = FastMCP["addTool"];

export type AzureDevOpsConfig = {
  organization: string;
  project: string;
  pat: string;
};

export type Repository = {
  id: string;
  name: string;
  url: string;
};

export type Branch = {
  name: string;
  objectId: string;
};

export type PullRequest = {
  pullRequestId: number;
  title: string;
  description: string;
  sourceRefName: string;
  targetRefName: string;
  status: string;
};

export type Commit = {
  commitId: string;
  author: {
    name: string;
    email: string;
    date: string;
  };
  comment: string;
}; 