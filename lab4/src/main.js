'use strict';
import histogram from "./histogram.js";
import * as d3 from "d3";
import csv from "./assets/daily.csv";
import csv2 from "./assets/temperature.csv";
import histogram2 from "./histogram2.js";

d3.csv(csv).then((data, error) => { 
  if (error) {
    console.log(error);
  } else {
    //data = FileAttachment("./assets/daily.csv").csv({typed: true})
    histogram(data, {});
  };
}); 
d3.csv(csv2).then((data, error) => { 
  if (error) {
    console.log(error);
  } else {
    //data = FileAttachment("./assets/daily.csv").csv({typed: true})
    histogram2(data, {});
  };
}); 