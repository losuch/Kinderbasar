/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
'use strict';

var React = require('react');
var ReactNative = require('react-native');

var {
  AppRegistry,
  NavigatorIOS,
  StyleSheet,
  Image,
  AsyncStorage,
  AlertIOS,
} = ReactNative;

var SearchScreen = require('./SearchScreen');
var FavoritesScreen = require('./FavoritesScreen');


var Kinderbasar = React.createClass({

  getInitialState: function() {
    return {
      isEditing : false,
    };
  },


  renderFavoritesIcon: function() {
    return(<Image style={styles.favoritesIcon} source={require('./resources/ios-book-outline.png')} />);
  },

  renderTrashIcon: function() {
    return(<Image style={styles.favoritesIcon} source={require('./resources/ios7-trash-outline.png')} />);
  },

  handleNextButtonPress: function() {

    // get offline data
    AsyncStorage.getItem('KINDERBASAR_LIST', (err, result) => {
      var favoriteList = [];
      if (result !== null) {
        favoriteList = JSON.parse(result);
      }

      // Get by ref not prop
      this.refs.nav.push({
          component: FavoritesScreen,
          title: 'Favoriten',
          passProps: {favoriteList: favoriteList, isFavorites: true},
      });
    })
  },

  render: function() {
    return(
      <NavigatorIOS
        style={styles.container}
        ref='nav' // added this
        initialRoute={{
          component: SearchScreen,
          title: 'Kinderbasar',
          rightButtonIcon: this.renderFavoritesIcon().props.source,
          onRightButtonPress: this.handleNextButtonPress,
          passProps: { favorites: false },
        }}
      />
    )
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  favoritesIcon: {
    width: 35,
    height: 35,
  },
});

AppRegistry.registerComponent('Kinderbasar', () => Kinderbasar);

module.exports = Kinderbasar;
