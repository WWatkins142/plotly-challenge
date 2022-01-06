// function to populate the metadata
function demographicInfo(sample)
{
    //console.log(sample);

    // use d3.json to get data
    d3.json("samples.json").then((data) => {
        // grab all of the metadata
        let metaData = data.metadata;
        //console.log(metaData);

        //filter based on the value of the sample ( one result from dataset)
        let result = metaData.filter(sampleResult => sampleResult.id == sample);
        //console.log(result);

        // access index 0 from array
        let resultData = result[0];
        //console.log(resultData);
        
        // clear metadata 
        d3.select("#sample-metadata").html("");

        // get value key using Object.entries
        Object.entries(resultData).forEach(([key, value])=>{
            // at to the demographics section sample data
            d3.select("#sample-metadata")
                .append("h5").text(`${key}: ${value}`);
        });
    });
}

// function to build the graphs
function buildBarChart(sample)
{
    //console.log(sample);
    //let data = d3.json("samples.json");
    //console.log(data);
    
    d3.json("samples.json").then((data) => {
        // grab all of the sample Data
        let sampleData = data.samples;
        //console.log(sampleData);

        
        // filter based on the value of the sample ( one result from dataset)
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);
        //console.log(result);
        
        // access index 0 from array
        let resultData = result[0];
        //console.log(resultData);
        
        // get otu ids, labels, and sample_values
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;
        //console.log(otu_ids);
        //console.log(otu_labels);
        //console.log(sample_values);
        
        // build the bar chart
        let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`);
        let xValues = sample_values.slice(0,10);
        let textLabels = otu_labels.slice(0,10);
        //console.log(textLabels);

        let barChart = {
            y: yticks.reverse(),
            x: xValues.reverse(),
            text: textLabels.reverse(),
            type: "bar",
            orientation: "h"
        }

        let layout = {
            title: "Top 10 Belly Button Bacteria"
        };

        Plotly.newPlot("bar", [barChart], layout);
       
    });
}

// function to build bubble chart
function buildBubbleChart(sample)
{

    d3.json("samples.json").then((data) => {
        // grab all of the sample Data
        let sampleData = data.samples;
        //console.log(sampleData);

        
        //filter based on the value of the sample ( one result from dataset)
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);
        //console.log(result);
        
        // access index 0 from array
        let resultData = result[0];
        //console.log(resultData);
        
        // get otu ids, labels, and sample_values
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;
        //console.log(otu_ids);
        //console.log(otu_labels);
        //console.log(sample_values);
        
        // build the bar chart
        let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`);
        let xValues = sample_values.slice(0,10);
        let textLabels = otu_labels.slice(0,10);
      

        let bubbleChart = {
            y: sample_values,
            x: otu_ids,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }

        let layout = {
            title: "Bacteria Cultures Per Sample",
            hovermode:"closest",
            xaxis: {title: "OTU ID"}
        };

        Plotly.newPlot("bubble", [bubbleChart], layout);
       
    });
}

// function to initialize the dashboard
function initalize()
{

    //let data = d3.json("samples.json");
    //console.log(data);

    // access dropdown selector from index.html file
    var select = d3.select("#selDataset");

    // use d3.json  to get the data
    d3.json("samples.json").then((data) => {
        let sampleNames = data.names; // array of the names only
        //console.log(sampleNames);

        // use a forEach in order to create 
        //options for each sample in the selector

        sampleNames.forEach((sample) => {
            select.append("option")
                .text(sample)
                .property("value", sample);
        });

        // when initialized, pass in the information for the first sample
        let sample1 = sampleNames[0];

        // call the function to build the metadata
        demographicInfo(sample1);

        // use function to build bar chart
        buildBarChart(sample1);

        // function to build bubble chart
        buildBubbleChart(sample1);

    });
}
// function to update the dashboard
function optionChanged(item)
{
    // call update to metadata
    demographicInfo(item);
  
    //use function to build bar chart
    buildBarChart(item);

    // function to build bubble chart
    buildBubbleChart(item);
}
// call the initialize function
initalize();
