import { auth } from '@/auth';
import { apiClientHttp } from './lib/api-client-http'; 
import { NextResponse, NextRequest } from 'next/server';
import { findOneRestaurant } from './src/actions/restaurant.actions';

export async function proxy(request: NextRequest) {
    const session = await auth();
    const { pathname } = request.nextUrl;

    // ✅ fichiers publics
    if (
        pathname.startsWith('/manifest.json') ||
        pathname.startsWith('/service-worker.js') ||
        pathname.startsWith('/favicon.ico') ||
        pathname.startsWith('/icon')
    ) return NextResponse.next();

    if (!session?.user) {
        if (!pathname.startsWith('/auth')) {
            return NextResponse.redirect(new URL('/auth', request.url));
        }
        return NextResponse.next();
    }

    // console.log('TOKEN USED:', session.user.token);
    // ✅ appels sécurisés
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

    return NextResponse.next();
}

// ✅ Config avec exclusions explicites
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|manifest.json|service-worker.js|icon|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|auth|api/auth|auth/signout).*)',
    ],
};
