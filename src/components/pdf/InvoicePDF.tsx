import { Document, Page, Text, View } from '@react-pdf/renderer';
import moment from 'moment';

// import theme from './theme'; // Import your theme file
import { InvoiceType } from '../../types/apps/invoiceTypes';
import { formatPhoneNumber } from '../../utils/format';

import styles from './Style'; // Import your styles file

interface Props {
  data: InvoiceType | null;
}
const InvoicePDF = (props: Props) => {
  const { data } = props;

  return (
    <Document>
      <Page size="A4" style={styles?.invoicePage}>
        {/* Header */}
        <View>
          <View
            style={{
              ...styles.mb10,
              ...styles.logoContainer,
            }}
          >
            <Text style={{ ...styles.heading }}>Aux365 Invoice </Text>

            {/* <Text style={{ color: '#000', fontSize: '1.5rem' }}>
              #{data?.invoiceNumber || 0}
            </Text> */}
          </View>

          <View style={styles.invoiceGridContainer}>
            <View style={{ ...styles.gridItem, flex: 0.7 }}>
              <View>
                <Text style={styles?.secondaryText}>{data?.companyName}</Text>
                <Text style={styles?.secondaryText}>{`${formatPhoneNumber(
                  data?.companyPhoneNumber,
                )}`}</Text>
                <Text style={styles?.secondaryText}>
                  {' '}
                  {moment(data?.createdAt).format('MM-DD-YYYY')}
                </Text>
              </View>
            </View>
          </View>
          {/* Invoice To */}
          <View
            style={{ ...styles?.invoiceGridContainer, flexDirection: 'column' }}
          >
            <Text style={styles?.secondaryText}>{data?.customerName}</Text>
            <Text style={styles?.secondaryText}>
              {data?.customerPhoneNumber}
            </Text>
          </View>

          {/* Item Table */}
          <View style={styles?.tableContainer}>
            <View style={styles?.invoiceTableRow}>
              <Text style={styles?.invoiceTableHeader}>Name</Text>
              <Text style={styles?.invoiceTableHeader}>Cost</Text>
            </View>
            {data?.items?.map((item: any, index: number) => (
              <View key={index} style={styles?.invoiceTableRow}>
                <Text style={styles?.tableCell}>{item.name}</Text>
                <Text style={styles?.tableCell}>${item.cost}</Text>
              </View>
            ))}
          </View>

          {/* Footer */}

          <View style={{ ...styles?.invoiceGridContainer, marginTop: '20px' }}>
            <View style={{ ...styles.gridItem, flex: 0.7 }}>
              <Text style={styles?.signatureLabel}>Signature:</Text>
              <Text style={styles?.signatureValue}>{data?.signature}</Text>
              {/* <Text style={styles?.message}>{data?.message}</Text> */}
            </View>
            <View style={{ ...styles.gridItem, flex: 0.3 }}>
              {/* Calculate and display totals  */}
              <Text style={styles?.calcLabel}>
                Subtotal:{' '}
                <Text style={styles?.calcValue}>${data?.subtotal}</Text>
              </Text>

              <Text style={styles?.calcLabel}>
                Tax: <Text style={styles?.calcValue}>{data?.tax}%</Text>
              </Text>

              <View style={styles?.divider} />
              <Text style={styles?.calcLabel}>
                Total: <Text style={styles?.calcValue}>${data?.total}</Text>
              </Text>
            </View>
          </View>
          {/* Additional Sections (if any) */}

          {/* Note Section
          <View style={styles?.cardContent}>
            <View style={styles?.divider} />
            <Text style={styles?.noteText}>{data?.note}</Text>
          </View> */}
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
