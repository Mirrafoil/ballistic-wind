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
    let driveRatioInitial = null;
    let verticalReferenceInitial = null;

    if (localStorage.getItem('ballistic-settings-nighttheme') !== null) {
      this.nightTheme = JSON.parse(
        localStorage.getItem('ballistic-settings-nighttheme')
      );
    } else {
      this.nightTheme = false;
    }

    // If settings stored locally, grab them
    if (localStorage.getItem('dropSettings') !== null) {
      this.dropSettings = JSON.parse(localStorage.getItem('dropSettings'));
      console.log('Loading  settings from localStorage', this.dropSettings);
      jumpTypeInitial = this.dropSettings['jumpType'];
      dropAltitudeInitial = this.dropSettings['dropAltitude'];
      actualAltitudeInitial = this.dropSettings['actualAltitude'];
      dzElevationInitial = this.dropSettings['dzElevation'];
      driveRatioInitial = this.dropSettings['driveRatio'];
      verticalReferenceInitial = this.dropSettings['verticalReference'];

      if (jumpTypeInitial === 'Freefall') {
        this.showFreefall = true;
      }
    }

    this.form = new FormGroup({
      jumpType: new FormControl(jumpTypeInitial, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dropAltitude: new FormControl(dropAltitudeInitial, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      actualAltitude: new FormControl(actualAltitudeInitial, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dzElevation: new FormControl(dzElevationInitial, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      driveRatio: new FormControl(driveRatioInitial, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      verticalReference: new FormControl(verticalReferenceInitial, {
        updateOn: 'blur'
      }) // AboveMeanSeaLevel AboveGroundLevel FlightLevel
    });
  }

  ionViewWillLeave() {
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
    const dropSettings = {};
    Object.keys(this.form.value).forEach(key => {
      dropSettings[key] = this.form.value[key];
    });
    if (this.form.value.jumpType !== null) {
      localStorage.setItem('dropSettings', JSON.stringify(dropSettings));
    }
  }

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

  onSubmitJumpTypeChanged($event: { detail: { value: string; }; }) {
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
