import { WindData } from "./../windData.model";
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
  windData: WindData[];
  windDataSub: Subscription;
  possibleRunIn: number;
  runInKM: number;
  altitudes = [];
  windAnalysis = [];
  windVector: number;
  averageSpeed: number;
  possRunInOne: number;
  possRunInTwo: number;
  windAnalysisElement = [];
  showAnswers: boolean;
  bt80 = [];
  CNI: number;
  time: number;
  timeCalculatedString: string;
  grossError: number;
  grossErrorYards: number;
  grossErrorKM: number;

  constructor(private windDataService: WindDataService) {}

  ngOnInit() {
    this.showAnswers = false;

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

    this.windDataService.fetchWindData();

    this.windDataSub = this.windDataService.windData.subscribe(windData => {
      this.windData = windData;
    });
  }

  ionViewWillEnter() {}

  onSubmitDropSettingsSet() {
    if (!this.form.valid) {
      console.log("Not Valid!");
      return;
    } else {
      // Calculate Drop Height
      const dropHeight =
        1000 *
        Math.floor(
          (this.form.value.dropAltitude - this.form.value.dzElevation) / 1000 +
            0.5
        );
      // Calculate step
      let step = 0;
      const start = 1000 * Math.floor(this.form.value.dzElevation / 1000 + 2);
      if (dropHeight < 15500) {
        step = 1000;
      } else {
        step = 2000;
      }

      // Build Array of Altitudes
      let altitude = 0;
      this.altitudes = [];
      while (altitude < this.form.value.dropAltitude) {
        if (altitude === 0) {
          altitude = start;
        } else {
          altitude = altitude + step;
        }
        this.altitudes.push(altitude);
      }
      // console.log(this.altitudes);
      this.windDataService.passAltitudes(this.altitudes);
      
      // Gross Error Calculations
      const dropHeightTrue =
        this.form.value.dropAltitude - this.form.value.dzElevation;
      const dropHeightUpper = Math.ceil(dropHeightTrue / 1000) * 1000;
      const dropHeightLower = Math.floor(dropHeightTrue / 1000) * 1000;
      const dzElevationRoundedDown =
        Math.floor(this.form.value.dzElevation / 1000) * 1000;

      // Build Array of WindAnalyis
      let northSouthTotal = 0;
      let eastWestTotal = 0;
      this.windAnalysis = [];
      this.windData.forEach(element => {
        const northSouth = Math.cos(this.degToRad(+element.dir)) * element.spd;
        northSouthTotal += northSouth;
        const eastWest = Math.sin(this.degToRad(+element.dir)) * element.spd;
        eastWestTotal += eastWest;
        this.windAnalysisElement = [
          element.altitude,
          element.spd,
          northSouth,
          eastWest
        ];
        this.windAnalysis.push(this.windAnalysisElement);
      });

      const totalSpeed = Math.sqrt(
        Math.pow(northSouthTotal, 2) + Math.pow(eastWestTotal, 2)
      );
      this.averageSpeed = totalSpeed / this.windData.length;
      const windVectorInitial = this.radToDeg(
        Math.acos(northSouthTotal / totalSpeed)
      );
      if (eastWestTotal > 0) {
        this.windVector = windVectorInitial;
      } else {
        this.windVector = 360 - windVectorInitial;
      }

      if (this.windVector + 90 > 360) {
        this.possRunInOne = this.windVector - 270;
      } else {
        this.possRunInOne = this.windVector + 90;
      }

      if (this.windVector - 90 < 0) {
        this.possRunInTwo = this.windVector + 270;
      } else {
        this.possRunInTwo = this.windVector - 90;
      }

      this.bt80 = [
        {
          altitude: 5000,
          kts: 11,
          windSpeed20kt: 3.5,
          windSpeed40kt: 5.6,
          windDive: 0.105,
          canopyDrive: 1.4,
          time: 7
        },
        {
          altitude: 6000,
          kts: 13,
          windSpeed20kt: 4.4,
          windSpeed40kt: 6.9,
          windDive: 0.125,
          canopyDrive: 1.9,
          time: 8
        },
        {
          altitude: 7000,
          kts: 14,
          windSpeed20kt: 5.3,
          windSpeed40kt: 8.15,
          windDive: 0.1425,
          canopyDrive: 2.45,
          time: 9
        },
        {
          altitude: 8000,
          kts: 15,
          windSpeed20kt: 6.2,
          windSpeed40kt: 9.4,
          windDive: 0.16,
          canopyDrive: 3,
          time: 10.5
        },
        {
          altitude: 9000,
          kts: 15.5,
          windSpeed20kt: 7.1,
          windSpeed40kt: 10.7,
          windDive: 0.18,
          canopyDrive: 3.5,
          time: 12
        },
        {
          altitude: 10000,
          kts: 16,
          windSpeed20kt: 8,
          windSpeed40kt: 12,
          windDive: 0.2,
          canopyDrive: 4,
          time: 13
        },
        {
          altitude: 11000,
          kts: 16.5,
          windSpeed20kt: 8.9,
          windSpeed40kt: 13.25,
          windDive: 0.2175,
          canopyDrive: 4.55,
          time: 14
        },
        {
          altitude: 12000,
          kts: 17,
          windSpeed20kt: 9.8,
          windSpeed40kt: 14.5,
          windDive: 0.235,
          canopyDrive: 5.1,
          time: 15
        },
        {
          altitude: 13000,
          kts: 17.5,
          windSpeed20kt: 10.7,
          windSpeed40kt: 15.7,
          windDive: 0.25,
          canopyDrive: 5.7,
          time: 16
        },
        {
          altitude: 14000,
          kts: 18,
          windSpeed20kt: 11.6,
          windSpeed40kt: 16.9,
          windDive: 0.265,
          canopyDrive: 6.3,
          time: 17.5
        },
        {
          altitude: 15000,
          kts: 18.5,
          windSpeed20kt: 12.45,
          windSpeed40kt: 18.1,
          windDive: 0.2825,
          canopyDrive: 6.8,
          time: 19
        },
        {
          altitude: 16000,
          kts: 19,
          windSpeed20kt: 13.3,
          windSpeed40kt: 19.3,
          windDive: 0.3,
          canopyDrive: 7.3,
          time: 20
        },
        {
          altitude: 17000,
          kts: 19,
          windSpeed20kt: 14.15,
          windSpeed40kt: 20.45,
          windDive: 0.315,
          canopyDrive: 7.85,
          time: 21
        },
        {
          altitude: 18000,
          kts: 19,
          windSpeed20kt: 15,
          windSpeed40kt: 21.6,
          windDive: 0.33,
          canopyDrive: 8.4,
          time: 22
        },
        {
          altitude: 19000,
          kts: 19.5,
          windSpeed20kt: 15.85,
          windSpeed40kt: 22.75,
          windDive: 0.345,
          canopyDrive: 8.95,
          time: 23
        },
        {
          altitude: 20000,
          kts: 20,
          windSpeed20kt: 16.7,
          windSpeed40kt: 23.9,
          windDive: 0.36,
          canopyDrive: 9.5,
          time: 24
        },
        {
          altitude: 21000,
          kts: 20,
          windSpeed20kt: 17.5,
          windSpeed40kt: 25.05,
          windDive: 0.3775,
          canopyDrive: 9.95,
          time: 25
        },
        {
          altitude: 22000,
          kts: 20,
          windSpeed20kt: 18.3,
          windSpeed40kt: 26.2,
          windDive: 0.395,
          canopyDrive: 10.4,
          time: 25.5
        },
        {
          altitude: 23000,
          kts: 20.5,
          windSpeed20kt: 19.1,
          windSpeed40kt: 27.3,
          windDive: 0.41,
          canopyDrive: 10.9,
          time: 26
        },
        {
          altitude: 24000,
          kts: 21,
          windSpeed20kt: 19.9,
          windSpeed40kt: 28.4,
          windDive: 0.425,
          canopyDrive: 11.4,
          time: 27.5
        },
        {
          altitude: 25000,
          kts: 21,
          windSpeed20kt: 20.8,
          windSpeed40kt: 29.5,
          windDive: 0.435,
          canopyDrive: 12.1,
          time: 29
        }
      ];

      // Drive & Time
      const altitudeSelectedElement = this.bt80.filter(obj => {
        return obj.altitude === dropHeight;
      });
      const drive = altitudeSelectedElement[0].kts;
      this.time = altitudeSelectedElement[0].time;

      const driveCalculated = dropHeightTrue * 0.000425974025974 + 11.2770563;
      const timeCalculated =
        dropHeightTrue * 0.0010896103896 + 1.94155844155844;
      this.timeCalculatedString =
        Math.round(timeCalculated).toString() +
        "min " +
        Math.round((timeCalculated % 1) * 60).toString() +
        "s";
      this.CNI = drive + this.averageSpeed;

      // Gross Error
      const dropHeightGrossError =
        altitudeSelectedElement[0].windDive * this.averageSpeed +
        (this.form.value.diveRatio / 3.2) *
          altitudeSelectedElement[0].canopyDrive;

      const upperGrossErrorElement = this.bt80.filter(obj => {
        return obj.altitude === dropHeightUpper;
      });
      const upperGrossError =
        upperGrossErrorElement[0].windDive * this.averageSpeed +
        (this.form.value.diveRatio / 3.2) *
          upperGrossErrorElement[0].canopyDrive;

      const lowerGrossErrorElement = this.bt80.filter(obj => {
        return obj.altitude === dropHeightLower;
      });
      const lowerGrossError =
        lowerGrossErrorElement[0].windDive * this.averageSpeed +
        (this.form.value.diveRatio / 3.2) *
          lowerGrossErrorElement[0].canopyDrive;

      this.grossError =
        upperGrossError -
        ((upperGrossError - lowerGrossError) / 1000) *
          (this.form.value.dzElevation - dzElevationRoundedDown);
      this.grossErrorYards = Math.round(this.grossError * 2025.372);
      this.grossErrorKM = this.grossError * 1.852;
      this.showAnswers = true;
    }
  }

  degToRad(deg) {
    return deg * (Math.PI / 180);
  }
  radToDeg(rad) {
    return rad * (180 / Math.PI);
  }

  onChangePossibleRunIn(event) {
    // console.log("Event Target Value: ",event.target.value);
    this.runInKM = parseFloat((+event.target.value * 1.852).toFixed(3));
  }
}
