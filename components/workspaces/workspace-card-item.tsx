import React from 'react';
import { Card, CardBody, CardFooter, Button, CardHeader, Avatar, Chip } from '@nextui-org/react';
import Link from 'next/link';

import { body, title } from '@/components/primitives';
import { cn } from '@/lib/utils';
import { formatDate } from '@/utils/date-formate';
import { AvatarGroupComponent } from '@/components/workspaces/avatar-group-component';
import { Organisation } from '@/types';

export function WorkspaceCardItem(organisation: Organisation): React.JSX.Element {
    return (
        <Card key={organisation.name} className="w-full max-w-md">
            <CardHeader className="flex flex-col items-start gap-3">
                <div className="w-full flex justify-between items-start gap-3">
                    <div className="flex items-center gap-1">
                        <Avatar
                            showFallback
                            name={
                                organisation.name
                                    .split(' ')[0]
                                    ?.slice(0, organisation.name.split(' ').length > 1 ? 1 : 2)
                                    ?.toUpperCase() + (organisation.name.split(' ').length > 1 ? organisation.name.split(' ')[1]?.slice(0, 1)?.toUpperCase() : '')
                            }
                            size="sm"
                            src={organisation.logo!}
                        />
                        <p className="text-gray-400">#{organisation.reference}</p>
                    </div>
                    <Chip color="primary" variant="bordered" size="sm" className="font-thin">
                        {organisation.role}
                    </Chip>
                </div>
                <div className="flex flex-col text-left">
                    <p className={title({ size: 'h6' })}>{organisation.name + ' '}</p>
                    <p className={cn(body({ size: 'caption' }), 'line-clamp-3')}>Crée le {formatDate(organisation.created_at)}</p>
                </div>
            </CardHeader>
            <CardBody>
                <p className={cn(body({ size: 'caption' }), 'line-clamp-3')}>{organisation.description}</p>
            </CardBody>
            <CardFooter className="flex justify-between items-center">
                <Button as={Link} color="primary" href={`/workspaces/${organisation.reference}`} size="sm">
                    Accéder
                </Button>
                <AvatarGroupComponent images={organisation.members} />
            </CardFooter>
        </Card>
    );
}
