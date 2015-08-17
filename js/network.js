var settings = {
    distance:false, 
    color:false, 
    opacity:false, 
    width:false,
}

var change  = function(opt) {
    settings[opt] = settings[opt] == true ? false : true
    update()
}
$("[type='checkbox']").bootstrapSwitch();
//Constants for the SVG
var width = 800,
    height = 800;

//Read the data from the mis element 
var mis = document.getElementById('mis').innerHTML;
graph = JSON.parse(mis);
console.log('graph ', graph)

var opacityScale = d3.scale.linear().domain([d3.max(graph.links, function(d) {return d.value}), d3.min(graph.links, function(d) {return d.value})]).range([1,.1])
var distanceScale = d3.scale.linear().domain([d3.max(graph.links, function(d) {return d.value}), d3.min(graph.links, function(d) {return d.value})]).range([1000,10])
var chargeScale = d3.scale.linear().domain([d3.max(graph.links, function(d) {return d.value}), d3.min(graph.links, function(d) {return d.value})]).range([-120,120])

//Set up the colour scale
var color = d3.scale.category20();

//Set up the force layout
// var force = d3.layout.force()
//     .charge(-120)
//     .linkDistance(function(d){
//         return settings.distance == true ? distanceScale(d.value) : 100
//     })
//     .size([width, height]);

//Append a SVG to the body of the html page. Assign this SVG as an object to svg

var svg = d3.select("#my-div").append("svg")
    .attr("width", width)
    .attr("height", height);


//Creates the graph data structure out of the json data

var update = function() {

    var force = d3.layout.force()
        .charge(-120)
        // .charge(function(d){
        //     console.log(d, chargeScale(d.value))
        //     return settings.distance == true ? chargeScale(d.value) : -120
        // })
        .linkDistance(function(d){
            console.log('distance ', distanceScale(d.value))
            return settings.distance == true ? distanceScale(d.value) : 30
        })

        // .linkStrength(function(d){
        //     return opacityScale(d.value)
        // })
        .size([width, height]);

    force.nodes(graph.nodes)
        .links(graph.links)
        .start();
    
    var link = svg.selectAll(".link")
        .data(graph.links)
        
        link.enter().append("line")
        .attr("class", "link")
        .style('opacity', function(d) {
          return settings.opacity == true ? opacityScale(d.value) : .7
        })
        .style("stroke-width", function (d) {
         return settings.width == true ? Math.sqrt(d.value) : 3;
            // return 2
    });

        //Do the same with the circles for the nodes - no 
    var node = svg.selectAll(".node")
        .data(graph.nodes)
       
       node.enter().append("circle")
        .attr("class", "node")
        .attr("r", 8)
        .style("fill", function (d) {
            return settings.color == true ? color(d.group) : '#d3d3d3';
        })
        .style('opacity', 1)
        .call(force.drag);

    //Now we are giving the SVGs co-ordinates - the force layout is generating the co-ordinates which this code is using to update the attributes of the SVG elements
    force.on("tick", function () {
        console.log('force tick')
        link.attr("x1", function (d) {
            return d.source.x;
        })
            .attr("y1", function (d) {
            return d.source.y;
        })
            .attr("x2", function (d) {
            return d.target.x;
        })
            .attr("y2", function (d) {
            return d.target.y;
        });

        node.attr("cx", function (d) {
            return d.x;
        })
            .attr("cy", function (d) {
            return d.y;
        });
    });

    d3.selectAll('.link')
        .style('opacity', function(d) {
          return settings.opacity == true ? opacityScale(d.value) : .7
        })
        .style("stroke-width", function (d) {
         return settings.width == true ? Math.sqrt(d.value*3) : 3;
        });

    d3.selectAll('.node').style("fill", function (d) {
        return settings.color == true ? color(d.group) : '#d3d3d3';
    })

}
//Create all the line svgs but without locations yet




update()
