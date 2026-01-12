import { auth } from '@/auth';
import { apiClientHttp } from '@/lib/api-client-http'; 
import { findOneRestaurant } from '@/src/actions/restaurant.actions';
import DashboardLayoutWrapper from './dashboard-layout-wrapper';

interface DashboardLayoutWrapperProps {
    children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutWrapperProps) {
    const session = await auth();

    const data = await findOneRestaurant();
    const restaurant = data?.restaurant;
    
    return (
        <DashboardLayoutWrapper session={session} restaurant={restaurant}>
            {children}
        </DashboardLayoutWrapper>
    );
}