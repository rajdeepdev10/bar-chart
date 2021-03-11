fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(response => response.json())
    .then(data => {
        const gdp_data = data.data;

        drawChart(gdp_data);
        
    });


function drawChart(gdp_data){
    const chartWidth = 800;
    const chartHeight = 500;
    const padding = 60;

    //define svg inside svg variable
    const svg = d3.select("svg")
                    .attr("width", chartWidth)
                    .attr("height", chartHeight);

    //scales for overall bar width and height
    const xScale = d3.scaleLinear()
                        .domain([0, gdp_data.length - 1])   // number of bars
                        .range([padding, chartWidth - padding]);    // the width of overall chart

    const yScale = d3.scaleLinear()
                        .domain([0, d3.max(gdp_data, d => d[1])])   // 0-max(gdp)
                        .range([0, chartHeight - 2 * padding]);   // height of overall chart


    //store all the dates in Date() format
    const dates_arr = gdp_data.map(arr => new Date(arr[0]));


    //scales for axis labels
    const xAxisScale = d3.scaleTime()
                            .domain([d3.min(dates_arr), d3.max(dates_arr)]) // min(date)-max(date)
                            .range([padding, chartWidth - padding]);    // the width of overall chart

    const yAxisScale = d3.scaleLinear()
                            .domain([0, d3.max(gdp_data, d => d[1])])   // 0-max(gdp)
                            .range([chartHeight - padding, padding]);   // height of overall chart INVERSE

    //creating the axis labels
    const xAxis = d3.axisBottom(xAxisScale);
    const yAxis = d3.axisLeft(yAxisScale);

    //creating tooltip element as div and appending to body
    let tooltip = d3.select("body")
                    .append("div")
                    .attr("class", "tooltip")
                    .attr("id", "tooltip")
                    .style("opacity", 0);
                        

    //attaching axis to the svg
    svg.append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${chartHeight - padding})`);   

    svg.append("g")
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding}, 0)`);

    //drawing bars
    svg.selectAll("rect")
        .data(gdp_data)
        .enter()
        .append("rect")
        .attr("data-date", d => d[0])
        .attr("data-gdp", d => d[1])
        .attr("width", (chartWidth - 2 * padding) / gdp_data.length)    //distribute among the overall chart width
        .attr("height", d => yScale(d[1]))  
        .attr("x", (d, i) => xScale(i))
        .attr("y", (d, i) => chartHeight - padding - yScale(d[1]))
        .attr("class", "bar")
        .on("mouseover", (e, d) => {
            tooltip.transition()
                    .duration(200)
                    .style("opacity", 1);

            tooltip.html(`${get_date_in_quarter(d[0])} $${d[1]} Bil.`);
            tooltip.attr("data-date", d[0]);
        })
        .on("mouseout", () => {
            tooltip.transition()
                    .duration(400)
                    .style("opacity", 0);
        });

        // Draw the y-axis title
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - (chartHeight / 2))
            .attr("dy", "0.75em")
            .style("text-anchor", "middle")
            .text("Gross Domestic Product (in Billion $)");      

        // Draw chart data source
        svg.append("text")
            .attr("x", 60)
            .attr("y", chartHeight - 10)
            .text("Source: US Federal Reserve Economic Data");  




        function get_date_in_quarter(date_in_dash){
            date_in_dash = date_in_dash.split('-');

            switch(date_in_dash[1]){
                case '01':
                    return date_in_dash[0] + ' - Q1';
                
                case '04':
                    return date_in_dash[0] + ' - Q2';

                case '07':
                    return date_in_dash[0] + ' - Q3';

                case '10':
                    return date_in_dash[0] + ' - Q4';
            }

        }
        
    


}
    