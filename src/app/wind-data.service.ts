import { WindData } from "./windData.model";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { take, map, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class WindDataService {
  private _windData = new BehaviorSubject<WindData[]>([]);

  get windData() {
    return this._windData.asObservable();
  }

  constructor() {}

  allStorage() {
    var values = [],
      keys = Object.keys(localStorage),
      i = keys.length;
    while (i--) {
      values.push(JSON.parse(localStorage.getItem(keys[i])));
    }
    return values;
  }

  fetchWindData() {
    console.log("Getting WindData from storage");
    const windData = [];
    const resData = localStorage.getItem("windData");
    for (const key in resData) {
      if (resData.hasOwnProperty(key)) {
        windData.push(
          new WindData(
            resData[key].altitude,
            resData[key].dir,
            resData[key].spd
          )
        );
      }
    }
    this._windData.next(windData);
  }

  getWindData(altitude: number) {
    return this.windData.pipe(
      take(1),
      map(windData => {
        return { ...windData.find(e => e.altitude === altitude) };
      })
    );
  }

  addWindData(altitude: number, dir: number, spd: number) {
    const newWindData = new WindData(altitude, dir, spd);
    this.windData.pipe(take(1)).subscribe(windData => {
      this._windData.next(windData.concat(newWindData));
    });
  }
}
