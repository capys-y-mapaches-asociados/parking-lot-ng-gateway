import { SpotStatus } from 'app/entities/enumerations/spot-status.model';
import { SpotType } from 'app/entities/enumerations/spot-type.model';

import { IParkingSpot, NewParkingSpot } from './parking-spot.model';

export const sampleWithRequiredData: IParkingSpot = {
  id: 12186,
  number: 22612,
  status: SpotStatus['OCCUPIED'],
  spotType: SpotType['REGULAR'],
};

export const sampleWithPartialData: IParkingSpot = {
  id: 60814,
  number: 24222,
  status: SpotStatus['OUT_OF_SERVICE'],
  spotType: SpotType['DISABLED'],
};

export const sampleWithFullData: IParkingSpot = {
  id: 95588,
  number: 95071,
  status: SpotStatus['OUT_OF_SERVICE'],
  spotType: SpotType['DISABLED'],
};

export const sampleWithNewData: NewParkingSpot = {
  number: 88160,
  status: SpotStatus['OUT_OF_SERVICE'],
  spotType: SpotType['REGULAR'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
