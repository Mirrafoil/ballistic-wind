import { ThemeSwitcherService } from './../theme-switcher.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {
  chosenTheme: string;

  constructor(public themeSwitcher: ThemeSwitcherService) {}

  ngOnInit() {
    if (!localStorage.getItem('ballistic-settings-theme')) {
      this.chosenTheme = 'daytime';
      this.themeSwitcher.setTheme('daytime');
      localStorage.setItem('ballistic-settings-theme', 'daytime');
    } else {
      this.chosenTheme = localStorage.getItem('ballistic-settings-theme');
      this.themeSwitcher.setTheme(this.chosenTheme);
      console.log('Chosen Theme Pulled: ', this.chosenTheme);
    }
  }

  onUpdateChangeTheme($event) {
    this.chosenTheme = $event.target.value;
    localStorage.setItem('ballistic-settings-theme', $event.target.value);
    this.themeSwitcher.setTheme(this.chosenTheme);
  }

  onSubmitResetAllLocalStorage() {
    localStorage.clear();
  }
}
