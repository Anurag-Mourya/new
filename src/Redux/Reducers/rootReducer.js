import { combineReducers } from 'redux';
import { accountListReducer, categoryListReducer, creditNoteListReducer, customListReducer, debitNoteListReducer, invoiceListReducer, itemListReducer, journalListReducer, purchseListReducer, quoatationListReducer, saleOrderListReducer, vendorListReducer } from './listApisReducers';
import { activeInactiveItemReducer, addItemsReducer, itemDeleteReducer, itemExportReducer, itemImportReducer, itemsDetailReducer, itemStockeducer, stockItemsReducer } from './itemsReducers';
import { masterDataReducer, countriesDataReducer, citiesDataReducer, stateDataReducer, createCustomReducer, getCurrencyReducer, getTaxRateReducer, updateAddressReducer, expenseHeadListReducer } from './globalReducers';
import { categoryStatusReducer, createCategoryReducer, createSubCategoryReducer, deleteCategoryReducer, subCategoryListReducer } from './categoryReducers';
import { createCustomerReducer, customerDeleteReducer, customerListReducer, customerStatusReducer, viewCustomerReducer } from './customerReducers';
import { quotationDeleteReducer, quotationDetailReducer, quotationSendReducer, quotationStatusReducer, quotationUpdateReducer } from './quotationReducers';
import { saleOrderDeleteReducer, saleOrderDetailReducer, saleOrderStatusReducer } from './saleOrderReducers';
import { invoiceDeleteReducer, invoiceDetailReducer, invoicePendingReducer, invoiceStatusReducer } from './invoiceReducers';
import { creditNoteDeleteReducer, creditNoteDetailReducer, debitNoteDeleteReducer, debitNoteDetailReducer } from './noteReducers';
import { vendorCreateReducer, vendorDeleteReducer, vendorStatusReducer, vendorViewReducer } from './vendorReducers';
import { JournalDetailReducer, accountDeleteReducer, accountDetailsReducer, accountStatusReducer, accountTypeReducer, createAccountReducer, journalsReducer } from './accountReducers';
import { createPaymentReducer, paymentDeleteReducer, paymentDetailReducer, paymentListReducer, paymentStatusReducer } from './paymentReducers';
import { billDeleteReducer, billDetailReducer, billListReducer, billStatusReducer, pendingBillReducer } from './billReducers';
import { createPurchasesReducer, purchasesDeleteReducer, purchasesDetailsReducer, purchasesSendReducer, purchasesStatusReducer } from './purchasesReducers';
import { expenseCreateReducer, expenseDeleteReducer, expenseDetailReducer, expenseListReducer } from './expenseReducers';
import { createGRNreducer, GRNdeleteReducer, GRNdetailsReducer, GRNrecepitDetailReducer, GRNrecepitListReducer, GRNrecepitMoveItemReducer, GRNstatusReducer, listGRNreducer } from './grnReducers';
import { binCreateReducer, binDetailsReducer, binStatusReducer, binViewReducer, rackCreateReducer, rackDetailsReducer, rackStatusReducer, rackViewReducer, warehouseCreateReducer, warehouseDetailReducer, warehouseStatusReducer, warehouseViewReducer, zoneCreateReducer, zoneDetailsReducer, zoneStatusReducer, zoneViewReducer } from './warehouseReducers';

const reducer = combineReducers({
    addItemsReducer,

    stockAdjustment: stockItemsReducer,
    itemStock: itemStockeducer,
    itemDetail: itemsDetailReducer,
    itemList: itemListReducer,
    importItems: itemImportReducer,
    exportItems: itemExportReducer,

    masterData: masterDataReducer,
    createCategory: createCategoryReducer,
    createSubCategory: createSubCategoryReducer,
    categoryStatus: categoryStatusReducer,
    createCustomer: createCustomerReducer,
    customerStatus: customerStatusReducer,
    customerDelete: customerDeleteReducer,
    viewCustomer: viewCustomerReducer,
    customerList: customerListReducer,
    categoryList: categoryListReducer,
    deleteCategory: deleteCategoryReducer,
    subCategoryList: subCategoryListReducer,
    accountList: accountListReducer,
    accountStatus: accountStatusReducer,
    accountDetails: accountDetailsReducer,
    journalList: journalListReducer,
    quoteList: quoatationListReducer,
    quoteDetail: quotationDetailReducer,
    quoteStatus: quotationStatusReducer,
    quoteDelete: quotationDeleteReducer,
    quoteSend: quotationSendReducer,
    saleList: saleOrderListReducer,
    saleDetail: saleOrderDetailReducer,
    saleStatus: saleOrderStatusReducer,
    vendorList: vendorListReducer,
    vendorView: vendorViewReducer,
    vendorDelete: vendorDeleteReducer,
    vendorStatus: vendorStatusReducer,
    purchseList: purchseListReducer,
    purchseSend: purchasesSendReducer,
    purchseStatus: purchasesStatusReducer,
    createVendor: vendorCreateReducer,
    saleDelete: saleOrderDeleteReducer,
    invoiceDetail: invoiceDetailReducer,
    invoiceList: invoiceListReducer,
    invoicesStatus: invoiceStatusReducer,
    invoicesDelete: invoiceDeleteReducer,
    invoicePending: invoicePendingReducer,
    creditNoteList: creditNoteListReducer,
    debitNoteList: debitNoteListReducer,
    debitNoteDetail: debitNoteDetailReducer,
    debitNoteDelete: debitNoteDeleteReducer,
    creditNoteDetail: creditNoteDetailReducer,
    creditNoteDelete: creditNoteDeleteReducer,

    countries: countriesDataReducer,
    states: stateDataReducer,
    cities: citiesDataReducer,

    status: activeInactiveItemReducer,
    deleteItem: itemDeleteReducer,
    createCustom: createCustomReducer,
    customList: customListReducer,
    quoteUpdate: quotationUpdateReducer,
    getCurrency: getCurrencyReducer,
    getTaxRate: getTaxRateReducer,
    updateAddress: updateAddressReducer,
    createJournal: journalsReducer,
    getAccType: accountTypeReducer,
    createAccount: createAccountReducer,
    deleteAccount: accountDeleteReducer,
    paymentRecList: paymentListReducer,
    paymentRecDelete: paymentDeleteReducer,
    paymentRecDetail: paymentDetailReducer,
    paymentRecStatus: paymentStatusReducer,
    createPayment: createPaymentReducer,
    journalDetail: JournalDetailReducer,
    billList: billListReducer,
    billDetail: billDetailReducer,
    billDelete: billDeleteReducer,
    billStatuses: billStatusReducer,
    pendingBill: pendingBillReducer,
    createPurchase: createPurchasesReducer,
    detailsPurchase: purchasesDetailsReducer,
    deletePurchase: purchasesDeleteReducer,
    expenseCreate: expenseCreateReducer,
    expenseList: expenseListReducer,
    expenseHeadList: expenseHeadListReducer,
    expenseDelete: expenseDeleteReducer,
    expenseDetail: expenseDetailReducer,

    GRNcreate: createGRNreducer,
    GRNlist: listGRNreducer,
    GRNdetails: GRNdetailsReducer,
    GRNreceptList: GRNrecepitListReducer,
    GRNreceptDetail: GRNrecepitDetailReducer,
    GRNstatus: GRNstatusReducer,
    GRNdelete: GRNdeleteReducer,
    GRNitem: GRNrecepitMoveItemReducer,

    warehouseView: warehouseViewReducer,
    warehouseCreate: warehouseCreateReducer,
    warehouseDetail: warehouseDetailReducer,
    warehouseStatus: warehouseStatusReducer,

    zoneCrate: zoneCreateReducer,
    zoneView: zoneViewReducer,
    zoneDetail: zoneDetailsReducer,
    zoneStatus: zoneStatusReducer,


    rackCreate: rackCreateReducer,
    rackView: rackViewReducer,
    rackDetail: rackDetailsReducer,
    rackStatus: rackStatusReducer,

    binCreate: binCreateReducer,
    binView: binViewReducer,
    binDetail: binDetailsReducer,
    binStatus: binStatusReducer,


});

export default reducer;
