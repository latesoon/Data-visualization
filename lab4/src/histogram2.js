import * as d3 from "d3";

function Histogram(data, {
} = {}) {
    const width = 958;
    const height = 620;
    const marginTop = 100;
    const marginRight = 40;
    const marginBottom = 50;
    const marginLeft = 40;
    for(let i=0;i<data.length;i++){
        data[i].Date=new Date(data[i].Date);
        data[i].maxAT=data[i].maxAT*1.0;
        data[i].minAT=data[i].minAT*1.0;
        data[i].humidity=parseFloat(data[i].humidity)*0.01;
    }
    //console.log(data);
    const x = d3.scaleUtc()
          .domain(d3.extent(data, d => d.Date))
          .range([marginLeft, width - marginRight]);
    const y = d3.scaleLinear()
          .domain([0, d3.max(data, (d) => d.humidity)])
          .range([height - marginBottom, marginTop]);
    const y1 = d3.scaleLinear()
          .domain([0, d3.max(data, (d) => d.maxAT)])
          .range([height - marginBottom, marginTop]);
    const line1=d3.line()
          .x((d) => x(d.Date))
          .y((d) => y1(d.maxAT))
          .curve(d3.curveCatmullRom);
    const line2=d3.line()
          .x((d) => x(d.Date))
          .y((d) => y1(d.minAT))
          .curve(d3.curveCatmullRom);
    const svg = d3.select("#svg2-1")
          //.attr("transform", `translate(0,2000)`)
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", [0, 0, width, height])
          .attr("style", "max-width: 100%; height: auto;");
    svg.append("g")
          .call(g=>g.append("text")
          .attr("x", 0)
          .attr("y", 15)
          .attr("font-size",15)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("task2"));
    svg.append("g")
          .call(g=>g.append("text")
          .attr("x", 0)
          .attr("y", 50)
          .attr("font-size",25)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("天津市2023年10月温度湿度情况"));
    svg.append("g")
          .call(g=>g.append("rect")
            .attr("x",(marginLeft))
            .attr("y",70)
            .attr("width",40)
            .attr("height",2)
            .attr("fill", "#FF7575"));
    svg.append("g")
          .call(g=>g.append("text")
          .attr("x", marginLeft+50)
          .attr("y", 75)
          .attr("font-size",10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("最高温度"));
    svg.append("g")
          .call(g=>g.append("rect")
            .attr("x",(marginLeft+150))
            .attr("y",70)
            .attr("width",40)
            .attr("height",2)
            .attr("fill", "#ACD0FF"));
    svg.append("g")
          .call(g=>g.append("text")
          .attr("x", marginLeft+200)
          .attr("y", 75)
          .attr("font-size",10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("最低温度"));
    var axis = d3.axisBottom()
          .scale(x)
          .ticks(d3.timeDay.every(2))
          .tickFormat(d3.timeFormat("%y/%m/%d"))
          .offset(0);
    svg.append("g")
          .attr("class", "axis")
          .attr("transform", `translate(0,${height - marginBottom})`)
          .call(axis);
    svg.append("g")
          .attr("fill", "#C1FFE4")
          .selectAll()
          .data(data)
          .join("rect")
          .attr("x", (d) => x(d.Date)-2.5)
          .attr("y", (d) => y(d.humidity))
          .attr("height", (d) => y(0) - y(d.humidity))
          .attr("width", 5);
    svg.append("g")
          .attr("transform", `translate(${marginLeft-2.5},0)`)
          .call(d3.axisLeft(y).ticks(10,".0%"))
          .call(g => g.append("text")
          .attr("x", -marginLeft+5)
          .attr("y", marginTop-10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("↑ 湿度 (%)"));
    svg.append("g")
          .attr("transform", `translate(${width-marginRight+2.5},0)`)
          .call(d3.axisRight(y1).ticks(10))
          .call(g => g.append("text")
          .attr("x", -10)
          .attr("y", marginTop-10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("↑ 温度(℃)"));
    //console.log(line1(data));
    svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "#FF7575")
      .attr("stroke-miterlimit", 1)
      .attr("stroke-width", 2)
      .attr("d", line1(data));
    svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "#ACD0FF")
      .attr("stroke-miterlimit", 1)
      .attr("stroke-width", 2)
      .attr("d", line2(data));
    svg.append("g")
      .call(g => g.append("text")
            .attr("x", marginLeft)
            .attr("y", height-marginBottom+35)
            .attr("fill", "currentColor")
            .attr("font-size",10)
            .attr("text-anchor", "start")
            .text("注：数据来源于网络。由于使用的数据源与实验3相同，故2023/10/17前为实际数据，2023/10/18后为当时给出的预测数据。"));
}
export default Histogram;