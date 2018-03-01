var CanvasChart = function () {

    var ctx;
    var margin = { top: 40, left: 75, right: 0, bottom: 75 };
    var chartHeight;
    var chartWidth;
    var yMax;
    var xMax;
    var data;
    var maxYValue = 0;
    var ratio = 0;
    var pointRadius = 10;
    var renderType = { lines: 'lines', points: 'points' };
    var finalDataPoints = [];
    var selectedDataPoint = null;
    var timerID;
    var overlayDiv;


    function render(canvasID, dataObj) {
        data = dataObj;
        createOverlay();

        var canvas = document.getElementById(canvasID);
        chartHeight = canvas.getAttribute('height');
        chartWidth = canvas.getAttribute('width');
        canvas.addEventListener('mousemove', mouseMove, false);
        ctx = canvas.getContext('2d');

        xMax = chartWidth - (margin.left + margin.right);
        yMax = chartHeight - (margin.top + margin.bottom);
        maxYValue = getMaxDataYValue();
        ratio = yMax / maxYValue;
        // render data based upon type of renderType(s) that client supplies
        if (data && (data.renderTypes === undefined || data.renderTypes === null)) {
            data.renderTypes = [renderType.lines];
        }
        renderParts();
    };

    function renderParts() {
        renderBackground();
        renderText();
        renderLinesAndLabels(true);
        renderData();
    };

    function renderBackground() {
        var lingrad = ctx.createLinearGradient(margin.left, margin.top, xMax - margin.right, yMax);
        lingrad.addColorStop(0.0, '#D4D4D4');
        lingrad.addColorStop(0.2, '#fff');
        lingrad.addColorStop(0.8, '#fff');
        lingrad.addColorStop(1, '#D4D4D4');
        ctx.fillStyle = lingrad;
        ctx.fillRect(margin.left, margin.top, xMax - margin.left, yMax - margin.top);
        ctx.fillStyle = 'black';
    };

    function renderText() {
        var labelFont = (data.labelFont != null) ? data.labelFont : '20pt Arial';
        ctx.font = labelFont;
        ctx.textAlign = 'center';

        // Title
        ctx.fillText(data.title, (chartWidth / 2), margin.top / 2);

        // X-axis text
        var txtSize = ctx.measureText(data.xLabel);
        ctx.fillText(data.xLabel,
            margin.left + (xMax / 2) - (txtSize.width / 2),
            yMax + (margin.bottom / 1.2));

        // Y-axis text
        ctx.save();
        ctx.rotate(-Math.PI / 2);
        ctx.font = labelFont;
        ctx.fillText(data.yLabel, (yMax / 2) * -1, margin.left / 4);
        ctx.restore();
    };

    function renderLinesAndLabels(shouldRenderText) {
        var yInc = yMax / data.dataPoints.length;
        var yPos = 0;
        var xInc = getXInc();
        var xPos = margin.left;

        for (var i = 0; i < data.dataPoints.length; i++) {
            yPos += (i == 0) ? margin.top : yInc;
            // Draw Horizontal lines
            drawLine({ x: margin.left, y: yPos, x2: xMax, y2: yPos }, '#E8E8E8');

            if (shouldRenderText) {
                // y axis labels
                ctx.font = (data.dataPointFont != null) ? data.dataPointFont : '10pt Calibri';
                var txt = Math.round(maxYValue - ((i == 0) ? 0 : yPos / ratio));
                var txtSize = ctx.measureText(txt);
                ctx.fillText(txt, margin.left - ((txtSize.width >= 14) ? txtSize.width : 10) - 7, yPos + 4);

                // x axis labels
                txt = data.dataPoints[i].x;
                txtSize = ctx.measureText(txt);
                ctx.fillText(txt, xPos, yMax + (margin.bottom / 3));
                xPos += xInc;
            }
        }
        // Vertical line
        drawLine({ x: margin.left, y: margin.top, x2: margin.left, y2: yMax });

        // Horizontal line
        drawLine({ x: margin.left, y: yMax, x2: xMax, y2: yMax });
    };

    function renderData() {
        var xInc = getXInc();
        var prevX = 0;
        var prevY = 0;

        for (var i = 0; i < data.dataPoints.length; i++) {
            var pt = data.dataPoints[i];
            var y = (maxYValue - pt.y) * ratio;
            if (y < margin.top) {
                y = margin.top;
            }
            var x = (i * xInc) + margin.left;

            // Calculate dataPoint details
            var dataPoint = { x: x, y: y, currX: margin.left, x2: prevX, y2: prevY, originalY: pt.y };
            finalDataPoints.push(dataPoint);

            prevX = x;
            prevY = y;
        }

        if(data.renderTypes.indexOf(renderType.lines) > -1){
            drawLines();
        }
    };

    function drawLines() {
        for (var i = 0; i < finalDataPoints.length; i++) {
            var pt = finalDataPoints[i];
            if(pt.x2 > 0){
                drawLine(pt);
            }
        }
    };

    function drawLine(pt, strokeStyle) {
        ctx.strokeStyle = (strokeStyle == null) ? 'black' : strokeStyle;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pt.x2, pt.y2);
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();
        ctx.closePath();
    };

    function getMaxDataYValue() {
        var maxY = 0;
        if (data && data.dataPoints) {
            for (var i = 0; i < data.dataPoints.length; i++) {
                var y = data.dataPoints[i].y;
                if (y > maxY) {
                    maxY = y;
                }
            }
        }
        return maxY;
    };

    function getXInc() {
        return Math.round(xMax / data.dataPoints.length) - 1;
    };

    function createOverlay() {

    };

    function mouseMove() {

    };

    // public member
    return {
        render: render,
        renderType: renderType
    };

};
/* }(); // <- invoking the function would create a singleton. One CanvasChart per page. */