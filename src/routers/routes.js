import User from '../Views/User';
import Booking from '../Views/Booking';

import {
  ManageAccount,
} from "../images/icons";

const routes = [
  {
    path: "/user",
    name: "_account",
    component: User,
    icon: ManageAccount,
    sider: true
  },
  {
    path: "/booking",
    name: "_booking",
    component: Booking,
    icon: ManageAccount,
    sider: true
  },
]

export default routes