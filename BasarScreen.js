'use strict';

var React = require('react');
var ReactNative = require('react-native');


var {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  AlertIOS,
  AsyncStorage,
  Linking,
} = ReactNative;

var Icon = require('react-native-vector-icons/Ionicons');

var BasarScreen = React.createClass({

  getInitialState: function() {
    return{
      selectedTab: 'one',
      isFavorites: this.props.isFavorites,
    };
  },

  saveBasar: function() {
    var favoriteList = [];

    AsyncStorage.getItem('KINDERBASAR_LIST', (getErr, getResult) => {
      if(getResult !== null) {
        favoriteList = JSON.parse(getResult);
        favoriteList.push(this.props.basar);
      } else {
        favoriteList.push(this.props.basar);
      }
      AsyncStorage.setItem('KINDERBASAR_LIST', JSON.stringify(favoriteList),  (err, res) => {
      });

    });
  },

  showInMap: function() {

    var address = this.props.basar.details.address.trim().replace(/\s+/g," ").replace(/ /g,"+").replace(/Adresse:/g,"");
    var url = 'http://maps.apple.com/?q=' + address;
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred', err));

  },

  renderFunctionButton: function() {
    var saveButton = (
    <Icon.TabBarItem
      iconName="ios-download-outline"
      selectedIconName="ios-download-outline"
      onPress={() => AlertIOS.alert('Zur Favoriten hinzufügen?', null, [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: () => this.saveBasar()}
      ])} />);

      return !this.state.isFavorites ? saveButton : null;
  },

  render: function() {

    var content = (<ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.mainSection}>
        <Text style={styles.basarTitle}>{this.props.basar.details.title}</Text>
        <Text style={styles.basarDate}>{this.props.basar.details.dateTime}</Text>

        <Text style={styles.basarDescription}>{this.props.basar.details.description}</Text>

        <Text style={styles.basarAddress}>{this.props.basar.details.address}</Text>
      </View>
    </ScrollView>);
    return (

      <TabBarIOS
        tintColor="grey">
        {this.renderFunctionButton()}
      <Icon.TabBarItem
        iconName="ios-navigate-outline"
        selectedIconName="ios-navigate-outline"
        selected={true}
        onPress={() => AlertIOS.alert('In Maps anzeigen?', null, [
          {text: 'Cancel', style: 'cancel'},
          {text: 'OK', onPress: () => this.showInMap()}
        ])}>
        {content}
        </Icon.TabBarItem>
      </TabBarIOS>
    );
  },
});


var styles = StyleSheet.create({
  mainSection: {
    padding: 20,
  },
  basarTitle: {
    fontSize: 19,
    fontWeight: '500',
    marginTop: 20,
    textAlign: 'center',
  },
  basarAddress: {
    fontSize: 14,
    fontWeight: '100',
    marginTop: 10,
  },
  basarDate: {
    fontSize: 15,
    marginTop: 20,
    color: '#999999',
  },
  basarDescription: {
    marginTop: 20,
    fontSize: 14,
  },
  separator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: StyleSheet.hairlineWidth,
    marginVertical: 10,
  },
});

module.exports = BasarScreen;
