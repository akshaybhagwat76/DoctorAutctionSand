// localstorage key used to store user data
export const LOCALSTORAGE_USER = 'doctor-sand-user';

// Roles ids
export const ROLE_ID_BUYER = 1;
export const ROLE_ID_SELLER = 2;
export const ROLE_ID_RETAILER = 3;
export const ROLE_ID_ADMIN = 4;

//bid states
// export const REGISTERD_BID = 10;
// export const WINNER = 20;
// export const AWAITING_RESULT = 30;
// export const AWAITING_PR = 40;
// export const PR_REJECTED = 50;
// export const LOST = 60;
// export const SELLER_NOTIFIED = 70;
// export const SELLER_CONFIRMED = 80;
// export const BUYER_NOTIFIED = 90;
// export const BUYER_CONFIRMED = 100;
// export const SELLER_REJECTED = 110;

//auction states
export const UPCOMING = 1;
export const LIVE = 2;
export const COMPLETED = 3;
export const CANCELLED = 4;
//bid states
export const REGISTERD_BID = 10;
export const AWAITING_RESULT = 20;
export const AWAITING_OR = 30;
export const OR_GENERATED = 40;
export const OR_CONFIRMED_SELLER = 50;
export const OR_REJECTED_SELLER = 60;
export const OR_SENT = 70;
export const OR_CONFIRMED_BUYER = 80;
export const OR_REJECTED_BUYER = 90;
export const OC_GENERATED = 100;
export const OC_SENT = 110;
export const OC_CONFIRMED_SELLER = 120;
export const OC_REJECTED_SELLER = 130;
// export const OC_CONFIRMED_BUYER = 140;
// export const OC_REJECTED_BUYER = 150;
export const LOST = 200;

//bid refresh time
export const BID_REFRESH_SEC = 10;

//security check flag
export const SECURITY_DEPOSIT_ENABLED = 0;

//account types
export const CURRENT_ACCOUNT = 1;
export const NODAL_ACCOUNT = 2;
export const CREDIT_ACCOUNT = 3;

//consignment status
export const CONSIGNMENT_ADDED = 10;
export const DC_GENERATED = 20;
export const DC_ACCEPTED = 30;
export const INVOICE_GENERATED = 40;

//consignment invoice
export const NEW = 1;
export const PAY_COMPLETED = 2;

//consignment invoice payment mode
export const CHEQUE = 1;
export const RTGS = 2;

// product types

export const SAND_BULK = 1;
export const SUPPLEMNETRY = 2;
export const SAND_BAG = 3;

export const DEFAULT_TRUCK_SIZE = 1;
export const DEFAULT_BAG_SIZE = 25;

export const DEFAULT_UNIT_TRUCK = {name: 'ton', value: 1};
export const DEFAULT_UNIT_BAG = {name: 'kg', value: 2};
export const UNITS = {kg: 2, ton: 1};

export const ORDER_CREATED = 0;
export const ORDER_PLACED = 10;
export const NOTIFIED_SELLER = 20;
export const SELLER_CONFIRMED = 30;
export const SELLER_REJECTED = 40;
export const BUYER_ACCEPTED = 50;
export const BUYER_REJECTED = 60;
export const ORDER_HOLD = 70;

//order consignment approval status
export const NOT_APPROVED = 0;
export const APPROVED = 1;
export const RESCHEDULE = 2;
export const CONSIGMENT_STATUS: any = {
    0: 'Not Approved',
    1: 'Approved',
    2: 'Rescheduled',
    3: 'Dispathced',
    4: 'Delivered',
    5: 'Paid'
};

//truck attachment type
export const TRANSIT_PASS = 1;
export const OTHER_DOCS = 2;
export const INVOICE = 3;
export const DELIVERY_CHALLAN = 4;
export const F_VARIANCE = 20; //in percentage

//enquiry status
export const ENQUIRY_STATUS: any = {
  RECEIVED: 10,
  MEETING_DONE: 20,
  CANCELLED: 30,
  CONVERTED_TO_ORDER: 40,
};

export const ENQUIRY_STATUS_ENUM: any = {
  [ENQUIRY_STATUS.RECEIVED]: 'New Enquiry',
  [ENQUIRY_STATUS.MEETING_DONE]: 'Meeting Done',
  [ENQUIRY_STATUS.CANCELLED]: 'Cancelled',
  [ENQUIRY_STATUS.CONVERTED_TO_ORDER]: 'Enquiry Converted To Order',
};

