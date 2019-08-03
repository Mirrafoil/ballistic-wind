import { ThemeSwitcherService } from './theme-switcher.service';
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  chosenTheme: string;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public themeSwitcher: ThemeSwitcherService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    if (!localStorage.getItem('ballistic-settings-theme')) {
      this.chosenTheme = 'daytime';
      localStorage.setItem('ballistic-settings-theme', this.chosenTheme);
      console.log('No Theme saved, defaulting');
    } else {
      this.chosenTheme = localStorage.getItem('ballistic-settings-theme');
      console.log('Loading Theme: ', this.chosenTheme);
      this.themeSwitcher.setTheme(this.chosenTheme);
    }
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
