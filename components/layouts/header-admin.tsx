'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { IRootState } from '@/store';
import { toggleSidebar } from '@/store/themeConfigSlice';
import IconMenu from '@/components/icon/icon-menu';
import IconCaretDown from '@/components/icon/icon-caret-down';
import { usePathname } from 'next/navigation';
import { getTranslation } from '@/i18n';
import NotificationList from './notificationList';
import MessageList from './messageList';
import LocaleSwitch from './localeSwitch';
import ThemeSwitch from './themeSwitch';
import SearchComponent from './searchComponent';
import { Icone } from '../icons';
import ToolsList from './ToolsList';
import menuDataAdmin, { IMenuDataAdmin } from '@/config/menu-data-admin';
import UserProfileDropdown from './user-profile-dropdown';
import { Button } from '@nextui-org/react';

const HeaderAdmin = () => {
    const pathname = usePathname();
    const dispatch = useDispatch();
    const { t } = getTranslation();

    useEffect(() => {
        const selector = document.querySelector('ul.horizontal-menu a[href="' + window.location.pathname + '"]');
        if (selector) {
            const all: any = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
            for (let i = 0; i < all.length; i++) {
                all[0]?.classList.remove('active');
            }

            let allLinks = document.querySelectorAll('ul.horizontal-menu a.active');
            for (let i = 0; i < allLinks.length; i++) {
                const element = allLinks[i];
                element?.classList.remove('active');
            }
            selector?.classList.add('active');

            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link');
                if (ele) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele?.classList.add('active');
                    });
                }
            }
        }
    }, [pathname]);

    const themeConfig = useSelector((state: IRootState) => state.themeConfig);

    return (
        <>
            <header className={`z-40 ${themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}`}>
                <div className="shadow-sm">
                    <div className="relative flex w-full items-center bg-white px-5 py-2.5 dark:bg-black">
                        <div className="horizontal-logo flex items-center justify-between ltr:mr-2 rtl:ml-2">
                            <Icone className="py-2 shrink-0 mr-2" />

                            <Button isIconOnly variant="light" onClick={() => dispatch(toggleSidebar())} className="collapse-icon lg:hidden  ltr:ml-2 rtl:mr-2">
                                <IconMenu className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="hidden ltr:mr-2 rtl:ml-2 sm:block">
                          
                        </div>
                        <div className="flex items-center space-x-1.5 ltr:ml-auto rtl:mr-auto rtl:space-x-reverse dark:text-[#d0d2d6] sm:flex-1 ltr:sm:ml-0 sm:rtl:mr-0 lg:space-x-2">
                            <div className="sm:ltr:mr-auto sm:rtl:ml-auto">
                                <SearchComponent />
                            </div>
                            <ThemeSwitch />
                            <LocaleSwitch />
                            <MessageList />
                            <NotificationList />
                            <UserProfileDropdown />
                        </div>
                    </div>

                    {/* horizontal menu */}
                    <ul className="horizontal-menu hidden border-t border-[#ebedf2] bg-white px-6 py-1.5 font-semibold text-black rtl:space-x-reverse dark:border-[#191e3a] dark:bg-black dark:text-white-dark lg:space-x-1.5 xl:space-x-8">
                        <RenderMenu menu={menuDataAdmin} t={t} />
                    </ul>
                </div>
            </header>
        </>
    );
};

export default HeaderAdmin;

function RenderMenu({ menu, t }: { menu: IMenuDataAdmin[]; t: (value: string) => string }) {
    const renderItemMenu = (item: IMenuDataAdmin, key: number) => {
        return (
            <li key={key} className="relative">
                <button type="button">
                    {t(item.title)}
                    <div className="-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90">
                        <IconCaretDown />
                    </div>
                </button>
                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white dark:bg-black p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] ">
                    {item?.children?.map((child: any, index: number) => (
                        <li key={index}>
                            {child.icon && <child.icon className="shrink-0" />}
                            <Link href={`/lunion-booking-admin${child.path ?? ''}`}>{t(child.title)}</Link>
                        </li>
                    ))}
                </ul>
            </li>
        );
    };
    const renderItem = (item: IMenuDataAdmin, key: number) => {
        return (
            <Link href={`/lunion-booking-admin${item.path ?? ''}`} key={key} type="button" className="nav-link">
                <div className="flex items-center">
                    {item.icon && <item.icon className="shrink-0" />}
                    <span className="px-1">{t(item.title)}</span>
                </div>
            </Link>
        );
    };

    return menu.map((item, index) => {
        if (!item.isHeader && !item.children) {
            return renderItem(item, index);
        }
        return (
            <li key={index} className="menu nav-item relative">
                <button type="button" className="nav-link">
                    <div className="flex items-center">
                        {item.icon && <item.icon className="shrink-0" />}
                        <span className="px-1">{t(item.title)}</span>
                    </div>
                    <div className="right_arrow">
                        <IconCaretDown />
                    </div>
                </button>
                <ul className="sub-menu">
                    {item?.children?.map((child: any, index: number) =>
                        child.children ? (
                            renderItemMenu(child, index)
                        ) : (
                            <li key={index}>
                                <Link href={`/lunion-booking-admin${child.path ?? ''}`}>{t(child.title)}</Link>
                            </li>
                        ),
                    )}
                </ul>
            </li>
        );
    });
}
