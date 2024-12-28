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
} from '@material-ui/icons';

import moment from "moment";

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

  const [availabelRoomList, setAvailabelRoomList] = React.useState([]);

  const getAvailabelRoomList = useCallback(async () => {
    let startAt = 0;

    for (let i = 0; i < 23; i++) {
      if (moment().isBetween(moment().startOf('day').add(i, 'hours'), moment().startOf('day').add(i + 1, 'hours'))) {
        startAt = i
      }
    }

    let { rows, count } = await authedApi.getAvailabelRoomList({
      limit: filter.limit,
      page: filter.page,
      keyword: filter.keyword,
      order: filter.order,
      sort: filter.sort,
      startAt
    })
    const _rows = rows.map(a => ({ ...a, _id: a.id }))
    setAvailabelRoomList(_rows)
    setTotal(count)
  }, [filter])

  React.useEffect(() => {
    getAvailabelRoomList()
  }, [getAvailabelRoomList])


  return (
    <Paper style={{ margin: 20 }}>
      <Table
        title={"可預約的會議室"}
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
        onSearchClick={getAvailabelRoomList}
        onClearClick={() => setFilter(initFilter)}
        onPageChange={(page) => setFilter({ ...filter, page })}
        onRowsPerPageChange={(limit) => setFilter({ ...filter, page: 0, limit })}
        onSortChange={(order, sort) => setFilter({ ...filter, order, sort })}
        onKeywordSearch={(keyword) => setFilter({ ...filter, keyword })}
        toolbarActions={[]}
        rowActions={[]}
      // dense
      />
    </Paper>
  );
}


export default User;