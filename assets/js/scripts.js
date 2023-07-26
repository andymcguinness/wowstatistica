// A $( document ).ready() block.
$( document ).ready(function() {

	// DropCap.js
	var dropcaps = document.querySelectorAll(".dropcap");
	window.Dropcap.layout(dropcaps, 2);

	// Responsive-Nav
	var nav = responsiveNav(".nav-collapse");

	// Round Reading Time
    $(".time").text(function (index, value) {
      return Math.round(parseFloat(value));
    });

});

function drawBarChart(selector, xrangestart, yrangestart, yrangeend, datasource, xaxis, yaxis) {

	// set the dimensions and margins of the graph
	const margin = {top: 30, right: 30, bottom: 70, left: 60},
	    width = 460 - margin.left - margin.right,
	    height = 400 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	const svg = d3.select(selector)
	  .append("svg")
	  .attr("width", width + margin.left + margin.right)
	  .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	  .attr("transform", `translate(${margin.left},${margin.top})`);
	

	// Parse the Data
	d3.json(datasource).then( function(data) {

		// step down a level
		data = data.rankings;

		// X axis
		const x = d3.scaleBand()
		  .range([ xrangestart, width ])
		  .domain(data.map(d => d[xaxis]))
		  .padding(0.2);
		svg.append("g")
		  .attr("transform", `translate(0, ${height})`)
		  .call(d3.axisBottom(x))
		  .selectAll("text")
		  .attr("transform", "translate(-10,0)rotate(-45)")
		  .style("text-anchor", "end");

		// Add Y axis
		const y = d3.scaleLinear()
		  .domain([yrangestart, yrangeend])
		  .range([ height, 0]);
		svg.append("g")
		  .call(d3.axisLeft(y));

		// Bars
		svg.selectAll("mybar")
		  .data(data)
		  .join("rect")
		  .attr("x", d => x(d[xaxis]))
		  .attr("y", d => y(d[yaxis]))
		  .attr("width", x.bandwidth())
		  .attr("height", d => height - y(d[yaxis]))
		  .attr("fill", "#0074d9")

})}

function drawClassBarChart(selector, datasource) {

	// Some constants for the positioning
	const margin = {top: 30, right: 30, bottom: 70, left: 60},
	    width = 460 - margin.left - margin.right,
	    height = 400 - margin.top - margin.bottom;	

	// Parse the Data
	d3.json(datasource).then( function(data) {

		// step down a level
		data = data.rankings;

		// pull out an array of arrays of the characters for each run
		roster_array = data.map(d => {
			return [...new Map(d.run.roster.map(item =>
				[item.character.id, item])).values()]})

		// flatten the array to 100 character records
		let options_2 = Array.from(roster_array.values()).flat()

		// pull out individual character records
		let options = [...new Map(options_2.map(item =>
			[item.character.id, item])).values()]; 
		
		// roll up to the class count
		rollup_array = d3.rollup(options, v => v.length, d => d["character"]["class"]["slug"]);

		xScale = d3
		  .scaleBand()
		  .domain(Array.from(rollup_array.keys()))
		  .range([margin.left, width])
		  .padding(0.1)

		xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
			
		yScale = d3
		  .scaleLinear()
		  .domain([0, d3.max(rollup_array, d => d[1])])
		  .rangeRound([height, margin.top])

		yAxis = d3.axisLeft(yScale).tickSizeOuter(0)

		const svg = d3.select(selector)
		  .append("svg")
		  .attr("width", width + margin.left + margin.right)
		  .attr("height", height + margin.top + margin.bottom)

	  
		// draw the bars
		svg
		  .append("g")
		  .selectAll("rect")
		  .data(rollup_array)
		  .join('rect')
		  .attr("x", d => xScale(d[0]))
		  .attr("y", d => yScale(d[1]))
		  .attr("width", xScale.bandwidth())
		  .attr("height", d => yScale(0) - yScale(d[1]))
		  .attr("fill", "#0074d9")
	  
		// draw the x axis
		// nothing new here
		svg
		  .append('g')
		  .attr('class', 'x-axis')
		  .attr('transform', `translate(0,${height})`)
		  .call(xAxis)
		  .selectAll("text")
	      .attr("transform", "translate(-10,0)rotate(-45)")
	      .style("text-anchor", "end");
	  
		// draw the y axis
		// nothing new here
		svg
		  .append('g')
		  .attr('class', 'y-axis')
		  .attr('transform', `translate(${margin.left},0)`)
		  .call(yAxis);
	  
		// render the whole chart
		// nothing new here
		return svg.node();
})
}

function drawSpecBarChart(selector, datasource) {
	const margin = {top: 30, right: 30, bottom: 70, left: 60},
	    width = 460 - margin.left - margin.right,
	    height = 400 - margin.top - margin.bottom;	

	// Parse the Data
	d3.json(datasource).then( function(data) {

		// step down a level
		data = data.rankings;

		// pull out an array of arrays of the characters for each run
		roster_array = data.map(d => {
			return [...new Map(d.run.roster.map(item =>
				[item.character.id, item])).values()]})

		// flatten the array to 100 character records
		let options_2 = Array.from(roster_array.values()).flat()

		// pull out individual character records
		let options = [...new Map(options_2.map(item =>
			[item.character.id, item])).values()]; 
		
		// roll up to the class count
		rollup_array = d3.rollup(options, v => v.length, d => d["character"]["spec"]["slug"]);

		xScale = d3
          .scaleBand()
  		  .domain(Array.from(rollup_array.keys()))
  		  .range([margin.left, width])
  		  .padding(0.1)

		xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
		
		yScale = d3
 		  .scaleLinear()
  		  .domain([0, d3.max(rollup_array, d => d[1])])
  		  .rangeRound([height, margin.top])

	  	yAxis = d3.axisLeft(yScale).tickSizeOuter(0)

		const svg = d3.select(selector)
		  .append("svg")
		  .attr("width", width + margin.left + margin.right)
		  .attr("height", height + margin.top + margin.bottom)

	  
		// draw the bars
		svg
		  .append("g")
		  .selectAll("rect")
		  .data(rollup_array)
		  .join('rect')
		  .attr("x", d => xScale(d[0]))
		  .attr("y", d => yScale(d[1]))
		  .attr("width", xScale.bandwidth())
		  .attr("height", d => yScale(0) - yScale(d[1]))
		  .attr("fill", "#0074d9")
	  
		// draw the x axis
		// nothing new here
		svg
		  .append('g')
		  .attr('class', 'x-axis')
		  .attr('transform', `translate(0,${height})`)
		  .call(xAxis)
		  .selectAll("text")
	      .attr("transform", "translate(-10,0)rotate(-45)")
	      .style("text-anchor", "end");
	  
		// draw the y axis
		// nothing new here
		svg
		  .append('g')
		  .attr('class', 'y-axis')
		  .attr('transform', `translate(${margin.left},0)`)
		  .call(yAxis);
	  
		// render the whole chart
		// nothing new here
		return svg.node();
})}

function drawRaceBarChart(selector, datasource) {
	const margin = {top: 30, right: 30, bottom: 70, left: 60},
	    width = 460 - margin.left - margin.right,
	    height = 400 - margin.top - margin.bottom;	

	// Parse the Data
	d3.json(datasource).then( function(data) {

		// step down a level
		data = data.rankings;

		// pull out an array of arrays of the characters for each run
		roster_array = data.map(d => {
			return [...new Map(d.run.roster.map(item =>
				[item.character.id, item])).values()]})

		// flatten the array to 100 character records
		let options_2 = Array.from(roster_array.values()).flat()

		// pull out individual character records
		let options = [...new Map(options_2.map(item =>
			[item.character.id, item])).values()]; 
		
		// roll up to the class count
		rollup_array = d3.rollup(options, v => v.length, d => d["character"]["race"]["slug"]);

		xScale = d3
  		  .scaleBand()
  		  .domain(Array.from(rollup_array.keys()))
  	  	  .range([margin.left, width])
  		  .padding(0.1)

		xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
		
		yScale = d3
		  .scaleLinear()
		  .domain([0, d3.max(rollup_array, d => d[1])])
		  .rangeRound([height, margin.top])

		yAxis = d3.axisLeft(yScale).tickSizeOuter(0)

		const svg = d3.select(selector)
		  .append("svg")
		  .attr("width", width + margin.left + margin.right)
		  .attr("height", height + margin.top + margin.bottom)

	  
		// draw the bars
		svg
		  .append("g")
		  .selectAll("rect")
		  .data(rollup_array)
		  .join('rect')
		  .attr("x", d => xScale(d[0]))
		  .attr("y", d => yScale(d[1]))
		  .attr("width", xScale.bandwidth())
		  .attr("height", d => yScale(0) - yScale(d[1]))
		  .attr("fill", "#0074d9")
	  
		// draw the x axis
		// nothing new here
		svg
		  .append('g')
		  .attr('class', 'x-axis')
		  .attr('transform', `translate(0,${height})`)
		  .call(xAxis)
		  .selectAll("text")
	      .attr("transform", "translate(-10,0)rotate(-45)")
	      .style("text-anchor", "end");
	  
		// draw the y axis
		// nothing new here
		svg
		  .append('g')
		  .attr('class', 'y-axis')
		  .attr('transform', `translate(${margin.left},0)`)
		  .call(yAxis);
	  
		// render the whole chart
		// nothing new here
		return svg.node();
})}

function drawFactionBarChart(selector, datasource) {
	const margin = {top: 30, right: 30, bottom: 70, left: 60},
	    width = 460 - margin.left - margin.right,
	    height = 400 - margin.top - margin.bottom;	

	// Parse the Data
	d3.json(datasource).then( function(data) {

		// step down a level
		data = data.rankings;

		// pull out an array of arrays of the characters for each run
		roster_array = data.map(d => {
			return [...new Map(d.run.roster.map(item =>
				[item.character.id, item])).values()]})

		// flatten the array to 100 character records
		let options_2 = Array.from(roster_array.values()).flat()

		// pull out individual character records
		let options = [...new Map(options_2.map(item =>
			[item.character.id, item])).values()]; 
		
		// roll up to the class count
		rollup_array = d3.rollup(options, v => v.length, d => d["character"]["faction"]);

		xScale = d3
		  .scaleBand()
		  .domain(Array.from(rollup_array.keys()))
		  .range([margin.left, width])
		  .padding(0.1)

		xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
			
		yScale = d3
		  .scaleLinear()
		  .domain([0, d3.max(rollup_array, d => d[1])])
		  .rangeRound([height, margin.top])

		yAxis = d3.axisLeft(yScale).tickSizeOuter(0)

		const svg = d3.select(selector)
		  .append("svg")
		  .attr("width", width + margin.left + margin.right)
		  .attr("height", height + margin.top + margin.bottom)

	  
		// draw the bars
		svg
		  .append("g")
		  .selectAll("rect")
		  .data(rollup_array)
		  .join('rect')
		  .attr("x", d => xScale(d[0]))
		  .attr("y", d => yScale(d[1]))
		  .attr("width", xScale.bandwidth())
		  .attr("height", d => yScale(0) - yScale(d[1]))
		  .attr("fill", "#0074d9")
	  
		// draw the x axis
		// nothing new here
		svg
		  .append('g')
		  .attr('class', 'x-axis')
		  .attr('transform', `translate(0,${height})`)
		  .call(xAxis)
		  .selectAll("text")
	      .attr("transform", "translate(-10,0)rotate(-45)")
	      .style("text-anchor", "end");
	  
		// draw the y axis
		// nothing new here
		svg
		  .append('g')
		  .attr('class', 'y-axis')
		  .attr('transform', `translate(${margin.left},0)`)
		  .call(yAxis);
	  
		// render the whole chart
		// nothing new here
		return svg.node();
})}

function drawServerBarChart(selector, datasource) {
	const margin = {top: 30, right: 30, bottom: 70, left: 60},
	    width = 460 - margin.left - margin.right,
	    height = 400 - margin.top - margin.bottom;	

	// Parse the Data
	d3.json(datasource).then( function(data) {

		// step down a level
		data = data.rankings;

		// pull out an array of arrays of the characters for each run
		roster_array = data.map(d => {
			return [...new Map(d.run.roster.map(item =>
				[item.character.id, item])).values()]})

		// flatten the array to 100 character records
		let options_2 = Array.from(roster_array.values()).flat()

		// pull out individual character records
		let options = [...new Map(options_2.map(item =>
			[item.character.id, item])).values()]; 
		
		// roll up to the class count
		rollup_array = d3.rollup(options, v => v.length, d => d["character"]["realm"]["slug"]);

		xScale = d3
		  .scaleBand()
		  .domain(Array.from(rollup_array.keys()))
		  .range([margin.left, width])
		  .padding(0.1)

		xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
			
		yScale = d3
		  .scaleLinear()
		  .domain([0, d3.max(rollup_array, d => d[1])])
		  .rangeRound([height, margin.top])

		yAxis = d3.axisLeft(yScale).tickSizeOuter(0)

		const svg = d3.select(selector)
		  .append("svg")
		  .attr("width", width + margin.left + margin.right)
		  .attr("height", height + margin.top + margin.bottom)

	  
		// draw the bars
		svg
		  .append("g")
		  .selectAll("rect")
		  .data(rollup_array)
		  .join('rect')
		  .attr("x", d => xScale(d[0]))
		  .attr("y", d => yScale(d[1]))
		  .attr("width", xScale.bandwidth())
		  .attr("height", d => yScale(0) - yScale(d[1]))
		  .attr("fill", "#0074d9")
	  
		// draw the x axis
		// nothing new here
		svg
		  .append('g')
		  .attr('class', 'x-axis')
		  .attr('transform', `translate(0,${height})`)
		  .call(xAxis)
		  .selectAll("text")
	      .attr("transform", "translate(-10,0)rotate(-45)")
	      .style("text-anchor", "end");
	  
		// draw the y axis
		// nothing new here
		svg
		  .append('g')
		  .attr('class', 'y-axis')
		  .attr('transform', `translate(${margin.left},0)`)
		  .call(yAxis);
	  
		// render the whole chart
		// nothing new here
		return svg.node();
})}

function drawRoleBarChart(selector, datasource) {
	const margin = {top: 30, right: 30, bottom: 70, left: 60},
	    width = 460 - margin.left - margin.right,
	    height = 400 - margin.top - margin.bottom;	

	// Parse the Data
	d3.json(datasource).then( function(data) {

		// step down a level
		data = data.rankings;

		// pull out an array of arrays of the characters for each run
		roster_array = data.map(d => {
			return [...new Map(d.run.roster.map(item =>
				[item.character.id, item])).values()]})

		// flatten the array to 100 character records
		let options_2 = Array.from(roster_array.values()).flat()

		// pull out individual character records
		let options = [...new Map(options_2.map(item =>
			[item.character.id, item])).values()]; 
		
		// roll up to the class count
		rollup_array = d3.rollup(options, v => v.length, d => d["role"]);

		xScale = d3
		  .scaleBand()
		  .domain(Array.from(rollup_array.keys()))
		  .range([margin.left, width])
		  .padding(0.1)

		xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
			
		yScale = d3
		  .scaleLinear()
		  .domain([0, d3.max(rollup_array, d => d[1])])
		  .rangeRound([height, margin.top])

		yAxis = d3.axisLeft(yScale).tickSizeOuter(0)

		const svg = d3.select(selector)
		  .append("svg")
		  .attr("width", width + margin.left + margin.right)
		  .attr("height", height + margin.top + margin.bottom)

	  
		// draw the bars
		svg
		  .append("g")
		  .selectAll("rect")
		  .data(rollup_array)
		  .join('rect')
		  .attr("x", d => xScale(d[0]))
		  .attr("y", d => yScale(d[1]))
		  .attr("width", xScale.bandwidth())
		  .attr("height", d => yScale(0) - yScale(d[1]))
		  .attr("fill", "#0074d9")
	  
		// draw the x axis
		// nothing new here
		svg
		  .append('g')
		  .attr('class', 'x-axis')
		  .attr('transform', `translate(0,${height})`)
		  .call(xAxis)
		  .selectAll("text")
	      .attr("transform", "translate(-10,0)rotate(-45)")
	      .style("text-anchor", "end");
	  
		// draw the y axis
		// nothing new here
		svg
		  .append('g')
		  .attr('class', 'y-axis')
		  .attr('transform', `translate(${margin.left},0)`)
		  .call(yAxis);
	  
		// render the whole chart
		// nothing new here
		return svg.node();
})}