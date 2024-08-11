import { formatDate3 } from "../../Views/Helper/DateFormat";


export const SubjectContent = ({ detail_api_data }) => {
    const generateSubject = (detail_api_data) => {
        if (detail_api_data?.purchase_order_id) {
            return `Purchase Order from ${detail_api_data?.vendor?.first_name + " " + detail_api_data?.vendor?.last_name} (Purchase Order #: ${detail_api_data?.purchase_order_id})`;
        }
    };

    return generateSubject(detail_api_data);
};

export const BodyContent = ({ detail_api_data }) => {
    const generateBody = (detail_api_data) => {
        if (detail_api_data?.purchase_order_id) {
            return `<p>----------------------------------------------------------------------------------------</p><p><br></p><h2>Purchase Order&nbsp;# :&nbsp;${detail_api_data?.purchase_order_id}<br>Total: ${detail_api_data?.total} </h2><p><br></p><p>----------------------------------------------------------------------------------------</p><p><strong>&nbsp;Order Date&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;${formatDate3(detail_api_data?.transaction_date)}</p><p>----------------------------------------------------------------------------------------</p><p><br></p><p>Please go through it and confirm the order. We look forward to working with you again</p><p><br></p><p><br></p><p>Regards,</p><p><br></p><p>${detail_api_data?.email}</p><p>${detail_api_data?.vendor?.first_name + " " + detail_api_data?.vendor?.last_name}</p><p><br></p>`;
            ;
        } else if (detail_api_data?.quotation_id) {
            return `<p>----------------------------------------------------------------------------------------</p><p><br></p><h2>Purchase Order&nbsp;# :&nbsp;${detail_api_data?.quotation_id}<br>Total: ${detail_api_data?.total} </h2><p><br></p><p>----------------------------------------------------------------------------------------</p><p><strong>&nbsp;Order Date&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;${formatDate3(detail_api_data?.transaction_date)}</p><p>----------------------------------------------------------------------------------------</p><p><br></p><p>Please go through it and confirm the order. We look forward to working with you again</p><p><br></p><p><br></p><p>Regards,</p><p><br></p><p>${detail_api_data?.email}</p><p>${detail_api_data?.customer?.first_name + " " + detail_api_data?.customer?.last_name}</p><p><br></p>`;
            ;
        }
    };

    return generateBody(detail_api_data);
};

