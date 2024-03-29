
// CURVE DESIGN

svg = d3.select("#svg")
          .attr("width", "1000")
          .attr("height", "500");

curvegrp = svg.append("g")
          .attr("transform","translate(250 250)");

curvegrp.append("circle").attr("class","mainLines")
          .attr("cx",0)
          .attr("cy",0)
          .attr("r",200);

curvegrp.append("circle").attr("class","mainLines")
          .attr("cx",0)
          .attr("cy",0)
          .attr("r",1);

pth = curvegrp.append("path")
        .attr("class","mainLines");

sampleCurves = [
{ points : [[0,0],[100,0],[100,200],[0,200]],
  info : "Basic (2 nodes)"
},{
  points : [[0,0],[55,0],[100,45],[100,100],[100,155],[55,200],[0,200]],
  info : "Half circle (3 nodes)"
},{
  points : [[200,0],[90,120],[80,0],[0,0],[-80,0],[-90,120],[-200,0]],
  info : "Bi-stable (3 nodes)"
},{
  points : [[0,0], [-30.270513,-14.559518],
  [-19.367077,-53.81152], [0.4197994,-66.363074], [54.040998,-100.37699],
  [117.15274,-51.175631], [133.49119,0.44332373], [162.71681,92.77751],
  [88.015963,181.46541], [-0.01330444,200]],
  info : "Archimedean spiral (4 nodes)"
},{
  points : [[0,0],[55,0],
  [100,45],[100,100],[100,155],
  [55,200],[0,200],[-55,200],
  [-100,155],[-100,100],[-100,45],
  [-55,0],[0,0]],
  info : "Circle (5 nodes)"
},{
  points : [[0,0],[-10.753912,0.41506311], [-5.1932237,-14.34983], [0.21452162,-17.787519],
  [14.869232,-27.103372], [32.141156,-13.664919], [36.622724,0.44688676], [44.639222,25.689615],
  [24.234326,49.962364], [0.16611914,55.053158], [-35.154988,62.524217], [-67.252091,34.361858],
  [-72.638239,0.37419546], [-79.817099,-44.925822], [-43.640628,-85.067907], [0.26296353,-90.628191],
  [55.51109,-97.625311], [103.78908,-53.325176], [109.46345,0.49524431], [116.33582,65.67891],
  [63.855827,122.13989], [0.11765797,127.89382], [-74.995445,134.67471], [-139.66676,73.982232],
  [-145.47888,0.32576272], [-152.18924,-84.713435], [-83.263939,-157.61296], [0.31136876,-163.46884],
  [95.274957,-170.12238], [176.41446,-92.950758], [182.30414,0.54376049], [188.91143,105.43043],
  [103.48273,194.81829], [0.06925639,200]],
  info : "Archimedean spiral (12 nodes)"
},{
  points : [[173.2,-100],[123.2,-186.6],
    [50,-80],[0,-80],[-50,-80],
    [-123.2,-186.6],[-173.2,-100],[-200,-53.24],
    [-206.12,3.46],
    [-193.18,51.76],
    [-141.42,245],
    [50,-40],[0,200]
  ],
  info : "Double curve v1"
},{
  points : [[173.2,-100],[123.2,-186.6],
    [50,-40],[0,-40],[-50,-40],
    [-123.2,-186.6],[-173.2,-100],[-200,-53.24],
    [-206.12,3.46],
    [-193.18,51.76],
    [-141.42,245],
    [50,-180],[0,200]
  ],
  info : "Double curve v2"
}];

d3.select("#selectCurve").selectAll("option")
.data(sampleCurves).enter()
  .append("option")
    .attr("value",function(d,i){return i;})
    .text(function(d){return d.info})
    .property("selected", function(d,i){ return i === 0; });

d3.select("#selectCurve").on("change", selectChange)

function selectChange(){
  CP = sampleCurves[this.value].points;
  // curvegrp.selectAll(".controlPoints").remove();
  draw();
  //drawWheel();
}

//var CP = sampleCurves[0].points;
var lines=[];

//draw();




function pathFromDOMPoints(cps){
  var d = "M ";
  d+= (cps[0].x +' '+ cps[0].y +' ');
  for (i=1; i<cps.length; i++){
    if (i%3 == 1) {d+= "C "}
    d+=(cps[i].x +' '+ cps[i].y + ' ')}
  return d;
};


function makeLines(cps){
  var lines = []
  for (i=0;i<cps.length-1; i++){
    if (i%3!=1) {lines.push([cps[i],cps[i+1]]) }
  }
  return lines;
}


function draw (){
  pointsSel = curvegrp.selectAll(".controlPoints").data(CP);
  pointsSel.enter()
              .append("circle").attr("class","controlPoints")
           .merge(pointsSel)
            .attr("r",6)
            .attr("cx",function(d){return d[0]})
            .attr("cy",function(d){return d[1]})
            .call(dragHandler);

  pointsSel.exit().remove();

  lines = makeLines(CP);
  linesSel = curvegrp.selectAll("line").data(lines);
  linesSel.enter()
            .append("line").attr("class","auxLines")
          .merge(linesSel)
            .attr("x1",function(d){return d[0][0]})
            .attr("y1",function(d){return d[0][1]})
            .attr("x2",function(d){return d[1][0]})
            .attr("y2",function(d){return d[1][1]});
  linesSel.exit().remove();

  var CP1 = [];
  CP.forEach((item, i) => { CP1[i] = new DOMPoint(CP[i][0],CP[i][1]) });

  dAttr = pathFromDOMPoints(CP1);
  pth.attr("d",dAttr);
  d3.select("#d-attr").text(dAttr);

}


var dragHandler = d3.drag()
        .on("drag", function (event,d) {
          d3.select(this)
              .attr("cx", d[0] = event.x)
              .attr("cy", d[1] = event.y);
          draw();
          })

//dragHandler(curvegrp.selectAll("circle"));



// ROTATING WHEEL

wheelgrp = svg.append("g")
          .attr("transform","translate(750 250)")

rwheel = wheelgrp.append("g")

wheelgrp.append("circle").attr("class","mainLines")
          .attr("cx",0)
          .attr("cy",0)
          .attr("r",200)


pathOnWheel = svg.append("path")
                    .attr("class","mainLines")
var angle = 0;
var RotAngle = 180;




marble = svg.append("circle").attr("class","marble").attr("r",4)


IndexOfMaxY = 499;



function drawWheel(){
  rwheel.attr("transform", "rotate("+ angle + ")" );
  //console.log(pathdata);
  rotMatrix = rwheel.node().getCTM();
  var CP2=[];
  CP.forEach((item, i) => { CP2[i] = new DOMPoint(CP[i][0],CP[i][1]).matrixTransform(rotMatrix) });

  pathOnWheel.attr("d",pathFromDOMPoints(CP2))

  var pointsOnCurve =[];
  var path = pathOnWheel.node();
  var length = path.getTotalLength();
  for(i=0; i<500; i++){ pointsOnCurve.push(path.getPointAtLength(i*length/500)) }

  var lowBound = Math.max(IndexOfMaxY-20,0);
  var upBound = Math.min(IndexOfMaxY+20,499);
  pieceOfCurve = pointsOnCurve.slice(lowBound,upBound)
  var localIndex;
  localIndex = pieceOfCurve.reduce(function(accumulator, currentValue, currentIndex, array)
            {return currentValue.y>array[accumulator].y ? currentIndex : accumulator}, 0)
  IndexOfMaxY = lowBound + localIndex;

  P=pointsOnCurve[IndexOfMaxY]

  marble
    .attr("cx",P.x)
    .attr("cy",P.y)  //display marble ON the curve
    //.attr("cy",P.y-4) //display marble over the curve

  if (d3.select("#trace").property("checked")) {
        svg.append("circle").attr("class","mainLines").attr("class","trace")
            .attr("cx",P.x)
            .attr("cy",P.y-4)
            .attr("r",4)
        }
  console.log("-------")
  console.log("Marble coordinates: ", P);
  console.log("IndexOfMaxY: ", IndexOfMaxY);
  console.log("Angle: ", angle);
}

var timer;

function turnWheelClockwiseStep(){
  angle+=1;
  drawWheel();
}

function turnWheelCounterclockwiseStep(){
  angle-=1;
  drawWheel();
}

function startTurnClockwise(){ clearInterval(timer); timer = setInterval(turnWheelClockwiseStep,50); }

function startTurnCounterclockwise(){ clearInterval(timer); timer = setInterval(turnWheelCounterclockwiseStep,50); }

function stopTurning(){ clearInterval(timer); }


d3.select("#turnClockwise").on("mousedown",startTurnClockwise);
d3.select("#turnClockwise").on("mouseup",stopTurning);
d3.select("#turnCounterclockwise").on("mousedown",startTurnCounterclockwise);
d3.select("#turnCounterclockwise").on("mouseup",stopTurning);

d3.select("#AutoTurn").on("click",startTurnClockwise);
d3.select("#trace").on("change", ()=>{ d3.selectAll(".trace").remove();} );

//drawWheel();

// Drawing for Design/Carpenters
svg2 = d3.select("#svg2")
          .attr("width", "500")
          .attr("height", "500");

curvegrp2 = svg2.append("g")
          .attr("transform","translate(250 250)");

curvegrp2.append("circle").attr("class","mainLines")
          .attr("cx",0)
          .attr("cy",0)
          .attr("r",200);

curvegrp2.append("circle").attr("class","mainLines")
          .attr("cx",0)
          .attr("cy",0)
          .attr("r",1);

pth2 = curvegrp2.append("path")
        .attr("class","mainLines")

tippts_data = [
  {angle: -96, index: 499, sense: "CCW", label: "A"},
  {angle: 36, index: 369, sense: "CW", label: "B"},
  {angle: -222, index: 156, sense: "CCW", label: "C"},
  {angle: -138, index: 60, sense: "CW", label: "D"},
]


function drawDesign(){
    pth2.attr("d",dAttr);

    var path = pth2.node();
    var length = path.getTotalLength();

    tippts = curvegrp2.selectAll(".tippt")
              .data(tippts_data)
              .enter()
              .append("g");

    tippts.append("circle")
          .attr("class","marble")
          .attr("r",4)
          .attr("cx", d => path.getPointAtLength(d.index * length/500).x)
          .attr("cy", d => path.getPointAtLength(d.index * length/500).y)

    tippts.append("text")
          .attr("x", d => path.getPointAtLength(d.index * length/500).x)
          .attr("y", d => path.getPointAtLength(d.index * length/500).y +25)
          .attr("text-anchor","middle")
          .text(d => d.label)

    tippts.append("text")
          .attr("x", d => path.getPointAtLength(d.index * length/500).x)
          .attr("y", d => path.getPointAtLength(d.index * length/500).y +45)
          .attr("text-anchor","middle")
          .text(d => '(' + d.angle + 'º ' + d.sense +')')
}

function saveSVG() {
  var config = { filename: 'Curve' };
  d3_save_svg.save(d3.select('#svg2').node(), config);
}


d3.select("#PlotCurve").on("click",drawDesign);
d3.select("#ExportCurve").on("click",saveSVG);
