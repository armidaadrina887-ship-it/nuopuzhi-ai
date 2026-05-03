import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { createLead, getAllLeads, updateLeadStatus, deleteLead } from "./queries/leads";

export const leadRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        company: z.string().min(1, "请输入企业名称"),
        name: z.string().min(1, "请输入联系人"),
        phone: z.string().min(5, "请输入有效手机号"),
      })
    )
    .mutation(async ({ input }) => {
      const id = await createLead(input);
      return { id, success: true };
    }),

  list: publicQuery.query(async () => {
    return getAllLeads();
  }),

  updateStatus: publicQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["new", "contacted", "followup", "closed", "archived"]),
      })
    )
    .mutation(async ({ input }) => {
      await updateLeadStatus(input.id, input.status);
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteLead(input.id);
      return { success: true };
    }),
});
