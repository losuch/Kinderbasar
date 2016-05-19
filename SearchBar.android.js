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
var Icon = require('react-native-vector-icons/Ionicons');

var {
  Image,
  Platform,
  ProgressBarAndroid,
  TextInput,
  StyleSheet,
  TouchableNativeFeedback,
  View,
  Text,
  Picker,
} = ReactNative;

var IS_RIPPLE_EFFECT_SUPPORTED = Platform.Version >= 21;

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
    var loadingView;
    if (this.props.isLoading) {
      loadingView = (
        <ProgressBarAndroid
          styleAttr="Large"
          style={styles.spinner}
        />
      );
    } else {
      loadingView = <View style={styles.spinner} />;
    }
    var background = IS_RIPPLE_EFFECT_SUPPORTED ?
      TouchableNativeFeedback.SelectableBackgroundBorderless() :
      TouchableNativeFeedback.SelectableBackground();
    return (
      <View style={styles.searchBar}>
        <TextInput
        autoCapitalize="sentences"
        autoCorrect={false}
        placeholder="Ort oder Postleizahl"
        onFocus={this.props.onFocus}
        style={styles.searchBarInput}
        returnKeyType="search"
        onSubmitEditing={this.props.onSearchBasar}
        />
        {loadingView}
        <View style={{flex: 1}}>
          <Picker
            selectedValue={this.props.radIndex}
            onValueChange={(index) => this.props.onSelectRad(index)}>
            <Picker.Item label="10 km" value="0" />
            <Picker.Item label="20 km" value="1" />
            <Picker.Item label="50 km" value="2" />
            <Picker.Item label="100 km" value="3" />
          </Picker>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 40,
  },
  searchBarInput: {
    flex: 2,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'grey',
    height: 50,
    padding: 0,
    backgroundColor: 'transparent',
    marginLeft: 15,
  },
  searchRadius: {
    color: 'rgb(28, 155, 246)',
    marginRight: 5,
  },
  spinner: {
    width: 30,
    height: 30,
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 1,
  },
});

module.exports = SearchBar;
