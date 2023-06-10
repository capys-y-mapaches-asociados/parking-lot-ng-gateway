import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'parking-lot',
        data: { pageTitle: 'ParkingLots' },
        loadChildren: () => import('./ParkingLot/parking-lot/parking-lot.module').then(m => m.ParkingLotParkingLotModule),
      },
      {
        path: 'parking-spot',
        data: { pageTitle: 'ParkingSpots' },
        loadChildren: () => import('./ParkingLot/parking-spot/parking-spot.module').then(m => m.ParkingLotParkingSpotModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
