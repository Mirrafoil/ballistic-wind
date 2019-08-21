import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  altitudes = [];
  windData = [];

  constructor() {}

  ngOnInit() {
    if (localStorage.getItem('windData') !== null) {
      // console.log('Loading windData from localStorage');
      this.windData = JSON.parse(localStorage.getItem('windData'));
    } else {
      if (localStorage.getItem('dropSettings') !== null) {
        console.log('No windData set, setting altitudes');
        this.defineAltitudes();
      }
    }
  }

  ionViewWillEnter() {
    if (localStorage.getItem('windData') !== null) {
      this.windData = JSON.parse(localStorage.getItem('windData'));
    } else {
      if (localStorage.getItem('dropSettings') !== null) {
        this.defineAltitudes();
      }
    }
  }

  ionViewWillLeave() {
    this.submitWindData();
  }

  submitWindData() {
    localStorage.setItem('windData', JSON.stringify(this.windData));
    console.log('Saving Wind Data');
  }

  defineAltitudes() {
    // Grab values from localStorage
    const dataValues = JSON.parse(localStorage.getItem('dropSettings'));
    const dropAltitude = dataValues.dropAltitude;
    const actualAltitude = dataValues.actualAltitude;
    const dzElevation = dataValues.dzElevation;
    const jumpType = dataValues.jumpType;

    console.log('Calculating Altitudes for ', jumpType);

    let start = 0;
    let step = 0;
    this.altitudes = [];
    if (jumpType === 'Standoff') {
      // Calculate Start & Step for Standoff
      start = 1000 * Math.floor(dzElevation / 1000 + 2);
      if (
        1000 * Math.floor((dropAltitude - dzElevation) / 1000 + 0.5) <
        15500
      ) {
        step = 1000;
      } else {
        step = 2000;
      }
      let altitude = 0;
      while (altitude < dropAltitude) {
        if (altitude === 0) {
          altitude = start;
        } else {
          altitude = altitude + step;
        }
        this.altitudes.push(altitude);
      }
    } else {
      let altitude = 0;
      let i = 0;
      // Calculate Altitudes for Freefall
      while (altitude < dropAltitude) {
        if (actualAltitude > i * 1000) {
          altitude = dzElevation + (i + 1) * 1000;
        } else {
          if (actualAltitude > (i - 1) * 1000) {
            altitude = (Math.floor(altitude / 1000 - 0.51) + 2) * 1000;
          } else {
            altitude = altitude + 2000;
          }
        }
        i += 1;
        this.altitudes.push(altitude);
      }
      // Fix to align with MS Excel
      this.altitudes.pop();
    }
    this.altitudes = this.altitudes.filter(onlyUnique);

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    for (var i = 0; i < this.altitudes.length; ++i) {
      this.windData[i] = {
        altitude: this.altitudes[i],
        direction: null,
        speed: null
      };
    }

    localStorage.setItem('ballistic-altitudes', JSON.stringify(this.altitudes));
    localStorage.setItem('windData', JSON.stringify(this.windData));
  }
}
