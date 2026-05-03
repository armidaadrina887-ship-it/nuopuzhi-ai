import { getDb } from "./connection";
import { leads } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export async function createLead(data: { company: string; name: string; phone: string }) {
  const [{ id }] = await getDb()
    .insert(leads)
    .values({
      company: data.company,
      name: data.name,
      phone: data.phone,
      status: "new",
    })
    .$returningId();
  return id;
}

export async function getAllLeads() {
  return getDb()
    .select()
    .from(leads)
    .orderBy(desc(leads.createdAt));
}

export async function updateLeadStatus(id: number, status: string) {
  await getDb()
    .update(leads)
    .set({ status })
    .where(eq(leads.id, id));
}

export async function deleteLead(id: number) {
  await getDb()
    .delete(leads)
    .where(eq(leads.id, id));
}
