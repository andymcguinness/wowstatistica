---
layout: post
title: Top 20 Mythic Plus Run Statistics
date: 26-07-2023
tags: mythic-plus, mythics, stats
---

<!-- Intro Header -->
<h3>Data Analysis</h3>

<section>
    <!-- Data Viz 1 -->
    <p>The top 20 Mythic Plus runs are fascinating to examine, if  you take a closer look. For example, let's take a look at the scores vs. the rankings to start with:</p>
    <div class="dataviz" id="my_dataviz" ></div>
    <details>
        <summary>Click for d3 code.</summary>
        
        <pre class="code-block">
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
        </pre>
    </details>

    <!-- Data Viz 2 -->
    <p>As you can see, the scores are fairly homogenous for the top 20 Mythic runs, as of 07/23/2023</p>
    <div class="dataviz" id="my_dataviz_2"></div>
    <details>
        <summary>Click for d3 code.</summary>
        
        <pre class="code-block">
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
        </pre>
    </details>
    <p>However, if we adjust the scaling a bit, the difference between the top, and the top of the top, truly stands out.</p>

    <!-- Data Viz 3 -->
    <p>Now, let's take a look at the meta as well -- how bad is it?</p>
    <div class="dataviz" id="my_dataviz_3"></div>
    <details>
        <summary>Click for d3 code.</summary>
        
        <pre class="code-block">
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

                x1 = d3
                .scaleBand()
                .domain(Array.from(rollup_array.keys()))
                .rangeRound([0, xScale.bandwidth()])
                .padding(0.05)


                xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
                    
                yScale = d3
                .scaleLinear()
                .domain([0, d3.max(rollup_array, d => d[1])]) // in each key, look for the maximum number
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
        </pre>
    </details>

    <!-- Data Viz 4 -->
    <p>Whew! That's something. Let's take a look at the spec breakdown as well.</p>
    <div class="dataviz" id="my_dataviz_4"></div>
    <details>
        <summary>Click for d3 code.</summary>
        
        <pre class="code-block">
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

                x1 = d3
                .scaleBand()
                .domain(Array.from(rollup_array.keys()))
                .rangeRound([0, xScale.bandwidth()])
                .padding(0.05)


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
        </pre>
    </details>
    <p>Whew again! So, there's not much variation at the top this season. Some seasons, there's a smidge of variation, but not this time.</p>

    <!-- Data Viz 5 -->
    <p>Now, let's take a look at the races that are being played:</p>
    <div class="dataviz" id="my_dataviz_5"></div>
    <details>
        <summary>Click for d3 code.</summary>
        
        <pre class="code-block">
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

                x1 = d3
                .scaleBand()
                .domain(Array.from(rollup_array.keys()))
                .rangeRound([0, xScale.bandwidth()])
                .padding(0.05)


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
        </pre>
    </details>
    <p>Oh ho! A tiny bit of variation there. Dwarf is not surprisingly the highest-played race; with the all-powerful Stoneform and other race-based traits, dwarves are quite powerful overall, if a bit under-utilized by the population at large.</p>

    <!-- Data Viz 6 and 7 -->
    <p>Finally, let's take a look at the faction and server distribution:</p>
    <div class="dataviz" id="my_dataviz_6"></div>
    <details>
        <summary>Click for d3 code.</summary>
        
        <pre class="code-block">
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
        </pre>
    </details>
    <div class="dataviz" id="my_dataviz_7"></div>
    <details>
        <summary>Click for d3 code.</summary>
        
        <pre class="code-block">
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
        </pre>
    </details>
    <p>Not surprisingly, given the popularity of dwarves this season, the Alliance wins out, though there is a strong Horde showing as well. The servers are a bit mixed, which is nice to see; though this certainly isn't representative, there are only so many players at the top, so there will only be so many servers as well.</p>

    <p>As a general note, out of the 20 runs, there were 38 unique characters; their role distribution was as follows:</p>
    <div class="dataviz" id="my_dataviz_8"></div>
    <details>
        <summary>Click for d3 code.</summary>
        
        <pre class="code-block">
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
        </pre>
    </details>

    <!-- Outro -->
    <p>While this was not a very inspired data analysis (though still interesting!), I hope you'll watch this space as I expand my skills and begin tackling more interesting topics! Thanks for reading!</p>
</section>

<!-- Code Header -->
<h3>Code Analysis</h3>

<section>
    <p>This was my first time working with d3.js! I had spent much time building a Power BI dashboard to explore the relationships in the data, so I knew the general graphs I wanted to show, but I had never worked with d3 before, and was quite a noob when it came to putting together the graphs.</p>
    <p>With the help of a plethora of Google searches, I put together some functional code, and whaddya know! It doesn't look half bad!</p>
    <p>My goal is to build code that's as reusable as possible; though I did not succeed here (for the most part), I know it's only a matter of improving. Building more analyses will strengthen my skills, and I will have reusable, beautiful, original code in no time.</p>
</section>

<!-- References Header -->
<h3>Acknowledgements</h3>

<section>
    <p>There are a few sources I absolutely could not have done this without. They are as follows:</p>
    <ul>
        <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat" target="_blank">Array.prototype.flat()</a></li>
        <li><a href="https://www.eddymens.com/blog/how-to-highlight-syntax-in-pre-tags-using-highlightjs" target="_blank">This primer on Highlight.js</a></li>
        <li><a href="https://tomordonez.com/jekyll-text-expand-collapsible-markdown/" target="_blank">This explainer on collapsible Markdown elements</a></li>
        <li><a href="https://stackoverflow.com/questions/15125920/how-to-get-distinct-values-from-an-array-of-objects-in-javascript" target="_blank">The answer here on getting unique items from an array of objects</a></li>
        <li><a href="https://observablehq.com/@mkane2/d3-grouped-bar-chart" target="_blank">This incredible piece on grouped bar charts with d3, from which most of the presentation code on this page was taken</a></li>
        <li><a href="https://observablehq.com/@d3/d3-group" target="_blank">This piece from d3 on grouping and rollup functions, which was critical to the functionality of this code</a></li>
        <li><a href="https://stackoverflow.com/questions/38364400/index-inside-map-function" target="_blank">This piece reminding me how to snag the index inside the map function</a></li>
        <li><a href="https://stackoverflow.com/questions/48710951/d3-pass-variable-to-x-value" target="_blank">This answer reminding me of basic JavaScript object functionality (d'oh)</a></li>
        <li><a href="https://raider.io/api" target="_blank">And, of course, a huge thanks to Raider.io for making a public API</a></li>
    </ul>
</section>


<script>
drawBarChart("#my_dataviz", 0, 0, 250, "/data/top_20_mythic_runs_2023_07_23.json", "rank", "score");
drawBarChart("#my_dataviz_2", 0, 230, 245, "/data/top_20_mythic_runs_2023_07_23.json", "rank", "score");
drawClassBarChart("#my_dataviz_3", "/data/top_20_mythic_runs_2023_07_23.json");
drawSpecBarChart("#my_dataviz_4", "/data/top_20_mythic_runs_2023_07_23.json");
drawRaceBarChart("#my_dataviz_5", "/data/top_20_mythic_runs_2023_07_23.json");
drawFactionBarChart("#my_dataviz_6", "/data/top_20_mythic_runs_2023_07_23.json");
drawServerBarChart("#my_dataviz_7", "/data/top_20_mythic_runs_2023_07_23.json");
drawRoleBarChart("#my_dataviz_8", "/data/top_20_mythic_runs_2023_07_23.json");

var preTags = document.getElementsByTagName('pre');
    var size = preTags.length;
    for (var i=0; i < size; i++) { 
        preTags[i].innerHTML = '<code>'+preTags[i].innerHTML+'</code>'; // wrap content of pre tag in code tag
    }
    hljs.highlightAll(); // apply highlighting
</script>
