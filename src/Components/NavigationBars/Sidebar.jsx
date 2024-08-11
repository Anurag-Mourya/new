import React, { useEffect, useRef, useState } from "react";
import DashboardComponent from "../../Views/Dashboard/DashboardComponent";
import { Link, useNavigate, useParams } from "react-router-dom";
import ManageItems from "../../Views/Items/ManageItems";
import CreateItems from "../../Views/Items/CreateItems";
import ImportItems from "../../Views/Items/ImportItems";
import Customers from "../../Views/Sales/Customer/Customers";
import Categories from "../../Views/Items/Categories";
import MainLinks from "./SideNavigations/MainLinks";
import Quotations from "../../Views/Sales/Quotations/Quotations";
import SalesOrderList from "../../Views/Sales/SalesOrder/SalesOrderList";
import Invoices from "../../Views/Sales/Invoices/Invoices";
import CreateInvoices from "../../Views/Sales/Invoices/CreateInvoices";
import StockAdjustment from "../../Views/Items/StockAdjusment";
import Vendors from "../../Views/Sales/Vendors/Vendors";
import CreateVendors from "../../Views/Sales/Vendors/CreateVendors";
// import Bills from "../../Views/Purchases/Bill/Bills";
import Bills from '../../Views/Purchases/Bill/Bills'
import CreateBills from "../../Views/Purchases/Bill/CreateBills";
import Expenses from "../../Views/Purchases/Expenses/Expenses";
import ExpenseDetails from "../../Views/Purchases/Expenses/ExpenseDetails";
import CreateExpence from '../../Views/Purchases/Expenses/CreateExpence'
import Journal from "../../Views/Accountant/Journal/Journal";
import CreateJournal from "../../Views/Accountant/Journal/CreateNewJournal";
import CreateNewJournal from "../../Views/Accountant/Journal/CreateNewJournal";
import CreditNotes from "../../Views/Sales/CreditNotes/CreditNotes";
import CreateCreditNotes from "../../Views/Sales/CreditNotes/CreateCreditNotes";
import DebitNotes from "../../Views/Purchases/DebitNotes/DebitNotes";
import CreateDebitNotes from "../../Views/Purchases/DebitNotes/CreateDebitNotes";
import CreateCategory from "../../Views/Items/CreateCategory";
import ItemDetails from "../../Views/Items/ItemDetails";
import CustomerDetails from "../../Views/Sales/Customer/CustomerDetails";
import QuotationDetails from "../../Views/Sales/Quotations/QuotationDetails";
import SalesOrderDetail from "../../Views/Sales/SalesOrder/SalesOrderDetail";
import InvoicesDetails from "../../Views/Sales/Invoices/InvoicesDetails";
import CreditNotesDetails from "../../Views/Sales/CreditNotes/CreditNotesDetails";
import CreateCustomer from '../../Views/Sales/Customer/CreateCustomer'
import CategoryDetails from "../../Views/Items/CategoryDetails";
import CreateQuotation from "../../Views/Sales/Quotations/CreateQuotation";
import VendorsDetails from "../../Views/Sales/Vendors/VendorsDetails";
import PurchaseOrder from "../../Views/Sales/PurchaseOrder/PurchaseOrder";
import CreatePurchaseOrder from "../../Views/Sales/PurchaseOrder/CreatePurchaseOrder";
import CreateSalesOrders from "../../Views/Sales/SalesOrder/CreateSalesOrders";
import AccountChart from "../../Views/Accountant/AccountChart/AccountChart";
import CreateAccountChart from "../../Views/Accountant/AccountChart/CreateAccountChart";
import PaymentRecieved from "../../Views/Sales/PaymentRecieved/PaymentRecieved";
import CreatePaymentRec from "../../Views/Sales/PaymentRecieved/CreatePaymentRec";
import AccountDetails from "../../Views/Accountant/AccountChart/AccountDetails";
import JournalDetailsSing from "../../Views/Accountant/Journal/JournalDetails";
import PaymentRevievedDetail from "../../Views/Sales/PaymentRecieved/PaymentRevievedDetail";
import BillDetail from "../../Views/Purchases/Bill/BillDetail";
import PaymentMade from "../../Views/Purchases/PaymentMade/PaymentMade";
import PurchaseOrderDetails from "../../Views/Sales/PurchaseOrder/PurchaseOrderDetails";
import DebitNotesDetails from "../../Views/Purchases/DebitNotes/DebitNotesDetails";
import PaymentMadeDetails from "../../Views/Purchases/PaymentMade/PaymentMadeDetails";
import CreatePaymentMade from "../../Views/Purchases/PaymentMade/CreatePaymentMade";
import { TfiAngleDoubleLeft, TfiAngleDoubleRight, TfiHelpAlt, TfiMore } from "react-icons/tfi";
import { LiaAngleLeftSolid, LiaAngleRightSolid } from "react-icons/lia";

import helpIco from '../../assets/outlineIcons/othericons/helpIco.svg';
import { LuPlus } from "react-icons/lu";


import { MdOutlineSwitchAccessShortcut } from "react-icons/md";
import { HiOutlineHome } from "react-icons/hi2";
import { RiNotification3Line } from "react-icons/ri";

import FilledItemIco from '../../assets/outlineIcons/othericons/FilledItemIco.svg';
import FilledSalesIco from '../../assets/outlineIcons/othericons/FilledSalesIco.svg';
import FilledPurchasesIco from '../../assets/outlineIcons/othericons/FilledPurchasesIco.svg';
import FilledEwaybillsIco from '../../assets/outlineIcons/othericons/FilledEwaybillsIco.svg';
import FilledAccountantIco from '../../assets/outlineIcons/othericons/FilledAccountantIco.svg';


import { otherIcons } from "../../Views/Helper/SVGIcons/ItemsIcons/Icons";
import { BsPlusCircle } from "react-icons/bs";
import Reports from "../../Views/Reports/Reports";
import Profit_and_loss from "../../Views/Reports/ReportsData/PerformanceAndAna/Profit_and_loss";
import Cash_flow_statment from "../../Views/Reports/ReportsData/PerformanceAndAna/Cash_flow_statment";
import Balance_sheet from "../../Views/Reports/ReportsData/PerformanceAndAna/Balance_sheet";
import Expense_Reports from "../../Views/Reports/ReportsData/PerformanceAndAna/Expense_Reports";
import Activity_Report from "../../Views/Reports/ReportsData/PerformanceAndAna/Activity_Report";
import Sale_Reports from "../../Views/Reports/ReportsData/SalesAndPurch/Sale_Reports";
import Vendor_Reports from "../../Views/Reports/ReportsData/SalesAndPurch/Vendor_Reports";
import Invoice_Reports from "../../Views/Reports/ReportsData/SalesAndPurch/Invoice_Reports";
import Purchase_Reports from "../../Views/Reports/ReportsData/SalesAndPurch/Purchase_Reports";
import Bill_Reports from "../../Views/Reports/ReportsData/SalesAndPurch/Bill_Reports";
import Customer_Reports from "../../Views/Reports/ReportsData/SalesAndPurch/Customer_Reports";
import Product_Sales_Report from "../../Views/Reports/ReportsData/SalesAndPurch/Product_Sales_Report";
import SendMail from "../SendMail/SendMail";
import GRN from "../../Views/GRN/GRN";
import CreateGRN from "../../Views/GRN/CreateGRN";
import GRNdetails from "../../Views/GRN/GRNdetails";
import GRNreceipt from "../../Views/GRN/GRNreceipt";
import GRNreceiptDetail from "../../Views/GRN/GRNreceiptDetail";
import Warehouse from "../../Views/Warehouse/Warehouse";
import CreateWarehouse from "../../Views/Warehouse/CreateWarehouse";
import WarehouseDetail from "../../Views/Warehouse/WarehouseDetail";
import Zone from "../../Views/Warehouse/Zone/Zone";
import CreateZone from "../../Views/Warehouse/Zone/CreateZone";
import ZoneDetail from "../../Views/Warehouse/Zone/ZoneDetail";
import Racks from "../../Views/Warehouse/Racks/Racks";
import CreateRacks from "../../Views/Warehouse/Racks/CreateRacks";
import RacksDetail from "../../Views/Warehouse/Racks/RacksDetail";
import Bins from "../../Views/Warehouse/Bin/Bins";
import CreateBins from "../../Views/Warehouse/Bin/CreateBins";
import BinsDetail from "../../Views/Warehouse/Bin/BinsDetail";
import GrnApproval from "../../Views/GRN/GrnApproval";
import GRNApprovalDetail from "../../Views/GRN/GRNApprovalDetail";









const Sidebar = ({ loggedInUserData }) => {
  const [sidebarWidth, setSidebarWidth] = useState(230); // Initial width
  const [selectedMenuItem, setSelectedMenuItem] = useState("dashboard");

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);



  const handleMouseDown = (e) => {
    const startX = e.pageX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (e) => {
      const newWidth = startWidth + (e.pageX - startX);
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };






  const handleShrinkSidebar = () => {
    const newWidth = sidebarWidth === 50 ? 230 : 50;
    setSidebarWidth(newWidth);
    setIsSidebarCollapsed(newWidth === 50);

    const lastOptionsElements = document.querySelectorAll('.dispynonesidebarc5w6s');

    lastOptionsElements.forEach(element => {
      element.style.display = 'none';
    });

    if (newWidth !== 50) {
      setTimeout(() => {
        lastOptionsElements.forEach(element => {
          element.style.display = 'flex';
        });
      }, 150);
    }



    const heighseprx4w65sElements = document.querySelectorAll('.lastoptionsxkw');

    heighseprx4w65sElements.forEach(element => {
      if (newWidth === 50) {
        element.id = 'idofx5w6x3w6'; // Add your desired ID here
      } else {
        element.removeAttribute('id'); // Remove the ID
      }
    });
  };


  const handleShrinkSidebarTo230 = () => {
    const newWidth = 230;
    setSidebarWidth(newWidth);
    setIsSidebarCollapsed(newWidth === 50);

    const lastOptionsElements = document.querySelectorAll('.dispynonesidebarc5w6s');

    lastOptionsElements.forEach(element => {
      element.style.display = newWidth === 50 ? 'none' : 'flex';
    });



    const heighseprx4w65sElements = document.querySelectorAll('.lastoptionsxkw');

    heighseprx4w65sElements.forEach(element => {
      if (newWidth !== 50) {
        element.id = 'unsetx4w65'; // Add your desired ID here
      } else {
        element.removeAttribute('id'); // Remove the ID
      }
    });
  };






  const Navigate = useNavigate();
  const { component } = useParams();
  useEffect(() => {
    if (component) {
      setSelectedMenuItem(component);
      localStorage.setItem("selectedMenuItem", component);
    }
  }, [component]);

  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
    localStorage.setItem("selectedMenuItem", menuItem);
    Navigate(`/dashboard/${menuItem}`);
  };










  // 

  const [showAddShorts, setShowAddShorts] = useState(false);
  const showaddshortcutsRef = useRef(null);


  const handleClickOutsidex12 = (event) => {
    if (
      showaddshortcutsRef.current &&
      !showaddshortcutsRef.current.contains(event.target)
    ) {
      setShowAddShorts(false);
    }
  };


  useEffect(() => {
    document.addEventListener("click", handleClickOutsidex12);
    return () => {
      document.removeEventListener("click", handleClickOutsidex12);
    };
  }, []);
  const handleSearchButtonClickx12 = () => {
    setShowAddShorts(!showAddShorts);
    setShowAccountSlider(false);
    setIsOpen(false);
  };



  const renderComponent = () => {
    switch (selectedMenuItem) {
      case "home":
        return <DashboardComponent />;

      // case "/edit-quotation/:id":
      //   return <Quotation />;

      // item
      case "manage-items":
        return <ManageItems />;
      case "item-details":
        return <ItemDetails />;
      case "create-items":
        return <CreateItems />;
      case "items-categories":
        return <Categories />;
      case "category-details":
        return <CategoryDetails />;
      case "create-categories":
        return <CreateCategory />;
      case "import-items":
        return <ImportItems />;
      case "stock-adjustment":
        return <StockAdjustment />;



      //customers
      case "customers":
        return <Customers />;
      case "customer-details":
        return <CustomerDetails />;
      case "create-customer":
        return <CreateCustomer />;

      //vendors
      case "vendors":
        return <Vendors />;
      case "create-vendor":
        return <CreateVendors />;
      case "vendor-details":
        return <VendorsDetails />;

      //purchases
      case "create-purchases":
        return <CreatePurchaseOrder />;
      case "purchase":
        return <PurchaseOrder />;
      case "purchase-details":
        return <PurchaseOrderDetails />;

      case "expenses":
        return <Expenses />;
      case "create-expenses":
        return <CreateExpence />;
      case "expense-details":
        return <ExpenseDetails />;


      // grn
      case "grn":
        return <GRN />;
      case "new-grn":
        return <CreateGRN />;

      case "account-chart":
        return <AccountChart />;
      case "create-account-chart":
        return <CreateAccountChart />;
      case "grn_approval":
        return <GrnApproval />;
      case "grn_approval_detail":
        return <GRNApprovalDetail />;

      case "grn-detail":
        return <GRNdetails />;

      case "grn_receipt":
        return <GRNreceipt />;

      case "grn_receipt_detail":
        return <GRNreceiptDetail />;

      // Warehouse
      case "warehouse":
        return <Warehouse />
      case "create-warehouse":
        return <CreateWarehouse />
      case "warehouse_detail":
        return <WarehouseDetail />

      // Zone
      case "zone":
        return <Zone />
      case "create-zone":
        return <CreateZone />
      case "zone_detail":
        return <ZoneDetail />

      // Racks
      case "racks":
        return <Racks />
      case "create-racks":
        return <CreateRacks />
      case "racks_detail":
        return <RacksDetail />

      // Bins
      case "bin":
        return <Bins />
      case "create-bins":
        return <CreateBins />
      case "bin_detail":
        return <BinsDetail />

      // bills
      case "bills":
        return <Bills />;
      case "create-bills":
        return <CreateBills />;
      case "bill-details":
        return <BillDetail />;

      // quotation
      case "quotation":
        return <Quotations />;
      case "create-quotations":
        return <CreateQuotation />;
      case "quotation-details":
        return <QuotationDetails />;

      // notes
      case "credit-notes":
        return <CreditNotes />;
      case "creditnote-details":
        return <CreditNotesDetails />;
      case "create-credit-note":
        return <CreateCreditNotes />;
      case "debit-notes":
        return <DebitNotes />;
      case "create-debit-note":
        return <CreateDebitNotes />;
      case "debit-note-detail":
        return <DebitNotesDetails />;


      // payment
      case "payment-recieved":
        return <PaymentRecieved />;
      case "payment-recieved-detail":
        return <PaymentRevievedDetail />;
      case "payment-rec-details":
        return <CreditNotesDetails />;
      case "create-payment-rec":
        return <CreatePaymentRec />;
      case "payment-made":
        return <PaymentMade />;
      case "create-payment-made":
        return <CreatePaymentMade />;
      case "payment-made-detail":
        return <PaymentMadeDetails />;


      // sales-orders
      case "sales-orders":
        return <SalesOrderList />;
      case "create-sales-orders":
        return <CreateSalesOrders />;
      case "sales-order-details":
        return <SalesOrderDetail />;

      // invoices
      case "invoices":
        return <Invoices />;
      case "invoice-details":
        return <InvoicesDetails />;
      case "create-invoice":
        return <CreateInvoices />;

      // accounts
      case "journal":
        return <Journal />;
      case "journal-details":
        return <JournalDetailsSing />;
      case "create-journal":
        return <CreateNewJournal />;
      case "account-details":
        return <AccountDetails />;







      // reports
      case "reports":
        return <Reports />;

      case "profit_and_loss":
        return <Profit_and_loss />;
      case "Cash_flow_statment":
        return <Cash_flow_statment />;
      case "Balance_sheet":
        return <Balance_sheet />;
      case "Expense_Reports":
        return <Expense_Reports />;
      case "Activity_Report":
        return <Activity_Report />;


      case "Sale_Reports":
        return <Sale_Reports />;
      case "Vendor_Reports":
        return <Vendor_Reports />;
      case "Invoice_Reports":
        return <Invoice_Reports />;
      case "Purchase_Reports":
        return <Purchase_Reports />;
      case "Bill_Reports":
        return <Bill_Reports />;
      case "Customer_Reports":
        return <Customer_Reports />;
      case "Product_Sales_Report":
        return <Product_Sales_Report />;
      case "send_mail":
        return <SendMail />;


      default:
        return null;
    }
  };
  const handleClearEditItem = () => {
    sessionStorage.removeItem('Edit-Item');
  };
  const handleClearWareHouseItem = () => {
    sessionStorage.removeItem('update-warehouse');
  };

  return (
    <>
      <div id="leftsidearea">
        {/* <LeftMenu /> */}
        <div className="sidebar-container">
          <div className="sidebar" style={{ width: `${sidebarWidth}px`, transition: "width 0.2s" }}>


            <MainLinks handleShrinkSidebarx1={handleShrinkSidebarTo230} isSidebarCollapsedx1={isSidebarCollapsed} selectedMenuItem={selectedMenuItem} handleMenuItemClick={handleMenuItemClick} />



            {/* Add more menu items and submenus as needed */}
            <div className="resize-handle" onMouseDown={handleMouseDown}>
              <div id="newsidecont"></div>
            </div>

            <div className="btnofdecwidflhidx2" onClick={handleShrinkSidebar}>
              {isSidebarCollapsed ? <TfiAngleDoubleRight /> : <TfiAngleDoubleLeft />}
            </div>

            <div className="lastoptionsxkw"
              ref={showaddshortcutsRef}
              onClick={handleSearchButtonClickx12}
            >





              <p className="dispynonesidebarc5w6s">Shortcuts</p>
              <LuPlus />

            </div>
          </div>
          <div className="divider"></div>
          <div className="main-content">
            {/* <Topbar loggedInUserData={loggedInUserData}/> */}
            {renderComponent()}
          </div>
        </div>
      </div>




















      {showAddShorts && (
        <div id="shortcuts-box">
          <div id="sugnboxsxx1">
            <h3>Shortcuts <MdOutlineSwitchAccessShortcut /></h3>
            <ul>

              <div className="firstboxxlw51ws1">
                <div className="xkwloxs654s2">
                  <img src={FilledItemIco} alt="" />

                  <p>Items</p>
                </div>
                <div className="xkwloxs654s25">
                  <li><Link to={"/"}><BsPlusCircle /></Link>Add Item</li>
                  <li><Link to={"/"}><BsPlusCircle /></Link>Category</li>
                  <li><Link to={"/"}><BsPlusCircle /></Link>Sub-Category</li>
                </div>

              </div>


              <div className="firstboxxlw51ws1">
                <div className="xkwloxs654s2">
                  {/* {otherIcons?.salesiconex} */}

                  <img src={FilledSalesIco} alt="" />

                  <p>Sales</p>
                </div>
                <div className="xkwloxs654s25">
                  <li><Link to={"/"}><BsPlusCircle /></Link>Customer</li>
                  <li><Link to={"/"}><BsPlusCircle /></Link>Quotation</li>
                  <li><Link to={"/"}><BsPlusCircle /></Link>Sales Order</li>
                  <li><Link to={"/"}><BsPlusCircle /></Link>Invoice</li>
                  <li><Link to={"/"}><BsPlusCircle /></Link>Credit Notes</li>
                  <li><Link to={"/"}><BsPlusCircle /></Link>Payment Recieved</li>
                </div>

              </div>

              <div className="firstboxxlw51ws1">
                <div className="xkwloxs654s2">

                  <img src={FilledPurchasesIco} alt="" />
                  <p>Purchases</p>
                </div>
                <div className="xkwloxs654s25">
                  <li><Link to={"/"}><BsPlusCircle /></Link>Vendor</li>
                  <li><Link to={"/"}><BsPlusCircle /></Link>Purchases</li>
                  <li><Link to={"/"}><BsPlusCircle /></Link>Bill</li>
                  <li><Link to={"/"}><BsPlusCircle /></Link>Expense</li>
                  <li><Link to={"/"}><BsPlusCircle /></Link>Debit Notes</li>
                  <li><Link to={"/"}><BsPlusCircle /></Link>Payment Mode</li>
                </div>

              </div>


              <div className="firstboxxlw51ws1">
                <div className="xkwloxs654s2">

                  <img src={FilledEwaybillsIco} alt="" />
                  {/* {otherIcons?.ewaybillsiconex} */}
                  {/* <svg id="fi_6992035" height="512" viewBox="0 0 100 100" width="512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><linearGradient id="New_Gradient_Swatch_2" gradientUnits="userSpaceOnUse" x1="13.603" x2="76.403" y1="21.4" y2="84.2"><stop offset="0" stop-color="#0a75a1"></stop><stop offset="1" stop-color="#020088"></stop></linearGradient><g id="_09" data-name="09"><path d="m71.119 61.873a3.578 3.578 0 1 0 3.581 3.578 3.582 3.582 0 0 0 -3.581-3.578zm-50.625 0a3.578 3.578 0 1 0 3.578 3.578 3.582 3.582 0 0 0 -3.578-3.578zm6.588-15.018-2.711-2.71a1 1 0 0 1 1.414-1.414l2 2 1.066-1.066 5.109-5.109a1 1 0 1 1 1.414 1.414l-4.4 4.4.361.36 6.178-6.177a1 1 0 1 1 1.414 1.414l-6.885 6.884a1 1 0 0 1 -1.414 0l-1.068-1.067-1.06 1.071a1 1 0 0 1 -1.414 0zm67.118 11.972-6.131-3.25-2.569-12.712a10.21 10.21 0 0 0 -9.974-8.151h-17.492v-2.471a6.062 6.062 0 0 0 -6.049-6.062h-40.656a6.067 6.067 0 0 0 -6.061 6.062v33.214a1 1 0 0 0 1 1h5.924a8.362 8.362 0 0 0 16.6 0h34.025a8.362 8.362 0 0 0 16.6 0h14.315a1 1 0 0 0 1-1v-5.747a1 1 0 0 0 -.532-.883zm-67.34 6.648a6.367 6.367 0 0 1 -12.734 0c0-.007 0-.012 0-.018s0-.014 0-.021a6.368 6.368 0 0 1 12.735 0 .129.129 0 0 0 0 .021c-.004.006 0 .011 0 .018zm4.79-11.567a11.2 11.2 0 1 1 11.2-11.2 11.214 11.214 0 0 1 -11.2 11.2zm22.321 3.016a1 1 0 0 1 -1 1 1 1 0 0 1 -1-1v-6.3a1 1 0 0 1 1-1 1 1 0 0 1 1 1zm.007-10.608a1 1 0 0 1 -1 1 1 1 0 0 1 -1-1l.007-14.067a1 1 0 0 1 1-1 1 1 0 0 1 1 1zm17.141 25.5a6.375 6.375 0 0 1 -6.367-6.352v-.01-.013a6.368 6.368 0 1 1 6.368 6.375zm21.613-7.362h-13.309a8.362 8.362 0 0 0 -16.607 0h-4.782v-27.74h12.085v12.986a1 1 0 0 0 1 1h13.922l1.163 5.74a1.006 1.006 0 0 0 .512.685l6.016 3.189z" fill="url(#New_Gradient_Swatch_2)"></path></g></svg> */}
                  <p>e-Way Bills</p>
                </div>
                <div className="xkwloxs654s25">
                  <li><Link to={"/"}><BsPlusCircle /></Link>Create e-Way Bill</li>
                </div>

              </div>



              <div className="firstboxxlw51ws1">
                <div className="xkwloxs654s2">

                  <img src={FilledAccountantIco} alt="" />
                  {/* {otherIcons?.accountanticonex} */}
                  {/* <svg enableBackground="new 0 0 36 36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" id="fi_16597634"><path d="m8.114 5.564c-1.805 6.677-6.504 10.327-7.374 13.545s-.847 10.475 13.955 14.477 19.432-4.501 20.388-8.041c4.481-16.572-23.772-31.807-26.969-19.981z" fill="#efefef"></path><circle cx="15" cy="11" fill="#f3f3f1" r="4.25"></circle><path d="m13 11c0-1.955 1.328-3.585 3.125-4.08-.361-.1-.733-.17-1.125-.17-2.347 0-4.25 1.903-4.25 4.25s1.903 4.25 4.25 4.25c.392 0 .764-.07 1.125-.17-1.797-.495-3.125-2.125-3.125-4.08z" fill="#d5dbe1"></path><path d="m20.39 18.75h-1.14-7.36-1.14c-2.209 0-4 1.791-4 4v3.5h8.39.86 8.39v-3.5c0-2.209-1.791-4-4-4z" fill="#f3f3f1"></path><path d="m13 18.75h-1.11-1.14c-2.209 0-4 1.791-4 4v3.5h2.25v-3.5c0-2.209 1.791-4 4-4z" fill="#d5dbe1"></path><g fill="#a4afc1"><path d="m26.555 3.967h1v2h-1z" transform="matrix(.707 -.707 .707 .707 4.412 20.586)"></path><path d="m30.621 8.033h1v2h-1z" transform="matrix(.707 -.707 .707 .707 2.728 24.652)"></path><path d="m25.878 8.533h2v1h-2z" transform="matrix(.707 -.707 .707 .707 1.485 21.652)"></path><path d="m29.944 4.467h2v1h-2z" transform="matrix(.707 -.707 .707 .707 5.551 23.336)"></path><path d="m9.875 32.5c-.827 0-1.5-.673-1.5-1.5s.673-1.5 1.5-1.5 1.5.673 1.5 1.5-.673 1.5-1.5 1.5zm0-2c-.276 0-.5.224-.5.5s.224.5.5.5.5-.224.5-.5-.224-.5-.5-.5z"></path></g><circle cx="23" cy="24.5" fill="#2fdf84" r="2.75"></circle><path d="m22.5 24.5c0-1.117.669-2.074 1.625-2.504-.344-.155-.723-.246-1.125-.246-1.519 0-2.75 1.231-2.75 2.75s1.231 2.75 2.75 2.75c.402 0 .781-.091 1.125-.246-.956-.43-1.625-1.387-1.625-2.504z" fill="#00b871"></path><path d="m23 28c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5zm0-5.5c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z"></path><path d="m22.25 27.25h1.5v2h-1.5z"></path><path d="m22.25 19.75h1.5v2h-1.5z"></path><path d="m25.246 21.88h1.998v1.5h-1.998z" transform="matrix(.866 -.5 .5 .866 -7.803 16.176)"></path><path d="m18.756 25.62h1.998v1.5h-1.998z" transform="matrix(.866 -.5 .5 .866 -10.547 13.43)"></path><path d="m19.005 21.631h1.5v1.998h-1.5z" transform="matrix(.5 -.866 .866 .5 -9.724 28.408)"></path><path d="m25.495 25.371h1.5v1.998h-1.5z" transform="matrix(.5 -.866 .866 .5 -9.72 35.895)"></path><path d="m15 16c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5zm0-8.5c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5z"></path><path d="m16 27h-9.25c-.414 0-.75-.336-.75-.75v-3.5c0-2.619 2.131-4.75 4.75-4.75h8.5v1.5h-8.5c-1.792 0-3.25 1.458-3.25 3.25v2.75h8.5z"></path></svg> */}
                  <p>Accountant</p>
                </div>
                <div className="xkwloxs654s25">
                  <li><Link to={"/"}><BsPlusCircle /></Link>Account Chart</li>
                  <li><Link to={"/"}><BsPlusCircle /></Link>Journal</li>
                </div>

              </div>





              {/* <li><Link to={"/"}><HiOutlineHome /></Link>Add Organization</li>
              <li><Link to={"/"}><TfiMore /></Link>Create Items</li>
              <li><Link to={"/"}><RiNotification3Line /></Link>Add Customer</li>
              <li><Link to={"/"}><TfiMore /></Link>Invite User</li>
              <li><Link to={"/"}><HiOutlineHome /></Link>Add Organization</li>
              <li><Link to={"/"}><TfiMore /></Link>Create Items</li>
              <li><Link to={"/"}><TfiMore /></Link>Create Items</li>
              <li><Link to={"/"}><RiNotification3Line /></Link>Add Customer</li>
              <li><Link to={"/"}><TfiMore /></Link>Invite User</li> */}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

