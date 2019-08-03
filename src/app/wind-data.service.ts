import { WindData } from './windData.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WindDataService {
  private _windData = new BehaviorSubject<WindData[]>([]);
  altitudes = [];

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
    console.log('Getting WindData from storage');
    const windData = [];
    const resData = JSON.parse(localStorage.getItem('windData'));
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

  passAltitudes(altitudes) {
    this.altitudes = [...this.altitudes, ...altitudes];
    this.altitudes = this.altitudes.filter(onlyUnique);

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    // console.log(this.altitudes);
  }

  getAltitudes() {
    console.log('Here, have Altitudes:', this.altitudes);
    return this.altitudes;
  }

  addWindData(altitude: number, dir: number, spd: number) {
    const newWindData = new WindData(altitude, dir, spd);
    this.windData.pipe(take(1)).subscribe(windData => {
      this._windData.next(windData.concat(newWindData));
    });
  }

  checkIfWindDataAdded() {
    if (localStorage.getItem('windData') !== null) {
      return false;
    } else if (JSON.parse(localStorage.getItem('windData')).length > 0) {
      console.log('Looks like we have some windData stored!');
      return true;
    } else {
      return false;
    }
  }
}
