import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Preview from '../../../components/apps/invoice/preview/Preview';
import axios from '../../../utils/axios';

const InvoicePreview = () => {
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (router?.query?.id) {
      const getInvoice = async (id: string) => {
        const response = await axios.get(`/invoice/${id}`);
        const resp = response.status === 200 ? response.data.data : null;
        setInvoiceData(resp);
      };
      getInvoice(router?.query?.id as string);
    }
  }, [router]);

  return invoiceData && <Preview data={invoiceData} />;
};

export default InvoicePreview;
