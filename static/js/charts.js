// Dropdown menu 

function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector.append("option").text(sample).property('value', sample);
    });
    var initialSample = sampleNames[0];
    buildMetadata(initialSample);
    buildCharts(initialSample);
  });
}

init();

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Print info the "Demographic Info" when a user chooses an ID number
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter((sampleObj) => sampleObj.id == sample);
    var pairs = Object.entries(resultArray[0]);
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    var results = pairs.forEach(function (pair) {
      PANEL.append("h6").text(pair[0] + ": " + pair[1]);
    });
  });  
}

// Build charts when user chooses an ID number
function buildCharts(sample) {
  d3.json("samples.json").then(function ({ samples, metadata }) {
    var data = samples.filter((obj) => obj.id == sample)[0];
    console.log(data);
    // data for bar chart
    var otuIDs = data.otu_ids.map((row) => `OTU ID: ${row}`);
    var sampleValues = data.sample_values.slice(0,10).reverse();
    var sampleLabels = data.otu_labels.map((label) => 
      label.replace(/\;/g, ", ")
    );
    // data for bubble chart
    var otuID = data.otu_ids;
    var sampleValue = data.sample_values;
    var sampleLabel = data.otu_labels.map((label) =>
      label.replace(/\;/g, ", ")
    );
    // data for gauge chart
    var metadata = metadata.filter((obj) => obj.id == sample)[0];
    var washFreq = metadata.wfreq;

    // bar chart data
    var data1 =  [
      {
        x: sampleValues,
        y: otuIDs,
        type: "bar",
        orientation: "h",
        text: sampleLabels,
        hoverinfo: "text",
      },
    ];

    // bubble chart data
    var data2 =[
      {
        x: otuID,
        y: sampleValue,
        mode: "markers",
        text: sampleLabel,
        marker: {
          size: sampleValue,
          color: otuID,
        },
      },
    ];
    // gauge chart data
    var data3 = [
      {
        value: washFreq,
        title: {
          text: "Belly Button Washing Frequency <br> Scrubs per Week",
        },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {range: [null, 10] },
          bar: { color: "black" },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "green" },
            { range: [8, 10], color: "blue" } 
          ], 
        },
      },
    ];

    // bar chart layout
    var layout1 = {
      margin: {
        t: 40,
        l: 150,
      },
      title: {
        text: "Top 10 Bacterial Species (OTUs)",      }
    };
    // bubble chart layout
    var layout2 = {
      xaxis: { title: "OTU ID" },
    };
    // gauge chart layout
    var layout3 = {
      width: 600,
      height: 500,
      margin: {t: 0, b: 0 },
    };
    Plotly.newPlot("bar", data1, layout1);
    Plotly.newPlot("bubble", data2, layout2);
    Plotly.newPlot("gauge", data3, layout3);
  });
}