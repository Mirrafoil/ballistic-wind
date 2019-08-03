import { WindDataService } from './../wind-data.service';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  FormBuilder
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.page.html',
  styleUrls: ['./inputs.page.scss']
})
export class InputsPage implements OnInit {
  windData: object[];
  altitudes = [];
  form: FormGroup;

  getTheAltitudes(): void {
    this.altitudes = this.windDataService.getAltitudes();
  }

  constructor(
    private windDataService: WindDataService,
    private router: Router
  ) {}

  ngOnInit() {
    if (localStorage.getItem('windData') !== null) {
      // console.log('Loading windData from localStorage');
      this.windData = JSON.parse(localStorage.getItem('windData'));
    } else {
      console.log('No windData set, demo data');
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
      localStorage.setItem('windData', JSON.stringify(this.windData));
    }

    this.form = new FormGroup({
      altitude: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dir: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      spd: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

  ionViewWillEnter() {
    this.getTheAltitudes();
    console.log('Received: ', this.altitudes);
    // console.log(this.windData);
  }

  addNewRow() {
    console.log('Adding New Altitude Row');
    this.windData.push({ altitude: null, dir: null, spd: null });
  }

  submitWindData() {
    this.router.navigate(['/calc']);
  }
}
