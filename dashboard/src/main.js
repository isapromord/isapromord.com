/**
 * ISAPromoRD - Main Orchestrator & Application Bootstrap
 * High-performance ES Module entry point. Bridges all module exports to `window`
 * for 100% backward compatibility with inline HTML event handlers.
 */
import { state, SUPABASE_CONFIG, STORAGE_KEYS } from './state.js';
import { 
  initCloudSync, 
  loadStoredClients, 
  saveClientsToStorage, 
  syncAllClientsToCloud, 
  syncClientToCloud, 
  deleteClientFromCloud, 
  manualTriggerCloudSync,
  supabaseClient 
} from './sync.js';
import { 
  initAuth, 
  handlePinSubmit, 
  lockDashboard, 
  saveNewPin,
  emergencyBypassAuth,
  handleEmailPasswordLogin,
  handleGoogleLogin,
  handleMagicLinkLogin,
  switchAuthMode
} from './auth.js';
import {
  escapeHtml,
  formatMoney,
  formatDate,
  showToast,
  copyToClipboard,
  copyBankDetails,
  initThemeMode,
  toggleThemeMode,
  applyTheme,
  startClock,
  updateEdgePing,
  getBillingStatus,
  calculateTotalMrr,
  togglePresentationMode,
  updateKpis,
  renderViralFootersWidget,
  renderMilestonesCalendarWidget,
  renderClientAvatarPills,
  switchDashboardTab
} from './ui.js';
import {
  checkUrlUptime,
  pingSingleClient,
  pingCurrentDrilldownClient,
  pingAllClients
} from './uptime.js';
import {
  toggleTask,
  deleteClientTask,
  toggleTaskGuide,
  openRoadmapManagementModal,
  closeRoadmapManagementModal,
  switchRoadmapTab,
  getProposalDeliverables,
  renderRoadmapProposalsTab,
  renderRoadmapCatalogTab,
  activateProposalInRoadmap,
  injectSelectedCatalogServices,
  handleSaveCustomRoadmapTask,
  loadHqTasks,
  toggleHqTask,
  updateHqCardsState,
  checkHqLiveStatus,
  toggleHqGuide,
  renderHqTasks,
  toggleStitchSidebar,
  OFFICIAL_CATALOG_SERVICES,
  DEFAULT_HQ_TASKS
} from './roadmap.js';
import {
  initProposalBuilder,
  handleProposalClientSelect,
  renderProposalAddonsList,
  handlePackageSelect,
  toggleProposalAddon,
  updateProposalTotals,
  handleGenerateProposal,
  closeProposalResultModal,
  copyGeneratedProposalLink,
  getStoredProposals,
  saveProposalToHistory,
  renderProposalsHistory,
  deleteProposalWithUndo,
  undoProposalDelete,
  finalizeProposalDelete,
  openProposalForClient,
  goToProposalBuilderForClient,
  createContractFromCurrentResultProposal,
  activateCurrentProposalInRoadmap,
  getPackageData,
  updateCustomPackagePrice,
  resetCurrentPackagePrice,
  syncPackageCustomizerUI,
  updatePackageCardDisplay,
  toggleEditProposalAddon,
  updateProposalAddonField,
  addCustomProposalService,
  deleteCustomProposalService,
  resetProposalAddonsCatalog
} from './proposals.js';
import {
  getBankDetails,
  saveBankDetails,
  loadAccountingData,
  saveAccountingLedger,
  addAccountingTransaction,
  updateAccountingKpis,
  renderAccountingBankBalances,
  renderAccountingReceivables,
  renderAccountingTransactions,
  filterLedgerTransactions,
  openManualTransactionModal,
  closeManualTransactionModal,
  populateTxClientSelect,
  handleTxClientSelectChange,
  saveManualTransaction,
  deleteLedgerTransaction,
  exportAccountingReport,
  adjustForecastPlan,
  updateForecastSimulation,
  registerClientPayment,
  drawerRegisterPayment
} from './accounting.js';
import {
  openReportModal,
  closeReportModal,
  copyReportText,
  openBillingNoticeModal,
  closeBillingNoticeModal,
  generateBillingNoticeMessage,
  regenerateBillingMessage,
  updateBillingNoticeWhatsappLink,
  copyBillingNoticeText,
  drawerOpenBillingNotice
} from './reports.js';
import {
  getStoredReferralPartners,
  saveReferralPartnersToStorage,
  loadReferralsData,
  renderReferralsView,
  editPartnerReward,
  openPartnerSnippetModal,
  closePartnerSnippetModal,
  switchSnippetFormat,
  updateSnippetCode,
  copySnippetCode,
  openNewPartnerModal,
  closeNewPartnerModal,
  saveNewPartner,
  simulateReferralClick
} from './referrals.js';
import {
  openBackupModal,
  closeBackupModal,
  exportDatabase,
  importDatabase
} from './backup.js';
import {
  setClientViewMode,
  setQuickFilter,
  updateQuickFilterCounts,
  renderClients,
  filterClients,
  toggleClientOptimizationPillar,
  autoScanDomainData,
  openNewClientModal,
  editClient,
  closeClientModal,
  saveClient,
  deleteClient,
  openClientDrawer,
  closeClientDrawer,
  handleDrawerBackdropClick,
  switchDrawerTab,
  renderDrawerContent,
  drawerRunAudit,
  drawerEditClient,
  toggleClientAccordion,
  toggleAllClientsCollapse
} from './directory.js';
import {
  toggleClientViewMode,
  selectClientDrilldown,
  openSatelliteFile,
  convertAuditGapsToTasks,
  syncAuditGapsToClientRoadmap,
  renderClientDrilldown,
  drilldownRunAudit,
  drilldownOpenWhatsapp,
  drilldownOpenDrawer
} from './drilldown.js';
import {
  runServicesAudit,
  openServicesAuditModal,
  closeServicesAuditModal,
  toggleAuditDetail,
  copyAuditProposalWhatsapp,
  copyAuditReportForAntigravity,
  triggerDirectAuditFromInput,
  openDirectAuditModal,
  triggerQuickAuditFromHeader,
  quickSaveAuditAsClient,
  convertAuditToClientWithPrefill
} from './audit.js';
import {
  openContractEditorModal,
  closeContractEditorModal,
  openNewContractForClient,
  createContractFromProposal,
  addContractServiceRow,
  removeContractServiceRow,
  recalcContractAmounts,
  handleManualTotalSetupChange,
  handleManualMonthlyChange,
  handleContractClientSelectChange,
  saveContractFromModal,
  viewCurrentEditingContract,
  deleteCurrentEditingContract,
  deleteContractWithUndo,
  undoContractDelete,
  renderRoadmapContractsTab
} from './contracts.js';

// ==========================================
// WINDOW BRIDGE FOR HTML EVENT HANDLERS
// ==========================================
const windowBridge = {
  // UI & Utility
  escapeHtml,
  formatMoney,
  formatDate,
  showToast,
  copyToClipboard,
  copyBankDetails,
  toggleThemeMode,
  togglePresentationMode,
  switchDashboardTab,
  toggleStitchSidebar,

  // Auth
  handlePinSubmit,
  lockDashboard,
  saveNewPin,
  emergencyBypassAuth,
  handleEmailPasswordLogin,
  handleGoogleLogin,
  handleMagicLinkLogin,
  switchAuthMode,

  // Sync
  manualTriggerCloudSync,
  saveClientsToStorage,

  // Directory & Clients
  setClientViewMode,
  toggleClientViewMode,
  toggleClientAccordion,
  toggleAllClientsCollapse,
  setQuickFilter,
  filterClients,
  toggleClientOptimizationPillar,
  autoScanDomainData,
  openNewClientModal,
  editClient,
  closeClientModal,
  saveClient,
  deleteClient,
  openClientDrawer,
  closeClientDrawer,
  handleDrawerBackdropClick,
  switchDrawerTab,
  renderDrawerContent,
  drawerRunAudit,
  drawerEditClient,
  drawerOpenBillingNotice,
  drawerRegisterPayment,

  // Drilldown
  selectClientDrilldown,
  openSatelliteFile,
  convertAuditGapsToTasks,
  syncAuditGapsToClientRoadmap,
  renderClientDrilldown,
  drilldownRunAudit,
  drilldownOpenWhatsapp,
  drilldownOpenDrawer,

  // Network & Uptime
  pingSingleClient,
  pingCurrentDrilldownClient,
  pingAllClients,

  // Roadmap & HQ
  toggleTask,
  deleteClientTask,
  toggleTaskGuide,
  openRoadmapManagementModal,
  closeRoadmapManagementModal,
  switchRoadmapTab,
  activateProposalInRoadmap,
  injectSelectedCatalogServices,
  handleSaveCustomRoadmapTask,
  toggleHqTask,
  checkHqLiveStatus,
  toggleHqGuide,

  // Proposals
  initProposalBuilder,
  handlePackageSelect,
  toggleProposalAddon,
  handleProposalClientSelect,
  handleGenerateProposal,
  closeProposalResultModal,
  copyGeneratedProposalLink,
  openProposalForClient,
  goToProposalBuilderForClient,
  deleteProposalWithUndo,
  undoProposalDelete,
  finalizeProposalDelete,
  createContractFromCurrentResultProposal,
  activateCurrentProposalInRoadmap,
  getPackageData,
  updateCustomPackagePrice,
  resetCurrentPackagePrice,
  syncPackageCustomizerUI,
  updatePackageCardDisplay,
  toggleEditProposalAddon,
  updateProposalAddonField,
  addCustomProposalService,
  deleteCustomProposalService,
  resetProposalAddonsCatalog,

  // Contracts (50/50 Architecture)
  openContractEditorModal,
  closeContractEditorModal,
  openNewContractForClient,
  createContractFromProposal,
  addContractServiceRow,
  removeContractServiceRow,
  recalcContractAmounts,
  handleManualTotalSetupChange,
  handleManualMonthlyChange,
  handleContractClientSelectChange,
  saveContractFromModal,
  viewCurrentEditingContract,
  deleteCurrentEditingContract,
  deleteContractWithUndo,
  undoContractDelete,
  renderRoadmapContractsTab,

  // Audit 360
  runServicesAudit,
  openServicesAuditModal,
  closeServicesAuditModal,
  toggleAuditDetail,
  copyAuditProposalWhatsapp,
  copyAuditReportForAntigravity,
  triggerDirectAuditFromInput,
  openDirectAuditModal,
  triggerQuickAuditFromHeader,
  quickSaveAuditAsClient,
  convertAuditToClientWithPrefill,

  // Accounting & Ledger
  openManualTransactionModal,
  closeManualTransactionModal,
  handleTxClientSelectChange,
  saveManualTransaction,
  deleteLedgerTransaction,
  filterLedgerTransactions,
  exportAccountingReport,
  adjustForecastPlan,
  saveBankDetails,
  registerClientPayment,

  // Reports
  openReportModal,
  closeReportModal,
  copyReportText,
  openBillingNoticeModal,
  closeBillingNoticeModal,
  regenerateBillingMessage,
  updateBillingNoticeWhatsappLink,
  copyBillingNoticeText,

  // Referrals
  loadReferralsData,
  openNewPartnerModal,
  closeNewPartnerModal,
  saveNewPartner,
  editPartnerReward,
  openPartnerSnippetModal,
  closePartnerSnippetModal,
  switchSnippetFormat,
  copySnippetCode,
  simulateReferralClick,

  // Backup
  openBackupModal,
  closeBackupModal,
  exportDatabase,
  importDatabase
};

// Mount all handlers onto global `window`
Object.assign(window, windowBridge);

// Expose state and module API to `window.ISAPromo` for developer inspection and testing
window.ISAPromo = {
  state,
  modules: {
    sync: { initCloudSync, syncAllClientsToCloud, syncClientToCloud },
    directory: { renderClients, filterClients },
    drilldown: { renderClientDrilldown, selectClientDrilldown },
    contracts: { openContractEditorModal, createContractFromProposal },
    audit: { runServicesAudit, quickSaveAuditAsClient },
    proposals: { initProposalBuilder, handleGenerateProposal },
    accounting: { loadAccountingData, addAccountingTransaction },
    uptime: { pingAllClients, checkUrlUptime }
  }
};

// ==========================================
// DOM READY & BOOTSTRAP INITIALIZATION
// ==========================================
function bootstrap() {
  // 1. Theme Mode
  initThemeMode();

  // 2. Local Clock & Live Pings
  startClock();
  updateEdgePing();
  setInterval(updateEdgePing, 30000);

  // 3. Security / Multi-Auth System
  initAuth();

  // 4. Data Loading & Cloud Sync
  loadStoredClients();
  renderClients();
  updateKpis();
  initCloudSync();

  // 5. Accounting, Referrals & HQ
  loadAccountingData();
  loadReferralsData();
  loadHqTasks();

  // 6. Global Search Keyboard Shortcut (⌘K / Ctrl+K)
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      const input = document.getElementById('searchInput');
      if (input) {
        input.focus();
        input.select();
      }
    }
  });

  // 7. Initial Ping of clients
  setTimeout(() => {
    pingAllClients();
  }, 1000);

  console.log("🚀 [ISAPromoRD] Plataforma modular v2.0 inicializada correctamente.");
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
