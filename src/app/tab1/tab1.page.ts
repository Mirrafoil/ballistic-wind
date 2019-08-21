import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeSwitcherService } from './../theme-switcher.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  form: FormGroup;
  dropSettings = {};
  badFormSubmitted = false;
  chosenTheme: string;

  constructor(
    private router: Router,
    public themeSwitcher: ThemeSwitcherService
  ) {}

  ngOnInit() {
    let jumpTypeInitial = null;
    let dropAltitudeInitial = null;
    let actualAltitudeInitial = null;
    let dzElevationInitial = null;
    let diveRatioInitial = null;
    let verticalReferenceInitial = null;
    // If settings stored locally, grab them
    if (localStorage.getItem('dropSettings') !== null) {
      this.dropSettings = JSON.parse(localStorage.getItem('dropSettings'));
      console.log('Loading  settings from localStorage', this.dropSettings);
      jumpTypeInitial = this.dropSettings['jumpType'];
      dropAltitudeInitial = this.dropSettings['dropAltitude'];
      actualAltitudeInitial = this.dropSettings['actualAltitude'];
      dzElevationInitial = this.dropSettings['dzElevatio'];
      diveRatioInitial = this.dropSettings['diveRatio'];
      verticalReferenceInitial = this.dropSettings['verticalReference'];
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
      diveRatio: new FormControl(diveRatioInitial, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      verticalReference: new FormControl(verticalReferenceInitial, {
        updateOn: 'blur'
      })
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
    this.chosenTheme = $event.target.value;
    localStorage.setItem('ballistic-settings-theme', $event.target.value);
    this.themeSwitcher.setTheme(this.chosenTheme);
  }

  onSubmitResetAllLocalStorage() {
    localStorage.clear();
    this.form.reset();
  }
}
