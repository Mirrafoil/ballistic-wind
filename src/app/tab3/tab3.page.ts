import { element } from 'protractor';
import { Component } from '@angular/core';
import { Events } from '@ionic/angular';

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
  driveRatio: number;
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
  loBalSpeed: number;
  CDWA: number;
  runIn: number;
  CNI: any;
  windData: any;
  bt80: {
    altitude: number;
    kts: number;
    windSpeed20kt: number;
    windSpeed40kt: number;
    windDrive: number;
    canopyDrive: number;
    time: number;
  }[];
  showStandoff: boolean;
  showFreefall: boolean;
  grossError: number;
  windVectorLoBal: number;
  windVectorHiBal: number;
  driveDisplay: number;
  descentTime: number;

  constructor(public eventsTab2: Events) {
    this.eventsTab2.subscribe('wind-data-changed', data => {
      // console.log('Tab3: Wind Data updated ', data);
    });
  }

  ngOnInit() {
    this.bt80 = [
      {
        altitude: 5000,
        kts: 11,
        windSpeed20kt: 3.5,
        windSpeed40kt: 5.6,
        windDrive: 0.105,
        canopyDrive: 1.4,
        time: 7
      },
      {
        altitude: 6000,
        kts: 13,
        windSpeed20kt: 4.4,
        windSpeed40kt: 6.9,
        windDrive: 0.125,
        canopyDrive: 1.9,
        time: 8
      },
      {
        altitude: 7000,
        kts: 14,
        windSpeed20kt: 5.3,
        windSpeed40kt: 8.15,
        windDrive: 0.1425,
        canopyDrive: 2.45,
        time: 9
      },
      {
        altitude: 8000,
        kts: 15,
        windSpeed20kt: 6.2,
        windSpeed40kt: 9.4,
        windDrive: 0.16,
        canopyDrive: 3,
        time: 10.5
      },
      {
        altitude: 9000,
        kts: 15.5,
        windSpeed20kt: 7.1,
        windSpeed40kt: 10.7,
        windDrive: 0.18,
        canopyDrive: 3.5,
        time: 12
      },
      {
        altitude: 10000,
        kts: 16,
        windSpeed20kt: 8,
        windSpeed40kt: 12,
        windDrive: 0.2,
        canopyDrive: 4,
        time: 13
      },
      {
        altitude: 11000,
        kts: 16.5,
        windSpeed20kt: 8.9,
        windSpeed40kt: 13.25,
        windDrive: 0.2175,
        canopyDrive: 4.55,
        time: 14
      },
      {
        altitude: 12000,
        kts: 17,
        windSpeed20kt: 9.8,
        windSpeed40kt: 14.5,
        windDrive: 0.235,
        canopyDrive: 5.1,
        time: 15
      },
      {
        altitude: 13000,
        kts: 17.5,
        windSpeed20kt: 10.7,
        windSpeed40kt: 15.7,
        windDrive: 0.25,
        canopyDrive: 5.7,
        time: 16
      },
      {
        altitude: 14000,
        kts: 18,
        windSpeed20kt: 11.6,
        windSpeed40kt: 16.9,
        windDrive: 0.265,
        canopyDrive: 6.3,
        time: 17.5
      },
      {
        altitude: 15000,
        kts: 18.5,
        windSpeed20kt: 12.45,
        windSpeed40kt: 18.1,
        windDrive: 0.2825,
        canopyDrive: 6.8,
        time: 19
      },
      {
        altitude: 16000,
        kts: 19,
        windSpeed20kt: 13.3,
        windSpeed40kt: 19.3,
        windDrive: 0.3,
        canopyDrive: 7.3,
        time: 20
      },
      {
        altitude: 17000,
        kts: 19,
        windSpeed20kt: 14.15,
        windSpeed40kt: 20.45,
        windDrive: 0.315,
        canopyDrive: 7.85,
        time: 21
      },
      {
        altitude: 18000,
        kts: 19,
        windSpeed20kt: 15,
        windSpeed40kt: 21.6,
        windDrive: 0.33,
        canopyDrive: 8.4,
        time: 22
      },
      {
        altitude: 19000,
        kts: 19.5,
        windSpeed20kt: 15.85,
        windSpeed40kt: 22.75,
        windDrive: 0.345,
        canopyDrive: 8.95,
        time: 23
      },
      {
        altitude: 20000,
        kts: 20,
        windSpeed20kt: 16.7,
        windSpeed40kt: 23.9,
        windDrive: 0.36,
        canopyDrive: 9.5,
        time: 24
      },
      {
        altitude: 21000,
        kts: 20,
        windSpeed20kt: 17.5,
        windSpeed40kt: 25.05,
        windDrive: 0.3775,
        canopyDrive: 9.95,
        time: 25
      },
      {
        altitude: 22000,
        kts: 20,
        windSpeed20kt: 18.3,
        windSpeed40kt: 26.2,
        windDrive: 0.395,
        canopyDrive: 10.4,
        time: 25.5
      },
      {
        altitude: 23000,
        kts: 20.5,
        windSpeed20kt: 19.1,
        windSpeed40kt: 27.3,
        windDrive: 0.41,
        canopyDrive: 10.9,
        time: 26
      },
      {
        altitude: 24000,
        kts: 21,
        windSpeed20kt: 19.9,
        windSpeed40kt: 28.4,
        windDrive: 0.425,
        canopyDrive: 11.4,
        time: 27.5
      },
      {
        altitude: 25000,
        kts: 21,
        windSpeed20kt: 20.8,
        windSpeed40kt: 29.5,
        windDrive: 0.435,
        canopyDrive: 12.1,
        time: 29
      }
    ];
  }

  ionViewWillEnter() {
    if (localStorage.getItem('dropSettings') !== null) {
      const dropSettings = JSON.parse(localStorage.getItem('dropSettings'));
      this.jumpType = dropSettings['jumpType'];
      this.dropAltitude = dropSettings['dropAltitude'];
      this.dzElevation = dropSettings['dzElevation'];
      this.driveRatio = dropSettings['driveRatio'];
      this.verticalReference = dropSettings['verticalReference'];

      // Actual Altitude only provided for Freefall
      if (this.jumpType !== 'Freefall') {
        this.actualAltitude = this.dropAltitude - this.dzElevation;
        this.showStandoff = true;
        this.showFreefall = false;
      } else {
        this.actualAltitude = dropSettings['actualAltitude'];
        this.showStandoff = false;
        this.showFreefall = true;
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

    windData.forEach(element => {
      const northSouth =
        Math.cos(this.degToRad(+element.direction)) * element.speed;
      northSouthTotal += northSouth;
      const eastWest =
        Math.sin(this.degToRad(+element.direction)) * element.speed;
      eastWestTotal += eastWest;
      windAnalysisElement = [
        element.altitude,
        element.speed,
        northSouth,
        eastWest
      ];
      windAnalysis.push(windAnalysisElement);
    });

    // Standoff Calculations
    // Calculate Speeds
    const totalSpeed = Math.sqrt(
      Math.pow(northSouthTotal, 2) + Math.pow(eastWestTotal, 2)
    );
    this.averageSpeed = totalSpeed / windData.length;
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

    const driveCalculated =
      this.actualAltitude * 0.000425974025974 + 11.2770563;
    const timeCalculated =
      this.actualAltitude * 0.0010896103896 + 1.94155844155844;
    this.timeCalculatedString =
      Math.round(timeCalculated).toString() +
      'min ' +
      Math.round((timeCalculated % 1) * 60).toString() +
      's';
    this.CNI = drive + this.averageSpeed;

    // Gross Error
    const dropHeightGrossError =
      altitudeSelectedElement[0].windDrive * this.averageSpeed +
      (this.driveRatio / 3.2) * altitudeSelectedElement[0].canopyDrive;

    const upperGrossErrorElement = this.bt80.filter(obj => {
      return obj.altitude === dropHeightUpper;
    });
    const upperGrossError =
      upperGrossErrorElement[0].windDrive * this.averageSpeed +
      (this.driveRatio / 3.2) * upperGrossErrorElement[0].canopyDrive;

    const lowerGrossErrorElement = this.bt80.filter(obj => {
      return obj.altitude === dropHeightLower;
    });
    const lowerGrossError =
      lowerGrossErrorElement[0].windDrive * this.averageSpeed +
      (this.driveRatio / 3.2) * lowerGrossErrorElement[0].canopyDrive;

    this.grossError =
      upperGrossError -
      ((upperGrossError - lowerGrossError) / 1000) *
        (this.dzElevation - dzElevationRoundedDown);
    const grossErrorYards = Math.round(this.grossError * 2025.372);
    const grossErrorKM = this.grossError * 1.852;

    // to closest thousand
    const closest10k =
      Math.round(this.dropAltitude / 1000 - this.dzElevation / 1000) * 1000;
    const canopyDrive = this.bt80.find(
      element => element.altitude === closest10k
    );
    this.driveDisplay = (canopyDrive.kts * this.driveRatio) / 2.7;
    this.descentTime = canopyDrive.time;

    // Calculate Freefall
    let windAnalysisFreefall = [];
    let windAnalysisFreefallElement = [];
    let elementI = 0;
    let northSouthLoBalTotal = 0;
    let eastWestLoBalTotal = 0;
    let northSouthHiBalTotal = 0;
    let eastWestHiBalTotal = 0;
    let countHiBal = 0;
    let countLoBal = 0;

    windData.forEach(element => {
      const northSouth =
        Math.cos(this.degToRad(+element.direction)) * element.speed;
      const eastWest =
        Math.sin(this.degToRad(+element.direction)) * element.speed;
      if (this.actualAltitude <= elementI * 1000) {
        // HiBal Case
        northSouthHiBalTotal += northSouth;
        eastWestHiBalTotal += eastWest;
        countHiBal += 1;
      } else {
        // LoBal Case
        northSouthLoBalTotal += northSouth;
        eastWestLoBalTotal += eastWest;
        countLoBal += 1;
      }
      windAnalysisFreefallElement = [
        element.altitude,
        element.speed,
        northSouth,
        eastWest
      ];
      windAnalysisFreefall.push(windAnalysisFreefallElement);
      elementI += 1;
    });

    console.log(windData);

    const totalSpeedLoBal = Math.sqrt(
      Math.pow(northSouthLoBalTotal, 2) + Math.pow(eastWestLoBalTotal, 2)
    );
    const totalSpeedHiBal = Math.sqrt(
      Math.pow(northSouthHiBalTotal, 2) + Math.pow(eastWestHiBalTotal, 2)
    );

    this.hiBalSpeed = totalSpeedHiBal / countHiBal;
    this.loBalSpeed = totalSpeedLoBal / countLoBal;

    const windVectorInitialLoBal = this.radToDeg(
      Math.acos(northSouthLoBalTotal / totalSpeedLoBal)
    );
    const windVectorInitialHiBal = this.radToDeg(
      Math.acos(northSouthHiBalTotal / totalSpeedHiBal)
    );

    if (eastWestLoBalTotal > 0) {
      this.loBalAngle = windVectorInitialLoBal;
    } else {
      this.loBalAngle = 360 - windVectorInitialLoBal;
    }

    if (eastWestHiBalTotal > 0) {
      this.hiBalAngle = windVectorInitialHiBal;
    } else {
      this.hiBalAngle = 360 - windVectorInitialHiBal;
    }
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
