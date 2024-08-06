// ** Demo Components Imports

// ** Styled Component
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import CustomDatePickerWrapper from '../../../components/custom/CustomDatePickerWrapper';
import { AppDispatch } from '../../../store/Store';

const InvoiceEdit = () => {
  const store = useSelector((state: any) => state.invoice);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (store?.invoiceId) {
      // dispatch(getInvoice(store?.invoiceId))
      //   .then(() => {
      //     toast.success('Success')
      //   })
      //   .catch(error => {
      //     toast.error(error?.message)
      //   })
    }
  }, [store?.invoiceId]);

  return (
    <CustomDatePickerWrapper
      sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}
    >
      {/* {store?.invoiceId && <Edit id={store?.invoiceId} />} */}
    </CustomDatePickerWrapper>
  );
};

export default InvoiceEdit;
