'use client';
import {
  Card,
  CardBody,
  CardHeader,
  Tooltip,
  DateRangePicker,
  RangeValue,
  CalendarDate,
} from '@heroui/react';
import { title } from '@/components/primitives';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import { ChartConfig } from '@/components/ui/chart';
import { ChiffreAffaireRestaurant } from '@/types/statistiques.model';
import useContentCtx from './useContentCtx';
import {
  TbArrowUpRight,
  TbChartBar,
  TbMoneybag
} from 'react-icons/tb';
import { Info } from 'lucide-react';
import Loading from '@/components/layouts/loading';
import Link from 'next/link';

const chartConfig = {
  orders: {
    label: 'Commandes',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

interface Props {
  initialData: ChiffreAffaireRestaurant | null;
}

export default function Content({ initialData }: Props) {
  const {
    data,
    orderStatusData,
    statCards,
    detailCards,
    handleDateChange,
    dates,
    isLoading
  } = useContentCtx({ initialData });

  if (isLoading) return <Loading />;

  return (
    <div className="w-full px-4 md:px-8 py-8 mx-auto max-w-7xl flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className={title({ size: 'h3', class: 'text-primary' })}>Tableau de bord</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Rechercher la période</span>
          <DateRangePicker
            className="max-w-xs"
            value={dates}
            onChange={(value) => handleDateChange(value as RangeValue<CalendarDate>)}
          />
        </div>
      </div>

      {/* Stat Cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
            {statCards.map((stat, index) => {
            const content = (
                <Card
                key={index}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:ring-1 hover:ring-blue-300"
                >
                <CardBody className="p-6">
                    <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-500">{stat.title}</span>
                        <span className="text-2xl font-semibold text-gray-800">
                          {stat.value} {stat.title.includes('Total des commandes terminées') ? '' : 'XOF'}
                        </span>
                    </div>
                    <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color}`}>
                        <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    </div>
                </CardBody>
                </Card>
            );

            return stat.url ? (
                <Link href={stat.url} key={index} className="focus:outline-none" aria-label={stat.title}>
                {content}
                </Link>
            ) : content;
            })}
        </div>

      {/* Order Distribution & Commissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PieChart */}
        <Card className="max-h-[400px] cursor-pointer bg-white rounded-2xl border border-gray-100 shadow-sm">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-800">Distribution des Commandes</h2>
          </CardHeader>
          <CardBody>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {orderStatusData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Commissions */}
        <div className="grid grid-cols-1 gap-6">
          {data?.typeCommission === "POURCENTAGE" && (
            <Link href={`/tikets-terminers/POURCENTAGE`} className="focus:outline-none">
              <Card className="min-h-[400px] cursor-pointer bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-xl hover:shadow-2xl transition-all duration-200 rounded-2xl">
                <CardHeader className="pb-0 pt-4 px-6">
                  <div className="flex gap-2 items-center">
                    <h4 className="text-lg font-medium opacity-90">Cumul des commandes terminées</h4>
                    <Tooltip content="Commission en type pourcentage" className='bg-yellow-200 font-bold'>
                      <Info size={18} className='cursor-pointer mt-2' />
                    </Tooltip>
                  </div>
                </CardHeader>
                <CardBody className="py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/20 rounded-lg">
                        <TbChartBar className="w-8 h-8" />
                      </div>
                      <p className="text-3xl font-bold">{data?.commissionChiffreAffaire?.toLocaleString() ?? 0} XOF</p>
                    </div>
                    <TbArrowUpRight className="w-8 h-8 opacity-80" />
                  </div>
                </CardBody>
              </Card>
            </Link>
          )}

          {data?.typeCommission === "FIXE" && (
            <Link href={`/tikets-terminers/FIXE`} className="focus:outline-none">
              <Card className="min-h-[400px] cursor-pointer bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-200 rounded-2xl">
                <CardHeader className="pb-0 pt-4 px-6">
                  <div className='flex gap-2 items-center'>
                    <h4 className="text-lg font-medium opacity-90">Commission montant fixe</h4>
                    <Tooltip content="Commission en type fixe" className='bg-yellow-200 font-bold'>
                      <Info size={20} className='cursor-pointer' />
                    </Tooltip>
                  </div>
                </CardHeader>
                <CardBody className="py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/20 rounded-lg">
                        <TbMoneybag className="w-8 h-8" />
                      </div>
                      <p className="text-3xl font-bold">{data?.commissionCommande?.toLocaleString() ?? 0} XOF</p>
                    </div>
                    <TbArrowUpRight className="w-8 h-8 opacity-80" />
                  </div>
                </CardBody>
              </Card>
            </Link>
          )}
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {detailCards.map((card, index) => (
          <Card key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <CardHeader className="flex gap-3 justify-between">
              <div className="flex gap-3 items-center">
                <div className={`p-2 rounded-lg ${card.color}`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold">{card.title}</h3>
              </div>
              <Tooltip
                content={
                  <div className="px-1 py-2 max-w-60">
                    <div className="text-sm font-bold">{card.title}</div>
                    <div className="text-xs">{card.description}</div>
                  </div>
                }
              >
                <Info size={20} />
              </Tooltip>
            </CardHeader>
            <CardBody className="pt-0">
              {card.stats.map((stat, statIndex) => (
                <div
                  key={statIndex}
                  className="flex items-center justify-between py-2 border-b last:border-b-0"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <stat.icon className="w-4 h-4 text-gray-400" />
                    <span>{stat.label}</span>
                  </div>
                  <span className="font-medium text-gray-800">
                    {stat.value} {stat.label === 'Nombre' ? '' : 'XOF'}
                  </span>
                </div>
              ))}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
