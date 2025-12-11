import { Metadata } from 'next';
import NotFoundClient from './not-found-client';

export const metadata: Metadata = {
    title: 'Error 404',
};

export default function NotFound() {
    return <NotFoundClient />;
}