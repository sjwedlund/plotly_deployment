function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector.append("option").text(sample).property('value', sample);
    });
})};


init();

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildBarChart(newSample);
  buildBubbleChart(newSample);
  buildGaugeChart(newSample);
}
// Print info the "Demographic Info" when a user chooses an ID number
function buildMetadata(sample) {
d3.json("samples.json").then((data) => {
  var metadata = data.metadata;
  var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
  var result = resultArray[0];
  var PANEL = d3.select("#sample-metadata");

  PANEL.html("");
  Object.entries(result).forEach(([key, value]) => {
    PANEL.append("h6").text(key.toUpperCase() + ': ' + value);
  }) 

  });  
}
// bar chart
function buildBarChart(sample) {
  d3.json("samples.json").then((data) => {
    var resultArray = data.samples.filter(sampleObj => {
      return sampleObj.id == sample 
    });
    var result = resultArray[0];
    var topTenOtuIds = result.OtuIds.slice(0, 10).map(numericIds => {
      return 'OTU' + numericIds;
    }).reverse();

    var topTenSampleValues = result.sampleValues.slice(0,10).reverse();
    var topTenOtuLabels = result.OtuLabels.slice(0, 10).reverse();

    var barTrace = [
      {
        x: topTenSampleValues,
        y: topTenOtuIds,
        text: topTenOtuLabels,
        name: "Top 10",
        type: 'bar',
        orientation: 'h'
      }
    ];
    var data = [barTrace];
    var barLayout = {
      title: "Top 10 OTUs",
    }; 
    Plotly.newPlot('bar', barTrace, barLayout)
  });
}
// bubble chart
function buildBubbleChart(sample) {
  d3.json("samples.json").then((data) => {
    var resultArray = data.samples.filter(sampleObj => {
      return sampleObj.id == sample 
    });
    
    var result = resultArray[0];
    
    var OtuIds= result.OtuIds.map(numericIds => {
      return numericIds;
    });

    var sampleValues = result.sampleVales;
    var OtuLabels = result.OtuLabels;
    var bubbleTrace= {
      x: OtuIds,
      y: sampleValues,
      text: OtuLabels,
      mode: 'markers',
      marker: {
        color: OtuIds,
        size: sampleValues
      }
    }; 
    var data = [bubbleTrace];
    var bubbleLayout = {
      title: "OTU ID",
      showlegend: false,

    };

    Plotly.newPlot('bubble', data, bubbleLayout)

  });
}

  // gauge chart

  function buildGaugeChart(sample) {
    d3.json("samples.json").then((data)=> {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj.id == sample)
    });
    console.log(resultArray);
    var result = resultArray[0];
    console.log(result);
    var washFreq = result.wfreq;
    console.log(washFreq);
    
    var gaugeTrace = [
      {
        domain: {x: [0,1], y: [0,1] },
        value: washFreq,
        title: {text: samples.getElementsByTagName("TITLE")[0].text},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 10]},
          bar: { color: "black" },
          steps: [
            { range: [0, 1], color: 'rgba(0, 0, 0, 0.5)' },
            { range: [1, 2], color: 'rgba(0, 0, 0, 0.5)' },
            { range: [2, 3], color: 'rgba(183,28,28, .5)' },
            { range: [3, 4], color: 'rgba(183,28,28, .5)' },
            { range: [4, 5], color: 'rgba(249, 168, 37, .5)' },
            { range: [5, 6], color: 'rgba(249, 168, 37, .5)' },
            { range: [6, 7], color: 'rgba(110, 154, 22, .5)' },
            { range: [7, 8], color: 'rgba(110, 154, 22, .5)' },
            { range: [8, 9], color: 'rgba(14, 127, 0, .5)' },
            { range: [9, 10], color: 'rgba(14, 127, 0, .5)' }
          ],
        }  
      }
    ];
    var gaugeLayout = {
      width: 600,
      height: 500,
      margin: { t: 0, b: 0 }
    };
    Plotly.newPlot('gauge', gaugeTrace, gaugeLayout);

  };

