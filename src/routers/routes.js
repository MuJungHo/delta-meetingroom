import User from '../Views/User';
import Room from '../Views/Room';
import Book from '../Views/Book';
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
    path: "/book",
    name: "_book",
    component: Book,
    icon: CalendarMonth,
    sider: true,
  },
  // {
  //   path: "/avaliable",
  //   name: "avaliable",
  //   component: Avaliable,
  // },
  // {
  //   path: "/booking",
  //   name: "booking",
  //   component: Booking,
  // },
]

export default routes