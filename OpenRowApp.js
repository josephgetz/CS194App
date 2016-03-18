db = new Mongo.Collection("database");
averagePie = null;
averageLine=null;
individualHouseChart = null;
compareHouseChart = null;
 
if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    tasks: function () {
      return db.find({});
    }
  });
 
  db.allow({
    'insert': function () {
      return true;
    }
  });
 
  Meteor.methods({
     'file-upload': function (fileInfo, fileData) {
        console.log("received file " + fileInfo.name + " data: " + fileData);
        fs.writeFile(fileInfo.name, fileData);
     }
  });
 
  Template.body.events({
      "submit .new-task": function (event) {
        // Prevent default browser form submit
        event.preventDefault();
   
        // Get value from form element
        var text = event.target.text.value;
   
        // Insert a task into the collection
        db.insert({
          text: text,
          createdAt: new Date() // current time
        });
   
        // Clear form
        //event.target.text.value = "";
      }
    });
 
 
  Template.body.events({
      "submit .view-task": function (event) {
        // Prevent default browser form submit
 
        event.preventDefault();
   
        // Get value from form element
        var text = event.target.text.value;
   
        var entry = db.find({
          "Payee": text,
        }).fetch();
 
        console.log(entry)
   
        // Clear form
        //event.target.text.value = "";
        // return entry
 
      }
    });
 
 
house_name = ""
Template.body.events({
  "submit .house-name": function (event) {
    house_name = event.target.text.value;
    event.preventDefault();
    //event.target.text.value = "";
  }
});
 
 
weeks = 0
Template.body.events({
  "submit .week": function (event) {
    var text = event.target.text.value;
    weeks = parseInt(text)
    event.preventDefault();
    //event.target.text.value = "";
  }
});
 
Template.body.events({
  "submit .chart-by-type": function (event) {
    event.preventDefault();
    query = db.find({
          "HouseName": house_name,
          "Week":weeks
    }).fetch();
 
    console.log(query.length)
 
    var kitchen = 0;
    var social = 0;
 
    for (var i = 0; i < query.length; i++) {
      kitchen += query[i].KitchenExpense;
      social += query[i].SocialExpense;
    }
 
    console.log(kitchen);
    console.log(social);
 
    var data = {
      labels: ["Kitchen", "Social"],
      datasets: [
          {
              label: "My First dataset",
              fillColor: "rgba(220,220,220,0.5)",
              strokeColor: "rgba(220,220,220,0.8)",
              highlightFill: "rgba(220,220,220,0.75)",
              highlightStroke: "rgba(220,220,220,1)",
              data: [kitchen, social]
          },
      ]
    }
 
    var ctx = document.getElementById("myChart").getContext("2d");
 
    //ctx.canvas.width = 300;
    //ctx.canvas.height = 300;
 
    new Chart(ctx).Bar(data);
 
  }
});
 
 
house_name = ""
Template.body.events({
  "submit .house-name": function (event) {
    house_name = event.target.text.value;
    event.preventDefault();
    // event.target.text.value = "";
  }
});
 
fileName = ""
Template.body.events({
  "submit .house-name": function (event) {
    house_name = event.target.text.value;
    event.preventDefault();
    // event.target.text.value = "";
  }
});
 
 
weeks = 0
Template.body.events({
  "submit .week": function (event) {
    var text = event.target.text.value;
    weeks = parseInt(text)
    event.preventDefault();
    // event.target.text.value = "";
  }
});
 
 
file='No file exists'
Template.body.events({
  "submit .fileUpload": function (event){
    file = document.getElementById("myFile").files[0];
    console.log("New file!");
    console.log(file);
  }
});
 
uploadHouse=false
Template.body.events({
  "change .housedropdownfileUpload": function (event){
    var e = document.getElementById("house-upload");
    uploadHouse = e.options[e.selectedIndex].text;
    console.log(uploadHouse);
  }
});
 
uploadWeek=false
Template.body.events({
  "change .week-dropdown-upload": function (event){
    var e = document.getElementById("week-upload");
    uploadWeek = parseFloat(e.options[e.selectedIndex].text);
    console.log(uploadWeek);
  }
});
 
uploadQuarter=false
Template.body.events({
  "change .quarter-dropdown-upload": function (event){
    var e = document.getElementById("quarter-upload");
    uploadQuarter = e.options[e.selectedIndex].text;
    console.log(uploadQuarter);
  }
});
 
 
Template.body.events({
  "change .file-upload-input": function(event, template){
     file = event.currentTarget.files[0];
     console.log(file);
     console.log("Upload week"+uploadWeek);
     console.log("Upload quarter"+uploadQuarter);
     console.log("Upload house"+uploadHouse);
    if (!uploadWeek || !uploadHouse || !uploadQuarter){
      // console.log(uploadWeek+" "+uploadQuarter);
      confirm("Please fill in the house name, week, and quarter before uploading the file");
      file='No file exists'
      return;
    }
     var reader = new FileReader();
    query = db.find({
          "HouseName": uploadHouse,
          "Week": uploadWeek,
          "Quarter" : uploadQuarter,
          // "Week":wee
    }).fetch();
    for (i=0; i<query.length; i++){
      console.log(query[i]);
      db.remove(query[i]._id);
    }
 
     if (!uploadWeek || !uploadHouse || !uploadQuarter){
      // document.getElementById("uploadText")
      Meteor.router.notification("Please specify the week, quarter, and house.");
      return;
     }
     reader.onloadend = function (event) {
 
          var lines=this.result.split(/\r?\n/);
          console.log(lines);
 
          for (i=0; i<lines.length;i++){
            line=lines[i].split('\t');
            if (line[0].indexOf('/')>-1 && line[1].length>2 && !isNaN(parseFloat(line[4].substring(line[4].indexOf('$')+1).replace('"','').replace(',','')))
              && !isNaN(parseFloat(line[5].substring(line[5].indexOf('$')+1).replace('"','').replace(',',''))) && !isNaN(parseFloat(line[6].substring(line[6].indexOf('$')+1).replace('"','').replace(',','')))){
              console.log(line);
              db.insert({
                HouseName: uploadHouse,
                Quarter: uploadQuarter,
                Week: uploadWeek,
                TransactionDate: line[0],
                Payee:line[1],
                ItemOrDescription: line[2],
                CreditOrIncome: parseFloat(line[4].substring(line[4].indexOf('$')+1).replace('"','').replace(',','')),
                KitchenExpense: parseFloat(line[5].substring(line[5].indexOf('$')+1).replace('"','').replace(',','')),
                SocialExpense: parseFloat(line[6].substring(line[6].indexOf('$')+1).replace('"','').replace(',',''))
              });
            }
          }
 
          // Meteor.router.notification("File uploaded successfully");
        }
        reader.readAsText(file);
        confirm("File uploaded successfully");
 
  }
});
 
 
Template.body.events({
  "submit .chart-by-week": function (event) {
    event.preventDefault();
    query = db.find({
          "HouseName": house_name
    }).fetch();
 
    // console.log(query.length);
 
    var map = new Map();
 
    for (var i = 0; i < query.length; i++) {
      curr_week = query[i].Week;
      if (!map.has(curr_week)) {
        map.set(curr_week, 0);
      }
      new_val = map.get(curr_week)+query[i].KitchenExpense+query[i].SocialExpense;
      map.set(curr_week, new_val);
    }
 
    console.log(map.keys())
 
 
    for (var key in map) {
 
      keys.push(key);
      vals.push(map.get(key));
    }
 
 
    // var data = {
    //   labels: keys,
    //   datasets: [
    //       {
    //           label: "My First dataset",
    //           fillColor: "rgba(220,220,220,0.5)",
    //           strokeColor: "rgba(220,220,220,0.8)",
    //           highlightFill: "rgba(220,220,220,0.75)",
    //           highlightStroke: "rgba(220,220,220,1)",
    //           data: vals
    //       },
    //   ]
    // }
 
    var ctx = document.getElementById("myChart").getContext("2d");
 
    new Chart(ctx).Bar(data);
 
  }
});
 
Template.body.events({
  "submit .find-house-average": function (event) {
    if (averagePie != null){
      averagePie.destroy();
      averageLine.destroy();
    }
    var currHouse = document.getElementById("desiredHouseAverage");
    var house_average = currHouse.options[currHouse.selectedIndex].value;
    console.log(house_average);
    if (house_average=="House"){
      confirm("please specify the house name");
      return;
    }
    event.preventDefault();
        event.preventDefault();
    query = db.find({
          "HouseName": house_average
    }).fetch();
    var denominator = query.length;
 
 
    var kitchen = 0;
    var social = 0;
 
    for (var i = 0; i < query.length; i++) {
      kitchen += query[i].KitchenExpense;
      social += query[i].SocialExpense;
    }
    console.log(denominator);
    console.log(kitchen);
    console.log(social);
    kitchen = Math.round(kitchen*100)/100
    social = Math.round(social*100)/100
 
    var pieData = [
        {
          value: kitchen,
          color:"#558C89",
          highlight: "#74AFAD",
          label: "Overall Total Kitchen Spending",
        },
        {
          value: social,
          color: "#D9853B",
          highlight: "#F2A45E",
          label: "Overall Total Social Spending",
        }
    ];
 
    var ctx = document.getElementById("housePieChart").getContext("2d");
   
 
    averagePie = new Chart(ctx).Pie(pieData,{responsive: true, scaleFontSize: 24, tooltipFontSize: 24});
 
 
    kitchen = kitchen / denominator;
    social = social/ denominator;
    kitchen = Math.round(kitchen*100)/100
    social = Math.round(social*100)/100
 
    console.log(kitchen);
    console.log(social);
 
 
    var data = {
      labels: ["Average Kitchen Transaction", "Average Social Transaction"],
      datasets: [
          {
              label: "My First dataset",
              fillColor: "#D9853B",
              strokeColor: "rgba(220,220,220,0.8)",
              highlightFill: "#F2A45E",
              highlightStroke: "rgba(220,220,220,1)",
              data: [kitchen, social]
              // scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
              // scaleFontSize: 12
          },
      ]
    }
 
    var ctx = document.getElementById("averageChart").getContext("2d");
   
    averageLine = new Chart(ctx).Bar(data,{responsive: true, scaleFontSize: 24, tooltipFontSize: 24});
 
  }
});
 
 
Template.body.events({
  "submit .individual-house-graph-request": function (event) {
    if (individualHouseChart != null){
      individualHouseChart.destroy();
    }
    //Obtaining request types from user
    var thisHouse = document.getElementById("desiredHouseAverage2");
    var desiredHouse = thisHouse.options[thisHouse.selectedIndex].value;
    if (desiredHouse=="House"){
      confirm("please specify the house name");
      // return;
    }
    var desiredExpense = document.getElementById("desiredExpenseBreakdown");
    var requestedExpenseBreakdown = desiredExpense.options[desiredExpense.selectedIndex].value;
    if (requestedExpenseBreakdown=="Expense"){
      confirm("please specify the expense type");
      // return;
    }
    var currDesiredQuarter = document.getElementById("desiredQuarter");
    var requestedQuarter = currDesiredQuarter.options[currDesiredQuarter.selectedIndex].value;
    if (requestedQuarter=="Quarter"){
      confirm("please specify the quarter");
      // return;
    }
    var currDesiredGraph = document.getElementById("desiredGraphType");
    var requestedGraphType = currDesiredGraph.options[currDesiredGraph.selectedIndex].value;
    if (requestedGraphType=="Graph Type"){
      confirm("Please specify the graph type");
      // return;
    }
    event.preventDefault();
        event.preventDefault();
    //Querying database for items
    console.log(desiredHouse, requestedQuarter, requestedExpenseBreakdown, requestedGraphType);
    var kitchenArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var socialArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (currWeek = 1; currWeek < kitchenArray.length+1; currWeek++){
      query = db.find({
            "HouseName": desiredHouse,
            "Quarter": requestedQuarter,
            "Week" : currWeek
      }).fetch();
      var denominator = query.length;
 
      //Calculating social/kitchen totals
      for (var i = 0; i < query.length; i++) {
        console.log("***************************");
        console.log(query[i]);
        kitchenArray[currWeek-1] += query[i].KitchenExpense;
        socialArray[currWeek-1] += query[i].SocialExpense;
      }
      kitchenArray[currWeek-1] = Math.round(kitchenArray[currWeek-1]*100)/100
      socialArray[currWeek-1] = Math.round(socialArray[currWeek-1]*100)/100
    }
    //Printing to console to crosscheck values being calculated correctly
    console.log(denominator);
    console.log("KITCHEN ARRAY")
    console.log(kitchenArray);
    console.log("SOCIAL ARRAY")
    console.log(socialArray);
    //If the requested Expense is Total
    if(requestedExpenseBreakdown.localeCompare("Total") == 0 ){
      if(requestedGraphType.localeCompare("Pie") == 0 ){
            var pieData = [
            {
              value: kitchenArray[0] + socialArray[0],
              color:"#964C0A",
              highlight: "#C3C3BF",
              label: "Week 1"
            },
            {
              value: kitchenArray[1] + socialArray[1],
              color:"#BA671E",
              highlight: "#C3C3BF",
              label: "Week 2"
            },
            {
              value: kitchenArray[2] + socialArray[2],
              color:"#D9853B",
              highlight: "#C3C3BF",
              label: "Week 3"
            },
            {
              value: kitchenArray[3] + socialArray[3],
              color:"#F2A45E",
              highlight: "#C3C3BF",
              label: "Week 4"
            },
            {
              value: kitchenArray[4] + socialArray[4],
              color:"#FFC008",
              highlight: "#C3C3BF",
              label: "Week 5"
            },
            {
              value: kitchenArray[5] + socialArray[5],
              color:"#07545B",
              highlight: "#C3C3BF",
              label: "Week 6"
            },
            {
              value: kitchenArray[6] + socialArray[6],
              color:"#136971",
              highlight: "#C3C3BF",
              label: "Week 7"
            },
            {
              value: kitchenArray[7] + socialArray[7],
              color:"#257C84",
              highlight: "#C3C3BF",
              label: "Week 8"
            },
            {
              value: kitchenArray[8] + socialArray[8],
              color:"#3B8C93",
              highlight: "#C3C3BF",
              label: "Week 9"
            },
            {
              value: kitchenArray[9] + socialArray[9],
              color:"#5FA9B0",
              highlight: "#C3C3BF",
              label: "Week 10"
            },
            {
              value: kitchenArray[10] + socialArray[10],
              color:"#00292D",
              highlight: "#C3C3BF",
              label: "Week 11"
            }
            ];
 
            var ctx = document.getElementById("individualHouseChart").getContext("2d");
            individualHouseChart = new Chart(ctx).Pie(pieData, {responsive: true, scaleFontSize: 24, tooltipFontSize: 24});
 
      }else if(requestedGraphType.localeCompare("Bar") == 0 ){
          var data = {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8", "Week 9", "Week 10", "Week 11"],
          datasets: [
          {
              label: "My First dataset",
              fillColor: "#558C89",
              strokeColor: "rgba(220,220,220,0.8)",
              highlightFill: "#74AFAD",
              highlightStroke: "rgba(220,220,220,1)",
              data: [kitchenArray[0] + socialArray[0], kitchenArray[1] + socialArray[1],
              kitchenArray[2] + socialArray[2], kitchenArray[3] + socialArray[3],
              kitchenArray[4] + socialArray[4], kitchenArray[5] + socialArray[5],
              kitchenArray[6] + socialArray[6], kitchenArray[7] + socialArray[7], kitchenArray[8] + socialArray[8],
              kitchenArray[9] + socialArray[9], kitchenArray[10] + socialArray[10]]
          },
          ]
          }
 
          var ctx = document.getElementById("individualHouseChart").getContext("2d");
 
          individualHouseChart = new Chart(ctx).Bar(data,{responsive: true, scaleFontSize: 24, tooltipFontSize: 24});
 
      }else if(requestedGraphType.localeCompare("Line") == 0 ){
            var lineChartData = {
            labels : ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8", "Week 9", "Week 10", "Week 11"],
            datasets : [
              {
                label: "My First dataset",
                fillColor : "rgba(220,220,220,0.2)",
                strokeColor : "#558C89",
                pointColor : "#558C89",
                pointStrokeColor : "#fff",
                pointHighlightFill : "#fff",
                pointHighlightStroke : "#74AFAD",
                data : [kitchenArray[0] + socialArray[0], kitchenArray[1] + socialArray[1],
                  kitchenArray[2] + socialArray[2], kitchenArray[3] + socialArray[3],
                  kitchenArray[4] + socialArray[4], kitchenArray[5] + socialArray[5],
                  kitchenArray[6] + socialArray[6], kitchenArray[7] + socialArray[7],
                  kitchenArray[8] + socialArray[8],kitchenArray[9] + socialArray[9],
                  kitchenArray[10] + socialArray[10]]
              }
            ]
 
          }
 
        var ctx = document.getElementById("individualHouseChart").getContext("2d");
        individualHouseChart = new Chart(ctx).Line(lineChartData, {
          responsive: true, scaleFontSize: 24, tooltipFontSize: 24
        });
 
      }
    }else if(requestedExpenseBreakdown.localeCompare("Kitchen") == 0){
      if(requestedGraphType.localeCompare("Pie") == 0 ){
                    var pieData = [
            {
              value: kitchenArray[0],
              color:"#964C0A",
              highlight: "#C3C3BF",
              label: "Kitchen Week 1"
            },
            {
              value: kitchenArray[1],
              color:"#BA671E",
              highlight: "#C3C3BF",
              label: "Kitchen Week 2"
            },
            {
              value: kitchenArray[2],
              color:"#D9853B",
              highlight: "#C3C3BF",
              label: "Kitchen Week 3"
            },
            {
              value: kitchenArray[3],
              color:"#F2A45E",
              highlight: "#C3C3BF",
              label: "Kitchen Week 4"
            },
            {
              value: kitchenArray[4],
              color:"#FFC008",
              highlight: "#C3C3BF",
              label: "Kitchen Week 5"
            },
            {
              value: kitchenArray[5],
              color:"#07545B",
              highlight: "#C3C3BF",
              label: "Kitchen Week 6"
            },
            {
              value: kitchenArray[6],
              color:"#136971",
              highlight: "#C3C3BF",
              label: "Kitchen Week 7"
            },
            {
              value: kitchenArray[7],
              color:"#257C84",
              highlight: "#C3C3BF",
              label: "Kitchen Week 8"
            },
            {
              value: kitchenArray[8],
              color:"#3B8C93",
              highlight: "#C3C3BF",
              label: "Kitchen Week 9"
            },
            {
              value: kitchenArray[9],
              color:"#5FA9B0",
              highlight: "#C3C3BF",
              label: "Kitchen Week 10"
            },
            {
              value: kitchenArray[10],
              color:"#00292D",
              highlight: "#C3C3BF",
              label: "Kitchen Week 11"
            }
            ];
 
            var ctx = document.getElementById("individualHouseChart").getContext("2d");
            individualHouseChart = new Chart(ctx).Pie(pieData,{responsive: true, scaleFontSize: 24, tooltipFontSize: 24});
 
 
      }else if(requestedGraphType.localeCompare("Bar") == 0 ){
        var data = {
          labels: ["Kitchen Week 1", "Kitchen Week 2", "Kitchen Week 3",
          "Kitchen Week 4", "Kitchen Week 5", "Kitchen Week 6", "Kitchen Week 7",
          "Kitchen Week 8", "Kitchen Week 9", "Kitchen Week 10", "Kitchen Week 11"],
          datasets: [
          {
              label: "Kitchen",
              fillColor: "#558C89",
              strokeColor: "rgba(220,220,220,0.8)",
              highlightFill: "#74AFAD",
              highlightStroke: "rgba(220,220,220,1)",
              data: [kitchenArray[0], kitchenArray[1],
              kitchenArray[2], kitchenArray[3],
              kitchenArray[4], kitchenArray[5],
              kitchenArray[6], kitchenArray[7], kitchenArray[8],
              kitchenArray[9], kitchenArray[10]]
          },
          ]
          }
 
          var ctx = document.getElementById("individualHouseChart").getContext("2d");
 
          individualHouseChart = new Chart(ctx).Bar(data,{responsive: true, scaleFontSize: 24, tooltipFontSize: 24});
 
 
      }else if(requestedGraphType.localeCompare("Line") == 0 ){
            var lineChartData = {
            labels : ["Kitchen Week 1", "Kitchen Week 2", "Kitchen Week 3",
                "Kitchen Week 4", "Kitchen Week 5", "Kitchen Week 6",
                "Kitchen Week 7", "Kitchen Week 8", "Kitchen Week 9",
                "Kitchen Week 10", "Kitchen Week 11"],
            datasets : [
              {
                label: "Kitchen",
                fillColor : "rgba(220,220,220,0.2)",
                strokeColor : "#558C89",
                pointColor : "#558C89",
                pointStrokeColor : "#fff",
                pointHighlightFill : "#fff",
                pointHighlightStroke : "#74AFAD",
                data : [kitchenArray[0], kitchenArray[1],
                  kitchenArray[2], kitchenArray[3],
                  kitchenArray[4], kitchenArray[5],
                  kitchenArray[6], kitchenArray[7],
                  kitchenArray[8],kitchenArray[9],
                  kitchenArray[10]]
              }
            ]
 
          }
 
        var ctx = document.getElementById("individualHouseChart").getContext("2d");
        individualHouseChart = new Chart(ctx).Line(lineChartData, {
          responsive: true, scaleFontSize: 24, tooltipFontSize: 24
        });
 
      }
    }else if(requestedExpenseBreakdown.localeCompare("Social") == 0){
      if(requestedGraphType.localeCompare("Pie") == 0 ){
                    var pieData = [
            {
              value: socialArray[0],
              color:"#964C0A",
              highlight: "#C3C3BF",
              label: "Social Week 1"
            },
            {
              value: socialArray[1],
              color:"#BA671E",
              highlight: "#C3C3BF",
              label: "Social Week 2"
            },
            {
              value:socialArray[2],
              color:"#D9853B",
              highlight: "#C3C3BF",
              label: "Social Week 3"
            },
            {
              value:socialArray[3],
              color:"#F2A45E",
              highlight: "#C3C3BF",
              label: "Social Week 4"
            },
            {
              value: socialArray[4],
              color:"#FFC008",
              highlight: "#C3C3BF",
              label: "Social Week 5"
            },
            {
              value:socialArray[5],
              color:"#07545B",
              highlight: "#C3C3BF",
              label: "Social Week 6"
            },
            {
              value: socialArray[6],
              color:"#136971",
              highlight: "#C3C3BF",
              label: "Social Week 7"
            },
            {
              value: socialArray[7],
              color:"#257C84",
              highlight: "#C3C3BF",
              label: "Social Week 8"
            },
            {
              value: socialArray[8],
              color:"#3B8C93",
              highlight: "#C3C3BF",
              label: "Social Week 9"
            },
            {
              value: socialArray[9],
              color:"#5FA9B0",
              highlight: "#C3C3BF",
              label: "Social Week 10"
            },
            {
              value: socialArray[10],
              color:"#00292D",
              highlight: "#C3C3BF",
              label: "Social Week 11"
            }
            ];
 
            var ctx = document.getElementById("individualHouseChart").getContext("2d");
            individualHouseChart = new Chart(ctx).Pie(pieData,{responsive: true, scaleFontSize: 24, tooltipFontSize: 24});
 
      }else if(requestedGraphType.localeCompare("Bar") == 0 ){
                  var data = {
          labels: ["Social Week 1", "Social Week 2",
          "Social Week 3", "Social Week 4", "Social Week 5",
          "Social Week 6", "Social Week 7", "Social Week 8",
          "Social Week 9", "Social Week 10", "Social Week 11"],
          datasets: [
          {
              label: "Social",
              fillColor: "#D9853B",
              strokeColor: "rgba(220,220,220,0.8)",
              highlightFill: "#F2A45E",
              highlightStroke: "rgba(220,220,220,1)",
              data: [socialArray[0], socialArray[1],
              socialArray[2], socialArray[3],
              socialArray[4], socialArray[5],
              socialArray[6], socialArray[7], socialArray[8],
              socialArray[9], socialArray[10]]
          },
          ]
          }
 
          var ctx = document.getElementById("individualHouseChart").getContext("2d");
 
          individualHouseChart = new Chart(ctx).Bar(data,{responsive: true, scaleFontSize: 24, tooltipFontSize: 24});
 
 
      }else if(requestedGraphType.localeCompare("Line") == 0 ){
            var lineChartData = {
            labels : ["Social Week 1", "Social Week 2", "Social Week 3",
            "Social Week 4", "Social Week 5", "Social Week 6", "Social Week 7",
            "Social Week 8", "Social Week 9", "Social Week 10", "Social Week 11"],
            datasets : [
              {
                label: "Social",
                fillColor : "rgba(220,220,220,0.2)",
                strokeColor : "#D9853B",
                pointColor : "#D9853B",
                pointStrokeColor : "#fff",
                pointHighlightFill : "#fff",
                pointHighlightStroke : "#F2A45E",
                data : [socialArray[0], socialArray[1],
                  socialArray[2], socialArray[3],
                  socialArray[4], socialArray[5],
                  socialArray[6], socialArray[7],
                  socialArray[8], socialArray[9],
                  socialArray[10]]
              }
            ]
 
          }
 
        var ctx = document.getElementById("individualHouseChart").getContext("2d");
        individualHouseChart = new Chart(ctx).Line(lineChartData, {
          responsive: true, scaleFontSize: 24, tooltipFontSize: 24
        });
 
      }
    }else if(requestedExpenseBreakdown.localeCompare("Both") == 0){
      if(requestedGraphType.localeCompare("Pie") == 0 ){
                            var pieData = [
            {
              value: socialArray[0],
              color:"#D9853B",
              highlight: "#F2A45E",
              label: "Social Week 1"
            },
            {
              value: socialArray[1],
              color:"#D9853B",
              highlight: "#F2A45E",
              label: "Social Week 2"
            },
            {
              value:socialArray[2],
              color:"#D9853B",
              highlight: "#F2A45E",
              label: "Social Week 3"
            },
            {
              value:socialArray[3],
              color:"#D9853B",
              highlight: "#F2A45E",
              label: "Social Week 4"
            },
            {
              value: socialArray[4],
              color:"#D9853B",
              highlight: "#F2A45E",
              label: "Social Week 5"
            },
            {
              value:socialArray[5],
              color:"#D9853B",
              highlight: "#F2A45E",
              label: "Social Week 6"
            },
            {
              value: socialArray[6],
              color:"#D9853B",
              highlight: "#F2A45E",
              label: "Social Week 7"
            },
            {
              value: socialArray[7],
              color:"#D9853B",
              highlight: "#F2A45E",
              label: "Social Week 8"
            },
            {
              value: socialArray[8],
              color:"#D9853B",
              highlight: "#F2A45E",
              label: "Social Week 9"
            },
            {
              value: socialArray[9],
              color:"#D9853B",
              highlight: "#F2A45E",
              label: "Social Week 10"
            },
            {
              value: socialArray[10],
              color:"#D9853B",
              highlight: "#F2A45E",
              label: "Social Week 11"
            },
            {
              value: kitchenArray[0],
              color:"#558C89",
              highlight: "#74AFAD",
              label: "Kitchen Week 1"
            },
            {
              value: kitchenArray[1],
              color:"#558C89",
              highlight: "#74AFAD",
              label: "Kitchen Week 2"
            },
            {
              value:kitchenArray[2],
              color:"#558C89",
              highlight: "#74AFAD",
              label: "Kitchen Week 3"
            },
            {
              value:kitchenArray[3],
              color:"#558C89",
              highlight: "#74AFAD",
              label: "Kitchen Week 4"
            },
            {
              value: kitchenArray[4],
              color:"#558C89",
              highlight: "#74AFAD",
              label: "Kitchen Week 5"
            },
            {
              value:kitchenArray[5],
              color:"#558C89",
              highlight: "#74AFAD",
              label: "Kitchen Week 6"
            },
            {
              value: kitchenArray[6],
              color:"#558C89",
              highlight: "#74AFAD",
              label: "Kitchen Week 7"
            },
            {
              value: kitchenArray[7],
              color:"#558C89",
              highlight: "#74AFAD",
              label: "Kitchen Week 8"
            },
            {
              value: kitchenArray[8],
              color:"#558C89",
              highlight: "#74AFAD",
              label: "Kitchen Week 9"
            },
            {
              value: kitchenArray[9],
              color:"#558C89",
              highlight: "#74AFAD",
              label: "Kitchen Week 10"
            },
            {
              value: kitchenArray[10],
              color:"#558C89",
              highlight: "#74AFAD",
              label: "Kitchen Week 11"
            }
            ];
 
            var ctx = document.getElementById("individualHouseChart").getContext("2d");
            individualHouseChart = new Chart(ctx).Pie(pieData,{responsive: true, scaleFontSize: 24, tooltipFontSize: 24});
 
 
      }else if(requestedGraphType.localeCompare("Bar") == 0 ){
                          var data = {
          labels: ["Week 1", "Week 2",
          "Week 3", "Week 4", "Week 5",
          "Week 6", "Week 7", "Week 8",
          "Week 9", "Week 10", "Week 11"],
          datasets: [
          {
              label: "Social",
              fillColor: "#D9853B",
              strokeColor: "rgba(220,220,220,0.8)",
              highlightFill: "#F2A45E",
              highlightStroke: "rgba(220,220,220,1)",
              data: [socialArray[0], socialArray[1],
              socialArray[2], socialArray[3],
              socialArray[4], socialArray[5],
              socialArray[6], socialArray[7], socialArray[8],
              socialArray[9], socialArray[10]]
          },
          {
              label: "Kitchen",
              fillColor: "#558C89",
              strokeColor: "rgba(220,220,220,0.8)",
              highlightFill: "rgba(220,220,220,0.75)",
              highlightStroke: "#74AFAD",
              data: [kitchenArray[0], kitchenArray[1],
              kitchenArray[2], kitchenArray[3],
              kitchenArray[4], kitchenArray[5],
              kitchenArray[6], kitchenArray[7], kitchenArray[8],
              kitchenArray[9], kitchenArray[10]]
          },
          ]
          }
 
          var ctx = document.getElementById("individualHouseChart").getContext("2d");
 
          individualHouseChart = new Chart(ctx).Bar(data,{responsive: true, scaleFontSize: 24, tooltipFontSize: 24});
 
 
      }else if(requestedGraphType.localeCompare("Line") == 0 ){
            var lineChartData = {
            labels : ["Week 1", "Week 2", "Week 3",
            "Week 4", "Week 5", "Week 6", "Week 7",
            "Week 8", "Week 9", "Week 10", "Week 11"],
            datasets : [
              {
                label: "Social",
                fillColor : "rgba(220,220,220,0.2)",
                strokeColor : "#D9853B",
                pointColor : "#D9853B",
                pointStrokeColor : "#fff",
                pointHighlightFill : "#fff",
                pointHighlightStroke : "#F2A45E",
                data : [socialArray[0], socialArray[1],
                  socialArray[2], socialArray[3],
                  socialArray[4], socialArray[5],
                  socialArray[6], socialArray[7],
                  socialArray[8], socialArray[9],
                  socialArray[10]]
              },
              {
                label: "Kitchen",
                fillColor : "rgba(220,220,220,0.2)",
                strokeColor : "#558C89",
                pointColor : "#558C89",
                pointStrokeColor : "#fff",
                pointHighlightFill : "#fff",
                pointHighlightStroke : "#74AFAD",
                data : [kitchenArray[0], kitchenArray[1],
                  kitchenArray[2], kitchenArray[3],
                  kitchenArray[4], kitchenArray[5],
                  kitchenArray[6], kitchenArray[7],
                  kitchenArray[8], kitchenArray[9],
                  kitchenArray[10]]
              }
            ]
 
          }
 
        var ctx = document.getElementById("individualHouseChart").getContext("2d");
        individualHouseChart = new Chart(ctx).Line(lineChartData, {
          responsive: true
        });
      }
    }
  }
});
 
Template.body.events({
  "submit .compare-house-type-request": function (event) {
    if(compareHouseChart != null){
      compareHouseChart.destroy();
    }
    //Obtaining request types from user
    var thisHouse1 = document.getElementById("theChosenOne");
    var desiredHouse1 = thisHouse1.options[thisHouse1.selectedIndex].value;
    if (desiredHouse1=="House 1"){
      confirm("please specify the first house name");
    }
    var thisHouse2 = document.getElementById("theChosenTwo");
    var desiredHouse2 = thisHouse2.options[thisHouse2.selectedIndex].value;
    if (desiredHouse2=="House 2"){
      confirm("please specify the second house name");
    }
    var desiredExpense1 = document.getElementById("theExpenseType");
    var requestedExpenseBreakdown1 = desiredExpense1.options[desiredExpense1.selectedIndex].value;
    if (requestedExpenseBreakdown1=="Expense Type"){
      confirm("please specify the expense type");
    }
    var currDesiredQuarter1 = document.getElementById("theChosenQuarter");
    var requestedQuarter1 = currDesiredQuarter1.options[currDesiredQuarter1.selectedIndex].value;
    if (requestedQuarter1=="Quarter"){
      confirm("please specify the quarter");
    }
    var currDesiredGraph1 = document.getElementById("theChosenGraphType");
    var requestedGraphType1 = currDesiredGraph1.options[currDesiredGraph1.selectedIndex].value;
    if (requestedGraphType1=="Graph Type"){
      confirm("please specify the graph type");
    }
    event.preventDefault();
        event.preventDefault();
    //Querying database for items
    var kitchenArrayHouse1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var socialArrayHouse1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var kitchenArrayHouse2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var socialArrayHouse2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (currWeek = 1; currWeek < kitchenArrayHouse1.length+1; currWeek++){
      query = db.find({
            "HouseName": desiredHouse1,
            "Quarter": requestedQuarter1,
            "Week" : currWeek
      }).fetch();
      var denominator = query.length;
 
      //Calculating social/kitchen totals
      for (var i = 0; i < query.length; i++) {
 
        console.log(query[i])
 
        kitchenArrayHouse1[currWeek-1] += query[i].KitchenExpense;
        socialArrayHouse1[currWeek-1] += query[i].SocialExpense;
      }
      kitchenArrayHouse1[currWeek-1] = Math.round(kitchenArrayHouse1[currWeek-1]*100)/100
      socialArrayHouse1[currWeek-1] = Math.round(socialArrayHouse1[currWeek-1]*100)/100
    }
    for (currWeek = 1; currWeek < kitchenArrayHouse2.length+1; currWeek++){
      query = db.find({
            "HouseName": desiredHouse2,
            "Quarter": requestedQuarter1,
            "Week" : currWeek
      }).fetch();
      var denominator = query.length;
 
      //Calculating social/kitchen totals
      for (var i = 0; i < query.length; i++) {
 
        console.log(query[i])
 
        kitchenArrayHouse2[currWeek-1] += query[i].KitchenExpense;
        socialArrayHouse2[currWeek-1] += query[i].SocialExpense;
      }
      kitchenArrayHouse2[currWeek-1] = Math.round(kitchenArrayHouse2[currWeek-1]*100)/100
      socialArrayHouse2[currWeek-1] = Math.round(socialArrayHouse2[currWeek-1]*100)/100
    }
    console.log(kitchenArrayHouse1);
    console.log(kitchenArrayHouse2);
    console.log(socialArrayHouse1);
    console.log(socialArrayHouse2);
    //If the requested Expense is Total
    if(requestedExpenseBreakdown1.localeCompare("Overall") == 0 ){
      if(requestedGraphType1.localeCompare("Pie") == 0 ){
            var pieData = [
            {
              value: kitchenArrayHouse2[0] + socialArrayHouse2[0] +
              kitchenArrayHouse2[1] + socialArrayHouse2[1] +
              kitchenArrayHouse2[2] + socialArrayHouse2[2] +
              kitchenArrayHouse2[3] + socialArrayHouse2[3] +
              kitchenArrayHouse2[4] + socialArrayHouse2[4] +
              kitchenArrayHouse2[5] + socialArrayHouse2[5] +
              kitchenArrayHouse2[6] + socialArrayHouse2[6] +
              kitchenArrayHouse2[7] + socialArrayHouse2[7] +
              kitchenArrayHouse2[8] + socialArrayHouse2[8] +
              kitchenArrayHouse2[9] + socialArrayHouse2[9] +
              kitchenArrayHouse2[10] + socialArrayHouse2[10],
              color:"#558C89",
              highlight: "#74AFAD",
              label: desiredHouse2
            },
            {
              value: kitchenArrayHouse1[0] + socialArrayHouse1[0] +
              kitchenArrayHouse1[1] + socialArrayHouse1[1] +
              kitchenArrayHouse1[2] + socialArrayHouse1[2] +
              kitchenArrayHouse1[3] + socialArrayHouse1[3] +
              kitchenArrayHouse1[4] + socialArrayHouse1[4] +
              kitchenArrayHouse1[5] + socialArrayHouse1[5] +
              kitchenArrayHouse1[6] + socialArrayHouse1[6] +
              kitchenArrayHouse1[7] + socialArrayHouse1[7] +
              kitchenArrayHouse1[8] + socialArrayHouse1[8] +
              kitchenArrayHouse1[9] + socialArrayHouse1[9] +
              kitchenArrayHouse1[10] + socialArrayHouse1[10],
              color: "#D9853B",
              highlight: "#F2A45E",
              label: desiredHouse1
            },
            ];
 
            var ctx = document.getElementById("compareHouseChart").getContext("2d");
            compareHouseChart = new Chart(ctx).Pie(pieData,{responsive: true, scaleFontSize: 24, tooltipFontSize: 24});
 
      }else if(requestedGraphType1.localeCompare("Bar") == 0 ){
          var data = {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8", "Week 9", "Week 10", "Week 11"],
          datasets: [
          {
              label: desiredHouse1,
              fillColor: "#558C89",
              strokeColor: "rgba(220,220,220,0.8)",
              highlightFill: "#74AFAD",
              highlightStroke: "rgba(220,220,220,1)",
              data: [kitchenArrayHouse1[0] + socialArrayHouse1[0], kitchenArrayHouse1[1] + socialArrayHouse1[1],
              kitchenArrayHouse1[2] + socialArrayHouse1[2], kitchenArrayHouse1[3] + socialArrayHouse1[3],
              kitchenArrayHouse1[4] + socialArrayHouse1[4], kitchenArrayHouse1[5] + socialArrayHouse1[5],
              kitchenArrayHouse1[6] + socialArrayHouse1[6], kitchenArrayHouse1[7] + socialArrayHouse1[7], kitchenArrayHouse1[8] + socialArrayHouse1[8],
              kitchenArrayHouse1[9] + socialArrayHouse1[9], kitchenArrayHouse1[10] + socialArrayHouse1[10]]
          },
          {
              label: desiredHouse2,
              fillColor: "#D9853B",
              strokeColor: "rgba(220,220,220,0.8)",
              highlightFill:  "#F2A45E",
              highlightStroke: "rgba(220,220,220,1)",
              data: [kitchenArrayHouse2[0] + socialArrayHouse2[0], kitchenArrayHouse2[1] + socialArrayHouse2[1],
              kitchenArrayHouse2[2] + socialArrayHouse2[2], kitchenArrayHouse2[3] + socialArrayHouse2[3],
              kitchenArrayHouse2[4] + socialArrayHouse2[4], kitchenArrayHouse2[5] + socialArrayHouse2[5],
              kitchenArrayHouse2[6] + socialArrayHouse2[6], kitchenArrayHouse2[7] + socialArrayHouse2[7], kitchenArrayHouse2[8] + socialArrayHouse1[8],
              kitchenArrayHouse2[9] + socialArrayHouse2[9], kitchenArrayHouse2[10] + socialArrayHouse2[10]]
          }
          ]
          }
 
          var ctx = document.getElementById("compareHouseChart").getContext("2d");
 
          compareHouseChart = new Chart(ctx).Bar(data,{responsive: true, scaleFontSize: 24, tooltipFontSize: 24 });
 
      }else if(requestedGraphType1.localeCompare("Line") == 0 ){
            var lineChartData = {
            labels : ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8", "Week 9", "Week 10", "Week 11"],
            datasets : [
              {
                label: desiredHouse1,
                fillColor : "rgba(220,220,220,0.2)",
                strokeColor : "#558C89",
                pointColor : "#558C89",
                pointStrokeColor : "#fff",
                pointHighlightFill : "#fff",
                pointHighlightStroke : "#74AFAD",
                data : [kitchenArrayHouse1[0] + socialArrayHouse1[0], kitchenArrayHouse1[1] + socialArrayHouse1[1],
                  kitchenArrayHouse1[2] + socialArrayHouse1[2], kitchenArrayHouse1[3] + socialArrayHouse1[3],
                  kitchenArrayHouse1[4] + socialArrayHouse1[4], kitchenArrayHouse1[5] + socialArrayHouse1[5],
                  kitchenArrayHouse1[6] + socialArrayHouse1[6], kitchenArrayHouse1[7] + socialArrayHouse1[7],
                  kitchenArrayHouse1[8] + socialArrayHouse1[8],kitchenArrayHouse1[9] + socialArrayHouse1[9],
                  kitchenArrayHouse1[10] + socialArrayHouse1[10]]
              },
              {
                label: desiredHouse2,
                fillColor : "rgba(220,220,220,0.2)",
                strokeColor : "#D9853B",
                pointColor : "#D9853B",
                pointStrokeColor : "#fff",
                pointHighlightFill : "#fff",
                pointHighlightStroke : "#F2A45E",
                data : [kitchenArrayHouse2[0] + socialArrayHouse2[0], kitchenArrayHouse2[1] + socialArrayHouse2[1],
                  kitchenArrayHouse2[2] + socialArrayHouse2[2], kitchenArrayHouse2[3] + socialArrayHouse2[3],
                  kitchenArrayHouse2[4] + socialArrayHouse2[4], kitchenArrayHouse2[5] + socialArrayHouse2[5],
                  kitchenArrayHouse2[6] + socialArrayHouse2[6], kitchenArrayHouse2[7] + socialArrayHouse2[7],
                  kitchenArrayHouse2[8] + socialArrayHouse2[8],kitchenArrayHouse2[9] + socialArrayHouse2[9],
                  kitchenArrayHouse2[10] + socialArrayHouse2[10]]
              },
            ]
 
          }
 
        var ctx = document.getElementById("compareHouseChart").getContext("2d");
        compareHouseChart = new Chart(ctx).Line(lineChartData, {
          responsive: true, scaleFontSize: 24, tooltipFontSize: 24
        });
 
      }
    }else if(requestedExpenseBreakdown1.localeCompare("Kitchen") == 0){
      if(requestedGraphType1.localeCompare("Pie") == 0 ){
            var pieData = [
            {
              value: kitchenArrayHouse2[0]+
              kitchenArrayHouse2[1]+
              kitchenArrayHouse2[2]+
              kitchenArrayHouse2[3]+
              kitchenArrayHouse2[4]+
              kitchenArrayHouse2[5]+
              kitchenArrayHouse2[6]+
              kitchenArrayHouse2[7]+
              kitchenArrayHouse2[8]+
              kitchenArrayHouse2[9]+
              kitchenArrayHouse2[10],
              color:"#558C89",
              highlight: "#74AFAD",
              label: desiredHouse2
            },
            {
              value: kitchenArrayHouse1[0] +
              kitchenArrayHouse1[1]+
              kitchenArrayHouse1[2]+
              kitchenArrayHouse1[3]+
              kitchenArrayHouse1[4]+
              kitchenArrayHouse1[5]+
              kitchenArrayHouse1[6]+
              kitchenArrayHouse1[7]+
              kitchenArrayHouse1[8]+
              kitchenArrayHouse1[9]+
              kitchenArrayHouse1[10],
              color:"#D9853B",
              highlight: "#F2A45E",
              label: desiredHouse1
            },
            ];
 
            var ctx = document.getElementById("compareHouseChart").getContext("2d");
            compareHouseChart = new Chart(ctx).Pie(pieData,{responsive: true, scaleFontSize: 24, tooltipFontSize: 24});
 
 
      }else if(requestedGraphType1.localeCompare("Bar") == 0 ){
          var data = {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8", "Week 9", "Week 10", "Week 11"],
          datasets: [
          {
              label: desiredHouse1,
              fillColor: "#558C89",
              strokeColor: "rgba(220,220,220,0.8)",
              highlightFill: "#74AFAD",
              highlightStroke: "rgba(220,220,220,1)",
              data: [kitchenArrayHouse1[0], kitchenArrayHouse1[1],
              kitchenArrayHouse1[2], kitchenArrayHouse1[3],
              kitchenArrayHouse1[4], kitchenArrayHouse1[5],
              kitchenArrayHouse1[6], kitchenArrayHouse1[7], kitchenArrayHouse1[8],
              kitchenArrayHouse1[9], kitchenArrayHouse1[10]]
          },
          {
              label: desiredHouse2,
              fillColor: "#D9853B",
              strokeColor: "rgba(220,220,220,0.8)",
              highlightFill: "#F2A45E",
              highlightStroke: "rgba(220,220,220,1)",
              data: [kitchenArrayHouse2[0], kitchenArrayHouse2[1],
              kitchenArrayHouse2[2], kitchenArrayHouse2[3] ,
              kitchenArrayHouse2[4], kitchenArrayHouse2[5],
              kitchenArrayHouse2[6], kitchenArrayHouse2[7] , kitchenArrayHouse2[8],
              kitchenArrayHouse2[9], kitchenArrayHouse2[10]]
          }
          ]
          }
 
          var ctx = document.getElementById("compareHouseChart").getContext("2d");
 
          compareHouseChart = new Chart(ctx).Bar(data,{responsive: true, scaleFontSize: 24, tooltipFontSize: 24});
 
      }else if(requestedGraphType1.localeCompare("Line") == 0 ){
            var lineChartData = {
            labels : ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8", "Week 9", "Week 10", "Week 11"],
            datasets : [
              {
                label: desiredHouse1,
                fillColor : "rgba(220,220,220,0.2)",
                strokeColor : "#558C89",
                pointColor : "#558C89",
                pointStrokeColor : "#fff",
                pointHighlightFill : "#fff",
                pointHighlightStroke : "#74AFAD",
                data : [kitchenArrayHouse1[0], kitchenArrayHouse1[1],
              kitchenArrayHouse1[2], kitchenArrayHouse1[3],
              kitchenArrayHouse1[4], kitchenArrayHouse1[5],
              kitchenArrayHouse1[6], kitchenArrayHouse1[7], kitchenArrayHouse1[8],
              kitchenArrayHouse1[9], kitchenArrayHouse1[10]]
              },
              {
                label: desiredHouse2,
                fillColor : "rgba(220,220,220,0.2)",
                strokeColor : "#D9853B",
                pointColor : "#D9853B",
                pointStrokeColor : "#fff",
                pointHighlightFill : "#fff",
                pointHighlightStroke : "#F2A45E",
                data : [kitchenArrayHouse2[0], kitchenArrayHouse2[1],
              kitchenArrayHouse2[2], kitchenArrayHouse2[3] ,
              kitchenArrayHouse2[4], kitchenArrayHouse2[5],
              kitchenArrayHouse2[6], kitchenArrayHouse2[7] , kitchenArrayHouse2[8],
              kitchenArrayHouse2[9], kitchenArrayHouse2[10]]
              },
            ]
 
          }
 
        var ctx = document.getElementById("compareHouseChart").getContext("2d");
        compareHouseChart = new Chart(ctx).Line(lineChartData, {
          responsive: true, scaleFontSize: 24, tooltipFontSize: 24
        });
 
      }
    }else if(requestedExpenseBreakdown1.localeCompare("Social") == 0){
      if(requestedGraphType1.localeCompare("Pie") == 0 ){
            var pieData = [
            {
              value: socialArrayHouse2[0]+
              socialArrayHouse2[1]+
              socialArrayHouse2[2]+
              socialArrayHouse2[3]+
              socialArrayHouse2[4]+
              socialArrayHouse2[5]+
              socialArrayHouse2[6]+
              socialArrayHouse2[7]+
              socialArrayHouse2[8]+
              socialArrayHouse2[9]+
              socialArrayHouse2[10],
              color:"#558C89",
              highlight: "#74AFAD",
              label: desiredHouse2
            },
            {
              value: kitchenArrayHouse1[0] +
              socialArrayHouse1[1]+
              socialArrayHouse1[2]+
              socialArrayHouse1[3]+
              socialArrayHouse1[4]+
              socialArrayHouse1[5]+
              socialArrayHouse1[6]+
              socialArrayHouse1[7]+
              socialArrayHouse1[8]+
              socialArrayHouse1[9]+
              socialArrayHouse1[10],
              color:"#D9853B",
              highlight: "#F2A45E",
              label: desiredHouse1
            },
            ];
 
            var ctx = document.getElementById("compareHouseChart").getContext("2d");
            compareHouseChart = new Chart(ctx).Pie(pieData,{responsive: true, scaleFontSize: 24, tooltipFontSize: 24});
 
      }else if(requestedGraphType1.localeCompare("Bar") == 0 ){
          var data = {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8", "Week 9", "Week 10", "Week 11"],
          datasets: [
          {
              label: desiredHouse1,
              fillColor: "#558C89",
              strokeColor: "rgba(220,220,220,0.8)",
              highlightFill: "#74AFAD",
              highlightStroke: "rgba(220,220,220,1)",
              data: [socialArrayHouse1[0], socialArrayHouse1[1],
              socialArrayHouse1[2], socialArrayHouse1[3],
              socialArrayHouse1[4], socialArrayHouse1[5],
              socialArrayHouse1[6], socialArrayHouse1[7], socialArrayHouse1[8],
              socialArrayHouse1[9], socialArrayHouse1[10]]
          },
          {
              label: desiredHouse2,
              fillColor: "#D9853B",
              strokeColor: "rgba(220,220,220,0.8)",
              highlightFill: "#F2A45E",
              highlightStroke: "rgba(220,220,220,1)",
              data: [socialArrayHouse2[0], socialArrayHouse2[1],
              socialArrayHouse2[2], socialArrayHouse2[3] ,
              socialArrayHouse2[4], socialArrayHouse2[5],
              socialArrayHouse2[6], socialArrayHouse2[7] , kitchenArrayHouse2[8],
              socialArrayHouse2[9], socialArrayHouse2[10]]
          }
          ]
          }
 
          var ctx = document.getElementById("compareHouseChart").getContext("2d");
 
          compareHouseChart = new Chart(ctx).Bar(data,{responsive: true, scaleFontSize: 24, tooltipFontSize: 24});
 
      }else if(requestedGraphType1.localeCompare("Line") == 0 ){
            var lineChartData = {
            labels : ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8", "Week 9", "Week 10", "Week 11"],
            datasets : [
              {
                label: desiredHouse1,
                fillColor : "rgba(220,220,220,0.2)",
                strokeColor : "#558C89",
                pointColor : "#558C89",
                pointStrokeColor : "#fff",
                pointHighlightFill : "#fff",
                pointHighlightStroke : "#74AFAD",
                data : [socialArrayHouse1[0], socialArrayHouse1[1],
              socialArrayHouse1[2], socialArrayHouse1[3],
              socialArrayHouse1[4], socialArrayHouse1[5],
              socialArrayHouse1[6], socialArrayHouse1[7], socialArrayHouse1[8],
              socialArrayHouse1[9], socialArrayHouse1[10]]
              },
              {
                label: desiredHouse2,
                fillColor : "rgba(220,220,220,0.2)",
                strokeColor : "#D9853B",
                pointColor : "#D9853B",
                pointStrokeColor : "#fff",
                pointHighlightFill : "#fff",
                pointHighlightStroke : "#F2A45E",
                data : [socialArrayHouse2[0], socialArrayHouse2[1],
              socialArrayHouse2[2], socialArrayHouse2[3] ,
              socialArrayHouse2[4], socialArrayHouse2[5],
              socialArrayHouse2[6], socialArrayHouse2[7] , socialArrayHouse2[8],
              socialArrayHouse2[9], socialArrayHouse2[10]]
              },
            ]
 
          }
 
        var ctx = document.getElementById("compareHouseChart").getContext("2d");
        compareHouseChart = new Chart(ctx).Line(lineChartData, {
          responsive: true, scaleFontSize: 24, tooltipFontSize: 24
        });
      }
    }
    }
});
 
}
