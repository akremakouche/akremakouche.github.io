function calculateRoot() {
    const fStr = document.getElementById("fInput").value;
    const gStr = document.getElementById("gInput").value;
    const x0 = parseFloat(document.getElementById("guessInput").value);
    const tol = parseFloat(document.getElementById("tolInput").value);
    const maxIter = parseInt(document.getElementById("maxIterInput").value);
    
    // Parse and compile functions
    const f = math.parse(fStr).compile();
    const g = math.parse(gStr).compile();
    const df = math.derivative(fStr, 'x').compile();

    let x = x0;
    let converged = false;
    let iterations = 0;

    // Determine decimal places in tolerance input
    const decimalPlaces = (tol.toString().split(".")[1] || "").length;

    for (let k = 0; k < maxIter; k++) {
        try {
            const fx = f.evaluate({x: x});
            const dfx = df.evaluate({x: x});
            if (Math.abs(dfx) < 1e-10) throw new Error('Derivative too close to zero');

            const xNewton = x - fx / dfx;
            const xFixed = g.evaluate({x: x});
            const xNext = (xNewton + xFixed) / 2;

            if (Math.abs(xNext - x) < tol) {
                document.getElementById("result").innerHTML = `Converged in ${k+1} iterations. Approximate root: ${xNext.toFixed(decimalPlaces)}`;
                converged = true;
                iterations = k + 1;
                plotFunctions(fStr, gStr, x0, xNext); 
                break;
            }

            x = xNext;
        } catch (error) {
            document.getElementById("result").innerHTML = "Error: " + error.message;
            return;
        }
    }

    if (!converged) {
        document.getElementById("result").innerHTML = "Reached max number of iterations.";
    }
}


function plotFunctions(fStr, gStr, x0, root) {
    const xValues = math.range(x0 - 5, x0 + 5, 0.1).toArray();
    const f = math.parse(fStr).compile();
    const g = math.parse(gStr).compile();

    // Evaluate function values
    const fValues = xValues.map(x => f.evaluate({ x }));
    const gValues = xValues.map(x => g.evaluate({ x }));

    // Define plot data
    const data = [
        { x: xValues, y: fValues, type: 'scatter', mode: 'lines', name: 'f(x)', line: { color: 'blue' } },
        { x: xValues, y: gValues, type: 'scatter', mode: 'lines', name: 'g(x)', line: { color: 'red' } },
        { x: [root], y: [f.evaluate({ x: root })], type: 'scatter', mode: 'markers', name: 'Root', marker: { color: 'green', size: 10 } },
    ];

    // Define layout with custom colors for axis, title, and legend
    const layout = {
        title: { 
            text: 'Plot of f(x) and g(x)', 
            font: { color: 'black' }       // Title color set to black
        },
        paper_bgcolor: 'rgba(0, 0, 0, 0)',  // Transparent background for the plot container
        plot_bgcolor: 'rgba(0, 0, 0, 0)',   // Transparent background for the actual plot area
        xaxis: {
            title: 'x',
            color: 'black',
            linecolor: 'white',             // x-axis line at y=0 is white
            zeroline: true,                 // Enables the x=0 axis line
            zerolinecolor: 'yellow',         // Sets the x=0 line color to white
            tickfont: { color: 'black' }    // Tick label color (numbers along the axis)
        },
        yaxis: {
            title: 'Function values',
            color: 'black',
            linecolor: 'white',             // y-axis line at x=0 is white
            zeroline: true,                 // Enables the y=0 axis line
            zerolinecolor: 'yellow',         // Sets the y=0 line color to white
            tickfont: { color: 'black' }    // Tick label color (numbers along the axis)
        },
        legend: {
            font: { color: 'black' }        // Legend color set to black
        }
    };

    // Render plot with Plotly
    Plotly.newPlot("plot", data, layout);
}




function resetFields() {
    document.getElementById("fInput").value = '';
    document.getElementById("gInput").value = '';
    document.getElementById("guessInput").value = '';
    document.getElementById("tolInput").value = '';
    document.getElementById("maxIterInput").value = '';
    document.getElementById("result").innerHTML = '';
    document.getElementById("plot").innerHTML = '';
}

window.addEventListener("load", () => {
    document.body.classList.add("loaded");
    initialPlot();
});


