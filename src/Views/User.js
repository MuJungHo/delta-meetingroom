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

import { getKey } from '../utils/apis';
import UserSection from "../components/User/UserSection";
const CryptoJS = require("crypto-js");

const getAESEncrypt = async (txt) => {
  const timestamp = Date.now();
  const { secretkey } = await getKey({ timestamp });
  const cipher = CryptoJS.AES.encrypt(
    txt,
    CryptoJS.enc.Utf8.parse(secretkey),
    {
      iv: CryptoJS.enc.Utf8.parse(""),
      mode: CryptoJS.mode.ECB
    }
  )
  return cipher.toString()
}

const User = () => {
  const { t, openDialog, closeDialog, authedApi, openSnackbar, openWarningDialog } = useContext(GlobalContext);
  const { role, accountid } = useContext(AuthContext);
  const [total, setTotal] = React.useState(0);
  const [filter, setFilter] = React.useState({
    order: "desc",
    sort: "datetime",
    keyword: "",
    limit: 10,
    page: 1,
  });

  const [accountList, setAccountList] = React.useState([]);

  const getAccountList = useCallback(async () => {
    setAccountList([])
    setTotal(0)
  }, [filter])

  React.useEffect(() => {
    getAccountList()
  }, [getAccountList])
  
  const openEditUserDialog = (user) => {
    openDialog({
      title: t("edit-thing", { thing: t("account") }),
      section: <UserSection onConfirm={handleEditUserAccount} user={user} />
    })
  }

  const openAddUserDialog = () => {
    openDialog({
      title: t("add-thing", { thing: t("account") }),
      section: <UserSection onConfirm={handleAddUserAccount} />
    })
  }

  const handleEditUserAccount = async (user) => {

    const aesEncryptPassword = await getAESEncrypt(user.password)


    await authedApi.postEditAccount({
      data: {
        ...user,
        password: user.password ? aesEncryptPassword : undefined
      }
    })
    getAccountList()
    closeDialog()
    openSnackbar({
      severity: "success",
      message: t("success-thing", { thing: t("edit") })
    })
  }

  const handleAddUserAccount = async (user) => {

    const aesEncryptPassword = await getAESEncrypt(user.password)


    await authedApi.postAddAccount({
      data: {
        ...user,
        password: aesEncryptPassword
      }
    })
    getAccountList()
    closeDialog()
    openSnackbar({
      severity: "success",
      message: t("success-thing", { thing: t("add") })
    })
  }

  const handleDeleteAccount = async user => {
    await authedApi.deleteAccount({ accountid: user.accountid })
    getAccountList()
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
    <Paper>
      <Table
        title={t("thing-management", { thing: t("account") })}
        rows={accountList}
        columns={[
          { key: 'name', label: t('name') },
          { key: 'email', label: t('email') },
          { key: 'rolename', label: t('rolename') },
        ]}
        checkable={false}
        order={filter.order}
        sort={filter.sort}
        total={total}
        onSearchClick={getAccountList}
        onClearClick={() => setFilter({
          order: "desc",
          sort: "datetime",
          keyword: "",
          limit: 10,
          page: 1,
        })}
        onPageChange={(page) => setFilter({ ...filter, page })}
        onRowsPerPageChange={(limit) => setFilter({ ...filter, page: 1, limit })}
        onSortChange={(order, sort) => setFilter({ ...filter, order, sort })}
        onKeywordSearch={(keyword) => setFilter({ ...filter, keyword })}
        toolbarActions={role === 1 ? [
          { name: t('add'), onClick: openAddUserDialog, icon: <AddBox /> },
        ] : []}
        rowActions={role === 1 ? [
          { name: t('edit'), onClick: (e, row) => openEditUserDialog(row), icon: <BorderColorSharp /> },
          { name: t('delete'), onClick: (e, row) => handleSetWarningDialog(row), icon: <Delete /> }
        ] : [
          { name: t('edit'), onClick: (e, row) => openEditUserDialog(row), icon: <BorderColorSharp />, showMenuItem: (row) => row.accountid === accountid },
        ]}
      // dense
      />
    </Paper>
  );
}


export default User;