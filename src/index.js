import Chart from "chart.js";
import "chartjs-plugin-piechart-outlabels";

var ctx = document.getElementById("myChart");
Chart.pluginService.register({
  beforeDraw: function (chart) {
    if (chart.config.options.elements.center) {
      // Get ctx from string
      var ctx = chart.chart.ctx;
      let arr = chart.config.data.datasets[0].data;
      const average = parseFloat(
        arr.reduce((a, b) => a + b, 0) / arr.length
      ).toFixed(2);

      // Get options from the center object in options
      var centerConfig = chart.config.options.elements.center;
      var fontStyle = centerConfig.fontStyle || "Arial";
      var txt = centerConfig.text;
      var color = centerConfig.color || "#000";
      var maxFontSize = centerConfig.maxFontSize || 15;
      var sidePadding = centerConfig.sidePadding || 20;
      var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2);
      // Start with a base font of 30px
      ctx.font = "30px " + fontStyle;

      // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
      var stringWidth = ctx.measureText(txt).width;
      var elementWidth = chart.innerRadius * 2 - sidePaddingCalculated;

      // Find out how much the font can grow in width.
      var widthRatio = elementWidth / stringWidth;
      var newFontSize = Math.floor(30 * widthRatio);
      var elementHeight = chart.innerRadius * 2;

      // Pick a new font size so it will not be larger than the height of label.
      var fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
      var minFontSize = centerConfig.minFontSize;
      var lineHeight = centerConfig.lineHeight || 25;
      var wrapText = false;

      if (minFontSize === undefined) {
        minFontSize = 10;
      }

      if (minFontSize && fontSizeToUse < minFontSize) {
        fontSizeToUse = minFontSize;
        wrapText = true;
      }

      // Set font settings to draw it correctly.
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      var centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
      var centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
      ctx.font = fontSizeToUse + "px " + fontStyle;
      ctx.fillStyle = color;

      if (!wrapText) {
        ctx.fillText(txt, centerX, centerY - 10);
        ctx.fillText(average + "歳", centerX, centerY + 15);
        return;
      }

      var words = txt.split("\n");
      var line = "";
      var lines = [];

      // Break words up into multiple lines if necessary
      for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + "\n";
        var metrics = ctx.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > elementWidth && n > 0) {
          lines.push(line);
          line = words[n] + " ";
        } else {
          line = testLine;
        }
      }
      console.log(lines);

      // Move the center up depending on line height and number of lines
      centerY -= (lines.length / 2) * lineHeight;

      for (var n = 0; n < lines.length; n++) {
        ctx.fillText(lines[n], centerX, centerY);
        centerY += lineHeight;
      }
      //Draw text in center
      ctx.fillText(line, centerX, centerY);
    }
  }
});
var myChart = new Chart(ctx, {
  type: "outlabeledDoughnut",
  data: {
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)"
        ],
        borderWidth: 0
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    elements: {
      center: {
        text: "平均年齢",
        color: "#FF6384",
        fontStyle: "Arial",
        sidePadding: 0,
        minFontSize: 15,
        lineHeight: 15
      }
    },
    plugins: {
      legend: false,
      outlabels: {
        text: "%p\n%v万人",
        color: "white",
        stretch: 40,
        font: {
          resizable: true,
          minSize: 10,
          maxSize: 12
        }
      }
    },
    tooltips: {
      enabled: false
    }
  }
});
