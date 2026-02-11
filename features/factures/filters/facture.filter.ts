import { parseAsInteger, parseAsIsoDate } from 'nuqs';
import { subMonths } from 'date-fns';

export const factureFiltersClient = {
    filter: {
        periodeDebut: parseAsIsoDate.withDefault(subMonths(new Date(), 1)),
        periodeFin: parseAsIsoDate.withDefault(new Date()),
        page: parseAsInteger.withDefault(0),
        size: parseAsInteger.withDefault(20),
    },
    option: {
        clearOnDefault: true,
        throttleMs: 500,
        urlKeys: {
            periodeDebut: 'fPeriodeDebut',
            periodeFin: 'fPeriodeFin',
            page: 'fPage',
            size: 'fSize',
        },
    },
};