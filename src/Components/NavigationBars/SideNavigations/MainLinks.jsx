import React, { useEffect, useState } from 'react'
import { RxDashboard } from "react-icons/rx";
import { SiAwsorganizations } from "react-icons/si";
import { IoBagHandleOutline, IoDocumentsOutline } from "react-icons/io5";
import { PiShoppingCartLight, PiWarehouseLight } from "react-icons/pi";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { MdOutlineManageAccounts } from "react-icons/md";
import { BiPurchaseTag } from "react-icons/bi";

import homes_chinmey from '../../../assets/outlineIcons/home.svg';
import shopping_cart from '../../../assets/outlineIcons/shopping-cart.svg';
import basket_shopping_simple from '../../../assets/outlineIcons/basket-shopping-simple.svg';
import shopping_cart_add from '../../../assets/outlineIcons/shopping_cart_add.svg';
import accountantIco from '../../../assets/outlineIcons/accountantIco.svg';
import reportsIco from '../../../assets/outlineIcons/reportsIco.svg';
import truck_sideIco from '../../../assets/outlineIcons/truck_sideIco.svg';
import documentIco from '../../../assets/outlineIcons/documentIco.svg';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { LiaAngleDownSolid, LiaAngleLeftSolid, LiaAngleUpSolid } from 'react-icons/lia';
import { CiDeliveryTruck } from 'react-icons/ci';
import { VscGraphLine } from 'react-icons/vsc';

// import homes_chinmey from '../../../assets/icons/home.svg';
// import shopping_cart from '../../../assets/icons/shopping-cart.svg';
// import basket_shopping_simple from '../../../assets/icons/basket-shopping-simple.svg';
// import shopping_cart_add from '../../../assets/icons/shopping_cart_add.svg';
// import accountantIco from '../../../assets/icons/accountantIco.svg';





const MainLinks = ({ handleMenuItemClick, selectedMenuItem, isSidebarCollapsedx1, handleShrinkSidebarx1 }) => {

  const [orgMenuOpen, setOrgMenuOpen] = useState(false);
  const [Items, setItems] = useState(false);
  const [WareHouse, setWareHouse] = useState(false);
  const [Sales, setSales] = useState(false);
  const [Purchases, setPurchases] = useState(false);
  const [Warehouse, setWarehouse] = useState(false);
  const [Accountant, setAccountant] = useState(false);



  useEffect(() => {
    if (isSidebarCollapsedx1) {
      setItems(false);
      setSales(false);
      setPurchases(false);
      setWarehouse(false);
      setAccountant(false);
    }
  }, [isSidebarCollapsedx1]);

  return (
    <>
      <div id="sidebarx1">
        {/* <div id="topsearchbar">
        </div> */}

        {/* <div className="heighseprx4w65s"></div> */}


        <div
          {...(isSidebarCollapsedx1 && { 'data-tooltip-id': 'my-tooltip', 'data-tooltip-content': 'Home' })}
          onClick={() => handleMenuItemClick("home")}
          className={`menu-item ${selectedMenuItem === "home" ? "active" : ""
            }`}
        >
          {/* <RxDashboard /> */}
          <img className='svgiconsidebar' src={homes_chinmey} alt="" />
          {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#4e4e4e"} fill={"none"}>
    <path d="M8.99944 22L8.74881 18.4911C8.61406 16.6046 10.1082 15 11.9994 15C13.8907 15 15.3848 16.6046 15.2501 18.4911L14.9994 22" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2.35151 13.2135C1.99849 10.9162 1.82198 9.76763 2.25629 8.74938C2.69059 7.73112 3.65415 7.03443 5.58126 5.64106L7.02111 4.6C9.41841 2.86667 10.6171 2 12.0001 2C13.3832 2 14.5818 2.86667 16.9791 4.6L18.419 5.64106C20.3461 7.03443 21.3097 7.73112 21.744 8.74938C22.1783 9.76763 22.0018 10.9162 21.6487 13.2135L21.3477 15.1724C20.8473 18.4289 20.597 20.0572 19.4291 21.0286C18.2612 22 16.5538 22 13.1389 22H10.8613C7.44646 22 5.73903 22 4.57112 21.0286C3.40321 20.0572 3.15299 18.4289 2.65255 15.1724L2.35151 13.2135Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
</svg> */}
          {/* <img style={{padding:"3px"}} src="https://cdn-icons-png.freepik.com/512/1828/1828673.png?ga=GA1.1.1484071354.1711014403&" alt="" /> */}

          <p className='dispynonesidebarc5w6s'>Home</p>
        </div>













        {/* organization start */}
        {/* <div className="menu-itemxse">
                <div
                  className="menu-title"
                  onClick={() => setOrgMenuOpen(!orgMenuOpen)}
                >
                  <span>
                    <SiAwsorganizations />
                     Organisations{" "}
                  </span>{" "}
                  {orgMenuOpen ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  )}
                </div>
                {orgMenuOpen && (
                  <ul className="submenu">
                    <li
                      onClick={() => handleMenuItemClick("organisations")}
                      className={`menu-item ${
                        selectedMenuItem === "organisations" ? "active" : ""
                      }`}
                    >
                      Manage
                    </li>
                    <li
                      onClick={() => handleMenuItemClick("create-organization")}
                      className={`menu-item ${
                        selectedMenuItem === "create-organization"
                          ? "active"
                          : ""
                      }`}
                    >
                      Create & Update
                    </li>
                    <li
                      onClick={() => handleMenuItemClick("users")}
                      className={`menu-item ${
                        selectedMenuItem === "users"
                          ? "active"
                          : ""
                      }`}
                    >
                      Users
                    </li>
                    <li
                      onClick={() =>
                        handleMenuItemClick("invite-user-to-organization")
                      }
                      className={`menu-item ${
                        selectedMenuItem === "invite-user-to-organization"
                          ? "active"
                          : ""
                      }`}
                    >
                      Invite User
                    </li>
                  </ul>
                )}
              </div> */}

        {/* organization end */}











        <div className="menu-itemxse">
          <div
            {...(isSidebarCollapsedx1 && { 'data-tooltip-id': 'my-tooltip', 'data-tooltip-content': 'Items' })}


            className={`menu-title ${selectedMenuItem === "manage-items" ||
              selectedMenuItem === "stock-adjustment" ||
              selectedMenuItem === "items-categories"
              ? "active"
              : ""
              }`}

            onClick={() => { setItems(!Items); handleShrinkSidebarx1(); }}
          >
            <span>
              {/* <IoBagHandleOutline /> */}
              <img className='svgiconsidebar' src={shopping_cart} alt="" />
              {/* <IoBagHandleOutline /> */}
              {/* <img src="https://cdn-icons-png.freepik.com/512/3081/3081559.png?ga=GA1.1.1484071354.1711014403&" alt="" /> */}
              <p className='dispynonesidebarc5w6s'>Items</p>
            </span>{" "}
            <p className='dispynonesidebarc5w6s'>
              {Items ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </p>
          </div>
          {/* {Items && ( */}
          <ul className={`submenu ${Items ? 'opensidebardropdownx5' : ''}`}>
            <li
              onClick={() => handleMenuItemClick("manage-items")}
              className={`menu-item ${selectedMenuItem === "manage-items" ? "active" : ""
                }`}
            >
              List
            </li>
            {/* <li
                           onClick={() => {
                            handleMenuItemClick("create-items");
                            handleClearEditItem();
                          }}
                      className={`menu-item ${
                        selectedMenuItem === "create-items" ? "active" : ""
                      }`}
                    >
                      Create & Update
                    </li> */}
            <li onClick={() => { handleMenuItemClick("stock-adjustment"); }} className={`menu-item ${selectedMenuItem === "stock-adjustment" ? "active" : ""}`}>
              Stock Adjustment</li>
            <li onClick={() => { handleMenuItemClick("items-categories"); }} className={`menu-item ${selectedMenuItem === "items-categories" ? "active" : ""}`}>
              Categories</li>
            {/* 
                    <li
                           onClick={() => {
                            handleMenuItemClick("import-items");
                            handleClearEditItem();
                          }}
                      className={`menu-item ${
                        selectedMenuItem === "import-items" ? "active" : ""
                      }`}
                    >
                      Import Items
                    </li> */}
            {/*   <li  onClick={() => handleMenuItemClick("invite-user-to-organization")}className={`menu-item ${selectedMenuItem === "invite-user-to-organization" ? "active" : ""}`}>Invite User</li>
                    <li  onClick={() => handleMenuItemClick("organisations")}>Settings</li> */}
          </ul>

          {/* )} */}

        </div>






        <div id='' className="menu-itemxse">
          <div className="heighseprx4w65s"></div>
          <div
            {...(isSidebarCollapsedx1 && { 'data-tooltip-id': 'my-tooltip', 'data-tooltip-content': 'Sales' })}

            className={`menu-title ${selectedMenuItem === "customers" ||
              selectedMenuItem === "quotation" ||
              selectedMenuItem === "sales-orders" ||
              selectedMenuItem === "invoices" ||
              selectedMenuItem === "credit-notes" ||
              selectedMenuItem === "payment-recieved"
              ? "active"
              : ""
              }`}
            onClick={() => { setSales(!Sales); handleShrinkSidebarx1(); }}
          >
            <span>
              {/* <HiOutlineShoppingCart /> */}
              {/* <PiShoppingCartLight /> */}
              <img className='svgiconsidebar' src={basket_shopping_simple} alt="" />
              {/* <img src="https://cdn-icons-png.freepik.com/512/4290/4290854.png?ga=GA1.1.683301158.1710405244&" alt="" /> */}
              <p className='dispynonesidebarc5w6s'>Sales</p>
            </span>{" "}
            <p className='dispynonesidebarc5w6s'>
              {Sales ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </p>
          </div>
          {/* {Sales && ( */}
          <ul className={`submenu ${Sales ? 'opensidebardropdownx5' : ''}`}>
            <li
              onClick={() => { handleMenuItemClick("customers") }}
              className={`menu-item ${selectedMenuItem === "customers" ? "active" : ""
                }`}
            >
              Customers
            </li>

            <li
              onClick={() => {
                handleMenuItemClick("quotation");
              }}
              className={`menu-item ${selectedMenuItem === "quotation" ? "active" : ""
                }`}
            >
              Quotation
            </li>
            <li
              onClick={() => {
                handleMenuItemClick("sales-orders");
              }}
              className={`menu-item ${selectedMenuItem === "sales-orders" ? "active" : ""
                }`}
            >
              Sales Orders
            </li>
            <li
              onClick={() => {
                handleMenuItemClick("invoices");
              }}
              className={`menu-item ${selectedMenuItem === "invoices" ? "active" : ""
                }`}
            >
              Invoices
            </li>

            <li
              onClick={() => {
                handleMenuItemClick("credit-notes");
              }}
              className={`menu-item ${selectedMenuItem === "credit-notes" ? "active" : ""
                }`}
            >
              Credit Notes
            </li>
            <li
              onClick={() => {
                handleMenuItemClick("payment-recieved");
              }}
              className={`menu-item ${selectedMenuItem === "payment-recieved" ? "active" : ""
                }`}
            >
              Payment Recieved
            </li>
          </ul>
          {/* )} */}

        </div>

        <div id='' className="menu-itemxse">
          <div
            className={`menu-title ${selectedMenuItem === "vendors" ||
              selectedMenuItem === "purchase" ||
              selectedMenuItem === "bills" ||
              selectedMenuItem === "expenses" ||
              selectedMenuItem === "debit-notes" ||
              selectedMenuItem === "payment-made"
              ? "active"
              : ""
              }`}
            {...(isSidebarCollapsedx1 && { 'data-tooltip-id': 'my-tooltip', 'data-tooltip-content': 'Purchases' })}
            onClick={() => { setPurchases(!Purchases); handleShrinkSidebarx1(); }}
          >
            <span>

              <img className='svgiconsidebar' src={shopping_cart_add} alt="" />
              {/* <img src="https://cdn-icons-png.freepik.com/512/4290/4290854.png?ga=GA1.1.683301158.1710405244&" alt="" /> */}
              <p className='dispynonesidebarc5w6s'>Purchases</p>
            </span>{" "}
            <p className='dispynonesidebarc5w6s'>
              {Purchases ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </p>
          </div>
          {/* {Purchases && ( */}
          <ul className={`submenu ${Purchases ? 'opensidebardropdownx5' : ''}`}>
            <li
              onClick={() => { handleMenuItemClick("vendors") }}
              className={`menu-item ${selectedMenuItem === "vendors" ? "active" : ""
                }`}
            >
              Vendors
            </li>

            <li
              onClick={() => handleMenuItemClick("purchase")}
              className={`menu-item ${selectedMenuItem === "purchase" ? "active" : ""
                }`}
            >
              Purchase Order
            </li>
            <li
              onClick={() => handleMenuItemClick("grn")}
              className={`menu-item ${selectedMenuItem === "grn" ? "active" : ""
                }`}
            >
              GRN
            </li>
            <li
              onClick={() => handleMenuItemClick("grn_approval")}
              className={`menu-item ${selectedMenuItem === "grn_approval" ? "active" : ""
                }`}
            >
              GRN Approval
            </li>
            <li
              onClick={() => handleMenuItemClick("grn_receipt")}
              className={`menu-item ${selectedMenuItem === "grn_receipt" ? "active" : ""
                }`}
            >
              GRN Receiving Area
            </li>

            <li
              onClick={() => { handleMenuItemClick("bills") }}
              className={`menu-item ${selectedMenuItem === "bills" ? "active" : ""
                }`}
            >
              Bills
            </li>
            <li
              onClick={() => { handleMenuItemClick("payment-made") }}
              className={`menu-item ${selectedMenuItem === "payment-made" ? "active" : ""
                }`}
            >
              Payment Made
            </li>

            <li
              onClick={() => { handleMenuItemClick("expenses") }}
              className={`menu-item ${selectedMenuItem === "expenses" ? "active" : ""
                }`}
            >
              Expenses
            </li>
            <li
              onClick={() => { handleMenuItemClick("debit-notes") }}
              className={`menu-item ${selectedMenuItem === "debit-notes" ? "active" : ""
                }`}
            >
              Debit Notes
            </li>

          </ul>

          {/* )} */}

        </div>

        <div id='' className="menu-itemxse">
          <div
            className={`menu-title ${selectedMenuItem === "vendors" ||
              selectedMenuItem === "purchase" ||
              selectedMenuItem === "bills" ||
              selectedMenuItem === "expenses" ||
              selectedMenuItem === "debit-notes" ||
              selectedMenuItem === "payment-made"
              ? "active"
              : ""
              }`}
            {...(isSidebarCollapsedx1 && { 'data-tooltip-id': 'my-tooltip', 'data-tooltip-content': 'Warehouse' })}
            onClick={() => { setWarehouse(!Warehouse); handleShrinkSidebarx1(); }}
          >
            <span>

              <img className='svgiconsidebar' src={shopping_cart_add} alt="" />
              {/* <img src="https://cdn-icons-png.freepik.com/512/4290/4290854.png?ga=GA1.1.683301158.1710405244&" alt="" /> */}
              <p className='dispynonesidebarc5w6s'>Warehouse</p>
            </span>{" "}

            <p className='dispynonesidebarc5w6s'>
              {Warehouse ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </p>

          </div>

          {/* {Purchases && ( */}
          <ul className={`submenu ${Warehouse ? 'opensidebardropdownx5' : ''}`}>

            <li
              onClick={() => { handleMenuItemClick("warehouse") }}
              className={`menu-item ${selectedMenuItem === "warehouse" ? "active" : ""
                }`}
            >
              Warehouse
            </li>
            <li
              onClick={() => { handleMenuItemClick("zone") }}
              className={`menu-item ${selectedMenuItem === "zone" ? "active" : ""
                }`}
            >
              Zone
            </li>
            <li
              onClick={() => { handleMenuItemClick("racks") }}
              className={`menu-item ${selectedMenuItem === "racks" ? "active" : ""
                }`}
            >
              Racks
            </li>
            <li
              onClick={() => { handleMenuItemClick("bin") }}
              className={`menu-item ${selectedMenuItem === "bin" ? "active" : ""
                }`}
            >
              Bin
            </li>

          </ul>

          {/* )} */}

        </div>


        <div id='' className="menu-itemxse">
          <div

            className={`menu-title ${selectedMenuItem === "account-chart" ||
              selectedMenuItem === "journal"
              ? "active"
              : ""
              }`}

            {...(isSidebarCollapsedx1 && { 'data-tooltip-id': 'my-tooltip', 'data-tooltip-content': 'Accountant' })}
            onClick={() => { setAccountant(!Accountant); handleShrinkSidebarx1(); }}
          >
            <span>
              <img className='svgiconsidebar' src={accountantIco} alt="" />
              <p className='dispynonesidebarc5w6s'>Accountant</p>
            </span>{" "}
            <p className='dispynonesidebarc5w6s'>
              {Accountant ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </p>
          </div>

          {/* {Accountant && ( */}
          <ul className={`submenu ${Accountant ? 'opensidebardropdownx5' : ''}`}>
            <li
              onClick={() => handleMenuItemClick("account-chart")}
              className={`menu-item ${selectedMenuItem === "account-chart" ? "active" : ""
                }`}
            >
              Account chart
            </li>
            <li
              onClick={() => handleMenuItemClick("journal")}
              className={`menu-item ${selectedMenuItem === "journal" ? "active" : ""
                }`}
            >
              Manual Journal
            </li>
          </ul>
          {/* )} */}

        </div>


        <div id='' className="menu-itemxse" onClick={() => handleMenuItemClick("reports")}>
          <div className="menu-title"
            {...(isSidebarCollapsedx1 && { 'data-tooltip-id': 'my-tooltip', 'data-tooltip-content': 'Reports' })}
          // onClick={() => setAccountant(!Accountant)}
          >
            {/* <span><VscGraphLine />Reports</span> */}
            <span> <img className='svgiconsidebar' src={reportsIco} alt="" /><p className='dispynonesidebarc5w6s'>Reports</p></span>
          </div>
        </div>


        <div id='' className="menu-itemxse">
          <div className="heighseprx4w65s"></div>
          <div className="menu-title"
            {...(isSidebarCollapsedx1 && { 'data-tooltip-id': 'my-tooltip', 'data-tooltip-content': 'Documents' })}
          // onClick={() => setAccountant(!Accountant)}
          >
            {/* <span><IoDocumentsOutline />Documents</span> */}
            <span> <img className='svgiconsidebar' src={documentIco} alt="" /><p className='dispynonesidebarc5w6s'>Documents</p></span>
          </div>
        </div>


      </div>
    </>
  )
}

export default MainLinks
