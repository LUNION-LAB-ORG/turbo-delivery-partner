import { z } from "zod";

export const confirmOTPSchema = z.object({
  otp: z.string(),
});
export type _confirmOTPSchema = z.infer<typeof confirmOTPSchema>;

export const profileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  last_name: z.string().min(2),
  first_name: z.string().min(2),
  birthdate: z.string().date(),
  phone_number: z.string().min(6),
  country: z.string(),
});
export type _profileSchema = z.infer<typeof profileSchema>;