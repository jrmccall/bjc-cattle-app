import { Injectable } from '@angular/core';
import { LoadingController } from "ionic-angular";


@Injectable()
export class MARSProvider {

  constructor(private loadingCtrl: LoadingController) {

  }

  getAllReports(){
    var data = null;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });

    xhr.open("GET", "https://marsapi.ams.usda.gov/services/v1/reports/");
    xhr.setRequestHeader("Authorization", "Basic WUVVTGZrY3NhRzlNZ3M3YVY0S0RnY0hVS1VRdU94RDQ6");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.setRequestHeader("Postman-Token", "98d51fe0-79ad-4ed7-a830-e615df35efd4");

    xhr.send(data);

    console.log(xhr.responseText);

    // var responseJson = JSON.parse(xhr.responseText);
    //
    // console.log(responseJson);
  }


}
