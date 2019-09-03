import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { ThemeSwitcherService } from './../theme-switcher.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  form: FormGroup;
  dropSettings = {};
  badFormSubmitted = false;
  nightTheme: boolean;
  showFreefall = false;

  constructor(
    public themeSwitcher: ThemeSwitcherService,
    public eventsTab1: Events
  ) {}

  ngOnInit() {
    // Set Initial Values For Form
    let jumpTypeInitial = null;
    let dropAltitudeInitial = null;
    let actualAltitudeInitial = null;
    let dzElevationInitial = null;
    let verticalReferenceInitial = null;

    // Set up the theme button so it reflects what the user last set.
    if (localStorage.getItem('ballistic-settings-nighttheme') !== null) {
      this.nightTheme = JSON.parse(
        localStorage.getItem('ballistic-settings-nighttheme')
      );
    } else {
      this.nightTheme = false;
    }

    // If settings stored in localStorage, grab them and have them overwrite the variables that will form the Initial form values
    if (localStorage.getItem('dropSettings') !== null) {
      this.dropSettings = JSON.parse(localStorage.getItem('dropSettings'));
      // console.log('Loading  settings from localStorage', this.dropSettings);
      jumpTypeInitial = this.dropSettings['jumpType'];
      dropAltitudeInitial = this.dropSettings['dropAltitude']; 
      actualAltitudeInitial = this.dropSettings['actualAltitude'];  
      dzElevationInitial = this.dropSettings['dzElevation'];
      verticalReferenceInitial = this.dropSettings['verticalReference'];
      
      // This shows the additional Actual Altitude form if the type is Freefall
      if (jumpTypeInitial === 'Freefall') {
        this.showFreefall = true;
      }
    }

    // Setup the main settings Form
    this.form = new FormGroup({
      jumpType: new FormControl(jumpTypeInitial, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dropAltitude: new FormControl(dropAltitudeInitial, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      actualAltitude: new FormControl(actualAltitudeInitial, {    // Time under canopy starts below this
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dzElevation: new FormControl(dzElevationInitial, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      verticalReference: new FormControl(verticalReferenceInitial, {
        updateOn: 'blur'
      }) // AboveMeanSeaLevel AboveGroundLevel FlightLevel
    });
  }

  ionViewWillLeave() {
    // Run function to save current form values to localStorage
    this.onSubmitDropSettingsSet();
    // console.log('Saving Submitted Entries');
  }

  ionViewWillEnter() {
    // console.log('Will Enter...');
  }

  ionViewDidEnter() {
    // console.log('...Did Enter');
  }

  onSubmitDropSettingsSet() {
    // Get all form values and save them to localStorage
    const dropSettings = {};
    Object.keys(this.form.value).forEach(key => {
      dropSettings[key] = this.form.value[key];
    });
    if (this.form.value.jumpType !== null) {
      localStorage.setItem('dropSettings', JSON.stringify(dropSettings));
    }
  }

  // When the updateTheme switch is triggered then change the current theme variables
  onUpdateChangeTheme($event) {
    this.nightTheme = $event.detail.checked;
    localStorage.setItem(
      'ballistic-settings-nighttheme',
      $event.detail.checked
    );
    if (this.nightTheme === true) {
      this.themeSwitcher.setTheme('nighttime');
    } else {
      this.themeSwitcher.setTheme('daytime');
    }
  }

  onSubmitResetAllLocalStorage() {
    localStorage.clear();
    this.form.reset();
  }

  // Listen for changes in the Jump Type and show/hide the Actual Altitude input
  onSubmitJumpTypeChanged($event: { detail: { value: string } }) {
    this.eventsTab1.publish('jump-type-changed', $event.detail.value);
    localStorage.setItem('jumpType', $event.detail.value);
    if ($event.detail.value === 'Freefall') {
      this.showFreefall = true;
    } else {
      this.showFreefall = false;
    }
    // console.log('Jump type changed to', $event.detail.value);
  }
}
