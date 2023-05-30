export type Customer = {
    nin: string,
    password: string,
    name: string,
    postalCode: string,
}

export const customer: Customer[] = [
    {
        nin: '1234',
        password: '0000',
        name: 'Hugh Tran',
        postalCode: '5374'
    },
    {
        nin: '2345',
        password: '0000',
        name: 'Alex Tran',
        postalCode: '0000'
    },
];

export enum IVRResponseStatus {
    APPROVED = 'approved',
    REJECTed = 'rejected'
};

export type IVRResponse = Partial<Omit<Customer, 'password'>> & {
    message: string;
    exitLoop?: boolean;
    status?: IVRResponseStatus;
    requestField?: string,
    customer?: string,
};