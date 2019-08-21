import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  runInKM: number;
  constructor() {}

  onChangePossibleRunIn(event) {
    // console.log("Event Target Value: ",event.target.value);
    this.runInKM = parseFloat((+event.target.value * 1.852).toFixed(2));
  }
}
