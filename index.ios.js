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
