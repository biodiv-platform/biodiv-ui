import dayjs from "dayjs";
import CustomParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(CustomParseFormat);

const FORMAT_TIMESTAMP = "DD-MM-YYYY hh:mm A";
const FORMAT_DATE_TIMESTAMP = "DD-MM-YYYY";
const FORMAT_DATE_REVERSE = "YYYY-MM-DD";
const FORMAT_DATE_READABLE_TIMESTAMP = "D MMMM YYYY";

export const formatTimeStamp = (ts) => ts && dayjs(ts).format(FORMAT_TIMESTAMP);

export const formatDate = (ts) => ts && dayjs(ts).format(FORMAT_DATE_TIMESTAMP);

export const formatDateReadable = (ts) => ts && dayjs(ts).format(FORMAT_DATE_READABLE_TIMESTAMP);

export const formatDateReverse = (ts) => ts && dayjs(ts).format(FORMAT_DATE_REVERSE);

export const parseDateReverse = (ts) => ts && dayjs(ts, FORMAT_DATE_REVERSE).toDate();

export const parseDate = (ts) => (ts ? dayjs(ts, FORMAT_DATE_TIMESTAMP).toDate() : new Date());

export const parseDateRange = (ts) => (ts ? ts.map((i) => parseDate(i)) : []);

export const formatDateRange = (ts) => (ts ? ts.map((i) => formatDate(i)) : []);
