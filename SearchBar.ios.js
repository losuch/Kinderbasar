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
  ActivityIndicatorIOS,
  TextInput,
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  ActionSheetIOS,
} = ReactNative;

var TouchableElement = TouchableHighlight;

var items = ['10 km', '20 km', '50 km', '100 km', 'Cancel'];

var SearchBar = React.createClass({

  showSheet: function() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: items,
      cancelButtonIndex: 4,
    },
    (buttonIndex) => {
      if(buttonIndex < 4) {
        this.props.onSelectRad(buttonIndex);
      }
    });
  },

  render: function() {
    return (
      <View style={styles.searchBar}>

        <TextInput
          autoCapitalize="sentences"
          autoFocus={true}
          autoCorrect={false}
          placeholder="Ort oder Postleitzahl"
          onFocus={this.props.onFocus}
          style={styles.searchBarInput}
          returnKeyType="search"
          onSubmitEditing={this.props.onSearchBasar}
        />
        <ActivityIndicatorIOS
          animating={this.props.isLoading}
          style={styles.spinner}
        />
        <TouchableElement
          onPress={this.showSheet}
          underlayColor='white'>
          <Text style={styles.searchRadius}>{this.props.rad} km</Text>
        </TouchableElement>

      </View>
    );
  }
});

var styles = StyleSheet.create({
  searchBar: {
    marginTop: 70,
    marginBottom: 6,
    padding: 3,
    paddingLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBarInput: {
    fontSize: 15,
    flex: 1,
    height: 30,
  },
  searchRadius: {
    fontWeight: '500',
    color: 'rgb(0, 90,	255)',
    marginRight: 5,
  },
  spinner: {
    width: 30,
  },
});

module.exports = SearchBar;
