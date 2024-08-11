import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './SendMail.scss';
import { purchasesDetails, purchasesSendMail } from '../../Redux/Actions/purchasesActions';
import { useDispatch, useSelector } from 'react-redux';
import { MultiImageUpload } from '../../Views/Helper/ComponentHelper/ImageUpload';
import MainScreenFreezeLoader from '../Loaders/MainScreenFreezeLoader';
import { useLocation, useNavigate } from 'react-router-dom';
import { BodyContent, SubjectContent } from './ShowMailContent';
import { Toaster } from 'react-hot-toast';
import { generatePDF, generatePDF1 } from '../../Views/Helper/DateFormat';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { quotationDetails, quotationSend } from '../../Redux/Actions/quotationActions';

const modules = {
  toolbar: [
    [{ 'font': [] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'align': [] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'color': [] }, { 'background': [] }],
    ['link', 'image'],
    ['clean']
  ]
};

const SendMail = ({ recipientName }) => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const location = useLocation();
  const purchaseEmail = useSelector((state) => state?.purchseSend);
  const params = new URLSearchParams(location.search);
  const [freezLoadingImg, setFreezLoadingImg] = useState(false);
  const [imgLoader, setImgeLoader] = useState('');

  const data = location.state?.data || {};

  const [detail_api_data, setDetail_api_data] = useState(null); // Initialize with null

  // console.log("daaaaaaaaaaaaa from mailsend", detail_api_data)

  useEffect(() => {
    if (data?.transaction?.purchase_order_id) {
      dispatch(purchasesDetails({ id: data?.transaction?.id }, setDetail_api_data));
    } else if (data?.id) {
      dispatch(quotationDetails({ id: data?.id }, setDetail_api_data));
    }
  }, [data, dispatch]);

  const [formData, setFormData] = useState({
    from: detail_api_data?.email,
    to: '',
    subject: '',
    body: '',
    upload_documents: [],
  });

  useEffect(() => {
    if (detail_api_data) {
      setFormData(prevFormData => ({
        ...prevFormData,
        from: detail_api_data?.email,
        subject: SubjectContent({ detail_api_data }), // Generate subject here
        body: BodyContent({ detail_api_data })
      }));
    }

  }, [detail_api_data, data]);



  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const generateAndDisplayPDF = async () => {
      if (detail_api_data) {
        try {
          const url = await generatePDF1(detail_api_data.items);
          setPdfUrl(url);
        } catch (error) {
          console.error('Failed to generate PDF:', error);
          // Handle error as needed
        }
      }
    };

    generateAndDisplayPDF();
  }, [detail_api_data]);

  const openPDFInNewTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBodyChange = (value) => {
    setFormData({ ...formData, body: value });
  };

  const handleSend = () => {
    try {
      const sendData = {
        id: detail_api_data?.id,
        from: detail_api_data?.email,
        to_email: formData?.to,
        subject: formData?.subject,
        body: formData?.body,
        upload_documents: JSON.stringify(formData?.upload_documents),
      };
      if ((detail_api_data?.purchase_order_id)) {
        dispatch(purchasesSendMail(sendData, Navigate));
      } else if ((detail_api_data?.quotation_id)) {
        dispatch(quotationSend(sendData, Navigate));
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  const handleCancel = () => {
    setFormData({
      from: '',
      to: '',
      subject: '',
      body: '',
      upload_documents: [],
    });
  };

  return (
    <div className="send-mail">
      {freezLoadingImg && <MainScreenFreezeLoader />}
      <h1>Email To {recipientName}</h1>
      <div className="section">
        <div className="input-group">
          <label>From:</label>
          <input type="email" name="from" value={formData.from} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>Send To:</label>
          <input type="email" name="to" value={formData.to} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>Subject:</label>
          <input type="text" name="subject" value={formData.subject} onChange={handleChange} />
        </div>
      </div>
      <div className="section">
        <label>Mail Body:</label>
        <ReactQuill value={formData.body} onChange={handleBodyChange} modules={modules} />
      </div>
      <div className="section">
        {pdfUrl && (
          <iframe
            title="Generated PDF"
            src={pdfUrl}
            style={{ width: '100%', height: '300px', border: 'none' }}
          />
        )}
      </div>
      <div className="section">
        <label>upload_documents:</label>
        <MultiImageUpload
          formData={formData}
          setFormData={setFormData}
          setFreezLoadingImg={setFreezLoadingImg}
          imgLoader={imgLoader}
          setImgeLoader={setImgeLoader}
        />
      </div>
      <div className="buttons">
        <button onClick={handleSend}>Send</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
      <Toaster />
    </div>
  );
};

export default SendMail;

