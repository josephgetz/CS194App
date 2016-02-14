

var Parse = require('parse-cloud-express').Parse;
Parse.intialize("sBDcY6elVaGx4EHc9HYPNnCry7XOMdjuntIDztLD", "uvRMOCQbETWKK4wIjJTBQMWAoAv9oKMwPkIZzkiw");


Parse.Cloud.define("hello", function(request, response) {
  console.log('Ran cloud function.');
  // As with Parse-hosted Cloud Code, the user is available at: request.user
  // You can get the users session token with: request.user.getSessionToken()
  // Use the session token to run other Parse Query methods as that user, because
  //   the concept of a 'current' user does not fit in a Node environment.
  //   i.e.  query.find({ sessionToken: request.user.getSessionToken() })...
  response.success("Hello world! " + (request.params.a + request.params.b));
});


/*This function will return the total spending amount across all houses (returns as a num)*/
Parse.Cloud.define("findTotalSpending", function(request, response){
  console.log('Got here');
  var query = new Parse.Query("Transactions");
  query.find({
    success: function(results) {
      var sum = 0;
      for (var i = 0; i < results.length; ++i) {
        sum += results[i].get("SocialExpense");
        sum += results[i].get("KitchenExpense");
      }
      response.success(sum);
    },
    error: function() {
      response.error("House not found");
    }
  });
});

/*This function will return the total Social spending amount across all houses (returns as a num)*/
Parse.Cloud.define("findTotalSocialSpending", function(request, response){
  var query = new Parse.Query("Transactions");
  query.greaterThan("0.00", "SocialExpense");
  query.find({
    success: function(results) {
      var sum = 0;
      for (var i = 0; i < results.length; ++i) {
        sum += results[i].get("SocialExpense");
      }
      response.success(sum);
    },
    error: function() {
      response.error("House not found");
    }
  });
});

/*This function will return the total Kitchen spending across all houses (returns as a num)*/
Parse.Cloud.define("findTotalKitchenSpending", function(request, response){
  var query = new Parse.Query("Transactions");
  query.greaterThan("0.00", "KitchenExpense");
  query.find({
    success: function(results) {
      var sum = 0;
      for (var i = 0; i < results.length; ++i) {
        sum += results[i].get("KitchenExpense");
      }
      response.success(sum);
    },
    error: function() {
      response.error("House or Expense Type not found");
    }
  });
});

/*This function will return the total house spending amount (returns as a num)*/
Parse.Cloud.define("findHouseTotalSpending", function(request, response){
  var query = new Parse.Query("Transactions");
  query.equalTo("House", request.params.house);
  query.find({
    success: function(results) {
      var sum = 0;
      for (var i = 0; i < results.length; ++i) {
        sum += results[i].get("KitchenExpense");
        sum += results[i].get("SocialExpense");
      }
      response.success(sum);
    },
    error: function() {
      response.error("House not found");
    }
  });
});


/*This function will return the total house Social spending (returns as a num)*/
Parse.Cloud.define("findHouseTotalSocialSpending", function(request, response){
  var query = new Parse.Query("Transactions");
  query.equalTo("House", request.params.house);
  query.greaterThan("0.00", "SocialExpense");
  query.find({
    success: function(results) {
      var sum = 0;
      for (var i = 0; i < results.length; ++i) {
        sum += results[i].get("SocialExpense");
      }
      response.success(sum);
    },
    error: function() {
      response.error("House not found");
    }
  });
});

/*This function will return the total house Kitchen spending (returns as a num)*/
Parse.Cloud.define("findHouseTotalKitchenSpending", function(request, response){
  var query = new Parse.Query("Transactions");
  query.equalTo("House", request.params.house);
  query.contains("0.00", "KitchenExpense");
  query.find({
    success: function(results) {
      var sum = 0;
      for (var i = 0; i < results.length; ++i) {
        sum += results[i].get("KitchenExpense");
      }
      response.success(sum);
    },
    error: function() {
      response.error("House or Expense Type not found");
    }
  });
});

/*This function will return the house's week spending (takes in house name/week number/quarter, returns as a num)*/
Parse.Cloud.define("findHouseWeekSpending", function(request, response){
  var query = new Parse.Query("Transactions");
  query.contains("House", request.params.house);
  query.contains("Quarter", request.params.quarter);
  query.equalTo("Week_Number", request.params.week);
  query.find({
    success: function(results) {
      var sum = 0;
      for (var i = 0; i < results.length; ++i) {
        sum += results[i].get("SocialExpense");
        sum += results[i].get("KitchenExpense");
      }
      response.success(sum);
    },
    error: function() {
      response.error("House or Expense Type not found");
    }
  });
});

/*This function will return the total house Kitchen spending (returns as a num)*/
Parse.Cloud.define("findHouseWeeklyKitchenSpending", function(request, response){
  var query = new Parse.Query("Transactions");
  query.contains("House", request.params.house);
  query.contains("Quarter", request.params.quarter);
  query.equalTo("Week_Number", request.params.week);
  query.greaterThan("0.00", "KitchenExpense");
  query.find({
    success: function(results) {
      var sum = 0;
      for (var i = 0; i < results.length; ++i) {
        sum += results[i].get("KitchenExpense");
      }
      response.success(sum);
    },
    error: function() {
      response.error("House or Expense Type not found");
    }
  });
});

/*This function will return the total house Kitchen spending (returns as a num)*/
Parse.Cloud.define("findHouseWeeklySocialSpending", function(request, response){
  var query = new Parse.Query("Transactions");
  query.contains("House", request.params.house);
  query.contains("Quarter", request.params.quarter);
  query.equalTo("Week_Number", request.params.week);
  query.greaterThan("0.00", "SocialExpense");
  query.find({
    success: function(results) {
      var sum = 0;
      for (var i = 0; i < results.length; ++i) {
        sum += results[i].get("SocialExpense");
      }
      response.success(sum);
    },
    error: function() {
      response.error("House or Expense Type not found");
    }
  });
});

/*This function will return the number of payments made*/
Parse.Cloud.define("findHouseTotalPayments", function(request, response){
  var query = new Parse.Query("Transactions");
  query.equalTo("House", request.params.house);
  query.find({
    success: function(results) {
      response.success(results.length);
    },
    error: function() {
      response.error("House not found");
    }
  });
});
/*
Parse.Cloud.beforeSave('TestObject', function(request, response) {
  console.log('Ran beforeSave on objectId: ' + request.object.id);
  response.success();
});

Parse.Cloud.afterSave('TestObject', function(request, response) {
  console.log('Ran afterSave on objectId: ' + request.object.id);
});

Parse.Cloud.beforeDelete('TestObject', function(request, response) {
  console.log('Ran beforeDelete on objectId: ' + request.object.id);
  response.success();
});

Parse.Cloud.afterDelete('TestObject', function(request, response) {
  console.log('Ran afterDelete on objectId: ' + request.object.id);
});*/

