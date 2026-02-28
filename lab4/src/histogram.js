import * as d3 from "d3";

function Histogram(data, {
} = {}) {
  //console.log(data);
  const width = 928;
  const height = 530;
  //const heightt=60;
  const marginTop = 10;
  const marginRight = 10;
  const marginBottom = 50;
  const marginLeft = 40;
  
  for(let i=0;i<data.length;i++){
        data[i].time=new Date(data[i].time);
        data[i].hours=data[i].hours*1;
  }
  const series = d3.stack()
      .keys(d3.union(data.map(d => d.work))) // distinct series keys, in input order
      .value(([, D], key) => D.get(key).hours) // get value for each series key and stack
    (d3.index(data, d => d.time, d => d.work)); // group by stack then series key
  for(let i=0;i<series[0].length;i++){
    for(let j=0;j<series.length;j++){
      while(true){
        if(series[j][i][0]==0)break;
        let k;
            for(k=0;k<j;k++){
              if(series[j][i][0]==series[k][i][1])
                break;
            }
            if(series[j][i][1]-series[j][i][0]<series[k][i][1]-series[k][i][0]){
              let temp0=series[j][i][1]-series[j][i][0];
              series[k][i][1]=series[j][i][1];
              series[j][i][0]=series[k][i][0];
              series[j][i][1]=series[j][i][0]+temp0;
              series[k][i][0]=series[j][i][1];
            }
            else break;
          }
        }
      }
      //console.log(series);
      // Prepare the scales for positional and color encodings.
      const x = d3.scaleUtc()
          .domain(d3.extent(data, d => d.time))
          .range([marginLeft, width - marginRight]);

      const y = d3.scaleLinear()
          .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
          .rangeRound([height - marginBottom, 0]);

      const color = d3.scaleOrdinal()
          .domain(series.map(d => d.key))
          .range(d3.schemeTableau10);

      const svg1 = d3.select("#svg1")
          //.attr("transform", `translate(0,0)`)
          .attr("width", width)
          .attr("height", 120)
          .attr("viewBox", [0, 0, width, 120])
          .attr("style", "max-width: 100%; height: auto;");
        svg1.append("g")
          .call(g=>g.append("text")
          .attr("x", 0)
          .attr("y", 15)
          .attr("font-size",15)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("2211290 姚知言 数据可视化实验4"));
        svg1.append("g")
          .call(g=>g.append("text")
          .attr("x", 0)
          .attr("y", 40)
          .attr("font-size",15)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("task1"));
        svg1.append("g")
          .call(g=>g.append("text")
          .attr("x", 0)
          .attr("y", marginTop*7)
          .attr("font-size",25)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("My schedule for the week"));
      for(let i=0;i<series.length;i++){
        svg1.append("g")
          .call(g => g.append("text")
            .attr("x", (width-marginLeft-marginRight)/4*(i%4)+30+marginLeft)
            .attr("y", 95+15*parseInt(i/4))
            .attr("font-size",10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(series[i].key));
        svg1.append("g")
          .call(g=>g.append("rect")
            .attr("x",(width-marginLeft-marginRight)/4*(i%4)+marginLeft)
            .attr("y",85+15*parseInt(i/4))
            .attr("width",20)
            .attr("height",10)
            .attr("fill", color(series[i].key)));
      }
      // Construct an area shape.
      const area = d3.area()
          .x(d => x(d.data[0]))
          .y0(d => y(d[0]))
          .y1(d => y(d[1]))
          .curve(d3.curveBumpX);
      
      // Create the SVG container.
      const svg = d3.select("#svg2")
          //.attr("transform", `translate(0,50)`)
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", [0, 0, width, height])
          .attr("style", "max-width: 100%; height: auto;");

      // Add the y-axis, remove the domain line, add grid lines and a label.
      svg.append("g")
          .attr("transform", `translate(${marginLeft},0)`)
          .call(d3.axisLeft(y).ticks(height / 80))
        // .call(g => g.select(".domain").remove())
          .call(g => g.selectAll(".tick line").clone()
              .attr("x2", width - marginLeft - marginRight)
              .attr("stroke-opacity", 0.1))
          .call(g => g.append("text")
              .attr("x", -marginLeft)
              .attr("y", 10)
              .attr("fill", "currentColor")
              .attr("text-anchor", "start")
              .text("↑ hours"));

      // Append a path for each series.
      svg.append("g")
        .selectAll()
        .data(series)
        .join("path")
          .attr("fill", d => color(d.key))
          .attr("d", area)
        .append("title")
          .text(d => d.key);

      // Append the horizontal axis atop the area.
      var axis = d3.axisBottom()
          .scale(x)
          .ticks(d3.timeDay.every(1))
          .tickFormat(d3.timeFormat("%a"))
      //    .tickArguments([7])
          .offset(0);
      svg.append("g")
          .attr("class", "axis")
          .attr("transform", `translate(0,${height - marginBottom})`)
          .call(axis);
      svg.append("g")
        .call(g => g.append("text")
              .attr("x", width-100)
              .attr("y", 520)
              .attr("fill", "currentColor")
              .attr("font-size",10)
              .attr("text-anchor", "start")
              .text("Source: My Daily Life"));
      // Return the chart with the color scale as a property (for the legend).*/
      return Object.assign(svg.node(), {scales: {color}});
 
}
export default Histogram;
