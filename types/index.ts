import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface ActionResult {
  data: any;
  message: string;
  errors: {
    [key: string]: string;
  };
  status: "idle" | "loading" | "success" | "error";
  code?: ErrorDefaultCode;
}

export interface TeamUser {
  id: string;
  name: string;
  role: string;
  logo: string | null;
  reference: string;
  description: string | null;
  joined_at: string;
  members: string[];
}

export interface UserTeams {
  teams: TeamUser[];
  shared_teams: TeamUser[];
}

export interface ErrorCode {
  code: ErrorDefaultCode;
  message: string;
}

export enum ErrorDefaultCode {
  exception = "P0001",
  rls = "42501",
  auth = "401",
}

export interface Action {
  id: string;
  module_id: string;
  name: string;
  description: string | null;
  is_public: boolean | null;
}

export interface Invitation {
  id: string;
  email: string;
  created_at: string | null;
  inviter_profile_id: string | null;
  role_id: string | null;
  status: string | null;
  team_id: string | null;
}

export interface Member {
  id: string;
  joined_at: string | null;
  profile_id: string | null;
  role_id: string | null;
  team_id: string | null;
}

export interface Module {
  id: string;
  name: string;
  description: string | null;
  is_paid: boolean | null;
  created_at: string;
}

export interface Profile {
  id: string;
  status: number;
  deleted: boolean;
  dateCreation: string;
  dateEdition: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string;
  country: string | null;
  city: string | null;
  birthDate: string | null;
  email: string;
  bio: string | null;
  address: string | null;
  phoneNumber: string | null;
  job: string | null;
  gender: string | null;
  documentUrl: string | null;
  documentType: string | null;
}

export interface Property {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  price: number | null;
  team_id: string | null;
  created_at: string | null;
  created_by: string | null;
  updated_at: string | null;
  updated_by: string | null;
}

export interface RoleAction {
  id: string;
  role_id: string;
  action_id: string;
}

export interface Role {
  id: string;
  name: string;
  is_predefined: boolean | null;
  team_id: string | null;
  created_at: string | null;
}

export interface TeamModuleSubscription {
  id: string;
  team_id: string;
  module_id: string;
  is_active: boolean | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string | null;
  created_by: string | null;
  updated_at: string | null;
}

export interface Team {
  id: string;
  name: string;
  description: string | null;
  category:
    | "ADMINISTRATION"
    | "PROFESSION LIBERALE"
    | "PME-PMI-SARL"
    | "SOCIETE ANONYME (SA)"
    | "SOCIETE INDIVIDUELLE"
    | "COMMUNAUTE RELIGIEUSE"
    | "ASSOCIATION - ONG"
    | "ARTISAN - COMMERÇANT"
    | null;
  email: string | null;
  phone_number: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  logo: string | null;
  manager_name: string | null;
  manager_email: string | null;
  document: string | null;
  document_type:
    | "REGISTRE DE COMMERCE"
    | "AUTORISATION D_EXERCICE"
    | "STATUT"
    | "NUMERO COMPTE CONTRIBUABLE"
    | null;
  document_number: string | null;
  document_date_start: string | null;
  document_date_valid: string | null;
  created_at: string | null;
  created_by: string;
}
