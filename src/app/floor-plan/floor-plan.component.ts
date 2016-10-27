import { Component, OnInit, ChangeDetectorRef , ElementRef } from '@angular/core';
import { OccupantPopUpService } from '../shared/occupantPopUp.service';

@Component({
  selector: 'app-floor-plan',
  templateUrl: './floor-plan.component.html',
  styleUrls: ['./floor-plan.component.scss']
})
export class FloorPlanComponent implements OnInit {

	selectionMode : boolean;

  constructor(private occupantPopUpService: OccupantPopUpService, 
  	          private ref: ChangeDetectorRef) { 
  	this.selectionMode = false;
  }

  ngOnInit() {
  	this.ref.detach();
  	this.occupantPopUpService.selectionMode$.subscribe(
      data => {
      	this.selectionMode = data;
        this.ref.detectChanges();
      });
  	this.ref.detectChanges();
  }

  selectionModeDisable(){
  	this.occupantPopUpService.changeSelectionMode(false);
  }

}
