import User from '../Views/User';
import Room from '../Views/Room';
import Booking from '../Views/Booking';

import {
  ManageAccount,
  MeetingRoom,
  CalendarMonth
} from "../images/icons";

const routes = [
  {
    path: "/user",
    name: "_user",
    component: User,
    icon: ManageAccount,
    sider: true
  },
  {
    path: "/room",
    name: "_room",
    component: Room,
    icon: MeetingRoom,
    sider: true
  },
  {
    path: "/booking",
    name: "_booking",
    component: Booking,
    icon: CalendarMonth,
    sider: true
  },
]

export default routes