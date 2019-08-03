import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {
  chosenTheme: string;

  constructor() {}

  ngOnInit() {
    if (!localStorage.getItem('ballistic-settings-theme')) {
      this.chosenTheme = 'daytime';
      localStorage.setItem('ballistic-settings-theme', 'daytime');
    } else {
      this.chosenTheme = localStorage.getItem('ballistic-settings-theme');
      console.log('Chosen Theme Pulled: ', this.chosenTheme);
    }
  }

  onUpdateChangeTheme($event) {
    this.chosenTheme = $event.target.value;
    localStorage.setItem('ballistic-settings-theme', $event.target.value);
  }

  onSubmitResetAllLocalStorage() {
    localStorage.clear();
  }
}
