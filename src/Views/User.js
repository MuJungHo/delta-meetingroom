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

// import {
//   Select,
//   MenuItem
// } from '@material-ui/core';

import UserSection from "../components/User/UserSection";
import { api } from "../utils/apis";

const initFilter = {
  order: "asc",
  sort: "name",
  keyword: "",
  limit: 5,
  page: 0,
}

const User = () => {
  const { t, openDialog, closeDialog, openSnackbar, openWarningDialog } = useContext(GlobalContext);
  const [total, setTotal] = React.useState(0);
  const [filter, setFilter] = React.useState(initFilter);

  const [accountList, setAccountList] = React.useState([]);

  const getUserList = useCallback(async () => {
    let { rows, count } = await api.getUserList({
      limit: filter.limit,
      page: filter.page,
      keyword: filter.keyword,
      order: filter.order,
      sort: filter.sort
    })
    const _rows = rows.map(a => ({ ...a, _id: a.id }))
    setAccountList(_rows)
    setTotal(count)
  }, [filter])

  React.useEffect(() => {
    getUserList()
  }, [getUserList])

  const openEditUserDialog = (user) => {
    openDialog({
      title: t("edit-thing", { thing: t("user") }),
      section: <UserSection onConfirm={handleEditUserAccount} user={user} />
    })
  }

  const openAddUserDialog = () => {
    openDialog({
      title: t("add-thing", { thing: t("user") }),
      section: <UserSection onConfirm={handleAddUserAccount} />
    })
  }

  const handleEditUserAccount = async (user) => {
    await api.putUser({ data: { ...user }, id: user.id })
    getUserList()
    closeDialog()
    openSnackbar({
      severity: "success",
      message: t("success-thing", { thing: t("edit") })
    })
  }

  const handleAddUserAccount = async (user) => {
    await api.postUser({ data: { ...user } })
    getUserList()
    closeDialog()
    openSnackbar({
      severity: "success",
      message: t("success-thing", { thing: t("add") })
    })
  }

  const handleDeleteAccount = async user => {
    await api.deleteUser({ id: user.id })
    getUserList()
    closeDialog()
    openSnackbar({
      severity: "success",
      message: t("success-thing", { thing: t("delete") })
    })
  }

  const handleSetWarningDialog = (user) => {
    openWarningDialog({
      title: t("delete-confirmation"),
      message: t("delete-thing-confirm", { thing: user.name }),
      onConfirm: () => handleDeleteAccount(user)
    })
  }

  return (
    <Paper style={{ margin: 20 }}>
      <Table
        title={t("thing-management", { thing: t("user") })}
        rows={accountList}
        columns={[
          { key: 'name', label: t('name') },
          { key: 'account', label: t('account') },
          { key: 'email', label: t('email') },
        ]}
        checkable={false}
        order={filter.order}
        sort={filter.sort}
        rowsPerPage={filter.limit}
        page={filter.page}
        total={total}
        onSearchClick={getUserList}
        onClearClick={() => setFilter(initFilter)}
        onPageChange={(page) => setFilter({ ...filter, page })}
        onRowsPerPageChange={(limit) => setFilter({ ...filter, page: 0, limit })}
        onSortChange={(order, sort) => setFilter({ ...filter, order, sort })}
        onKeywordSearch={(keyword) => setFilter({ ...filter, keyword })}
        toolbarActions={[
          { name: t('add'), onClick: openAddUserDialog, icon: <AddBox /> },
        ]}
        rowActions={[
          { name: t('edit'), onClick: (e, row) => openEditUserDialog(row), icon: <BorderColorSharp /> },
          { name: t('delete'), onClick: (e, row) => handleSetWarningDialog(row), icon: <Delete /> }
        ]}
      // dense
      />
    </Paper>
  );
}


export default User;