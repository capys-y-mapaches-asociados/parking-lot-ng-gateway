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
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
