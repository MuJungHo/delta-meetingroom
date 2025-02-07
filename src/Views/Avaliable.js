import React, { useContext, useCallback } from "react";
import { GlobalContext } from "../contexts/GlobalContext";
import { AuthContext } from "../contexts/AuthContext";
import {
  Table,
  Paper,
} from "../components/common";

import {
  BorderColorSharp,
  Delete,
  AddBox,
  CalendarToday
} from '@material-ui/icons';
import TodayBooking from "../components/booking/TodayBooking";
import moment from "moment";

const initFilter = {
  order: "asc",
  sort: "name",
  keyword: "",
  limit: 5,
  page: 0,
}

const getCurrentTimeIndex = () => {
  let currTime = null
  for (let i = 0; i < 23; i++) {
    if (moment().isBetween(moment().startOf('day').add(i, 'hours'), moment().startOf('day').add(i + 1, 'hours'))) {
      currTime = i
    }
  }
  return currTime
}

const User = () => {
  const { t, openDialog, closeDialog, openSnackbar, openWarningDialog, authedApi } = useContext(GlobalContext);
  const [total, setTotal] = React.useState(0);
  const [filter, setFilter] = React.useState(initFilter);

  const [availabelRoomList, setAvailabelRoomList] = React.useState([]);

  const getAvaliableRoom = useCallback(async () => {

    let avaliables = await authedApi.getAvaliableRoom({
      startDateUnix: moment().unix(),
      endDateUnix: moment().unix(),
      startTime: getCurrentTimeIndex()
    })
    setAvailabelRoomList(avaliables)

  }, [filter])

  const handleViewTodayBooking = (room) => {
    openDialog({
      title: '今日預約',
      section: <TodayBooking room={room} />
    })
  }


  React.useEffect(() => {
    getAvaliableRoom()
  }, [getAvaliableRoom])


  return (
    <Paper style={{ margin: 20 }}>
      <Table
        title={"空閒的會議室"}
        rows={availabelRoomList}
        columns={[
          { key: 'name', label: t('name') }
        ]}
        checkable={false}
        order={filter.order}
        sort={filter.sort}
        rowsPerPage={filter.limit}
        page={filter.page}
        total={total}
        onSearchClick={() => { }}
        onClearClick={() => setFilter(initFilter)}
        onPageChange={(page) => setFilter({ ...filter, page })}
        onRowsPerPageChange={(limit) => setFilter({ ...filter, page: 0, limit })}
        onSortChange={(order, sort) => setFilter({ ...filter, order, sort })}
        onKeywordSearch={(keyword) => setFilter({ ...filter, keyword })}
        toolbarActions={[]}
        rowActions={[
          { name: '今日預約', onClick: (e, row) => handleViewTodayBooking(row), icon: <CalendarToday /> },]}
      // dense
      />
    </Paper>
  );
}


export default User;