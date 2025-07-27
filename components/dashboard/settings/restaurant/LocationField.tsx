'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import SelectLocationMap from './SelectLocationMap';

export default function LocationField() {
  const { control, setValue, watch } = useFormContext();

  const latitude = watch('latitude');
  const longitude = watch('longitude');

  return (
    <>
      <Controller
        control={control}
        name="latitude"
        render={({ field }) => (
          <input type="hidden" {...field} value={latitude ?? ''} />
        )}
      />

      <Controller
        control={control}
        name="longitude"
        render={({ field }) => (
          <input type="hidden" {...field} value={longitude ?? ''} />
        )}
      />

      <div className="mb-4">
        <label className="block font-semibold mb-4">
          Sélectionnez l'emplacement de votre restaurant sur la carte :
        </label>
        <SelectLocationMap
          value={{ lat: latitude, lng: longitude }}
          onChange={({ lat, lng }) => {
            setValue('latitude', lat);
            setValue('longitude', lng);
          }}
        />
      </div>
    </>
  );
}
