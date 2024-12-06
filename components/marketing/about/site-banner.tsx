'use client';

import { getTranslation } from '@/i18n';
import renderHtml from '@/utils/render-html';

export function SiteBanner() {
    const { t } = getTranslation();

    return (
        <div className="relative z-[40] top-0 bg-primary text-background py-3 md:py-0">
            <div className="container flex flex-col items-center justify-center gap-4 md:h-12 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-background">{renderHtml(t('banner'))}</p>
            </div>
            <hr className="absolute bottom-0 m-0 h-px w-full bg-neutral-200/30" />
        </div>
    );
}
