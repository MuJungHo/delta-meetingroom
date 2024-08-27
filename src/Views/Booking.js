import React, { useContext } from "react";
import Calendar from "../components/booking/Calendar";
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons';
import { Button } from "../components/common"
export default () => {
  const dt = new Date();
  const [year, setYear] = React.useState(dt.getFullYear());
  const [month, setMonth] = React.useState(dt.getMonth());
  const handleLowerMonth = () => {
    if (month === 0) {
      setMonth(11)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }
  const handleHigherMonth = () => {
    if (month === 11) {
      setMonth(0)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }
  return (
    <>
      <div>
        <Button onClick={handleLowerMonth}><ArrowBackIos /></Button>
        <Button onClick={handleHigherMonth}><ArrowForwardIos /></Button>
        {`${year}/${month + 1}`}
      </div>
      <Calendar year={year} month={month} />
    </>
  )
}