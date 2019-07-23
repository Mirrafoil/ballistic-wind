import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-inputs",
  templateUrl: "./inputs.page.html",
  styleUrls: ["./inputs.page.scss"]
})
export class InputsPage implements OnInit {
  windData: object[];

  constructor() {}

  ngOnInit() {
    if(localStorage.getItem("windData") !== null){
      console.log("Loading windData from localStorage");
      this.windData = JSON.parse(localStorage.getItem("windData"));
    } else {
      console.log("No windData set, demo data");
      this.windData = [
        { altitude: 4000, dir: 255, spd: 12 },
        { altitude: 5000, dir: 253, spd: 11 },
        { altitude: 6000, dir: 283, spd: 15 },
        { altitude: 7000, dir: 280, spd: 15 },
        { altitude: 8000, dir: 301, spd: 16 },
        { altitude: 9000, dir: 297, spd: 18 },
        { altitude: 10000, dir: 300, spd: 20 },
        { altitude: 11000, dir: 305, spd: 24 },
        { altitude: 12000, dir: 310, spd: 25 },
        { altitude: 13000, dir: 312, spd: 25 },
        { altitude: 14000, dir: 311, spd: 24 },
        { altitude: 15000, dir: 293, spd: 26 }
      ];
      localStorage.setItem("windData",JSON.stringify(this.windData));
    }
  }
}
