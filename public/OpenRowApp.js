db = new Mongo.Collection("database");
 
if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    tasks: function () {
      return db.find({});
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
        event.target.text.value = "";
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
        event.target.text.value = "";
        // return entry

      }
    });

// var data = {
//       labels: ["January", "February", "March", "April", "May", "June", "July"],
//       datasets: [
//           {
//               label: "My First dataset",
//               fillColor: "rgba(220,220,220,0.5)",
//               strokeColor: "rgba(220,220,220,0.8)",
//               highlightFill: "rgba(220,220,220,0.75)",
//               highlightStroke: "rgba(220,220,220,1)",
//               data: [65, 59, 80, 81, 56, 55, 40]
//           },
//           {
//               label: "My Second dataset",
//               fillColor: "rgba(151,187,205,0.5)",
//               strokeColor: "rgba(151,187,205,0.8)",
//               highlightFill: "rgba(151,187,205,0.75)",
//               highlightStroke: "rgba(151,187,205,1)",
//               data: [28, 48, 40, 19, 86, 27, 90]
//           }
//       ]
//     }



house_name = ""
Template.body.events({
  "submit .house-name": function (event) {
    house_name = event.target.text.value;
    event.preventDefault();
    event.target.text.value = "";
  }
});


weeks = 0
Template.body.events({
  "submit .week": function (event) {
    var text = event.target.text.value;
    weeks = parseInt(text)
    event.preventDefault();
    event.target.text.value = "";
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

    new Chart(ctx).Bar(data);

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
    var currHouse = document.getElementById("desiredHouseAverage");
    var house_average = currHouse.options[currHouse.selectedIndex].value;
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
    kitchen = kitchen / denominator;
    social = social/ denominator;

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

    var ctx = document.getElementById("averageChart").getContext("2d");

    new Chart(ctx).Bar(data);

  }
});

}




