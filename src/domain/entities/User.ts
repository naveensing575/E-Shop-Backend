export interface User {
  email: string;
  firstName: string;
  lastName: string;
  address: any;
  phoneNumber: string;
  uid: string;
}

export interface Address {
  flat: string;
  street: string;
  city: string;
  country: string;
  zipcode: string;
}
