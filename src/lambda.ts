import { ConnectContactFlowEvent, Context, Handler, KinesisStreamEvent } from "aws-lambda";
import { Connect, DynamoDB } from "aws-sdk";
import { dynamodb } from "./functions/dynamodb/client";
import { connect } from "./functions/amazonConnect/connect";
import { IVRResponse, customer } from "./types";


const affectedAreas = ['5374', '1215'];

export const handler: Handler = async (event: ConnectContactFlowEvent, context: Context): Promise<IVRResponse> => {
    console.log('Lambda event payload:', event);
    // TODO: handle records
    if (!isContactFlow(event)) return;
    const nin = event.Details.ContactData.Attributes.nin;
    if (!nin) {
        return {
            message: 'Please enter your NAB identification number',
            requestField: 'nin',
        };
    }
    const password = event.Details.ContactData.Attributes.password;
    if (!password) {
        return {
            message: 'Please enter your NAB identification password',
            requestField: 'password',
        }
    }
    console.log('Nin:', nin);
    console.log('Password:', password);
    const findCustomer = customer.find((element) => element.nin === nin && element.password === password);
    if (!findCustomer) {
        return {
            exitLoop: true,
            message: ''
        }
    }
    if (affectedAreas.includes(findCustomer.postalCode)) {
        return {
            exitLoop: true,
            message:`Thanks ${findCustomer.name}, Your request has been approved. We will contact you soon`,
            name: findCustomer.name,
            postalCode: findCustomer.postalCode,
            nin: findCustomer.nin,
            customer: 'true',
        }
    } else {
        return {
            exitLoop: true,
            message: '',
        }
    }
}

function isContactFlow(event: any): event is KinesisStreamEvent {
    return (
        Boolean(event.Name === 'ContactFlowEvent')
    );
}
