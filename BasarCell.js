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
    return(<View  style={styles.cell}>
    <View style={styles.basarRow}>
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
    </View>);
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
    if (this.props.isFavorites) {
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
  cell: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  textContainer: {
    padding: 15,
  },
  basarTitle: {
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
    backgroundColor: 'white',
    padding: 5,
  },
  addIcon: {
    marginRight: 15,
  },
  basarRow: {
    flex: 1,
  },
  cellBorder: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: StyleSheet.hairlineWidth,
    marginLeft: 4,
  },
});

module.exports = BasarCell;
