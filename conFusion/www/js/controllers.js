angular.module('conFusion.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $localStorage) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = $localStorage.getObject('userinfo', '{}');
  $scope.reservation = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

      // push the data into the local storage
      $localStorage.storeObject('userinfo', $scope.loginData);
      
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
    
    // Create the reserve modal that we will use later
  $ionicModal.fromTemplateUrl('templates/reserve.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.reserveform = modal;
  });

   // Triggered in the reserve modal to close it
  $scope.closeReserve = function() {
    $scope.reserveform.hide();
  };
    
  // Open the reserve modal
  $scope.reserve = function() {
    $scope.reserveform.show();
  };

  // Perform the reserve action when the user submits the reserve form
  $scope.doReserve = function() {
    console.log('Doing reservation', $scope.reservation);
      

    // Simulate a reserve delay. Remove this and replace with your reservation
    // code if using a reservation system
    $timeout(function() {
      $scope.closeReserve();
    }, 1000);
      
  };

  
})

    .controller('MenuController', ['$scope', 'favoriteFactory', 'baseURL', '$ionicListDelegate', 'dishes', 
                                   function($scope, favoriteFactory, baseURL, $ionicListDelegate, dishes) {

        $scope.baseURL = baseURL;
        $scope.tab = 1;
        $scope.filtText = '';
        $scope.showDetails = false;
        $scope.showMenu = false;
        $scope.message = "Loading ...";

        $scope.dishes = dishes;

        $scope.select = function(setTab) {
            $scope.tab = setTab;

            if (setTab === 2) {
                $scope.filtText = "appetizer";
            }
            else if (setTab === 3) {
                $scope.filtText = "mains";
            }
            else if (setTab === 4) {
                $scope.filtText = "dessert";
            }
            else {
                $scope.filtText = "";
            }
        };

        $scope.isSelected = function (checkTab) {
            return ($scope.tab === checkTab);
        };

        $scope.toggleDetails = function() {
            $scope.showDetails = !$scope.showDetails;
        };
        $scope.addFavorite = function(index) {
            console.log("index is " + index);
            
            favoriteFactory.addToFavorites(index);
            $ionicListDelegate.closeOptionButtons();
        };
    }])

    .controller('ContactController', ['$scope', function($scope) {

        $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };

        var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];

        $scope.channels = channels;
        $scope.invalidChannelSelection = false;

    }])

    .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope,feedbackFactory) {

        $scope.sendFeedback = function() {

            console.log($scope.feedback);

            if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
                $scope.invalidChannelSelection = true;
                console.log('incorrect');
            }
            else {
                $scope.invalidChannelSelection = false;
                feedbackFactory.save($scope.feedback);
                $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                $scope.feedback.mychannel="";
                $scope.feedbackForm.$setPristine();
                console.log($scope.feedback);
            }
        };
    }])

    .controller('DishDetailController', ['$scope', '$stateParams', 'dish', 'menuFactory', 'baseURL', 'favoriteFactory', '$timeout', '$ionicModal', '$ionicPopover', 
                                         function($scope, $stateParams, dish, menuFactory, baseURL, favoriteFactory, $timeout, $ionicModal, $ionicPopover) {

        $scope.baseURL = baseURL;
        $scope.dish = {};
        $scope.showDish = false;
        $scope.message="Loading ...";

        $scope.dish = dish;

        // load the dish detail popover
        $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
            scope: $scope
        }).then(function(popover){
           $scope.popover = popover; 
        });

        // show the popover
        $scope.showPopover = function ($event) {
            $scope.popover.show($event);
        };

        // close the popover
        $scope.closePopover = function() {
            $scope.popover.hide();
        };                                            

        // add the favorite and close the popover
        $scope.addFavorite = function() {
            favoriteFactory.addToFavorites($scope.dish.id);
            $scope.closePopover();
        };

        // Create the reserve modal that we will use later
        $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.commentform = modal;
        });

        // Triggered in the dish comment modal to close it
        $scope.closeComment = function() {
            $scope.commentform.hide();
        };

        // Open the dish comment modal
        $scope.addDishComment = function() {
            $scope.commentform.show();
            $scope.closePopover();
        };

        // init the my comment object
        $scope.mycomment = {rating:5, comment:"", author:"", date:""};
        
        // handle the submitComment method call from html page
        $scope.submitComment = function() {
            console.log('Submitting comment', $scope.mycomment);
            
            $scope.mycomment.date = new Date().toISOString();

            $scope.dish.comments.push($scope.mycomment);

            // adding the comment to the existing Dish comment list
            menuFactory.update({id:$scope.dish.id},$scope.dish);

            $scope.mycomment = {rating:5, comment:"", author:"", date:""};            

            // close the comment form modal
            $scope.closeComment();
        };
          
    }])

    .controller('DishCommentController', ['$scope', 'menuFactory', function($scope,menuFactory) {

        $scope.mycomment = {rating:5, comment:"", author:"", date:""};

        $scope.submitComment = function () {

            $scope.mycomment.date = new Date().toISOString();
            console.log($scope.mycomment);

            $scope.dish.comments.push($scope.mycomment);

            menuFactory.update({id:$scope.dish.id},$scope.dish);

            $scope.commentForm.$setPristine();

            $scope.mycomment = {rating:5, comment:"", author:"", date:""};
        }
    }])

    // implement the IndexController and About Controller here

        .controller('IndexController', ['$scope', 'dish', 'leader', 'promotion', 'baseURL',
                                        function($scope, dish, leader, promotion, baseURL) {

                        
                        $scope.baseURL = baseURL;
                        $scope.leader = leader;
                        $scope.showDish = false;
                        $scope.message="Loading ...";
                        $scope.dish = dish;
                        $scope.promotion = promotion;
      }])

    .controller('AboutController', ['$scope', 'baseURL', 'leaders', function($scope, baseURL, leaders) {

                $scope.baseURL = baseURL;
                $scope.leaders = leaders;
                console.log($scope.leaders);

        }])

    .controller('FavoritesController', ['$scope', 'dishes', 'favorites', 'favoriteFactory', 'baseURL', '$ionicListDelegate', 
                                        '$ionicPopup','$ionicLoading','$timeout',
                                        function($scope, dishes, favorites, favoriteFactory, baseURL, $ionicListDelegate, 
                                                  $ionicPopup, $ionicLoading, $timeout) {

                $scope.baseURL = baseURL;
                $scope.shouldShowDelete = false;
                                                            
                $scope.favorites = favorites;

                $scope.dishes = dishes;
                
                console.log($scope.dishes, $scope.favorites);
                
                // handle the shouldShouldDelete variable
                $scope.toggleDelete = function() {
                    $scope.shouldShowDelete = !$scope.shouldShowDelete;
                    
                    console.log($scope.shouldShowDelete);
                }
                
                // for delete favorite from the list
                $scope.deleteFavorite = function(index){
                    
                    // confirm popuo
                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Confirm Delete',
                        template: 'Are you sure you want to delete this item?'                        
                    });
                    
                    // check confirm popup response
                    confirmPopup.then(function(res) {
                        if(res) {
                            console.log('Ok to delete');
                            
                            // delete favorites
                            favoriteFactory.deleteFromFavorites(index);
                        } else {
                            console.log('Canceled delete');
                        }
                    });

                    // hide the delete button
                    $scope.shouldShowDelete = false;                    
                }
                                        
        }])

    .filter('favoriteFilter', function() {
    
        return function (dishes, favorites) {
            
            var out = [];
            
            for (var i = 0; i < favorites.length; i++) {
                for (var j = 0; j < dishes.length; j++) {
                    if(dishes[j].id === favorites[i].id)
                        out.push(dishes[j]);
                }
            }
            
            return out;            
        }
    })

;