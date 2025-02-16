import { useParams } from 'react-router-dom';

import { useTourDetail } from '@/services/hooks/tour.query';
import { cn, formatDateOnly, formatPrice } from '@/lib/utils';

import { HeadingMain } from '@/components/heading-main';
import { PendingContent } from '@/components/pending-content';
import { Card, CardContent } from '@/components/ui/card';

import { FormSchedules } from './_components/form-schedules';
import { Alert } from '@/components/ui/alert';
import { ErrorContent } from '@/components/error-content';
import { NoContent } from '@/components/no-content';

export default function TourSchedulesPage() {
  const { tourId } = useParams();
  const {
    data: tourDetail,
    isLoading,
    isFetching,
    isError
  } = useTourDetail(tourId || '');

  if (isLoading) return <PendingContent withOutText className="h-40" />;
  if (isError) return <ErrorContent />;
  if (!tourDetail) return <NoContent description="Tour no encontrado." />;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 px-4 pb-4 md:px-6 md:pb-6">
      <HeadingMain
        title="Gestion de Horarios"
        description={`Tour: ${tourDetail.tour.name}`}
        hasBackNavigation
      />

      <Card className={cn(isFetching && 'cursor-wait')}>
        <CardContent>
          {tourDetail.availability && (
            <Alert variant="info" className="mb-4">
              <p className="mb-2 text-lg font-medium">Informacion del Tour:</p>
              <div className="flex gap-2">
                <div className="flex w-full flex-col">
                  <p>Precio:</p>
                  <p className="font-semibold text-cyan-200">
                    {formatPrice(Number(tourDetail.tour.price))}
                  </p>
                </div>
                <div className="flex w-full flex-col">
                  <p>Capacidad:</p>
                  <p className="font-semibold text-cyan-200">
                    {tourDetail.tour.capacity} personas
                  </p>
                </div>
                <div className="flex w-full flex-col">
                  <p>Duracion:</p>
                  <p className="font-semibold text-cyan-200">
                    {tourDetail.tour.duration}
                  </p>
                </div>
              </div>
              <p>Disponibilidad desde:</p>
              <p className="e font-semibold text-cyan-200">
                {formatDateOnly(
                  tourDetail.availability.dateFrom,
                  "dd 'de' MMMM, yyyy"
                )}
                <span className="px-1 text-cyan-500">{' -> '}</span>
                {formatDateOnly(
                  tourDetail.availability.dateTo,
                  "dd 'de' MMMM, yyyy"
                )}
              </p>
            </Alert>
          )}
          <FormSchedules tour={tourDetail.tour} />
        </CardContent>
      </Card>
    </div>
  );
}
