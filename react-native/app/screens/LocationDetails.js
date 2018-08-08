import React, { Component } from "react";
import Meteor, { withTracker } from "react-native-meteor";
import { Text } from "react-native";
import Container from "../components/Container";
import { Header } from "../components/Text";
import { Button, Card } from "react-native-elements";
import colors from "../config/colors";
import _ from "lodash";

const CHECKED_IN = "in";
const CHECKED_OUT = "out";

class LocationDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      changingStatus: false
    };
  }

  attemptCheckin = () => {
    const { location } = this.props;
    let status = CHECKED_IN;
    if (location.checkedInUserId) {
      status = CHECKED_OUT;
    }
  };

  render() {
    console.log(this.props);
    const location =
      this.props.location ||
      _.get(this.props, "navigation.state.params.location", {});
    const userId = _.get(this.props, "user._id", "demo");
    const checkedIn = location.checkedInUserId === userId;
    const available = typeof location.checkedInUserId !== "string";

    let icon = { name: "check" };
    let title = "Check In";

    let backgroundColor = colors.primary;

    if (checkedIn) {
      icon = { name: "close" };
      title = "Check Out";
      backgroundColor = colors.red;
    } else if (!available) {
      icon = { name: "close" };
      title = "Not Available";
    }

    return (
      <Container scroll>
        <Card title={location.station_name}>
          <Text>{location.street_address}</Text>
          <Text>
            {"\n"}
            {location.access_days_time}
          </Text>
        </Card>
        <Button
          raised
          icon={icon}
          title={title}
          backgroundColor={backgroundColor}
          buttonStyle={{ marginVertical: 20 }}
          disabled={!available && !checkedIn}
          onPress={this.attemptCheckin}
          loading={this.state.changingStatus}
        />
      </Container>
    );
  }
}

const ConnectedLocationDetails = withTracker(params => {
  const location = _.get(params, "navigation.state.params.location", {});

  Meteor.subscribe("Locations.pub.details", { locationId: location._id });

  return {
    user: Meteor.user(),
    location: Meteor.collection("locations").findOne({ _id: location._id })
  };
})(LocationDetails);

export default ConnectedLocationDetails;
