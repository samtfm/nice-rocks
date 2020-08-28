
const MINUTE = 60;
const HOUR = 60*60;
const DAY = 60*60*24;
const WEEK = 60*60*24*7;
const MONTH = 60*60*24*30.42;
const YEAR = 60*60*24*365.25;

export const relativeTimeFromEpoch = (epoch) => {
  const deltaSeconds = Math.floor((Date.now())*.001) - epoch
  if (deltaSeconds<MINUTE) {
    return "just now";
  } else if (deltaSeconds<MINUTE*2) {
    return "1 minute ago";
  } else if (deltaSeconds<HOUR) {
    return  `${Math.floor(deltaSeconds/60)} minutes ago`;
  } else if (deltaSeconds<HOUR*2) {
    return "1 hour ago";
  } else if (deltaSeconds<DAY) {
    return  `${Math.floor(deltaSeconds/HOUR)} hours ago`;
  } else if (deltaSeconds<DAY*2) {
    return "1 day ago";
  } else if (deltaSeconds<WEEK) {
    return  `${Math.floor(deltaSeconds/(DAY))} days ago`;
  } else if (deltaSeconds<WEEK*2) {
    return "1 week ago";
  } else if (deltaSeconds<MONTH) {
    return  `${Math.floor(deltaSeconds/(WEEK))} weeks ago`;
  } else if (deltaSeconds<MONTH*2) {
    return "1 month ago";
  } else if (deltaSeconds<YEAR) {
    return  `${Math.floor(deltaSeconds/(MONTH))} months ago`;
  } else if (deltaSeconds<YEAR*2) {
    return "1 year ago";
  } else {
    return  `${Math.floor(deltaSeconds/(YEAR))} years ago`;
  }
};
