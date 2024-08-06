// ** React Imports
import { ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// ** Layout Import

// ** Demo Components Imports
import PrintPage from '../../../components/apps/invoice/print/PrintPage';
import BlankLayout from '../../../layouts/blank/BlankLayout';
import { AppDispatch } from '../../../store/Store';
import axios from '../../../utils/axios';

const InvoicePrint = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [invoiceId, setInvoiceId] = useState<string>('');

  useEffect(() => {
    const id = localStorage.getItem('invoiceId');
    setInvoiceId(invoiceId);
    if (id) {
      const getInvoice = async (id: string) => {
        try {
          setLoading(true);
          const response = await axios.get(`/invoice/${id}`);
          const resp = response.status === 200 ? response.data.data : [];
          setInvoiceData(resp);
          setLoading(false);
        } catch (e) {
          setLoading(false);
        }
      };

      getInvoice(id);
      localStorage.removeItem('invoiceId');
    }
  }, []);

  return invoiceData && <PrintPage id={invoiceId} invoiceData={invoiceData} />;
};

// InvoicePrint.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;
InvoicePrint.layout = 'Blank';

InvoicePrint.setConfig = () => {
  return {
    mode: 'light',
  };
};

export default InvoicePrint;
