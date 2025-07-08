import NextAuth from 'next-auth';
import { Restaurant } from './models';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            name: string;
            image: string;
            email: string;
            token: string;
            role: string;
            restaurant: string;
            restauranID: string;
            typeCommission: string;
        };
    }

    interface User {
        id: string;
        name: string;
        image: string;
        email: string;
        token: string;
        role: string;
        restaurant: string;
        restauranID: string;
        typeCommission: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        name: string;
        image: string;
        email: string;
        token: string;
        role: string;
        typeCommission: string;
        restauranID: string;
    }
}
