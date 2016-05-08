/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @providesModule SearchBar
 * @flow
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
          autoCorrect={false}
          placeholder="Ort oder Postleizahl"
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
