import React from 'react';
import { Loader2 } from 'lucide-react';

function TicketLoading() {
    return (
        <div className="w-full h-full pb-10 flex flex-1 flex-col gap-4 justify-center items-center">
            <Loader2 className="animate-spin size-8" />
        </div>
    );
}

export default TicketLoading;
