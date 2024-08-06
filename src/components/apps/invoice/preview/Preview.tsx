// ** React Imports
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import moment from 'moment';

import { formatPayment } from '../../../../utils/format';

type InvoiceLayoutProps = {
  data?: any;
};

const Preview = ({ data }: InvoiceLayoutProps) => {
  console.log('data::: ', data);
  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <div className="create_inv_div_right">
            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
              <Box gridColumn="span 12" sx={{ width: '100%' }}>
                <div
                  className="logo_vertual1"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                  }}
                >
                  <Typography sx={{ mb: 2, color: 'text.info' }}>
                    {data?.companyName}
                  </Typography>
                  {/* <Image
                    width={150}
                    height={150}
                    alt="logo"
                    src={'/images/logos/aux365-logo-icon-black.png'}
                  /> */}
                  {/* <Image
                    className="QRcode"
                    width={150}
                    height={150}
                    alt="QRcode"
                    src={'/images/logos/QRcode.png'}
                  /> */}
                </div>
              </Box>
            </Box>
            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
              <Box gridColumn="span 4">
                <ul className="list_ul">
                  <li className="li_list">
                    <p className="top-p2">
                      Invoice to {data?.customerCompany || data?.customerName} $
                      {data?.subtotal} USD
                    </p>
                  </li>
                  <li className="li_list">
                    <p className="top-p1">
                      <span style={{ minWidth: 50, display: 'inline-block' }}>
                        Due{' '}
                      </span>
                      {moment(data?.dueDate).format('MMM DD, YYYY')}
                    </p>
                  </li>
                  <li className="li_list">
                    <p className="top-p1">
                      <span style={{ minWidth: 50, display: 'inline-block' }}>
                        Covered{' '}
                      </span>
                      {moment(data?.dueDate).format('MMM DD, YYYY') +
                        '-' +
                        moment(data?.createdAt).format('MMM DD, YYYY')}
                    </p>
                  </li>
                  <li className="li_list">
                    <p className="top-p1">
                      <span style={{ minWidth: 50, display: 'inline-block' }}>
                        Status{' '}
                      </span>
                      {data?.status}
                    </p>
                  </li>
                </ul>
              </Box>
              <Box gridColumn="span 8">
                <ul className="list_ul">
                  <li className="li_list d-flex">
                    <p className="top-p1">Invoice #</p>
                    <p className="top-p2">{data?.invoiceNumber}</p>
                  </li>

                  <li className="li_list d-flex">
                    <p className="top-p1">Date Issued:</p>
                    <p className="top-p2">
                      {moment(data?.createdAt).format('MMM DD, YYYY')}
                    </p>
                  </li>
                  <li className="li_list d-flex">
                    <p className="top-p1">Requested by</p>
                    <p className="top-p2">AUX365</p>
                  </li>
                  <li className="li_list d-flex">
                    <p className="top-p1">Email:</p>
                    <p className="top-p2">aux365@auxgroup.net</p>
                  </li>
                  <li className="li_list d-flex">
                    <p className="top-p1">Phone:</p>
                    <p className="top-p2">{data?.companyPhoneNumber}</p>
                  </li>
                  <li className="li_list d-flex">
                    <p className="top-p1">Message:</p>
                    <p className="top-p2">
                      {data?.message ? data?.message : '-'}
                    </p>
                  </li>
                </ul>
              </Box>
            </Box>
            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
              {!data.shippingSameAsBilling && (
                <Box gridColumn="span 12">
                  <ul className="list_ul">
                    <li className="li_list">
                      <p
                        style={{
                          borderBottom: ' solid',
                          paddingBottom: '2px',
                        }}
                        className="top-p heading"
                      >
                        Shipping details
                      </p>
                    </li>
                    {data?.shippingAddress ? (
                      <li
                        className="li_list customer_div"
                        style={{ width: 200 }}
                      >
                        <p className="p1">Shipping Address:</p>
                        <p className="p2">{data.shippingAddress}</p>
                      </li>
                    ) : (
                      <>-</>
                    )}
                  </ul>
                </Box>
              )}

              <Box gridColumn="span 12" sx={{ m: 0, p: 0 }}>
                <ul className="list_ul">
                  <li className="li_list">
                    <p
                      style={{
                        borderBottom: ' solid',
                        paddingBottom: '2px',
                      }}
                      className="top-p heading"
                    >
                      Customer Details:
                    </p>
                  </li>
                </ul>
              </Box>
              <Box gridColumn="span 6" sx={{ m: 0, p: 0 }}>
                <ul className="list_ul">
                  <li className="li_list customer_div" style={{ width: 320 }}>
                    <p className="p1">Name:</p>
                    <p className="top-p2">{data.customerName}</p>
                  </li>
                  <li className="li_list customer_div" style={{ width: 320 }}>
                    <p className="p1">Email:</p>
                    <p className="p2">{data.customerEmail}</p>
                  </li>
                  <li className="li_list customer_div" style={{ width: 320 }}>
                    <p className="p1">Phone Number:</p>
                    <p className="p2">{data.customerPhoneNumber}</p>
                  </li>
                  <li className="li_list customer_div" style={{ width: 320 }}>
                    <p className="p1">Company Name:</p>
                    <p className="p2">{data?.companyName}</p>
                  </li>
                  <li className="li_list customer_div" style={{ width: 320 }}>
                    <p className="p1">Address:</p>
                    <p className="p2">{data?.companyAddress}</p>
                  </li>
                </ul>
              </Box>
            </Box>
            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
              <Box gridColumn="span 12">
                <div className="outer-table">
                  <ul className="list_ul">
                    <li className="li_list">
                      <p
                        style={{
                          borderBottom: ' solid',
                          paddingBottom: '2px',
                        }}
                        className="top-p heading"
                      >
                        Transaction Details:{' '}
                        <span style={{ float: 'right' }}>
                          Total Items #<span>{data?.products?.length}</span>
                        </span>
                      </p>
                    </li>
                  </ul>
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th style={{ minWidth: '250px' }}>PRODUCT</th>
                        <th>PRODUCT QTY</th>
                        <th>PRICE/AMOUNT ($)</th>
                        <th>TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.products?.map((item: any, index: any) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.description}</td>
                          <td>{item.quantity}</td>
                          <td>${formatPayment(item.price)}</td>
                          <td>${formatPayment(item.quantity * item.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Box>
            </Box>
            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
              <Box gridColumn="span 5"></Box>
              <Box gridColumn="span 7">
                <ul
                  className="list_ul"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                  }}
                >
                  <li className="li_list customer_div" style={{ width: 320 }}>
                    <p className="p1">Sub-Total Amount:</p>
                    <p className="top-p2">${formatPayment(data?.subtotal)}</p>
                  </li>
                  <li className="li_list customer_div" style={{ width: 320 }}>
                    <p className="p1">Technology Fee:</p>
                    <p className="top-p2">${formatPayment(data?.tax)}</p>
                  </li>
                  <li className="li_list customer_div" style={{ width: 320 }}>
                    <p className="p1">Total:</p>
                    <p className="top-p2">${formatPayment(data?.total)}</p>
                  </li>
                </ul>
              </Box>
            </Box>

            <div className="right_bottom_div" style={{ padding: '0 0 0 35px' }}>
              <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
                <Box gridColumn="span 12">
                  <p style={{ color: 'gray' }}>Note :</p>
                  <p
                    style={{
                      background: '#e8e8e8',
                      padding: '10px 15px',
                    }}
                  >
                    {data.note}
                  </p>
                </Box>
                <Box
                  gridColumn="span 12"
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <p style={{ color: 'gray' }}>Page 1 of 1</p>
                  <p>@ 2024 Aux 365.net. All Rights Reserved</p>
                </Box>
              </Box>
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default Preview;
