import { ReactNode, SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number;
};

export interface ActionResult<T> {
    data?: T | null;
    message?: string;
    errors?: {
        [key: string]: string;
    };
    status?: 'idle' | 'loading' | 'success' | 'error';
    code?: ErrorDefaultCode | number;
}

export interface Organisation {
    id: string;
    name: string;
    role: string;
    logo: string | null;
    reference: string;
    description: string | null;
    created_at: string;
    members: string[];
}

export interface ProfileOrganisations {
    organisations: Organisation[];
    shared_organisations: Organisation[];
}

export interface ErrorCode {
    code: ErrorDefaultCode;
    message: string;
}

export enum ErrorDefaultCode {
    exception = '400',
    permission = '42501',
    auth = '401',
}

export interface SelectedPermissions {
    [moduleId: string]: {
        all: boolean;
        actions: string[];
    };
}
