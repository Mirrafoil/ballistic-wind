import { Events } from '@ionic/angular';
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
  lastMessage: string;

  constructor(public eventsTab2: Events) {
    this.eventsTab2.subscribe('jump-type-changed', data => {
      console.log('Tab2: Jump Type Changed to ', data);
      this.lastMessage = data;
      this.defineAltitudes(data);
    });
  }

  ngOnInit() {
    if (localStorage.getItem('windData') !== null) {
      // console.log('Loading windData from localStorage');
      this.windData = JSON.parse(localStorage.getItem('windData'));
    } else {
      if (localStorage.getItem('dropSettings') !== null) {
        const dropSettings = JSON.parse(localStorage.getItem('dropSettings'));
        this.defineAltitudes(dropSettings.jumpType);
      }
    }
  }

  ionViewWillEnter() {
    if (localStorage.getItem('windData') !== null) {
      this.windData = JSON.parse(localStorage.getItem('windData'));
      const dropSettings = JSON.parse(localStorage.getItem('dropSettings'));
      this.defineAltitudes(dropSettings.jumpType);
    } else {
      if (localStorage.getItem('dropSettings') !== null) {
        const dropSettings = JSON.parse(localStorage.getItem('dropSettings'));
        this.defineAltitudes(dropSettings.jumpType);
      }
    }
  }

  ionViewWillLeave() {
    this.submitWindData();
  }

  submitWindData() {
    if (localStorage.getItem('dropSettings') !== null) {
      localStorage.setItem('windData', JSON.stringify(this.windData));
      // console.log('Saving Wind Data');
    }
  }

  defineAltitudes(jumpType) {
    // Grab values from localStorage
    const dataValues = JSON.parse(localStorage.getItem('dropSettings'));
    const dropAltitude = dataValues.dropAltitude;
    const actualAltitude = dataValues.actualAltitude;
    const dzElevation = dataValues.dzElevation;

    console.log('Calculating Altitudes for', jumpType);

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

      // Fix to align with MS Excel
      // this.altitudes.pop();
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
    }

    this.altitudes = this.altitudes.filter(onlyUnique);

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    this.updateWindDataAltitudes();

    let currentBallisticAltitudes = null;
    if (localStorage.getItem('ballistic-altitudes') !== null) {
      currentBallisticAltitudes = JSON.parse(
        localStorage.getItem('ballistic-altitudes')
      );
    }

    localStorage.setItem('ballistic-altitudes', JSON.stringify(this.altitudes));
  }

  updateWindDataAltitudes() {
    const storedwindData = JSON.parse(localStorage.getItem('windData'));
    if (storedwindData.length > 0) {
      // Case that windData needs updating
      // Cycle through each altitude, keep data entered for altitudes, remove those that aren't
      let newWindData = [];
      for (let i = 0; i < this.altitudes.length; ++i) {
        const currentAlt = this.windData.filter(
          a => a.altitude === this.altitudes[i]
        );
        if (currentAlt.length !== 0) {
          newWindData[i] = {
            altitude: this.altitudes[i],
            direction: this.windData[i].direction,
            speed: this.windData[i].speed
          };
        } else {
          newWindData[i] = {
            altitude: this.altitudes[i],
            direction: null,
            speed: null
          };
        }
      }
      this.windData = newWindData;
    } else {
      // Case that no windData is currently stored
      for (let i = 0; i < this.altitudes.length; ++i) {
        this.windData[i] = {
          altitude: this.altitudes[i],
          direction: null,
          speed: null
        };
      }
    }
  }
}
