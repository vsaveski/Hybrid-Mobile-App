'use strict';

angular.module('conFusion.services',['ngResource'])
        .constant("baseURL","http://localhost:3000/")

        .factory('menuFactory', ['$resource', 'baseURL', function($resource,baseURL) {
    
            return $resource(baseURL+"dishes/:id",null,  {'update':{method:'PUT' }});
                        
        }])

        .factory('promotionFactory', ['$resource', 'baseURL', function($resource,baseURL) {
    
            return $resource(baseURL+"promotions/:id");
                        
        }])

        .factory('corporateFactory', ['$resource', 'baseURL', function($resource,baseURL) {
    
    
            return $resource(baseURL+"leadership/:id");
    
        }])

        .factory('feedbackFactory', ['$resource', 'baseURL', function($resource,baseURL) {
    
    
            return $resource(baseURL+"feedback/:id");
    
        }])

        .factory('favoriteFactory', ['$localStorage', '$resource', 'baseURL', function($localStorage, $resource,baseURL) {
    
            var favFac = {};
            // grab the existing favorites from local storage
            var favorites = $localStorage.getObject('favorites', '[]');
            
            favFac.addToFavorites = function (index) {
                // looping the favorites
                for (var i = 0; i < favorites.length; i++) {
                    // check if the index is already part of the favorites
                    if (favorites[i].id == index) 
                        // exit the method if favorites already have the index
                        return;
                }
                
                // add the index into the favorites list
                favorites.push({id: index});
                
                // add to local storage
                $localStorage.storeObject('favorites', favorites);
            };
            
            favFac.deleteFromFavorites = function (index) {
                

                for (var i = 0; i < favorites.length; i++) {
                    if (favorites[i].id === index) {
                        // delete the favorite from the array
                        favorites.splice(i, 1);
                    }
                }
                // update the existing favorites in local storage
                $localStorage.storeObject('favorites', favorites);
            }
            // return a list of favorites
            favFac.getFavorites = function () {
                return favorites;
            };
            
            return favFac;
        }])

        .factory('$localStorage', ['$window', function($window) {
          return {
            store: function(key, value) {
              $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
              return $window.localStorage[key] || defaultValue;
            },
            storeObject: function(key, value) {
              $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key,defaultValue) {
              return JSON.parse($window.localStorage[key] || defaultValue);
            }
          }            
        }])
;
