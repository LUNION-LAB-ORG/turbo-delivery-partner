'use client';

import { Tooltip } from '@nextui-org/react';
import { IconInfoCircle } from '@tabler/icons-react';

export default function TooltipDescription({ description }: { description: string | null | undefined }) {
    return (
        <Tooltip
            content={
                <div className="px-1 py-2">
                    <div className="text-small font-bold">Description</div>
                    <div className="text-tiny">{description ?? 'Aucune description disponible'}</div>
                </div>
            }
        >
            <IconInfoCircle className="size-4" />
        </Tooltip>
    );
}
