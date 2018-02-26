var CanvasChart = function() {

    var ctx;
    var margin = { top: 40, left: 50, right: 0, bottom: 75 };
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
        if (data.renderTypes === undefined || data.renderTypes === null) {
            data.renderTypes = [renderType.lines];
        }
        renderParts();
    };

    function renderParts() {

    };

    function getMaxDataYValue() {
        var maxY = 0;
        for (var i = 0; i < data.dataPoints.length; i++) {
            var y = data.dataPoints[i].y;
            if (y > maxY) {
                maxY = y;
            }
        }
        return maxY;
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