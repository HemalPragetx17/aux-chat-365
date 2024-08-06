import { Font, StyleSheet } from '@react-pdf/renderer';

Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf' },
    { src: '/fonts/Roboto-Bold.ttf' },
  ],
});
// Font.register({
//   family: 'Arial',
//   fonts: [{ src: '/fonts/Arial-Regular.ttf' }, { src: '/fonts/Arial-Bold.ttf' }]
// })

Font.register({
  family: 'BrittanySignature',
  fonts: [{ src: '/fonts/BrittanySignature-MaZx.ttf' }],
});

Font.register({
  family: 'Autography',
  fonts: [{ src: '/fonts/Autography-DOLnW.otf' }],
});

const styles = StyleSheet.create({
  borderFull: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#000000',
  },
  border: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#000000',
    borderBottom: 'none',
  },
  dividerTop: {
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderColor: '#000000',
  },
  dividerBottom: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#000000',
  },
  h3: { fontSize: 16, fontWeight: 700 },
  h4: { fontSize: 13, fontWeight: 700 },
  body1: { fontSize: 10 },
  subtitle1: { fontSize: 9, fontWeight: 700 },
  subtitle2: { fontSize: 8, fontWeight: 700 },
  small: { fontSize: 7 },
  alignCenter: { textAlign: 'center' },
  alignRight: { textAlign: 'right' },
  footer: {
    left: 0,
    right: 0,
    bottom: 0,
    padding: 24,
    margin: 'auto',
    borderTopWidth: 1,
    borderStyle: 'solid',
    position: 'absolute',
    borderColor: '#DFE3E8',
  },
  table: { display: 'flex', width: 'auto' },
  tableHeader: {},
  tableBody: {},
  noBorder: { paddingTop: 8, paddingBottom: 0, borderBottomWidth: 0 },
  tableCell_1: { width: '5%' },
  tableCell_2: { width: '50%', paddingRight: 16 },
  tableCell_3: { width: '15%' },
  pynone: { paddingTop: 0, paddingBottom: 0 },

  col2: { width: '18%' },
  col3: { width: '25%' },
  col4: { width: '33.33%' },
  col6: { width: '50%' },
  col8: { width: '66.67%' },
  col9: { width: '75%' },
  col10: { width: '83.33%' },
  col12: { width: '100%' },
  my2: { marginVertical: 2 },
  my4: { marginVertical: 4 },
  my6: { marginVertical: 6 },
  my8: { marginVertical: 8 },
  mb2: { marginBottom: 2 },
  mb4: { marginBottom: 4 },
  mb8: { marginBottom: 8 },
  mb10: { marginBottom: 10 },
  mb20: { marginBottom: 20 },
  mb40: { marginBottom: 40 },
  page: {
    padding: '40px 24px 0 24px',
    fontSize: 9,
    lineHeight: 1.6,
    fontFamily: 'Roboto',
    backgroundColor: '#fff',
    textTransform: 'capitalize',
  },
  gridContainer: { width: '100%' },
  heading: {
    fontSize: 24,
    fontWeight: 700,
    color: '#ef4361',
    borderBottom: '1px solid #ef4361',
    alignItems: 'center',
  },
  underline: {
    fontSize: 10,
    fontWeight: 100,
  },
  overline: {
    fontSize: 10,
    fontWeight: 600,
    width: '30%',
  },
  tableHeadContainer: {
    padding: 10,
    backgroundColor: '#bebdbd',
  },
  tableHead: {
    fontSize: 14,
  },
  tableRowContainer: {
    padding: 2,
    borderBottom: '1px solid #bebdbd',
  },
  tableRow: {
    fontSize: 10,
  },

  // Invoice styles

  invoicePage: {
    fontFamily: 'Roboto',
    fontSize: '12px',
    padding: 20,
  },
  card: {
    marginBottom: 20,
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  invoiceGridContainer: {
    margin: '20px 0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridItem: {
    flex: 1,
    marginRight: 16,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
  },
  invoicemb10: {
    marginBottom: 10,
  },
  invoiceHeading: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  logo: {
    display: 'flex',
    width: 35,
    height: 35,
    margin: 0,
    padding: 0,
  },
  templateName: {
    fontSize: 16,
  },
  address: {
    marginBottom: 5,
  },
  secondaryText: {
    color: '#555',
  },
  tableContainer: {
    marginTop: 20,
  },
  invoiceTableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #ddd',
    padding: '8px 0',
  },
  invoiceTableHeader: {
    flex: 1,
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    color: '#555',
  },
  signatureLabel: {
    fontWeight: 'bold',
  },
  signatureValue: {
    marginBottom: 5,
    color: '#555',
  },
  message: {
    color: '#555',
  },
  calcLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  calcValue: {
    marginBottom: 5,
    color: '#555',
  },
  divider: {
    borderTop: '1px solid #ddd',
    marginVertical: 10,
  },
  noteLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  noteText: {
    color: '#555',
  },
});

export default styles;
