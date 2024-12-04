export interface Booking{
_id:object,
no_of_people: number,
Date: Date,
Time: string,
username: string
}
export interface Product{
    _id:object,
    name: string,
  price: number,
  description: string,
  image: string
}
export interface Order{
    _id:object,
    orderNo: number,
    products: Product[],
    address: string,
    status: string,
    username: string,
    createdAt: Date
}

export interface Cart{
    _id:object,
    username: string,  
    products: Product[]
    }
    
    export interface User{
        _id:object,
        email: string,
        name: string,
        isAdmin: boolean,
        username: string,
        password: string,
        phoneNo: string

    }