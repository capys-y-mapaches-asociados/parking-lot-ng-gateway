import { IParkingLot } from 'app/entities/ParkingLot/parking-lot/parking-lot.model';
import { SpotStatus } from 'app/entities/enumerations/spot-status.model';
import { SpotType } from 'app/entities/enumerations/spot-type.model';

export interface IParkingSpot {
  id: number;
  number?: number | null;
  status?: SpotStatus | null;
  spotType?: SpotType | null;
  parkingLot?: Pick<IParkingLot, 'id'> | null;
}

export type NewParkingSpot = Omit<IParkingSpot, 'id'> & { id: null };
