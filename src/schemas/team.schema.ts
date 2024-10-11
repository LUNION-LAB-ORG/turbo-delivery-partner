import { z } from "zod";

export const teamSchema = z.object({
  name: z.string().min(2),
  description: z.string(),
  category: z.string(),
  address: z.string(),
  city: z.string(),
  country: z.string(),
  document: z.string().optional(),
  document_date_start: z.string().optional(),
  document_date_valid: z.string().optional(),
  document_number: z.string().optional(),
  document_type: z.string().optional(),
  email: z.string().email(),
  logo: z.string().optional(),
  manager_email: z.string().email(),
  manager_name: z.string(),
  phone_number: z.string(),
});

export type _teamSchema = z.infer<typeof teamSchema>;
