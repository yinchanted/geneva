// wider scope for these charts so that we can reference them from the reset and filter utility functions
var totalNumber;
var uniqueNumber;
var averageNumber;
var streamRowChart;
var insititutionRowChart;
var bussiFocusRowChart;
var responsibilityRowChart;
var sessionRowChart;
var functionRowChart;
var ageRowChart;
var sessiondateRowChart;
var roomRowChart;
var scanBarChart;

var sessionDaysColors = ["#E0E4CC", "#00CCCC", "#2C8182", "#FF5E3E", "#FCCC3A"];
//var sessionDayColors = ["#E0E4CC", "#FCCC3A", "#FF5E3E", "#2C8182", "#00CCCC"];

// load the data file
d3.csv("./sibos.csv", function (data) {
    
    // associate the charts with their html elements
    totalNumber = dc.numberDisplay("#dc-chart-total");
    uniqueNumber = dc.numberDisplay("#dc-chart-unique");
    averageNumber = dc.numberDisplay("#dc-chart-average");
	streamRowChart = dc.rowChart("#dc-chart-stream");
	insititutionRowChart = dc.rowChart("#dc-chart-institutiontype");
	bussiFocusRowChart = dc.rowChart("#dc-chart-businessfocus");
	responsibilityRowChart = dc.rowChart("#dc-chart-responsibility");
	sessionRowChart = dc.rowChart("#dc-chart-sessionname");
	functionRowChart = dc.rowChart("#dc-chart-function");
    ageRowChart = dc.rowChart("#dc-chart-agerange");
    roomRowChart = dc.rowChart("#dc-chart-room");
    sessiondateRowChart = dc.pieChart("#dc-chart-date");
    scanBarChart = dc.barChart("#dc-chart-scan");
    
    data.forEach(function (d) {
        d.count = 1; // add column "count", set value to "1"
    });
    // put data in crossfilter
    var facts = crossfilter(data);

    var updateUnique = function (unique, key, increment) {
	    var value = unique["" + key];

	    // not initialized
	    if (typeof value === 'undefined')
		value = 0;

	    // update with increment
	    if (value + increment > 0) {
		unique["" + key] = value + increment;
	    } else {
		delete unique["" + key];
	    }
	}

    // group for grand total number of attendees
    var totalGroup = facts.groupAll().reduce(
        function (p, v) { // add finction
            ++p.count;
            console.log(v["BADGEID"]);
            updateUnique(p.uAttendees, v["BADGEID"], 1);
	    return p;
        },
        function (p, v) { // subtract function
            --p.count;
            updateUnique(p.uAttendees, v["BADGEID"], -1);
            return p;
        },
        function () {
            return {
                count: 0,
                uAttendees: {} // unique Attendees
            }
        } // initial function
    );

    // 01 display grand total
    totalNumber
        .group(totalGroup)
        .valueAccessor(function (d) {
            console.log(d.uAttendees);
            return d.count;
        })
        .formatNumber(function (d) { return d + " scans"; });

    // 02 display grand total
    uniqueNumber
        .group(totalGroup)
        .valueAccessor(function (d) {
            var keys = 0;
            for (k in d.uAttendees) ++keys;
	    return keys;
        })
        //.formatNumber(function (d) { return Math.round(d) + " attendees"; });
        .formatNumber(function (d) { return d + " attendees"; });
    
    averageNumber
        .group(totalGroup)
        .valueAccessor(function (d) {
            var keys = 0;
            for (k in d.uAttendees) ++keys;
        return Math.round(d.count / keys);
        })
        .formatNumber(function (d) { return "attended " + d + " sessions on average"; });
    
    // 03 dimension, rowchart, STREAM
    var streamDim = facts.dimension(dc.pluck('STREAM'));
    var streamGroupSum = streamDim.group().reduceSum(dc.pluck("count"));
    
    streamRowChart
        .dimension(streamDim)
        .group(streamGroupSum)
        .data(function (d) { return d.top(30); })
        .width(250)
        .height(280)
        //.height(15 * 22)
        .margins({ top: 0, right: 0, bottom: -1, left: 20 })
        .elasticX(true)
        .ordinalColors(['#FFF3E0']) //F5B041 light blue #
        .labelOffsetX(0)
        .label(function (d) {
                        return d.key + " (" + Math.floor(d.value / facts.groupAll().reduceCount().value() * 100) + "%)";
                    })
        //.xAxis().ticks(4).tickFormat(d3.format(".2s"));
        .xAxis().ticks(0).tickFormat(function(d){return '';});

    // 04 dimension, rowchart, INSTITUTION_TYPE  
    var institutionTypeDim = facts.dimension(dc.pluck('INSTITUTION_TYPE'));
    var institutionTypeGroupSum = institutionTypeDim.group().reduceSum(dc.pluck("count"));
    
    insititutionRowChart
        .dimension(institutionTypeDim)
        .group(institutionTypeGroupSum)
        .data(function (d) { return d.top(30); })
        .width(200)
        .height(270)
        //.height(15 * 22)
        .margins({ top: 0, right: 20, bottom: -1, left: 0 })
        .elasticX(true)
        .ordinalColors(['#B3E5FC']) // light blue
        .labelOffsetX(0)
        .label(function (d) {
                        return d.key + " (" + Math.floor(d.value / facts.groupAll().reduceCount().value() * 100) + "%)";
                    })
        .xAxis().ticks(0).tickFormat(function(d){return '';});
    
    // 05 dimension, rowchart, BUSINESS_FOCUS  
    var businessFocusDim = facts.dimension(dc.pluck('BUSINESS_FOCUS'));
    var businessFocusGroupSum = businessFocusDim.group().reduceSum(dc.pluck("count"));
    
    bussiFocusRowChart
        .dimension(businessFocusDim)
        .group(businessFocusGroupSum)
        .data(function (d) { return d.top(15); })
        .width(200)
        .height(270)
        //.height(15 * 22)
        .margins({ top: 0, right: 20, bottom: -1, left: 0 })
        .elasticX(true)
        .ordinalColors(['#FADBD8']) // #FADBD8
        .labelOffsetX(0)
        .label(function (d) {
                        return d.key + " (" + Math.floor(d.value / facts.groupAll().reduceCount().value() * 100) + "%)";
                    })
        //.xAxis().ticks(4).tickFormat(d3.format(".2s"));
        .xAxis().ticks(0).tickFormat(function(d){return '';});
    
    // 06 dimension, rowchart, RESPONSIBILITY  
    var responsibilityDim = facts.dimension(dc.pluck('RESPONSIBILITY'));
    var responsibilityGroupSum = responsibilityDim.group().reduceSum(dc.pluck("count"));
    
    responsibilityRowChart
        .dimension(responsibilityDim)
        .group(responsibilityGroupSum)
        .data(function (d) { return d.top(15); })
        .width(200)
        .height(270)
        //.height(15 * 22)
        .margins({ top: 0, right: 20, bottom: -1, left: 0 })
        .elasticX(true)
        .ordinalColors(['#EBDEF0']) // light blue
        .labelOffsetX(0)
        .label(function (d) {
                        return d.key + " (" + Math.floor(d.value / facts.groupAll().reduceCount().value() * 100) + "%)";
                    })
        //.xAxis().ticks(5).tickFormat(d3.format(".2s"));
        .xAxis().ticks(0).tickFormat(function(d){return '';});
    
    // 07 dimension, rowchart, SESSIONNAME  
    var sessionNameDim = facts.dimension(dc.pluck('SESSIONNAME'));
    var sessionNameGroupSum = sessionNameDim.group().reduceSum(dc.pluck("count"));
    
    sessionRowChart
        .dimension(sessionNameDim)
        .group(sessionNameGroupSum)
        .data(function (d) { return d.top(250); })
        .width(1000)
        .height(3000)
        //.height(15 * 22)
        .margins({ top: 0, right: 10, bottom: -1, left: 0 })
        .elasticX(true)
        .ordinalColors(['#E0E4CC']) // light blue
        .labelOffsetX(0)
        .xAxis().ticks(0).tickFormat(function(d){return '';});
    
    // 08 dimension, rowchart, FUNCTION  
    var functionDim = facts.dimension(dc.pluck('FUNCTION'));
    var functionGroupSum = functionDim.group().reduceSum(dc.pluck("count"));
    
    functionRowChart
        .dimension(functionDim)
        .group(functionGroupSum)
        .data(function (d) { return d.top(15); })
        .width(200)
        .height(270)
        //.height(15 * 22)
        .margins({ top: 0, right: 10, bottom: -1, left: 00 })
        .elasticX(true)
        .ordinalColors(['#C8E6C9']) // #D1F2EB
        .labelOffsetX(0)
        .label(function (d) {
                        return d.key + " (" + Math.floor(d.value / facts.groupAll().reduceCount().value() * 100) + "%)";
                    })
        //.xAxis().ticks(4).tickFormat(d3.format(".2s"));
        .xAxis().ticks(0).tickFormat(function(d){return '';});
    
    // 09 dimension, rowchart, AGE_RANGE  
    var ageRangeDim = facts.dimension(dc.pluck('AGE_RANGE'));
    var ageRangeGroupSum = ageRangeDim.group().reduceSum(dc.pluck("count"));
    
    ageRowChart
        .dimension(ageRangeDim)
        .group(ageRangeGroupSum)
        .data(function (d) { return d.top(15); })
        .width(200)
        .height(270)
        //.height(15 * 22)
        .elasticX(true)
        .ordinalColors(['#E6EE9C']) // light blue
        .labelOffsetX(0)
        .label(function (d) {
                        return d.key + " (" + Math.floor(d.value / facts.groupAll().reduceCount().value() * 100) + "%)";
                    })
        .margins({top: 0, right: 20, bottom: -1, left: 0})
        //.xAxis().ticks(5).tickFormat(d3.format(".2s"));
        .xAxis().ticks(0).tickFormat(function(d){return '';});
    
    // 10 dimension, rowchart, SESSIONDATE  
    var sessionDateDim = facts.dimension(dc.pluck('DAYS'));
    var sessionDateGroupSum = sessionDateDim.group().reduceSum(dc.pluck("count"));
    
    sessiondateRowChart
        .dimension(sessionDateDim)
        .group(sessionDateGroupSum)
        .width(170)
        .height(280)
        .radius(80)
        .innerRadius(45)
        .ordinalColors(sessionDaysColors);
        
        // 11 dimension, rowchart, ROOM  
    var roomDim = facts.dimension(dc.pluck('COUNTRY'));
    var roomGroupSum = roomDim.group().reduceSum(dc.pluck("count"));
    
    roomRowChart
        .dimension(roomDim)
        .group(roomGroupSum)
        .data(function (d) { return d.top(15); })
        .width(200)
        .height(270)
        .margins({ top: 0, right: 20, bottom: -1, left: 0 })
        .elasticX(true)
        .ordinalColors(['#F6DDCC']) // light blue
        .labelOffsetX(0)
        .label(function (d) {
                        return d.key + " (" + Math.floor(d.value / facts.groupAll().reduceCount().value() * 100) + "%)";
                    })
        //.xAxis().ticks(4).tickFormat(d3.format(".2s"));
        .xAxis().ticks(0).tickFormat(function(d){return '';});

    
    var scanDim = facts.dimension(dc.pluck('YEAR'));
    //var scanDim = facts.dimension(function(d) { return d3.time.year(d.Year);});
    var scanGroupSum = scanDim.group().reduce(
        function (p, v) { // add function
              p[v.DAYS] += v.count;
              return p;
        },
        function (p, v) { // subtract function
            p[v.DAYS] -= v.count;
            return p;
        },
        function () { // initial function
            return { "DAY0": 0, "DAY1": 0, "DAY2": 0, "DAY3": 0, "DAY4": 0};
        }
    );

    // 05 stacked bar chart for days w/appropriation types  
    scanBarChart
        .dimension(scanDim)
        .group(scanGroupSum, "DAY0").valueAccessor(function (d) { return d.value.DAY0; })
        .stack(scanGroupSum, "DAY1", function (d) { return d.value.DAY1; })
        .stack(scanGroupSum, "DAY2", function (d) { return d.value.DAY2; })
        .stack(scanGroupSum, "DAY3", function (d) { return d.value.DAY3; })
        .stack(scanGroupSum, "DAY4", function (d) { return d.value.DAY4; })
        .width(700)
        .height(300).margins({ top: 10, right: 30, bottom: 20, left: 50 })
        .legend(dc.legend().x(60).y(20))
        //.filter([2014, 2016])
        .x(d3.scale.linear().domain([2013.1, 2018.10]))
        .elasticY(true)
        .ordinalColors(sessionDaysColors)
        .xAxis().ticks(4).tickFormat(d3.format("d"));

    scanBarChart.yAxis().tickFormat(function (v) { return v/1000 + "k scan"; });

       
    dc.renderAll();
});


