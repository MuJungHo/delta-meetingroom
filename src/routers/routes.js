import User from '../Views/User';
import Room from '../Views/Room';
import Book from '../Views/_Book';
import Avaliable from '../Views/Avaliable';
// import NotFound from '../Views/404';
import {
  ManageAccount,
  MeetingRoom,
  CalendarMonth,
  EventAvailable
} from "../images/icons";


const routes = [
  {
    path: "/user",
    name: "_user",
    component: User,
    icon: ManageAccount,
    sider: true,
    exact: true
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
    // component: Book,
    icon: CalendarMonth,
    sider: true,
    children: [
      '/calendar',
      '/avaliable'
    ]
  },
  {
    path: "/calendar",
    name: "_calendar",
    component: Book,
    // icon: EventAvailable,
    sider: false,
  },
  {
    path: "/avaliable",
    name: "_avaliable",
    component: Avaliable,
    // icon: EventAvailable,
    sider: false,
  },
  // {
  //   path: "*",
  //   name: "404",
  //   component: NotFound,
  // },
]

export default routes