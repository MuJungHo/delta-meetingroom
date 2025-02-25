import React, { useContext, useCallback } from "react";
import { GlobalContext } from "../contexts/GlobalContext";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import {
  Table,
  Paper,
} from "../components/common";

import {
  BorderColorSharp,
  Delete,
  AddBox,
  CalendarToday,
  EventNote
} from '@material-ui/icons';

// import {
//   Select,
//   MenuItem
// } from '@material-ui/core';

import RoomSection from "../components/room/RoomSection";

const initFilter = {
  order: "asc",
  sort: "name",
  keyword: "",
  limit: 5,
  page: 0,
}

const User = () => {
  const { t, openDialog, closeDialog, openSnackbar, openWarningDialog, authedApi } = useContext(GlobalContext);
  const [total, setTotal] = React.useState(0);
  const [filter, setFilter] = React.useState(initFilter);
  const history = useHistory();
  const [roomList, setRoomList] = React.useState([]);

  const getRoomList = useCallback(async () => {
    let { rows, count } = await authedApi.getRoomList({
      limit: filter.limit,
      page: filter.page,
      keyword: filter.keyword,
      order: filter.order,
      sort: filter.sort
    })
    const _rows = rows.map(a => ({ ...a, _id: a.id }))
    setRoomList(_rows)
    setTotal(count)
  }, [filter])

  React.useEffect(() => {
    getRoomList()
  }, [getRoomList])

  const openEditRoomDialog = (room) => {
    openDialog({
      title: t("edit-thing", { thing: t("room") }),
      section: <RoomSection onConfirm={handleEditRoom} room={room} />
    })
  }

  const openAddRoomDialog = () => {
    openDialog({
      title: t("add-thing", { thing: t("room") }),
      section: <RoomSection onConfirm={handleAddRoom} />
    })
  }

  const handleEditRoom = async (room) => {
    await authedApi.putUpdateRoom({ data: { ...room }, id: room.id })
    getRoomList()
    closeDialog()
    openSnackbar({
      severity: "success",
      message: t("success-thing", { thing: t("edit") })
    })
  }

  const handleAddRoom = async (room) => {
    await authedApi.postCreateRoom({ data: { ...room } })
    getRoomList()
    closeDialog()
    openSnackbar({
      severity: "success",
      message: t("success-thing", { thing: t("add") })
    })
  }

  const handleDeleteRoom = async room => {
    await authedApi.deleteRoom({ id: room.id })
    getRoomList()
    closeDialog()
    openSnackbar({
      severity: "success",
      message: t("success-thing", { thing: t("delete") })
    })
  }

  const handleSetWarningDialog = (room) => {
    openWarningDialog({
      title: t("delete-confirmation"),
      message: t("delete-thing-confirm", { thing: room.name }),
      onConfirm: () => handleDeleteRoom(room)
    })
  }

  return (
    <Paper style={{ margin: 20 }}>
      <Table
        title={t("room")}
        rows={roomList}
        columns={[
          { key: 'name', label: t('name') },
        ]}
        checkable={false}
        order={filter.order}
        sort={filter.sort}
        rowsPerPage={filter.limit}
        page={filter.page}
        total={total}
        onSearchClick={getRoomList}
        onClearClick={() => setFilter(initFilter)}
        onPageChange={(page) => setFilter({ ...filter, page })}
        onRowsPerPageChange={(limit) => setFilter({ ...filter, page: 0, limit })}
        onSortChange={(order, sort) => setFilter({ ...filter, order, sort })}
        onKeywordSearch={(keyword) => setFilter({ ...filter, keyword })}
        toolbarActions={[
          { name: t('add'), onClick: openAddRoomDialog, icon: <AddBox /> },
        ]}
        rowActions={[
          // { name: '預約', onClick: (e, row) => history.push(`/book/${row.id}`), icon: <EventNote /> },
          { name: t('edit'), onClick: (e, row) => openEditRoomDialog(row), icon: <BorderColorSharp /> },
          { name: t('delete'), onClick: (e, row) => handleSetWarningDialog(row), icon: <Delete /> }
        ]}
      // dense
      />
    </Paper>
  );
}


export default User;