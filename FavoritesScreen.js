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
  StyleSheet,
  Text,
  Platform,
  View,
  ListView,
  AsyncStorage,
  Image,
  AlertIOS,
} = ReactNative;

var BasarCell = require('./BasarCell');
var BasarScreen = require('./BasarScreen');
var dismissKeyboard = require('dismissKeyboard');



var FavoritesScreen = React.createClass({

  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows(this.props.favoriteList),
      isFavorites: this.props.isFavorites,
    };
  },

  getDataSource: function(basars: Array<any>): ListView.DataSource {
    return this.state.dataSource.cloneWithRows(basars);
  },

  removeBasar: function(rowID) {
    AsyncStorage.getItem('KINDERBASAR_LIST', (err, result) => {
      var favoriteList = [];
      if (result !== null) {
        favoriteList = JSON.parse(result);
        favoriteList.splice(rowID, 1);
        AsyncStorage.setItem('KINDERBASAR_LIST', JSON.stringify(favoriteList),  (err, res) => {
          this.setState({
            dataSource: this.getDataSource(favoriteList)
          });
        });
      }
    })
  },

  selectBasar: function(basar: Object, rowID: number) {

    if (Platform.OS === 'ios') {
      this.props.navigator.push({
        title: '',
        component: BasarScreen,
        rightButtonIcon: this.renderTrashIcon().props.source,
        onRightButtonPress: () => {
          AlertIOS.alert('Von Favoriten löschen?', null, [
            {text: 'Cancel', style: 'cancel'},
            {text: 'OK', onPress: () => {
              this.removeBasar(rowID);
              this.props.navigator.pop();
            }}
          ])
        },
        passProps: {basar: basar,
          isFavorites: this.state.isFavorites,
          rowID: rowID
        },
      });
    } else {
      dismissKeyboard();
      this.props.navigator.push({
        title: '',
        name: 'favoriteBasar',
        basar: basar,
        rowID: rowID,
      });
    }
  },

  renderTrashIcon: function() {
    return(<Image style={styles.favoritesIcon} source={require('./resources/ios7-trash-outline.png')} />);
  },


  renderSeparator: function(
    sectionID: number | string,
    rowID: number | string,
    adjacentRowHighlighted: boolean
  ) {
    var style = styles.rowSeparator;
    if (adjacentRowHighlighted) {
        style = [style, styles.rowSeparatorHide];
    }
    return (
      <View key={'SEP_' + sectionID + '_' + rowID}  style={style}/>
    );
  },

  renderRow: function (
    basar: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
  ) {
    return (
      <BasarCell
        key={basar.id}
        onSelect={() => this.selectBasar(basar, rowID)}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        showAddButton={false}
        basar={basar}
        isFavorites={this.props.isFavorites}
        removeBasar={() => this.removeBasar(rowID)}
      />
    );
  },

  render: function() {

    var content = this.state.dataSource.getRowCount() === 0 ?
      <NoBasar/> :
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        renderFooter={this.renderFooter}
        renderSeparator={this.renderSeparator}
      />;
    return (
      <View style={styles.container}>
        {content}
        <View style={styles.separator} />
      </View>
    );
  },
});

var NoBasar = React.createClass({
  render: function() {
  var text = 'Keine Favoriten gefunden';
  return (
    <View style={[styles.container, styles.centerText]}>
      <Text style={styles.noBasarText}>{text}</Text>
    </View>
    );
  }
});


var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centerText: {
    alignItems: 'center',
  },
  noBasarText: {
    marginTop: 180,
    color: '#888888',
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
});

module.exports = FavoritesScreen;
