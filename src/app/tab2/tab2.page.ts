import { element } from 'protractor';
import { Events } from '@ionic/angular';
import { Component, ViewChildren, QueryList, ElementRef } from '@angular/core';

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
    // Listen for any events fired called 'jump-type-changed', fired by Tab1 on changing Jump Type
    this.eventsTab2.subscribe('jump-type-changed', data => {
      console.log('Tab2: Jump Type Changed to ', data);
      this.lastMessage = data;
      this.defineAltitudes(data);
    });
  }

  // Listens for any #windInput elements created, allowing us to list them to move between with the keyboard
  @ViewChildren('windInput') foundInputElements: QueryList<ElementRef>;

  // When the page is initially loaded...
  ngOnInit() {
    if (localStorage.getItem('windData') !== null) {
      // console.log('Loading windData from localStorage');

      // Get previously saved windData elements from localStorage
      this.windData = JSON.parse(localStorage.getItem('windData'));
    } else {
      if (localStorage.getItem('dropSettings') !== null) {
        // Get previously saved drop settings from localStorage
        const dropSettings = JSON.parse(localStorage.getItem('dropSettings'));

        // Calculate input altitudes for our given jump type
        this.defineAltitudes(dropSettings.jumpType);
      }
    }
  }
  // Each time the page is entered
  ionViewWillEnter() {
    // If we have windData then load it and recalculate altitudes
    if (localStorage.getItem('windData') !== null) {
      this.windData = JSON.parse(localStorage.getItem('windData'));
      const dropSettings = JSON.parse(localStorage.getItem('dropSettings'));
      this.defineAltitudes(dropSettings.jumpType);
    } else {
      // If we have no windData, but do have jump settings then load the settings and calculate altitudes
      if (localStorage.getItem('dropSettings') !== null) {
        const dropSettings = JSON.parse(localStorage.getItem('dropSettings'));
        this.defineAltitudes(dropSettings.jumpType);
      }
    }
  }

  // When we lave the page... 
  ionViewWillLeave() {
    // Save the inputted wind data to localStorage and trigger an event
    this.submitWindData();
    this.eventsTab2.publish('wind-data-changed', this.windData);
  }

  // Function whichi saves wind data to localStorage if drop settings have been set
  submitWindData() {
    if (localStorage.getItem('dropSettings') !== null) {
      localStorage.setItem('windData', JSON.stringify(this.windData));
      // console.log('Saving Wind Data');
    }
  }

  // Main function which calculates which altitudes to ask for input for
  defineAltitudes(jumpType) {
    // Grab values from localStorage
    const dataValues = JSON.parse(localStorage.getItem('dropSettings'));
    const dropAltitude = dataValues.dropAltitude;
    const actualAltitude = dataValues.actualAltitude;
    const dzElevation = dataValues.dzElevation;

    // console.log('Calculating Altitudes for', jumpType);

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
      if (this.altitudes[this.altitudes.length - 1] > dropAltitude) {
        this.altitudes.pop();
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

  // Function which updates which altitudes to ask for, keeping any relevant data which has already been inputted
  updateWindDataAltitudes() {
    const storedwindData = JSON.parse(localStorage.getItem('windData'));
    if (storedwindData !== null) {
      // Case that windData needs updating
      // Cycle through each altitude, keep data entered for altitudes, remove those that aren't
      let newWindData = [];
      for (let i = 0; i < this.altitudes.length; ++i) {
        const foundAltI = this.windData.findIndex(
          a => a.altitude === this.altitudes[i]
        );
        if (foundAltI === -1) {
          newWindData[i] = {
            altitude: this.altitudes[i],
            direction: null,
            speed: null
          };
        } else {
          if (this.windData.length > foundAltI) {
            newWindData[i] = {
              altitude: this.altitudes[i],
              direction: this.windData[foundAltI].direction,
              speed: this.windData[foundAltI].speed
            };
          } else {
            newWindData[i] = {
              altitude: this.altitudes[i],
              direction: null,
              speed: null
            };
          }
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

  // Function which listens for 'enter' and moves to the next input
  // $event is the associated data for the enter input, i is the input number. We will swap inputs to i+1
  keytab($event: any, i) {
    // Grab all input elements as an array
    const elements = this.foundInputElements;

    // Loop through each input to find the one we want to switch to
    for (let j = 0; j < elements.length; ++j) {
      // Grab the specific element
      const element = elements['_results'][j]['el'];
      // If the element's ID matches the id for the element we want to move to, set focus to it and stop looking
      if (element.id === 'windEnter' + parseInt(i + 1)) {
        element.setFocus();
        return;
      }
    }
  }
}
