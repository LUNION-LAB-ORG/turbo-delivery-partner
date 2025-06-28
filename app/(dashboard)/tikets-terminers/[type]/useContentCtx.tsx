// 'use client';

// import { getAllBonLivraisons } from '@/src/actions/tickets.actions';
// import { BonLivraisonVM } from '@/types';
// import { PaginatedResponse } from '@/types/models';
// import { CalendarDate, RangeValue, Switch } from '@heroui/react';
// import { useParams } from 'next/navigation';
// import { Key, useCallback, useEffect, useMemo, useState } from 'react';
// import { toast } from 'react-toastify';

// //  Fonction qui renvoie dynamiquement les colonnes en fonction du type
// function getColumns(type?: string) {
//   const baseColumns = [
//     { name: 'Référence', uid: 'reference' },
//     { name: 'Date et Heure', uid: 'date' },
//     { name: 'Livreur', uid: 'livreur' },
//     { name: 'Coût livraison', uid: 'coutLivraison' },
//     { name: 'Coût commande', uid: 'coutCommande' },
//     { name: 'Terminé', uid: 'statut' },
//   ];

//   if (type === 'commision-en-pourcentage') {
//     baseColumns.splice(5, 0, { name: 'Pourcentage', uid: 'commission' });
//   } else if (type === 'commision-en-montant-fixe') {
//     baseColumns.splice(5, 0, { name: 'Commission (Montant fixe)', uid: 'commssionFixe' });
//   }

//   // Si type = cumul → on ne rajoute rien de plus
//   return baseColumns;
// }


// interface Props {
//   initialData: PaginatedResponse<BonLivraisonVM> | null;
//   restaurantId?: string;
// }

// export default function useContentCtx({ initialData, restaurantId }: Props) {
//   const { type } = useParams(); // récupère ?type=cumul ou autre
//   const [isLoading, setIsLoading] = useState(!initialData);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize] = useState(10);
//   const [data, setData] = useState<PaginatedResponse<BonLivraisonVM> | null>();

//   const [dates, setDates] = useState<RangeValue<CalendarDate> | null>(null);

//   // 👇 Colonnes dynamiques recalculées si le type change
//   const columns = useMemo(() => getColumns(type as string), [type]);

//   useEffect(() => {
//     mapData(initialData);
//   }, [initialData]);

//   const handleDateChange = (value: RangeValue<CalendarDate>) => {
//     if (value.start && value.end) {
//       setDates({ start: value.start, end: value.end });
//       handlePageChange(1);
//     }
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   // 👇 Chargement automatique des données dès que page ou dates changent
//   useEffect(() => {
//     const fetchData = async () => {
//       if ((dates?.start && dates?.end) || currentPage || pageSize) {
//         setIsLoading(true);
//         try {
//           const newData = await getAllBonLivraisons(restaurantId ?? '', currentPage - 1, pageSize, {
//             dates: {
//               start: dates?.start?.toString() ?? '',
//               end: dates?.end?.toString() ?? '',
//             },
//           });
//           mapData(newData);
//         } catch (error) {
//           toast.error('Erreur lors de la récupération des données');
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     };
//     fetchData();
//   }, [dates?.start, dates?.end, currentPage, pageSize, restaurantId]);

//   // 👇 On ne garde que les commandes TERMINÉES
//   const mapData = (result: PaginatedResponse<BonLivraisonVM> | null) => {
//     const filtered = result?.content.filter((item: BonLivraisonVM) => item.statut === 'TERMINER' as typeof item.statut) || [];
//     if (filtered && result) setData({ ...result, content: filtered });
//   };

//   // 👇 Rendu personnalisé des cellules
//   const renderCell = useCallback((bonLivraison: BonLivraisonVM, columnKey: Key) => {
//     const cellValue = bonLivraison[columnKey as keyof BonLivraisonVM];
//     if (columnKey === 'commission' && type === 'commision-en-pourcentage') {
//       return <p className='text-blue-600'>{' 0 (10% CC)'}</p>;
//     } else if (columnKey === 'commssionFixe' && type === 'commision-en-montant-fixe') {
//       return <p className='text-purple-600'>{'0 FCFA'}</p>;
//     } else {
//       switch (columnKey) {
//         case 'livreur':
//           return <p>{cellValue?.toString() ?? '-'}</p>;
//         case 'coutLivraison':
//           return <p>{String(cellValue) + ' FCFA'}</p>;
//         case 'coutCommande':
//           return <p>{String(cellValue) + ' FCFA'}</p>;
//         case 'statut':
//           return cellValue == 'TERMINER' ? <Switch size='sm' color='primary' readOnly isSelected /> : <Switch size='sm' isSelected={false} readOnly />;
//         default:
//           return cellValue;
//       }
//     }
//   }, [type]);

//   return {
//     renderCell,
//     columns,
//     data,
//     handlePageChange,
//     currentPage,
//     isLoading,
//     handleDateChange,
//     type,
//   };
// }

'use client';

import { getAllBonLivraisons } from '@/src/actions/tickets.actions';
import { BonLivraisonVM } from '@/types';
import { PaginatedResponse } from '@/types/models';
import { CalendarDate, RangeValue, Switch } from '@heroui/react';
import { useParams } from 'next/navigation';
import { Key, useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

// Fonction qui renvoie dynamiquement les colonnes en fonction du type
function getColumns(type?: string) {
  const baseColumns = [
    { name: 'Référence', uid: 'reference' },
    { name: 'Date et Heure', uid: 'date' },
    { name: 'Livreur', uid: 'livreur' },
    { name: 'Coût livraison', uid: 'coutLivraison' },
    { name: 'Coût commande', uid: 'coutCommande' },
    { name: 'Terminé', uid: 'statut' },
  ];

  if (type === 'commision-en-pourcentage') {
    baseColumns.splice(5, 0, { name: 'Commission (Montant fixe)', uid: 'commission' });
  } else if (type === 'commision-en-montant-fixe') {
    baseColumns.splice(5, 0, { name: 'Commission (Montant fixe)', uid: 'commssionFixe' });
  }

  return baseColumns;
}

interface Props {
  initialData: PaginatedResponse<BonLivraisonVM> | null;
  restaurantId?: string;
}

export default function useContentCtx({ initialData, restaurantId }: Props) {
  const { type } = useParams();
  const [isLoading, setIsLoading] = useState(!initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [data, setData] = useState<PaginatedResponse<BonLivraisonVM> | null>();

  const [dates, setDates] = useState<RangeValue<CalendarDate> | null>(null);

  const columns = useMemo(() => getColumns(type as string), [type]);

  useEffect(() => {
    mapData(initialData);
  }, [initialData]);

  const handleDateChange = (value: RangeValue<CalendarDate>) => {
    if (value.start && value.end) {
      setDates({ start: value.start, end: value.end });
      handlePageChange(1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchData = async () => {
      if ((dates?.start && dates?.end) || currentPage || pageSize) {
        setIsLoading(true);
        try {
          const newData = await getAllBonLivraisons(restaurantId ?? '', currentPage - 1, pageSize, {
            dates: {
              start: dates?.start?.toString() ?? '',
              end: dates?.end?.toString() ?? '',
            },
          });
          mapData(newData);
        } catch (error) {
          toast.error('Erreur lors de la récupération des données');
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [dates?.start, dates?.end, currentPage, pageSize, restaurantId]);

  const mapData = (result: PaginatedResponse<BonLivraisonVM> | null) => {
    const filtered = result?.content.filter((item: BonLivraisonVM) => item.statut === 'TERMINER' as typeof item.statut) || [];
    if (filtered && result) setData({ ...result, content: filtered });
  };

  const renderCell = useCallback((bonLivraison: BonLivraisonVM, columnKey: Key) => {
    const cellValue = bonLivraison[columnKey as keyof BonLivraisonVM];

    if (columnKey === 'commission' && type === 'commision-en-pourcentage') {
      return (
        <p className='text-blue-600'>
            {`${bonLivraison.commission || 0} (10% CC)`}
        </p>
      );
    } else if (columnKey === 'commssionFixe' && type === 'commision-en-montant-fixe') {
      return <p className='text-purple-600'>{`${bonLivraison.commission || 0} FCFA`}</p>;
    } else {
      switch (columnKey) {
        case 'livreur':
          return <p>{cellValue?.toString() ?? '-'}</p>;
        case 'coutLivraison':
          return <p>{String(cellValue) + ' FCFA'}</p>;
        case 'coutCommande':
          return <p>{String(cellValue) + ' FCFA'}</p>;
        case 'statut':
          return cellValue == 'TERMINER' ?
            <Switch size='sm' color='primary' readOnly isSelected /> :
            <Switch size='sm' isSelected={false} readOnly />;
        default:
          return cellValue;
      }
    }
  }, [type]);

  return {
    renderCell,
    columns,
    data,
    handlePageChange,
    currentPage,
    isLoading,
    handleDateChange,
    type,
  };
}
