import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DomController } from '@ionic/angular';

interface Theme {
  name: string;
  styles: ThemeStyle[];
}

interface ThemeStyle {
  themeVariable: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeSwitcherService {
  private themes: Theme[] = [];
  private currentTheme = 0;

  constructor(
    private domCtrl: DomController,
    @Inject(DOCUMENT) private document
  ) {
    this.themes = [
      {
        name: 'daytime',
        styles: [
          { themeVariable: '--ion-color-primary', value: '#3880ff' },
          { themeVariable: '--ion-color-primary-rgb', value: '56,128,255' },
          { themeVariable: '--ion-color-primary-contrast', value: '#ffffff' },
          {
            themeVariable: '--ion-color-primary-contrast-rgb',
            value: '255,255,255'
          },
          { themeVariable: '--ion-color-primary-shade', value: '#3171e0' },
          { themeVariable: '--ion-color-primary-tint', value: '#4c8dff' },
          { themeVariable: '--ion-color-secondary', value: '#0cd1e8' },
          { themeVariable: '--ion-color-secondary-rgb', value: '12, 209, 232' },
          { themeVariable: '--ion-color-secondary-shade', value: '#0bb8cc' },
          {
            themeVariable: '--ion-item-ios-background-color',
            value: '#ffffff'
          },
          { themeVariable: '--ion-item-md-background-color', value: '#ffffff' },
          { themeVariable: '--ion-tabbar-background-color', value: '#fff' },
          {
            themeVariable: '--ion-tabbar-ios-text-color-active',
            value: '#000000'
          },
          {
            themeVariable: '--ion-tabbar-md-text-color-active',
            value: '#000000'
          },
          { themeVariable: '--ion-background-color', value: '#ffffff' },
          { themeVariable: '--ion-color-light', value: '#f4f5f8' },
          { themeVariable: '--ion-color-light-rgb', value: '244,244,244' },
          { themeVariable: '--ion-color-dark', value: '#222428' },
          { themeVariable: '--ion-color-dark-rgb', value: '34,34,34' },
          { themeVariable: '--ion-text-color', value: 'var(--ion-color-dark)' },
          {
            themeVariable: '--ion-text-color-rgb',
            value: 'var(--ion-color-dark-rgb)'
          }
        ]
      },
      {
        name: 'nighttime',
        styles: [
          { themeVariable: '--ion-color-primary', value: '#000000' },
          { themeVariable: '--ion-color-primary-rgb', value: '0,0,0' },
          { themeVariable: '--ion-color-primary-shade', value: '#222428' },
          { themeVariable: '--ion-color-primary-contrast', value: '#ffffff' },
          {
            themeVariable: '--ion-color-primary-contrast-rgb',
            value: '255,255,255'
          },
          { themeVariable: '--ion-color-secondary', value: '#43464B' },
          { themeVariable: '--ion-color-secondary-rgb', value: '26,27,29' },
          { themeVariable: '--ion-color-secondary-shade', value: '#222428' },
          { themeVariable: '--ion-color-light', value: '#28FE14' },
          { themeVariable: '--ion-color-light-rgb', value: '40,254,20' },
          {
            themeVariable: '--ion-border-color',
            value: 'var(--ion-color-dark-shade)'
          },
          {
            themeVariable: '--ion-text-color',
            value: 'var(--ion-color-light)'
          },
          {
            themeVariable: '--ion-text-color-rgb',
            value: 'var(--ion-color-light-rgb)'
          },
          {
            themeVariable: '--ion-item-ios-background-color',
            value: '#717171'
          },
          { themeVariable: '--ion-item-md-background-color', value: '#717171' },
          { themeVariable: '--ion-tabbar-background-color', value: '#222428' },
          {
            themeVariable: '--ion-tabbar-ios-text-color-active',
            value: '#ffffff'
          },
          {
            themeVariable: '--ion-tabbar-md-text-color-active',
            value: '#ffffff'
          },
          {
            themeVariable: '--ion-background-color',
            value: 'var(--ion-color-dark)'
          },
          {
            themeVariable: '--ion-background-color-rgb',
            value: 'var(--ion-color-dark-rgb)'
          },
          { themeVariable: '--ion-color-step-50', value: '#232323' },
          { themeVariable: '--ion-color-step-100', value: '#2e2e2e' },
          { themeVariable: '--ion-color-step-150', value: '#3a3a3a' },
          { themeVariable: '--ion-color-step-200', value: '#454545' },
          { themeVariable: '--ion-color-step-250', value: '#515151' },
          { themeVariable: '--ion-color-step-300', value: '#5d5d5d' },
          { themeVariable: '--ion-color-step-350', value: '#8b8b8b' },
          { themeVariable: '--ion-color-step-400', value: '#747474' },
          { themeVariable: '--ion-color-step-450', value: '#7f7f7f' },
          { themeVariable: '--ion-color-step-500', value: '#8b8b8b' },
          { themeVariable: '--ion-color-step-550', value: '#979797' },
          { themeVariable: '--ion-color-step-600', value: '#a2a2a2' },
          { themeVariable: '--ion-color-step-650', value: '#aeaeae' },
          { themeVariable: '--ion-color-step-700', value: '#b9b9b9' },
          { themeVariable: '--ion-color-step-750', value: '#c5c5c5' },
          { themeVariable: '--ion-color-step-800', value: '#d1d1d1' },
          { themeVariable: '--ion-color-step-850', value: '#dcdcdc' },
          { themeVariable: '--ion-color-step-900', value: '#e8e8e8' },
          { themeVariable: '--ion-color-step-950', value: '#f3f3f3' }
        ]
      }
    ];
  }

  setTheme(name): void {
    if (name === false) {
      name === 'nighttime';
    }
    let theme = this.themes.find(theme => theme.name === name);

    this.domCtrl.write(() => {
      theme.styles.forEach(style => {
        document.documentElement.style.setProperty(
          style.themeVariable,
          style.value
        );
      });
    });
  }
}
