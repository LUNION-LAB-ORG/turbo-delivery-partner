'use client';

import React from 'react';
import { Role } from '@/types/models';
import RoleCard from './role-card';
import { Module } from '@/types/models';

export default function RoleContent({ roles, modules }: { roles: Role[]; modules: Module[] }) {
    return (
        <div className="relative min-h-[calc(100vh-300px)] h-full py-5 px-6 mt-4 flex-1 rounded-lg border border-dashed">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {roles.map((role) => (
                    <RoleCard key={role.id} role={role} modules={modules} />
                ))}
            </div>
        </div>
    );
}
