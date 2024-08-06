import { LoadingButton } from '@mui/lab';
import { Alert } from '@mui/material';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import axios from '../../../utils/axios';
import CustomSpinner from '../../custom/CustomSpinner';

import SignaturePadComponent from './SignaturePadComponent';

const MySwal = withReactContent(Swal);

export default function ContractForm() {
  const [contractId, setContractId] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [contract, setContract] = useState<any>(null);
  const [display, setDisplay] = useState<'none' | 'block'>('none');
  const router = useRouter();
  const [signature, setSignature] = useState<any>('');
  const [disabled, setDisabled] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const [files, setFiles] = useState<any>(null);
  const [showButton, setShowButton] = useState<boolean>(true);

  useEffect(() => {
    const { slug } = router.query;
    const contractId = (slug as string[])[0];
    setContractId(contractId);
  }, [router]);

  useEffect(() => {
    if (Boolean(contractId)) {
      fetchContractDetails();
    }
  }, [contractId]);

  const fetchContractDetails = async () => {
    setLoading(true);
    setError(false);
    setSending(false);
    setFiles(null);
    const response = await axios.get(`/contracts/${contractId}`);
    if (response.status !== 200) {
      setError(true);
      setLoading(false);
      return false;
    }
    const contract = response?.data?.data;
    setContract(contract);
    setLoading(false);
  };

  useEffect(() => {
    if (Boolean(contract)) {
      const { contractTemplate, status } = contract;
      const { adminField, userField } = contractTemplate;
      var inputs = document.querySelectorAll(
        'input, textarea, select, checkbox',
      );

      if (status !== 'SIGNED') {
        const { contact, requiredFields } = contract;
        let fullName = '';
        if (Boolean(contact?.firstName)) {
          fullName += contact?.firstName;
        }
        if (Boolean(contact?.firstName)) {
          fullName += ` ${contact?.lastName}`;
        }

        if (requiredFields?.length > 0) {
          for (let field of requiredFields) {
            (document as any).getElementById(field.id).innerHTML = field.value;
          }
        }

        if ((document as any).getElementById('full_name_field')) {
          (document as any).getElementById('full_name_field').innerHTML =
            fullName || '';
        }

        if ((document as any).getElementById('full_name')) {
          const key =
            (document as any).getElementById('full_name').tagName === 'INPUT'
              ? 'value'
              : 'innerHTML';
          (document as any).getElementById('full_name')[key] = fullName || '';
        }
        if ((document as any).getElementById('phone_number')) {
          (document as any).getElementById('phone_number').innerHTML =
            contact?.phone || '';
        }
        if ((document as any).getElementById('address')) {
          (document as any).getElementById('address').innerHTML =
            contact?.address?.city || '';
        }
        if ((document as any).getElementById('current_date_field')) {
          (document as any).getElementById('current_date_field').innerHTML =
            moment().format('MM-DD-YYYY, hh:mm:ss A');
        }

        inputs.forEach(function (input) {
          const _ele = input as any;
          _ele.disabled = true;
          const isAdminField = adminField.indexOf(_ele.id) > -1;
          const isUserField = userField.indexOf(_ele.id) > -1;
          _ele.disabled = isAdminField;
          _ele.required = isUserField;
          _ele.addEventListener('change', validateForm);
        });

        let fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(function (input) {
          input.addEventListener('change', onImageUploaded);
        });

        const signature_button = (document as any).getElementById('signature');
        signature_button.addEventListener('click', openSignaturePad);
        signature_button.disabled = true;

        const { payment } = contract;
        const buttonText = payment?.payment_url
          ? 'Proceed to payment'
          : 'Submit for Merchant Validation';
        setButtonText(buttonText);
      }

      if (status === 'SIGNED') {
        inputs.forEach(function (input) {
          const _ele = input as any;
          _ele.disabled = true;
          const isAdminField = adminField.indexOf(_ele.id) > -1;
          _ele.disabled = !isAdminField;
        });
        if ((document as any).getElementById('admin_signature')) {
          (document as any)
            .getElementById('admin_signature')
            .addEventListener('click', openSignaturePad);
        } else {
          setSignature(true);
        }
        setButtonText('Validate and generate PDF');
      }

      setDisplay('block');
    }
  }, [contract]);

  const validateForm = () => {
    var form: any = document.getElementById('myForm');
    const validForm = form.checkValidity();
    const signature_button = (document as any).getElementById('signature');
    if (signature_button) {
      signature_button.disabled = !validForm;
    }
  };

  const onImageUploaded = (event: any) => {
    const id = event?.target?.id;
    const file = event?.target?.value;
    const isImage = validateImageUpload(file);
    if (!isImage) {
      toast.error('Please Upload Image');
      (document as any).getElementById(`${id}`).value = '';
      return false;
    }
    setFiles({ id: `${id}_preview`, file: event.target.files[0] });
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onloadend = () => {
      const preview_container = (document as any).getElementById(
        `${id}_preview`,
      );
      preview_container.src = reader.result;
      preview_container.width = id === 'driving_license' ? 150 : 100;
    };
  };

  const validateImageUpload = (filePath: any) => {
    var fileExtension = filePath.split('.').pop().toLowerCase();
    var allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    if (allowedExtensions.indexOf(fileExtension) === -1) {
      return false;
    }
    return true;
  };

  const openSignaturePad = () => {
    MySwal.fire({
      html: '<div id="signature-pad-container" style="overflow: hidden"></div>',
      showCancelButton: false,
      showConfirmButton: false,
      didOpen: () => {
        const container = document.getElementById('signature-pad-container');
        // eslint-disable-next-line react/no-deprecated
        ReactDOM.render(
          <SignaturePadComponent
            onSign={setSignature}
            setSign={(e: any) => handleSign(e)}
            onClose={() => {
              setSignature(null);
              MySwal.close();
            }}
          />,
          container,
        );
      },
    });
  };

  const handleSign = (src: any) => {
    MySwal.close();
    setSignature(src);
    const button_id =
      contract?.status === 'SIGNED' ? 'admin_signature' : 'signature';
    const signatureButton: any = document.getElementById(button_id);
    const signatureImage = document.createElement('img');
    signatureImage.src = src;
    signatureImage.width = 300;
    signatureImage.height = 100;
    signatureImage.alt = 'Signature';
    signatureImage.id = 'signature_image';
    signatureButton.parentNode.replaceChild(signatureImage, signatureButton);
    (document as any).getElementById(`${button_id}_head`).outerHTML = '';
  };

  const handleSubmit = async () => {
    setSending(true);
    var form: any = document.getElementById('myForm');
    const validForm = form.checkValidity();
    if (!(validForm && Boolean(signature))) {
      toast.error('Please fill all the details and sign the form');
      setSending(false);
      return false;
    }

    await handleUploadImage();

    var inputs = document.querySelectorAll('input, textarea, select, checkbox');
    inputs.forEach(function (input) {
      const _ele = input as any;
      if (_ele.type === 'checkbox') {
        _ele.checked = true;
        _ele.setAttribute('checked', true);
      } else {
        _ele.defaultValue = _ele.value;
      }
      _ele.disabled = true;
    });

    const field_name =
      contract?.status === 'SIGNED' ? 'admin_full_name' : 'full_name';
    if ((document as any).getElementById(`${field_name}_field`)) {
      (document as any).getElementById(`${field_name}_field`).innerHTML = (
        document as any
      ).getElementById(field_name).value;
    }

    let fileInputs = document.querySelectorAll('.file-upload-btn');
    fileInputs.forEach(function (input) {
      input.parentNode?.removeChild(input);
    });

    const rawContract = (document as any).getElementById(
      'template_container',
    ).innerHTML;

    const response = await axios.put(`/contracts/${contractId}`, {
      rawContract,
      status: 'SIGNED',
    });
    if (response.status === 200) {
      if (contract?.status !== 'SIGNED') {
        toast.success('Contract Filled Successfully!');
        setShowButton(false);
        const { payment } = contract;
        if (payment?.payment_url) {
          window.location.assign(payment.payment_url);
        }
      }
      if (contract?.status === 'SIGNED') {
        toast.success('Contract Validated! Downloading PDF...');
        const full_name = (document as any).getElementById(
          `full_name_field`,
        ).innerHTML;
        handlePDFGenerate(full_name);
      }
      setLoading(false);
      setDisabled(true);
    }
  };

  const handleUploadImage = async () => {
    try {
      if (files) {
        const { id, file } = files;
        const header = {
          headers: {
            'Content-Type': 'multipart/form-data',
            bodyParser: false,
          },
        };
        const upload = await axios.put('/shared/upload/', { file }, header);
        const { Location } = upload?.data;
        const preview_container = (document as any).getElementById(id);
        preview_container.src = Location;
      }
    } catch (error) {
      toast.error('Error in Uploading File! Please refresh page and try again');
      return false;
    }
  };

  const handlePDFGenerate = async (name: string) => {
    const input: any = document.getElementById('template_container');
    const currentWidth = input.style.width;
    const currentHeight = input.style.height;
    input.style.paddingLeft = '10px';
    input.style.paddingRight = '10px';
    input.style.width = '600px';
    input.style.height = '1200px';

    html2canvas(input, {
      allowTaint: true,
      useCORS: true,
    }).then(async (canvas) => {
      const imgData: any = canvas.toDataURL('image/png');
      const pdf: any = new jsPDF('p', 'mm', 'a4');
      var width = pdf.internal.pageSize.getWidth();
      var height = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
      pdf.addPage();

      var img = new Image();
      img.src = '/images/backgrounds/dsc.png';
      var imgWidth = pdf.internal.pageSize.getWidth();
      var imgHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(img, 'PNG', 0, 0, imgWidth, imgHeight);

      pdf.setFontSize(32);
      pdf.text('Digital Signature Certificate', 20, 30);
      pdf.setFontSize(10);
      pdf.text(`Reference Number - ${contractId}`, 20, 40);

      let signature_image: any = document.getElementById('signature_image');
      signature_image = await html2canvas(signature_image);
      signature_image = signature_image.toDataURL('image/png');
      pdf.addImage(signature_image, 'JPEG', 20, 75);

      pdf.setFontSize(10);
      const { signedIp, signedAt } = contract?.lifecycleAttributesForCustomer;
      pdf.text(`IP Address : ${signedIp?.replaceAll('::ffff:', '')}`, 20, 115);
      pdf.text(
        `Signed On : ${moment(signedAt).format('MM-DD-YYYY, HH:mm:ss')}`,
        20,
        120,
      );
      pdf.text(name, 20, 125);
      pdf.save('download.pdf');

      input.style.width = currentWidth;
      input.style.height = currentHeight;

      setShowButton(false);
    });
  };

  return (
    <>
      {loading ? (
        <CustomSpinner />
      ) : (
        <>
          {error ? (
            <Alert icon={false} severity="error" sx={{ fontSize: 14 }}>
              Invalid Contract. Please try again later.
            </Alert>
          ) : (
            <form id="myForm" style={{ maxWidth: 600, width: '80%', display }}>
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    contract?.rawContract ||
                    contract?.contractTemplate?.contractHtml,
                }}
                id="template_container"
              />
              {showButton && (
                <LoadingButton
                  fullWidth
                  onClick={handleSubmit}
                  variant="contained"
                  loading={sending}
                  disabled={disabled}
                >
                  {buttonText}
                </LoadingButton>
              )}
            </form>
          )}
        </>
      )}
    </>
  );
}
