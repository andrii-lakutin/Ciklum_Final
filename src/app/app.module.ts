import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ServerService } from './shared/server.service';
import { SeatPopUpService } from './shared/seatPopUp.service';
import { OccupantPopUpService } from './shared/occupantPopUp.service';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FloorPlanComponent } from './floor-plan/floor-plan.component';
import { SeatItemsComponent } from './seat-items/seat-items.component';
import { SeatPopupComponent } from './seat-popup/seat-popup.component';
import { OccupantPopupComponent } from './occupant-popup/occupant-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FloorPlanComponent,
    SeatItemsComponent,
    SeatPopupComponent,
    OccupantPopupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule 
  ],
  providers: [ServerService, SeatPopUpService, OccupantPopUpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
