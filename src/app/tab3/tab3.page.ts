import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  runInKM: number;
  jumpType: string;
  dropAltitude: number;
  actualAltitude: number;
  dzElevation: number;
  diveRatio: number;
  verticalReference: string;
  averageSpeed: number;
  windVector: number;
  possRunInOne: number;
  possRunInTwo: number;
  time: number;
  timeCalculatedString: string;
  hiBalAngle: number;
  hiBalSpeed: number;
  loBalAngle: number;
  lowBalspeed: number;

  constructor() {}

  ngOnInit() {
    console.log(this.jumpType);
  }

  ionViewWillEnter() {
    if (localStorage.getItem('dropSettings') !== null) {
      let dropSettings = JSON.parse(localStorage.getItem('dropSettings'));
      this.jumpType = dropSettings['jumpType'];
      this.dropAltitude = dropSettings['dropAltitude'];
      this.dzElevation = dropSettings['dzElevation'];
      this.diveRatio = dropSettings['diveRatio'];
      this.verticalReference = dropSettings['verticalReference'];

      // Actual Altitude only provided for Freefall
      if (this.jumpType !== 'Freefall') {
        this.actualAltitude = this.dropAltitude - this.dzElevation;
      } else {
        this.actualAltitude = dropSettings['actualAltitude'];
      }

      // Calculate Paramaters for Display
      this.canclulateParameters();

    } else {
      this.jumpType = 'No Jump Type Defined';
    }
  }

  canclulateParameters() {

    // Get WindData that's stored...
    const windData = JSON.parse(localStorage.getItem('windData'));

    // Gross Error Calculations
    const dropHeightUpper = Math.ceil(this.actualAltitude / 1000) * 1000;
    const dropHeightLower = Math.floor(this.actualAltitude / 1000) * 1000;
    const dzElevationRoundedDown = Math.floor(this.dzElevation / 1000) * 1000;

    // Build Array of WindAnalyis
    let windAnalysis = [];
    let windAnalysisElement = [];
    let northSouthTotal = 0;
    let eastWestTotal = 0;
    this.windData.forEach(element => {
      const northSouth = Math.cos(this.degToRad(+element.dir)) * element.spd;
      northSouthTotal += northSouth;
      const eastWest = Math.sin(this.degToRad(+element.dir)) * element.spd;
      eastWestTotal += eastWest;
      windAnalysisElement = [
        element.altitude,
        element.spd,
        northSouth,
        eastWest
      ];
      windAnalysis.push(windAnalysisElement);
    });

    // Calculate Speeds
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

    // Drive & Time
    const altitudeSelectedElement = this.bt80.filter(obj => {
      return obj.altitude === this.dropAltitude;
    });
    const drive = altitudeSelectedElement[0].kts;
    this.time = altitudeSelectedElement[0].time;

    const driveCalculated = this.actualAltitude * 0.000425974025974 + 11.2770563;
    const timeCalculated = this.actualAltitude * 0.0010896103896 + 1.94155844155844;
    this.timeCalculatedString =
      Math.round(timeCalculated).toString() +
      'min ' +
      Math.round((timeCalculated % 1) * 60).toString() +
      's';
    this.CNI = drive + this.averageSpeed;

    // Gross Error
    const dropHeightGrossError =
      altitudeSelectedElement[0].windDive * this.averageSpeed +
      (this.diveRatio / 3.2) * altitudeSelectedElement[0].canopyDrive;

    const upperGrossErrorElement = this.bt80.filter(obj => {
      return obj.altitude === dropHeightUpper;
    });
    const upperGrossError =
      upperGrossErrorElement[0].windDive * this.averageSpeed +
      (this.diveRatio / 3.2) * upperGrossErrorElement[0].canopyDrive;

    const lowerGrossErrorElement = this.bt80.filter(obj => {
      return obj.altitude === dropHeightLower;
    });
    const lowerGrossError =
      lowerGrossErrorElement[0].windDive * this.averageSpeed +
      (this.diveRatio / 3.2) * lowerGrossErrorElement[0].canopyDrive;

    const grossError =
      upperGrossError -
      ((upperGrossError - lowerGrossError) / 1000) *
        (this.dzElevation - dzElevationRoundedDown);
    const grossErrorYards = Math.round(grossError * 2025.372);
    const grossErrorKM = grossError * 1.852;

    // Freefall HI Bal / LO Bal
    this.hiBalAngle
    this.hiBalSpeed

    this.loBalAngle
    this.lowBalspeed
  }

  onChangePossibleRunIn(event) {
    // console.log("Event Target Value: ",event.target.value);
    this.runInKM = parseFloat((+event.target.value * 1.852).toFixed(2));
  }

  degToRad(deg) {
    return deg * (Math.PI / 180);
  }
  radToDeg(rad) {
    return rad * (180 / Math.PI);
  }
}
