// Single source of truth for every icon in the app. All icons are 24x24,
// stroked with currentColor, so a parent `color:` drives them and CSS can
// still size them (a stylesheet beats the width/height attributes here).
// Where CSS does not set a size, pass `size` at the call site.

const paths = {
  activity: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,

  alertTriangle: (
    <>
      <path d="M12 3.5 2.5 20h19z" />
      <path d="M12 9.5v4.5" />
      <path d="M12 17.2h.01" />
    </>
  ),

  arrowLeft: (
    <>
      <path d="M19 12H5" />
      <path d="m11 6-6 6 6 6" />
    </>
  ),

  arrowRight: (
    <>
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),

  calendar: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M4 10h16" />
    </>
  ),

  calendarPlus: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M7.5 3.5v3" />
      <path d="M16.5 3.5v3" />
      <path d="M3.5 9h17" />
      <path d="M12 12v5" />
      <path d="M9.5 14.5h5" />
    </>
  ),

  check: <path d="m5 12 4 4L19 6" />,

  checkCircle: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12 2.3 2.3 4.7-5" />
    </>
  ),

  chevronDown: <path d="m6 9 6 6 6-6" />,

  chevronRight: <path d="M9 5l7 7-7 7" />,

  clinic: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M12 8v6M9 11h6" />
      <path d="M8 20v-2M16 20v-2" />
    </>
  ),

  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3 2" />
    </>
  ),

  document: (
    <>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v5h4" />
      <path d="M10 12h5M10 16h5" />
    </>
  ),

  edit: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </>
  ),

  eye: (
    <>
      <path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),

  eyeOff: (
    <>
      <path d="M3 3l18 18" />
      <path d="M10.6 6.2A9.5 9.5 0 0 1 12 6c6.1 0 9.5 6 9.5 6a16 16 0 0 1-3.1 3.5" />
      <path d="M6.2 6.9C3.9 8.3 2.5 12 2.5 12s3.4 6 9.5 6c1.2 0 2.3-.2 3.3-.6" />
    </>
  ),

  filter: (
    <>
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </>
  ),

  fingerprint: (
    <>
      <path d="M12 3.5a8.5 8.5 0 0 0-8.5 8.5" />
      <path d="M12 6a6 6 0 0 0-6 6" />
      <path d="M12 8.5A3.5 3.5 0 0 0 8.5 12" />
      <path d="M12 3.5a8.5 8.5 0 0 1 8.5 8.5" />
      <path d="M12 6a6 6 0 0 1 6 6" />
      <path d="M12 8.5a3.5 3.5 0 0 1 3.5 3.5" />
      <path d="M7 15.5c1-1.1 1.5-2.4 1.5-3.5" />
      <path d="M17 15.5c-1-1.1-1.5-2.4-1.5-3.5" />
      <path d="M12 20v-5" />
    </>
  ),

  history: (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
      <path d="M12 7v5l3 2" />
    </>
  ),

  home: (
    <>
      <path d="M3 10.8L12 3l9 7.8" />
      <path d="M5.5 9.5V20h13V9.5" />
      <path d="M9.5 20v-5.8h5V20" />
    </>
  ),

  hospital: (
    <>
      <path d="M4 21V6h16v15" />
      <path d="M8 6V3h8v3" />
      <path d="M9 10h6" />
      <path d="M12 7v6" />
      <path d="M8 17h2" />
      <path d="M14 17h2" />
      <path d="M8 21v-4" />
      <path d="M16 21v-4" />
    </>
  ),

  idCard: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="11" r="1.8" />
      <path d="M6 16c.5-1.6 1.5-2.4 2.5-2.4s2 .8 2.5 2.4" />
      <path d="M14 9.5h4M14 13h4" />
    </>
  ),

  lock: (
    <>
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),

  logout: (
    <>
      <path d="M10 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H10" />
      <path d="M14 8l4 4-4 4" />
    </>
  ),

  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </>
  ),

  note: (
    <>
      <path d="M5 4h14v16H5z" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </>
  ),

  phone: <path d="M5 4h3l2 5-2 1.5c1 2 2.5 3.5 4.5 4.5L14 13l5 2v3c0 1.1-.9 2-2 2C10.4 20 4 13.6 4 7c0-1.7.4-3 1-3Z" />,

  queue: (
    <>
      <rect x="4" y="3.5" width="16" height="17" rx="2" />
      <path d="M8 7.5h8" />
      <path d="M8 11.5h2" />
      <path d="M14 11.5h2" />
      <path d="M8 15.5h2" />
      <path d="M14 15.5h2" />
    </>
  ),

  refresh: (
    <>
      <path d="M20 11a8 8 0 0 0-14.9-4" />
      <path d="M4 4v5h5" />
      <path d="M4 13a8 8 0 0 0 14.9 4" />
      <path d="M20 20v-5h-5" />
    </>
  ),

  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.5" />
      <path d="m16 16 5 5" />
    </>
  ),

  searchUser: (
    <>
      <circle cx="10.5" cy="8.5" r="3.2" />
      <path d="M4.5 19c.7-3.2 2.7-5 6-5 2 0 3.5.6 4.6 1.8" />
      <circle cx="17.2" cy="16.7" r="3.3" />
      <path d="M19.7 19.2l2 2" />
    </>
  ),

  shield: (
    <>
      <path d="M12 3 20 6v5c0 5-3.2 8.4-8 10-4.8-1.6-8-5-8-10V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),

  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c.8-4 3.4-6 8-6s7.2 2 8 6" />
    </>
  ),

  userCheck: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20c.6-3.3 2.5-5.2 5.5-5.2s4.9 1.9 5.5 5.2" />
      <path d="m16 11 2 2 4-4" />
    </>
  ),

  userPlus: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20c.6-3.3 2.5-5.2 5.5-5.2s4.9 1.9 5.5 5.2" />
      <path d="M18 9v6" />
      <path d="M15 12h6" />
    </>
  ),

  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20c.6-3.3 2.5-5.2 5.5-5.2s4.9 1.9 5.5 5.2" />
      <path d="M16 11a3 3 0 1 0 0-6" />
      <path d="M17 15c2.1.3 3.4 1.8 3.8 4" />
    </>
  ),

  visit: (
    <>
      <rect x="4" y="3.5" width="16" height="17" rx="2" />
      <path d="M8 7.5h8" />
      <path d="M8 11.5h8" />
      <path d="M8 15.5h4" />
      <circle cx="16.5" cy="15.5" r="2" />
    </>
  ),

  wallet: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
      <path d="M16 14h3" />
      <circle cx="16" cy="14" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),

  x: (
    <>
      <path d="m7 7 10 10" />
      <path d="m17 7-10 10" />
    </>
  ),

  xCircle: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m9 9 6 6" />
      <path d="m15 9-6 6" />
    </>
  ),
}

export function Icon({ name, size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

export const ActivityIcon = ({ size }) => <Icon name="activity" size={size} />
export const AlertTriangleIcon = ({ size }) => <Icon name="alertTriangle" size={size} />
export const ArrowLeftIcon = ({ size }) => <Icon name="arrowLeft" size={size} />
export const ArrowRightIcon = ({ size }) => <Icon name="arrowRight" size={size} />
export const CalendarIcon = ({ size }) => <Icon name="calendar" size={size} />
export const CalendarPlusIcon = ({ size }) => <Icon name="calendarPlus" size={size} />
export const CheckCircleIcon = ({ size }) => <Icon name="checkCircle" size={size} />
export const CheckIcon = ({ size }) => <Icon name="check" size={size} />
export const ClockIcon = ({ size }) => <Icon name="clock" size={size} />
export const FingerprintIcon = ({ size }) => <Icon name="fingerprint" size={size} />
export const HospitalIcon = ({ size }) => <Icon name="hospital" size={size} />
export const MailIcon = ({ size }) => <Icon name="mail" size={size} />
export const LockIcon = ({ size }) => <Icon name="lock" size={size} />
export const EyeIcon = ({ size }) => <Icon name="eye" size={size} />
export const EyeOffIcon = ({ size }) => <Icon name="eyeOff" size={size} />
export const LogoutIcon = ({ size }) => <Icon name="logout" size={size} />
export const QueueIcon = ({ size }) => <Icon name="queue" size={size} />
export const RefreshIcon = ({ size }) => <Icon name="refresh" size={size} />
export const SearchIcon = ({ size }) => <Icon name="search" size={size} />
export const ShieldIcon = ({ size }) => <Icon name="shield" size={size} />
export const UserIcon = ({ size }) => <Icon name="user" size={size} />
export const UsersIcon = ({ size }) => <Icon name="users" size={size} />
export const VisitIcon = ({ size }) => <Icon name="visit" size={size} />
export const XCircleIcon = ({ size }) => <Icon name="xCircle" size={size} />
export const XIcon = ({ size }) => <Icon name="x" size={size} />
export const ChevronRightIcon = ({ size }) => <Icon name="chevronRight" size={size} />
export const FilterIcon = ({ size }) => <Icon name="filter" size={size} />
export const PhoneIcon = ({ size }) => <Icon name="phone" size={size} />
export const HomeIcon = ({ size }) => <Icon name="home" size={size} />
export const SearchUserIcon = ({ size }) => <Icon name="searchUser" size={size} />
export const UserPlusIcon = ({ size }) => <Icon name="userPlus" size={size} />
export const UserCheckIcon = ({ size }) => <Icon name="userCheck" size={size} />