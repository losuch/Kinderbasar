/**
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * (c) 2016 Lukasz Osuch
 */
'use strict';

var React = require('react');
var ReactNative = require('react-native');
var dismissKeyboard = require('dismissKeyboard');

var {
  AppRegistry,
  BackAndroid,
  Navigator,
  StyleSheet,
  ToolbarAndroid,
  View,
  Alert,
  AsyncStorage,
  Linking,
} = ReactNative;

var BasarScreen = require('./BasarScreen');
var SearchScreen = require('./SearchScreen');
var FavoritesScreen = require('./FavoritesScreen');

var Icon = require('react-native-vector-icons/Ionicons');

var _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});

var onAddFavorite = function(basar: Object) {

  var favoriteList = [];

  AsyncStorage.getItem('KINDERBASAR_LIST', (getErr, getResult) => {
    if(getResult !== null) {
      favoriteList = JSON.parse(getResult);
      favoriteList.push(basar);
    } else {
      favoriteList.push(basar);
    }
    AsyncStorage.setItem('KINDERBASAR_LIST', JSON.stringify(favoriteList),  (err, res) => {
    });

  });
};

var RouteMapper = function(route, navigationOperations, onComponentRef) {
  _navigator = navigationOperations;
  if (route.name === 'search') {
    return (
      <View style={{flex: 1}}>
        <Icon.ToolbarAndroid
          title='Kinderbasar'
          titleColor="white"
          style={styles.toolbar}
          onIconClicked={navigationOperations.pop}
          actions={[{ title: '', iconName: 'android-archive', iconSize: 30, show: 'always' },]}
          onActionSelected={() => AsyncStorage.getItem('KINDERBASAR_LIST', (err, result) => {
            var favoriteList = [];
            if (result !== null) {
              favoriteList = JSON.parse(result);
            }
            _navigator.push({name: 'favorites', favoriteList: favoriteList, isFavorites: true});
          })

          }
          />

        <SearchScreen navigator={navigationOperations} />
      </View>
    );
  } else if (route.name === 'basar') {
    return (
      <View style={{flex: 1}}>
        <Icon.ToolbarAndroid
          title='Kinderbasar'
          titleColor="white"
          navIconName="chevron-left"
          style={styles.toolbar}
          onIconClicked={navigationOperations.pop}
          actions={[{ title: '', iconName: 'map', iconSize: 30, show: 'always'},
                    { title: '', iconName: 'arrow-down-a', iconSize: 30, show: 'always' },]}
          overflowIconName="more"
          onActionSelected={(position) => {
            if (position === 0) {
              var address = route.basar.details.address.trim().split('\n').slice(-2).join().replace(/\s+/g," ").replace(/ /g,"+");
              console.log('address: ' + address);
              var url = 'http://maps.google.com/?q=' + address;
              Linking.canOpenURL(url).then(supported => {
                if (supported) {
                  Linking.openURL(url);
                } else {
                  console.log('Don\'t know how to open URI: ' + url);
                }
              });
            } else if (position === 1) {
              Alert.alert('Zu Favoriten hinzufuegen?','',
                [{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => onAddFavorite(route.basar)},])
              }
            }} />
        <BasarScreen
          style={{flex: 1}}
          navigator={navigationOperations}
          basar={route.basar}
        />
      </View>
    );
  } else if (route.name === 'favoriteBasar') {
    return (
      <View style={{flex: 1}}>
        <Icon.ToolbarAndroid
          title='Kinderbasar'
          titleColor="white"
          navIconName="chevron-left"
          onIconClicked={navigationOperations.pop}
          style={styles.toolbar}
          actions={[{ title: '', iconName: 'map', iconSize: 30, show: 'always'},
                    { title: '', iconName: 'trash-b', iconSize: 30, show: 'always' },]}
          overflowIconName="more"
          onActionSelected={(position) => {
            if (position === 0) {
              var address = route.basar.details.address.trim().split('\n').slice(-2).join().replace(/\s+/g," ").replace(/ /g,"+");
              console.log('address: ' + address);
              var url = 'http://maps.google.com/?q=' + address;
              Linking.canOpenURL(url).then(supported => {
                if (supported) {
                  Linking.openURL(url);
                } else {
                  console.log('Don\'t know how to open URI: ' + url);
                }
              });
            } else if (position === 1) {
              Alert.alert('Von Favoriten löschen?','',
                [{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => AsyncStorage.getItem('KINDERBASAR_LIST', (err, result) => {
                  var favoriteList = [];
                  if (result !== null) {
                    favoriteList = JSON.parse(result);
                    favoriteList.splice(route.rowID, 1);
                    AsyncStorage.setItem('KINDERBASAR_LIST', JSON.stringify(favoriteList),  (err, res) => {
                      _navigator.replacePreviousAndPop({name: 'favorites', favoriteList: favoriteList, isFavorites: true});
                    });
                  }
                })},])
            }
          }} />
        <BasarScreen
          style={{flex: 1}}
          navigator={navigationOperations}
          basar={route.basar}
        />
      </View>
    );
  } else if (route.name === 'favorites') {
    return(
    <View style={{flex: 1}}>
      <Icon.ToolbarAndroid
        title='Favoriten'
        titleColor="white"
        navIconName="chevron-left"
        onIconClicked={navigationOperations.pop}
        style={styles.toolbar}/>
      <FavoritesScreen navigator={navigationOperations}
        favoriteList={route.favoriteList}
        isFavorites={route.isFavorites}/>
    </View>);

  }
};

var Kinderbasar = React.createClass({
  render: function() {
    var initialRoute = {name: 'search'};
    return (
      <Navigator
        style={styles.container}
        initialRoute={initialRoute}
        configureScene={() => Navigator.SceneConfigs.FadeAndroid}
        renderScene={RouteMapper}
      />
    );
  },

});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    backgroundColor: 'rgb(28, 155,246)',
    height: 56,
  },
});

AppRegistry.registerComponent('Kinderbasar', () => Kinderbasar);

module.exports = Kinderbasar;
