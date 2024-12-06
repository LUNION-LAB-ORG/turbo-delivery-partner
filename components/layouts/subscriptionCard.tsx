import { Button, CardFooter, CardHeader } from '@nextui-org/react';
import { Card } from '@nextui-org/react';
import { ProfileSubscription } from '@/types/models';
import { body, subtitle } from '@/components/primitives';

export const SubscriptionCard = ({ subscription }: { subscription: ProfileSubscription | null }) => {
    return subscription ? (
        subscription.is_active ? (
            <Card className="p-4">
                <p className={subtitle({ class: 'text-primary' })}>Abonnement en cours</p>
                <p className={body({ class: 'font-semibold' })}>Plan : {subscription.plan.name}</p>
                <ul></ul>
                <CardFooter>
                    <Button className="text-white" color="primary" size="sm">
                        Essayer gratuitement
                    </Button>
                </CardFooter>
            </Card>
        ) : (
            <Card className="p-4">
                <CardHeader>
                    <p className={subtitle({ class: 'text-primary' })}>Abonnement en cours</p>
                </CardHeader>
                <p className={body({ size: 'body2' })}>
                    Vous n&apos;avez pas d&apos;abonnement en cours. Rejoignez-nous dès aujourd'hui pour profiter de fonctionnalités avancées de gestion immobilière et maximiser votre expérience !
                </p>

                <CardFooter>
                    <Button className="text-white" color="primary" size="sm">
                        Essayer gratuitement
                    </Button>
                </CardFooter>
            </Card>
        )
    ) : (
        <Card className="p-4">
            <CardHeader>
                <p className={subtitle({ class: 'text-primary' })}>Abonnement en cours</p>
            </CardHeader>
            <p className={body({ size: 'body2' })}>
                Vous n&apos;avez pas d&apos;abonnement en cours. Rejoignez-nous dès aujourd'hui pour profiter de fonctionnalités avancées de gestion immobilière et maximiser votre expérience !
            </p>

            <CardFooter>
                <Button className="text-white" color="primary" size="sm">
                    Essayer gratuitement
                </Button>
            </CardFooter>
        </Card>
    );
};
