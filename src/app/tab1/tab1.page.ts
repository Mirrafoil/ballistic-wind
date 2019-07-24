import { FormGroup, FormControl, Validators } from "@angular/forms";
import { WindDataService } from "./../wind-data.service";
import { Component } from "@angular/core";
import { Subscription } from "rxjs";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"]
})
export class Tab1Page {
  form: FormGroup;
  private windDataSub: Subscription;
  possibleRunIn: number;
  runInKM: number;

  constructor(private windDataService: WindDataService) {}

  ngOnInit() {
    if (isNaN(this.possibleRunIn)) {
      this.possibleRunIn = 0.0;
    } 
    this.form = new FormGroup({
      dzElevation: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      dropAltitude: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      diveRatio: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      })
    });
  }

  onSubmitDropSettingsSet() {
    if (!this.form.valid) {
      console.log("Not Valid!");
      return;
    } else {
      console.log(this.form.value);
    }
  }

  onChangePossibleRunIn(event) {
    // console.log("Event Target Value: ",event.target.value);
    this.runInKM = parseFloat((+event.target.value * 1.852).toFixed(3));
  }
}
