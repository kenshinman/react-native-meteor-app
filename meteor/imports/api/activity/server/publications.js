import { Meteor } from "meteor/meteor";
import { Activity } from "../activity";

Meteor.publish("Activity.pub.list", function({ locationId }) {
  return Activity.find({ locationId }, { limit: 5, sort: { createdAt: -1 } });
});
