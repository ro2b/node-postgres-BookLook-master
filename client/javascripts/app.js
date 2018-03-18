angular.module('nodeBookLook', [])
.controller('mainController', ($scope, $http) => {
  $scope.formData = {};
  $scope.BookLookData = {};
  // Get all BookLooks
  $http.get('/api/v1/BookLooks')
  .success((data) => {
    $scope.BookLookData = data;
    console.log(data);
  })
  .error((error) => {
    console.log('Error: ' + error);
  });

  function fixdate(mydate){
    if (mydate){
      mydate = new Date(mydate);
    }
    return mydate
  }

  $scope.lookupinventory = () => {
    var mybarcode = $scope.formData.barcode;

    console.log("lookin' up a barcode; " + $scope.formData.barcode);
    $http.post('/api/v1/lookupinventory', $scope.formData)
    .success((data) => {
      if (data.length<1){
        alert ("no record");
        $scope.formData = {};
      }

      console.log(data);
      //fix the stupid dates...effin computers!!!
      var acquired = fixdate(data[0].date_acquired);
      var sold = fixdate(data[0].date_sold);
      var removed = fixdate(data[0].date_removed);
      //filledformstuff = JSON.parse(data)
      $scope.formData = {};
      $scope.formData = {isbn: data[0].isbn, title: data[0].title, author: data[0].author, description: data[0].description, comments: data[0].comments, categories: data[0].categories, date_acquired: acquired, date_sold: sold, original_price: data[0].original_price,sold_price: data[0].sold_price,date_removed: removed, status: data[0].status, barcode: data[0].barcode,genre: data[0].genre, keywords: data[0].keywords};
      //$scope.BookLookData = data;
    })
    .error((error) => {
      alert("that barcode is not in inventory")
      console.log('Error: ' + error);
    });
  };
  // Lookup an isbn on the internet
  $scope.lookupisbn = () => {
    var myisbn = $scope.formData.isbn;
    console.log("lookin' up an isbn; " + $scope.formData.isbn);
    $http.post('/api/v1/lookupisbn', $scope.formData)
    .success((data) => {
      console.log(data);
      var note = "Published Date: " + data.publishedDate + " Subtitle: "+data.subtitle;
      var mydate = new Date();
      //filledformstuff = JSON.parse(data)
      $scope.formData = {isbn: myisbn, title: data.title, author: data.authors,date_acquired: mydate, description: data.description, comments: note,keywords: data.categories};
      //$scope.BookLookData = data;
    })
    .error((error) => {
      alert('Book not found for ISBN ' + myisbn);
      console.log('Error: ' + error);
    });
  };
  // Create a new record
  $scope.createBookLook = () => {
    console.log($scope.formData);
    $http.post('/api/v1/BookLooks', $scope.formData)
    .success((data) => {
      $scope.formData = {};
      $scope.BookLookData = data;
      console.log(data);
    })
    .error((error) => {
      console.log('Error: ' + error);
    });
  };

  // update a record
  $scope.updateBookLook = () => {
    $http.post('/api/v1/updateBookLook/', $scope.formData)
    .success((data) => {
      $scope.BookLookData = data;
      console.log(data);
    })
    .error((data) => {
      console.log('Error: ' + data);
    });
  };


  // Delete a record
  $scope.deleteBookLook = (BookLookID) => {
    $http.delete('/api/v1/BookLooks/' + BookLookID)
    .success((data) => {
      $scope.BookLookData = data;
      console.log(data);
    })
    .error((data) => {
      console.log('Error: ' + data);
    });
  };
//monday 3-5-18 just copied this in so it don't work yet!!
  $scope.getdropdowndata = (mycategory) => {

    //var mybarcode = $scope.formData.barcode;
    //console.log("lookin' up a barcode; " + $scope.formData.barcode);
    $http.post('/api/v1/getdropdowndata', 'genre')
    .success((data) => {
      if (data.length<1){
        alert ("no record");
        $scope.formData = {};
      }

      console.log(data[0]);

      //filledformstuff = JSON.parse(data)
      //$scope.formData = {};
      //$scope.formData = {isbn: data[0].isbn, title: data[0].title, author: data[0].author, description: data[0].description, comments: data[0].comments, categories: data[0].categories, date_acquired: acquired, date_sold: sold, original_price: data[0].original_price,sold_price: data[0].sold_price,date_removed: removed, status: data[0].status, barcode: data[0].barcode,genre: data[0].genre, keywords: data[0].keywords};
      //$scope.BookLookData = data;
    })
    .error((error) => {
      alert("that barcode is not in inventory")
      console.log('Error: ' + error);
    });
  };
});
