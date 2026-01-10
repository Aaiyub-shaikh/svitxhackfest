export type CropType = 'rice' | 'wheat' | 'corn' | 'tomato' | 'potato' | 'cotton';

export interface IrrigationEvent {
  dateISO: string;
  volumeLiters: number;
  notes?: string;
}

const baseIntervalDays: Record<CropType, number> = {
  rice: 3,
  wheat: 7,
  corn: 5,
  tomato: 3,
  potato: 4,
  cotton: 7,
};

const litersPerAcrePerSession: Record<CropType, number> = {
  rice: 6000,
  wheat: 3500,
  corn: 4000,
  tomato: 3000,
  potato: 3500,
  cotton: 4500,
};

export function generateIrrigationSchedule(
  crop: CropType,
  sowingDateISO: string,
  landSizeAcres: number,
  rainNext24hMm?: number,
  count: number = 8,
): IrrigationEvent[] {
  const start = new Date();
  const sowingDate = new Date(sowingDateISO);
  if (isNaN(sowingDate.getTime())) {
    // fallback to today if invalid
    return [];
  }

  const interval = baseIntervalDays[crop] ?? 5;
  const baseVolume = litersPerAcrePerSession[crop] ?? 3500;

  const events: IrrigationEvent[] = [];
  let dayOffset = 0;

  // Adjust first interval if significant rain is expected
  const rainAdjust = rainNext24hMm && rainNext24hMm > 5 ? 2 : 0;

  // Start after sowing date at the first interval boundary that is >= today
  const firstDate = new Date(Math.max(sowingDate.getTime(), start.getTime()));
  // Set first scheduled date to tomorrow for clarity
  firstDate.setDate(firstDate.getDate() + 1 + rainAdjust);

  for (let i = 0; i < count; i++) {
    const d = new Date(firstDate);
    d.setDate(d.getDate() + dayOffset);

    const volume = baseVolume * Math.max(landSizeAcres, 0);
    const notes = rainAdjust && i === 0 ? 'Delayed due to rainfall' : undefined;

    events.push({
      dateISO: d.toISOString(),
      volumeLiters: Math.round(volume),
      notes,
    });

    dayOffset += interval;
  }

  return events;
}
