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
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
} = ReactNative;

var Icon = require('react-native-vector-icons/Ionicons');

var Swipeout = require('react-native-swipeout')

var BasarCell = React.createClass({

  renderCell: function() {
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    return(
    <View>
      <TouchableElement
        onPress={this.props.onSelect}
        onShowUnderlay={this.props.onHighlight}
        onHideUnderlay={this.props.onUnhighlight}>
        <View style={styles.row}>
          <View style={styles.textContainer}>
            <Text style={styles.basarTitle} numberOfLines={2}>
              {this.props.basar.title}
            </Text>
            <Text style={styles.basarAddress} >
              {this.props.basar.address}
            </Text>
            <Text style={styles.basarDesctiprion} >
              {this.props.basar.description}
            </Text>
            <Text style={styles.basarDate} >
              {this.props.basar.date} {this.props.basar.time}
            </Text>
          </View>
        </View>

      </TouchableElement>
    </View>
    );
  },

  render: function() {

    var swipeoutBtns = [
      {
        text: 'Delete',
        backgroundColor: '#ff0000',
        onPress: this.props.removeBasar,
      }
    ];

    if(this.props.basar.url === undefined || this.props.basar.url === '') {
      return false;
    }
    if (this.props.isFavorites && Platform.OS === 'ios') {
    return (
      <Swipeout right={swipeoutBtns}
        autoClose={true}>
      {this.renderCell()}
      </Swipeout>
    );
  }else {
    return(this.renderCell());
  }
  }
});




var styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    padding: 15,
  },
  basarTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 2,
  },
  basarAddress: {
    marginTop: 1,
    marginBottom: 2,
    color: '#999999',
    fontSize: 14,
  },
  basarDesctiprion: {
    fontSize: 12,
  },
  basarDate: {
    fontSize: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  row: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 5,
  },
  addIcon: {
    marginRight: 15,
  },
  cellBorder: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: StyleSheet.hairlineWidth,
    marginLeft: 4,
  },
});

module.exports = BasarCell;
