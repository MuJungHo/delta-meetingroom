import User from '../Views/User';
import Room from '../Views/Room';
import Booking from '../Views/Booking';
import Avaliable from '../Views/Avaliable';


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
    path: "/_booking",
    name: "_booking",
    component: Booking,
    icon: CalendarMonth,
    sider: true,
    children: ["/booking", "/avaliable"]
  },
  {
    path: "/avaliable",
    name: "avaliable",
    component: Avaliable,
  },
  {
    path: "/booking",
    name: "booking",
    component: Booking,
  },
]

export default routes