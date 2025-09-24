'use client';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import Dropdown from '@/components/dropdown';
import IconInfoCircle from '@/components/icon/icon-info-circle';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { NotificationVM } from '@/types/notifcation.model';
import EmptyDataTable from '@/components/commons/EmptyDataTable';

const Content = ({ 
    className, 
    notifications, 
    notificationNonLus, 
    voirTout, 
    toutMarqueCommeLus, 
    isConnected, 
    voirMoins 
}: {
    className?: string,
    notifications: NotificationVM[],
    notificationNonLus: NotificationVM[];
    voirTout: () => void,
    toutMarqueCommeLus: () => void,
    voirMoins: boolean
    isConnected: boolean;
}) => {
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

    return (
        <div className={`dropdown shrink-0 ${className}`}>
            <Dropdown
                offset={[0, 8]}
                placement="bottom"
                btnClassName="relative block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                button={
                    <span className="relative inline-block">
                        <Bell className="w-5 h-5" />
                        {notificationNonLus.length > 0 && (
                            <span className="absolute -top-2 -right-1 flex h-5 w-5 items-center justify-center">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/50 opacity-75"></span>
                                <span className="relative inline-flex h-4 w-4 rounded-full bg-red-500 items-center justify-center">
                                    <span className="text-white text-xs font-bold leading-none">
                                        {notificationNonLus.length > 99 ? '99+' : notificationNonLus.length}
                                    </span>
                                </span>
                            </span>
                        )}
                    </span>
                }
            >
                <ul className="w-[350px] lg:w-[500px] xl:w-[600px] divide-y !py-0 text-dark dark:divide-white/10 dark:text-white-dark !shadow-xl max-h-[400px] overflow-y-auto">
                    {/* Header */}
                    <li onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-4 py-3 font-semibold border-b border-gray-200 dark:border-gray-700">
                            <h4 className="text-lg font-bold text-gray-800 dark:text-white">Notifications</h4>
                            {notificationNonLus.length > 0 && (
                                <span 
                                    className="text-sm text-blue-600 cursor-pointer hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                    onClick={toutMarqueCommeLus}
                                >
                                    Tout marquer comme lu
                                </span>
                            )}
                        </div>
                    </li>

                    {/* Notifications */}
                    {notifications.length > 0 ? (
                        <>
                            {notifications.map((notification) => (
                                <li key={notification.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <div className="flex items-start px-4 py-3 space-x-3">
                                        {/* Avatar avec indicateur de connexion */}
                                        <div className="relative flex-shrink-0">
                                            <img 
                                                className="h-10 w-10 rounded-full object-cover" 
                                                alt="profile" 
                                                src="/assets/images/avatar.png" 
                                            />
                                            <span 
                                                className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 ${
                                                    isConnected ? "bg-green-500" : "bg-red-500"
                                                }`}
                                            />
                                        </div>

                                        {/* Contenu de la notification */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <h6 className={`text-sm font-semibold text-gray-900 dark:text-white ${!notification.lu ? 'font-bold' : ''}`}>
                                                        {notification.titre}
                                                    </h6>
                                                    {notification.message && (
                                                        <p className={`text-sm text-gray-600 dark:text-gray-400 mt-1 ${!notification.lu ? 'font-medium' : ''}`}>
                                                            {notification.message}
                                                        </p>
                                                    )}
                                                    
                                                    {/* Bouton d'action pour les notifications non lues */}
                                                    {!notification.lu && notification.type && (
                                                        <div className="mt-2">
                                                            <Button className="h-7 px-3 py-1 text-xs rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600">
                                                                <Link href={notification.lien || "#"}>
                                                                    {notification.type.toString()
                                                                        .toLowerCase()
                                                                        .replace(/_/g, " ")
                                                                        .replace(/\b\w/g, char => char.toUpperCase())}
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Temps et lien détail */}
                                                <div className="flex flex-col items-end ml-2 flex-shrink-0">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {notification.tempsPasse}
                                                    </span>
                                                    <Link 
                                                        href={`/notification/${notification.id}`} 
                                                        className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mt-1"
                                                    >
                                                        Détail
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* Indicateur de notification non lue */}
                                            {!notification.lu && (
                                                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}

                            {/* Voir tous */}
                            <li className="border-t border-gray-200 dark:border-gray-700">
                                <Link href="/notification">
                                    <div className="px-4 py-3 text-center">
                                        <span className="text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer">
                                            Voir toutes les notifications
                                        </span>
                                    </div>
                                </Link>
                            </li>
                        </>
                    ) : (
                        <li className="px-4 py-8">
                            <div className="text-center">
                                <EmptyDataTable title="Aucune notification" />
                            </div>
                        </li>
                    )}
                </ul>
            </Dropdown>
        </div>
    );
};

export default Content;