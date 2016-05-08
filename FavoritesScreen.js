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
} = ReactNative;

var BasarCell = require('./BasarCell');
var BasarScreen = require('./BasarScreen');

var FavoritesScreen = React.createClass({

  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    return {
      dataList : this.props.favoriteList,
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
        passProps: {basar: basar,
          isFavorites: this.state.isFavorites,
          rowID: rowID
        },
      });
    } else {
      dismissKeyboard();
      this.props.navigator.push({
        title: '',
        name: 'basar',
        basar: basar,
      });
    }
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
