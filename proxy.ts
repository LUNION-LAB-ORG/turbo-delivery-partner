import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';
import { findOneRestaurant } from './src/actions/restaurant.actions';

export async function proxy(request: NextRequest) {
    const session = await auth();
    const { pathname } = request.nextUrl;

    // ✅ On laisse passer les fichiers publics nécessaires au PWA
    if (
        pathname.startsWith('/manifest.json') ||
        pathname.startsWith('/service-worker.js') ||
        pathname.startsWith('/favicon.ico') ||
        pathname.startsWith('/icon') // pour icon-192x192.png etc.
    ) {
        return NextResponse.next();
    }

    // 🚫 Si l'utilisateur n'est pas authentifié
    if (!session?.user) {
        if (!pathname.startsWith('/auth')) {
            return NextResponse.redirect(new URL('/auth', request.url));
        }
    } else {
        const data = await findOneRestaurant();
        const restaurant = data?.restaurant;

        if (!restaurant && session?.user.restaurant && !pathname.startsWith('/auth')) {
            return NextResponse.redirect(new URL(`/auth`, request.url));
        }

        if (!restaurant && !session?.user.restaurant && !pathname.startsWith('/create-restaurant')) {
            return NextResponse.redirect(new URL(`/create-restaurant`, request.url));
        }

        if (restaurant && restaurant.openingHours.length === 0 && !pathname.startsWith('/horaires')) {
            return NextResponse.redirect(new URL('/horaires', request.url));
        }

        if (restaurant && restaurant.openingHours.length > 0 && restaurant?.pictures.length === 0 && !pathname.startsWith('/add-pictures')) {
            return NextResponse.redirect(new URL('/add-pictures', request.url));
        }

        if (restaurant && restaurant.openingHours.length > 0 && restaurant?.pictures.length > 0 && restaurant.status <= 2 && !pathname.startsWith('/activation-pending')) {
            return NextResponse.redirect(new URL('/activation-pending', request.url));
        }
    }

    return NextResponse.next();
}

// ✅ Config avec exclusions explicites
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|manifest.json|service-worker.js|icon|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|auth|api/auth|auth/signout).*)',
    ],
};
