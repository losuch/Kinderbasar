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
var jquery = require('jquery');
var cheerio = require('cheerio');

var BasarCell = require('./BasarCell');
var BasarScreen = require('./BasarScreen');
var SearchBar = require('./SearchBar');
var dismissKeyboard = require('dismissKeyboard');

var {
  ActivityIndicatorIOS,
  ListView,
  Platform,
  ProgressBarAndroid,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableNativeFeedback,
  AlertIOS,
  AsyncStorage,
  Image,
} = ReactNative;

var API_URL = 'http://www.kinderbasar-online.de/Kinderbasar/Termine/Liste/l-';
var RAD = [10, 20, 50, 100];

var MOCKED_LIST = [
  {id: 1, title: 'Basar Rund Ums Kind', address: '65830 Kriftel', description: 'Gutsortierter Abgabebasar für Baby- und Kleinkinderkleidung Gr. 50-176, Umstandsmode, Spielzeug und Kinderzubeh&oum...', date: 'Sa, 30.04.2016', time:'von 09:30 bis 12:30', url:'test'},
  {id: 2, title: 'Kindersachenflohmarkt', address: '65197 Dotzheim', description: 'Selbstverkäufer-Flohmarkt im Außengelände der Kita Schlangenbader Straße: Das erste Mal starten wi...', date: 'Sa, 30.04.2016', time:'von 09:30 bis 12:30', url:'test'},
  {id: 3, title: 'Kinderbasar', address: '65439 Flörsheim am Main', description: 'Die „Spielgruppe Weilbach“ lädt Euch ein zum 3. Kinderbasar Wann: Samstag, 30. April 2016 von 14:00 Uhr...', date: 'Sa, 30.04.2016', time:'von 09:30 bis 12:30', url:'test'},
  {id: 4, title: 'Kinder- und Jugendsachen- Flohmarkt', address: '65462 Ginsheim-Gustavsburg', description: 'Gutsortierter Abgabebasar für Baby- und Kleinkinderkleidung Gr. 50-176, Umstandsmode, Spielzeug und Kinderzubeh&oum...', date: 'Sa, 30.04.2016', time:'von 09:30 bis 12:30', url:'test'}
];



var SearchScreen = React.createClass({

  getInitialState: function() {
    return {
      isLoading: false,
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      rad: RAD[0],
      radIndex: 0,
      pageNr: 1,
      maxPageNr: 1,
      isLoadingNextPage: false,
      isFavorites: this.props.isfavorites,
    };
  },

  getDataSource: function(basars: Array<any>): ListView.DataSource {
    return this.state.dataSource.cloneWithRows(basars);
  },

  getUrlForQueryAndPage: function (query: string, page: string, rad: number): string {
    return (
      API_URL + encodeURIComponent(query) + '/Seite-' + page + '/Sortieren-datum-aufsteigend/r-' + rad
    );
  },

  selectBasar: function(basar: Object) {
    if (Platform.OS === 'ios') {
      this.props.navigator.push({
        title: '',
        component: BasarScreen,
        rightButtonIcon: this.renderDownloadIcon().props.source,
        onRightButtonPress: () => {
          AlertIOS.alert('Zu Favoriten hinzufuegen?', null, [
            {text: 'Cancel', style: 'cancel'},
            {text: 'OK', onPress: () => this.onAddFavorite(basar)},
          ]);
        },
        passProps: {basar: basar, isFavorites: this.state.isFavorites},
      });
    } else {
      dismissKeyboard();
      this.props.navigator.push({
        name: 'basar',
        basar: basar,
      });
    }
  },

  onAddFavorite: function(basar: Object) {

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
  },

  onSelectRad: function(radIndex: number){
    this.setState({
      radIndex: radIndex,
      rad: RAD[radIndex]
    });

    if (this.state.query !== null && this.state.query !== '' && this.state.query !== undefined) {
      var query = {
        nativeEvent: { text: this.state.query}
      };

      this.onSearchBasar(query)
    }
  },

  onSearchBasar: function(event: Object) {
    var query = event.nativeEvent.text.toLowerCase();

    if (query === '') {
      this.setState({
        dataSource: this.getDataSource([]),
        isLoading: false,
        pageNr: 1,
        query: query
      });
      return;
    }



    this.setState({
      dataSource: this.getDataSource([]),
      isLoading: true,
      pageNr: 1,
      query: query
    });

      fetch(this.getUrlForQueryAndPage(query, this.state.pageNr, this.state.rad))
      .then((response) => response.text())
      .then((responseText) => {

        var $ = cheerio.load(responseText);
        var basarList = [];

        // scrap list of all events
        $('tr').not('.alpha').each(function (i, elem) {
          var basarObj = {
            id: i
          };
          $(this).find('div').each(function (j, obj) {
            if (j % 5 === 0) {
              basarObj.date = $(this).text().trim();
            } if(j % 5 === 1) {
              basarObj.time = $(this).text().replace(/(\r\n|\n|\r)/gm," ").replace(/\s+/g," ").trim();
            }
            if (j % 5 === 2) {
              basarObj.address = $(this).text().trim();
            } if (j % 4 === 3) {
              basarObj.url = $(this).find('a').attr('href');
              basarObj.title = $(this).find('a').text().trim();
              basarObj.description = $(this).find('div').text().trim();
            }
          });
          basarList.push(basarObj);
        });

        // get max page number
        var pages = $('.lower_bar').find('.grid_4').text().trim().split(' von ');

        this.setState({
          dataSource: this.getDataSource(basarList),
          isLoading: false,
          maxPageNr: pages[1]
        });
      })
      .catch((error) => {
        console.warn(error);
      });
    },

    onLoadNextPage: function() {

      this.setState({
        isLoadingNextPage: true,
      });

      fetch(this.getUrlForQueryAndPage(this.state.query, this.state.pageNr + 1, this.state.rad))
      .then((response) => response.text())
      .then((responseText) => {

        var $ = cheerio.load(responseText);
        var basarList = [];

        for (var z = 0; z < this.state.dataSource.getRowCount(); z++) {
          var obj = this.state.dataSource.getRowData(0, z);
          basarList.push(obj);
        }

        // scrap list of all events
        $('tr').not('.alpha').each(function (i, elem) {
          var basarObj = {
            id: i
          };
          $(this).find('div').each(function (j, obj) {
            if (j % 5 === 0) {
              basarObj.date = $(this).text().trim();
            } if(j % 5 === 1) {
              basarObj.time = $(this).text().replace(/(\r\n|\n|\r)/gm," ").replace(/\s+/g," ").trim();
            }
            if (j % 5 === 2) {
              basarObj.address = $(this).text().trim();
            } if (j % 4 === 3) {
              basarObj.url = $(this).find('a').attr('href');
              basarObj.title = $(this).find('a').text().trim();
              basarObj.description = $(this).find('div').text().trim();
            }
          });
          basarList.push(basarObj);
        });


        this.setState({
          dataSource: this.getDataSource(basarList),
          isLoadingNextPage: false,
          pageNr: this.state.pageNr + 1
        });
      })
      .catch((error) => {
        console.warn(error);
      });

    },

  loadBasarDetails: function(basar: Object) {
    this.setState({
      isLoading: true
    });
    basar.details = {};
    fetch(basar.url)
    .then((response) => response.text())
    .then((responseText) => {

      var $ = cheerio.load(responseText);
      basar.details.title = $('.content').find('h1').text();
      basar.details.dateTime = $('.content').find('h4').text();
      basar.details.description = $('.content').find('div').first().text().trim();
      basar.details.address = $('.content').find('div.grid_16.alpha.omega').find('li').next().first().text();

      this.setState({
        isLoading: false
      });

      this.selectBasar(basar);
    })
    .catch((error) => {
      console.warn(error);
    });


  },

  renderDownloadIcon: function() {
    return(<Image style={styles.favoritesIcon} source={require('./resources/ios7-download-outline.png')} />);
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

  renderFooter: function (){

    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
      if(this.state.maxPageNr > this.state.pageNr) {
        if (this.state.isLoadingNextPage) {
          return(<View style={styles.footer}>
            <ProgressBarAndroid
              styleAttr="Large"
              style={styles.spinner}
            />
          </View>
        );
        } else {
          return(
            <View style={styles.footer}>
              <TouchableElement
                onPress={this.onLoadNextPage}
                underlayColor='white'>
                <View>
                  <Text style={styles.footerText}>weiter</Text>
                </View>
              </TouchableElement>
            </View>);
        }
      }
    } else {
      var TouchableElement = TouchableHighlight;
      if(this.state.maxPageNr > this.state.pageNr) {
        if (this.state.isLoadingNextPage) {
          return(<View style={styles.footer}>
            <ActivityIndicatorIOS
              animating={this.state.isLoadingNextPage}
              style={styles.spinner}
            />
          </View>
        );
        } else {
          return(
            <View style={styles.footer}>
              <TouchableElement
                onPress={this.onLoadNextPage}
                underlayColor='white'>
                <Text style={styles.footerText}>weiter</Text>
              </TouchableElement>
            </View>);
        }
      }
    }
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
        onSelect={() => this.loadBasarDetails(basar)}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        basar={basar}
      />
    );
  },

render: function() {

  // this.props.navigator.replace({
  //     title: 'Undo'});

  var content = this.state.dataSource.getRowCount() === 0 ?
      <NoBasar
        isLoading={this.state.isLoading}
      /> :
    <ListView
      ref="listview"
      dataSource={this.state.dataSource}
      renderRow={this.renderRow}
      renderFooter={this.renderFooter}
      renderSeparator={this.renderSeparator}
      automaticallyAdjustContentInsets={false}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps={true}
      showsVerticalScrollIndicator={false}
    />;
  return (
    <View style={styles.container}>
      <SearchBar
        onSearchBasar={this.onSearchBasar}
        onSelectRad={this.onSelectRad}
        isLoading={this.state.isLoading}
        rad={this.state.rad}
        radIndex={this.state.radIndex}
        onFocus={() =>
          this.refs.listview && this.refs.listview.getScrollResponder().scrollTo({ x: 0, y: 0 })}
      />
      <View style={styles.separator} />
      {content}
    </View>
  );
}
});

var NoBasar = React.createClass({
  render: function() {
  var text = 'Keinen Termin gefunden';
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
    marginTop: 80,
    color: '#888888',
  },
  row: {
    padding: 35,
  },
  footer: {
    padding: 15,
    alignItems: 'center',

  },
  spinner: {
    width: 30,
    height: 30,
  },
  footerText: {
    color: 'rgb(0, 90,	255)',
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

module.exports = SearchScreen;
