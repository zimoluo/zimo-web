import { z } from "zod";
import type { NotebookPage } from "../notebook/model";
import { notebookPageSchema } from "../notebook/model";
export const workspaceSchema = z.object({
  version:z.literal(1), revision:z.number().int().nonnegative(),
  notebook:z.object({pages:z.array(notebookPageSchema).max(500),activeId:z.string().nullable()}),
  stickyNotes:z.object({opened:z.boolean()}),
  calculatorAppearance:z.enum(["normal","border","contrast"]),
  christmasTree:z.object({viewedIds:z.array(z.string()).max(10000)}),
}).refine((workspace) => workspace.notebook.activeId === null || workspace.notebook.pages.some((page) => page.id === workspace.notebook.activeId), {message:"Active notebook page does not exist"});
export type WorkspaceData = Omit<z.infer<typeof workspaceSchema>, "notebook"> & { readonly notebook: { readonly pages: readonly NotebookPage[]; readonly activeId: string | null } };
export const defaultWorkspace: WorkspaceData = {version:1,revision:0,notebook:{pages:[],activeId:null},stickyNotes:{opened:false},calculatorAppearance:"normal",christmasTree:{viewedIds:[]}};
