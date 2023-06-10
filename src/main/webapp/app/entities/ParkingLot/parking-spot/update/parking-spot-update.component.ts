import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ParkingSpotFormService, ParkingSpotFormGroup } from './parking-spot-form.service';
import { IParkingSpot } from '../parking-spot.model';
import { ParkingSpotService } from '../service/parking-spot.service';
import { IParkingLot } from 'app/entities/ParkingLot/parking-lot/parking-lot.model';
import { ParkingLotService } from 'app/entities/ParkingLot/parking-lot/service/parking-lot.service';
import { SpotStatus } from 'app/entities/enumerations/spot-status.model';
import { SpotType } from 'app/entities/enumerations/spot-type.model';

@Component({
  selector: 'jhi-parking-spot-update',
  templateUrl: './parking-spot-update.component.html',
})
export class ParkingSpotUpdateComponent implements OnInit {
  isSaving = false;
  parkingSpot: IParkingSpot | null = null;
  spotStatusValues = Object.keys(SpotStatus);
  spotTypeValues = Object.keys(SpotType);

  parkingLotsSharedCollection: IParkingLot[] = [];

  editForm: ParkingSpotFormGroup = this.parkingSpotFormService.createParkingSpotFormGroup();

  constructor(
    protected parkingSpotService: ParkingSpotService,
    protected parkingSpotFormService: ParkingSpotFormService,
    protected parkingLotService: ParkingLotService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareParkingLot = (o1: IParkingLot | null, o2: IParkingLot | null): boolean => this.parkingLotService.compareParkingLot(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parkingSpot }) => {
      this.parkingSpot = parkingSpot;
      if (parkingSpot) {
        this.updateForm(parkingSpot);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const parkingSpot = this.parkingSpotFormService.getParkingSpot(this.editForm);
    if (parkingSpot.id !== null) {
      this.subscribeToSaveResponse(this.parkingSpotService.update(parkingSpot));
    } else {
      this.subscribeToSaveResponse(this.parkingSpotService.create(parkingSpot));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IParkingSpot>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(parkingSpot: IParkingSpot): void {
    this.parkingSpot = parkingSpot;
    this.parkingSpotFormService.resetForm(this.editForm, parkingSpot);

    this.parkingLotsSharedCollection = this.parkingLotService.addParkingLotToCollectionIfMissing<IParkingLot>(
      this.parkingLotsSharedCollection,
      parkingSpot.parkingLot
    );
  }

  protected loadRelationshipsOptions(): void {
    this.parkingLotService
      .query()
      .pipe(map((res: HttpResponse<IParkingLot[]>) => res.body ?? []))
      .pipe(
        map((parkingLots: IParkingLot[]) =>
          this.parkingLotService.addParkingLotToCollectionIfMissing<IParkingLot>(parkingLots, this.parkingSpot?.parkingLot)
        )
      )
      .subscribe((parkingLots: IParkingLot[]) => (this.parkingLotsSharedCollection = parkingLots));
  }
}
