export interface Address {
  flat: string;
  street: string;
  city: string;
  country: string;
  zipcode: string;
}

export interface UserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  address: Address;
  phoneNumber: string;
  uid: string;
}
