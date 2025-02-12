import User from '../Views/User';
import Room from '../Views/Room';
import Book from '../Views/Book';
import Avaliable from '../Views/Avaliable';
import NotFound from '../Views/404';
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
    path: "/book/:roomId",
    name: "_book",
    component: Book,
    icon: CalendarMonth,
    sider: false,
  },
  {
    path: "/avaliable",
    name: "快速預約",
    component: Avaliable,
    icon: EventAvailable,
    sider: true,
  },
  {
    path: "*",
    name: "404",
    component: NotFound,
  },
]

export default routes