import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import {AuctionInfoPopover} from "../auction-info-popover/auction-info-popover";

import * as d3s from 'd3-selection';
import * as d3g from 'd3-geo';
import * as d3f from 'd3-fetch';
import * as topj from "topojson-client";
import {select} from "@angular-redux/store";
import {Observable} from "rxjs/Rx";
//import * as t from '@types/topojson';
//import * as d3Scale from "d3-scale";
//import * as d3Shape from "d3-shape";

// import React, { Component as comp } from "react"
// import ReactDOM from "react-dom"
// import {
//   ComposableMap,
//   ZoomableGroup,
//   Geographies,
//   Geography,
// } from "react-simple-maps"
/*
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  @select(['library', 'globalAuctionData']) globalAuctionData$: Observable<any>;
  @select(['library', 'auctionTableData']) auctionTableData$: Observable<any>;

  auctionList: any[] = [{name: 'Auction 1', price: 23, top: '23%', left: '50%'}, {name: 'Auction 1', price: 23, top: '23%', left: '50%'}];

  constructor(public navCtrl: NavController, public navParams: NavParams, public popCtrl: PopoverController) {
  }

  mapPoints$: Observable<any[]> = Observable.combineLatest(
    this.globalAuctionData$,
    this.auctionTableData$,
    (globalData: any, auctionTable: any) => {
      if(globalData == null || auctionTable == null){
        return [];
      }

      let mapPoints = [];
      let key = '';
      for(key in globalData){
        if(globalData.hasOwnProperty(key) && auctionTable.hasOwnProperty(key)){
          let point = {
            name: auctionTable[key].name,
            slug_id: key,
            x: auctionTable[key].map.x,
            y: auctionTable[key].map.y,
            steerAvgPrice: globalData[key].steerAvgPrice,
            heiferAvgPrice: globalData[key].heiferAvgPrice,
            steerCount: globalData[key].steerCount,
            heiferCount: globalData[key].heiferCount
          };

          mapPoints.push(point);
        }
      }
      return mapPoints;
  });

  colorRange$: Observable<any[]> = Observable.combineLatest(
    this.globalAuctionData$,
    this.auctionTableData$,
    (globalData: any, auctionTable: any) => {
      if(globalData == null || auctionTable == null){
        return [];
      }

      let range = [];
      let key = '';
      for(key in globalData){
        if(globalData.hasOwnProperty(key) && auctionTable.hasOwnProperty(key)){

          let steerAvgPrice = globalData[key].steerAvgPrice;
          let heiferAvgPrice = globalData[key].heiferAvgPrice;
          let steerCount = globalData[key].steerCount;
          let heiferCount = globalData[key].heiferCount;

          let avg = (steerCount*steerAvgPrice + heiferCount*heiferAvgPrice)/(steerCount + heiferCount);
          if(!isNaN(avg)){
            range.push(avg);
          }

        }
      }
      range.sort(function(a, b) {
        return a-b;
      });

      return range;
    });

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    this.renderMap();
    this.renderScale();
  }


  renderMap(){

    let popCtrl = this.popCtrl;
    var svg = d3s.select("svg");

    let path = d3g.geoPath();

    // let usOut = d3f.json("https://unpkg.com/us-atlas@1.0.2/us/10m.json")
    //   .then(function(data){
    //     console.log(data);
    //   });
    // console.log(usOut);



    //var projection = d3g.geoMercator();
      // .scale(8000)
      // .precision(.1)
      // .center([-98.5795,39.8283])
      // .translate([1200 / 2, 720 / 2]);

    //console.log(projection);

    // let path = d3g.geoPath()
    //   .projection(projection);
    //
    // console.log(path);

    // let xTranslate = 462.40;
    // let xScale = 1.9174;
    //
    // let yTranslate = -16087;
    // let yScale = -175.74;

    let mapWidth = 960;
    let mapHeight = 600;

    let xA = -3849;
    let xB = 176.2;
    let xC = -2.047;
    let xD = 0.007103;

    let xTranslate = -3;

    let yTranslate = 6000;

    // let auctionData = [{x: -93.00326, y: 40.4769606, name: 'Unionville'}, {x: -93.4305908, y:37.2012252, name: 'Springfield'}, {x: -90.04898, y: 35.1495, name: "Memphis"}, {x: -122.4194155, y: 37.7749295, name: "San Francisco"}];
    //
    // let cdata = [{x: 35, y: 260, name: "San Francisco"}];
    //
    // let center = [{x: mapWidth/2, y: mapHeight/2, name: "Center"}];
    //
    // let centerCoords = {x: -96.364444, y: 38.730167, name: "Center"};

    let points = [];

    this.mapPoints$.subscribe(data => points = data);

    let range = [];

    this.colorRange$.subscribe(data => range = data);
    range.splice(1, range.length-2);


    d3f.json("https://unpkg.com/us-atlas@1.0.2/us/10m.json").then( function(us) {

      //console.log(us);
      svg.append("path")
        .attr("stroke", "#000")
        .attr("stroke-width", 0.5);

      svg.append("path")
        .attr("stroke-width", 0.5)
        .attr("d", path(topj.mesh(us, us.objects.states, function(a, b) { return a !== b; })));

      svg.append("path")
        .attr("d", path(topj.feature(us, us.objects.nation)));

      // svg.append("path")
      //   .datum(topj.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      //   .attr("stroke-width", 0.5)
      //   .attr("d", path);
      //
      // svg.append("path")
      //   .datum(topj.feature(us, us.objects.nation))
      //   .attr("d", path);

      // svg.append("path")
      //   .attr("class", "auctions")
      //   //.selectAll("path")
      //   .datum(data)
      //   .classed("geopath", true)
      //   .attr("d", path)
      //   .attr("stroke","#009")
      //   .attr("fill", "#009");

      //svg.data(data).enter().append("path").attr("stroke","#009");

      svg.selectAll("circle")
        .data(points)
        .enter()
        .append("circle")
        .attr("cx", function(d){
          let x = xD*Math.pow(-d.x,3) + xC*Math.pow(-d.x,2) + xB*(-d.x) + xA;

          return x;
        })
        .attr("cy", function(d){
          //let y = (d.y)+yTranslate;
          let scale = Math.log(Math.tan((Math.PI/4)+((d.y*(Math.PI/180))/2)));
          let y = mapHeight*(1-scale) + (1/d.y)*yTranslate;
          console.log(y);
          //let y = 250;
          return y;
        })
        .attr("r", 5)
        .style("fill", function(d){
          let avg = ((d.steerCount*d.steerAvgPrice + d.heiferCount*d.heiferAvgPrice)/(d.heiferCount+d.steerCount));
          console.log(avg);
          if(isNaN(avg)){
            avg = 0;
          } else {
            avg = ((avg-range[0])/(range[1]-range[0]))*255;
          }
          let color = avg.toFixed(0);
          console.log(color);
          let fill = "rgb(0, 148, "+color+")";
          return fill;
        })
        .on("mouseover", function(d){
          const popover = popCtrl.create(AuctionInfoPopover, d);
          popover.present();
        });

      // svg.selectAll("circle")
      //   .data(cdata)
      //   .enter()
      //   .append("circle")
      //   .attr("cx", function(d){
      //     let x = d.x;
      //     console.log(x);
      //     return x;
      //   })
      //   .attr("cy", function(d){
      //     let y = (d.y);
      //     console.log(y);
      //     return y;
      //   })
      //   .attr("r", 5)
      //   .style("fill", "blue")
      //   .on("mouseover", function(d){
      //     console.log(d.name);
      //     const popover = popCtrl.create(AuctionInfoPopover);
      //     popover.present();
      //   });

      // svg.append("circle")
      //   .attr("cx", 25)
      //   .attr("cy", 25)
      //   .attr("r", 25)
      //   .attr("class", "auctions");

      // svg.append("g")
      //   .selectAll("g")
      //   .data(data.features)
      //   .enter()
      //   .append("g")
      //   .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
      //   .append("circle")
      //   .attr("r", 1)

    });

  }

  renderScale(){
    let range = [];
    this.colorRange$.subscribe(data => range = data);
    let min = range[0];
    let max = range[range.length-1];

    let svg = d3s.select("svg");
    svg.selectAll("rect")
      .data(range)
      .enter()
      .append("rect")
      .attr("width", 6)
      .attr("height", 50)
      .attr("y", 550)
      .attr("x", (d, i) => 490+i*9)
      .style("fill", function(d){
        let avg = d;
        if(isNaN(d)){
          avg = 0;
        } else {
          avg = ((avg-min)/(max-min))*255;
        }
        let color = avg.toFixed(0);
        console.log(color);
        let fill = "rgb(0, 148, "+color+")";
        return fill;
      });

    svg.selectAll("text")
      .data(range)
      .enter()
      .append("text")
      .attr("x", (d, i) => 490+i*8)
      .attr("y", 545)
      .text(function(d,i){
        if(i==0 || i==range.length-1) {
          return Math.floor(d);
        }
      });
  }

  log(){
    console.log("moused over point");
    const popover = this.popCtrl.create(AuctionInfoPopover);
    popover.present();
  }

}

// document.addEventListener("DOMContentLoaded", () => {
//   ReactDOM.render(<App />, document.getElementById("app"))
// });
