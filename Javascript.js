document.addEventListener('DOMContentLoaded', function() {
    // --- Get references to main content sections and navigation links ---
    const dashboardContent = document.getElementById('dashboardContent');
    const gridLineView = document.getElementById('gridLineView');
    const raisedFloorView = document.getElementById('raisedFloorView');
    const floorPlanView = document.getElementById('floorPlanView');
    const airConditionerInventoryView = document.getElementById('airConditionerInventoryView');

    // New Asset Views
    const fm200View = document.getElementById('fm200View');
    const cameraView = document.getElementById('cameraView');
    const powerComponentsView = document.getElementById('powerComponentsView');
    const accessControlView = document.getElementById('accessControlView');
    const upsDetailView = document.getElementById('upsDetailView'); // Specific UPS detail view
    const heaterView = document.getElementById('heaterView');

    const dashboardLink = document.getElementById('dashboardLink');
    const gridLineLink = document.getElementById('gridLineLink');
    const raisedFloorLink = document.getElementById('raisedFloorLink');
    const floorPlanLink = document.getElementById('floorPlanLink');
    const airConditionerLink = document.getElementById('airConditionerLink');

    // New Asset Links
    const fm200Link = document.getElementById('fm200Link');
    const cameraLink = document.getElementById('cameraLink');
    const powerComponentsLink = document.getElementById('powerComponentsLink');
    const accessControlLink = document.getElementById('accessControlLink');
    const upsDetailLink = document.getElementById('upsDetailLink');
    const heaterLink = document.getElementById('heaterLink');

    // PDF Links (from navigation sidebar)
    const msbLink = document.getElementById('msbLink');
    const rectifierLink = document.getElementById('rectifierLink'); // Assuming you've also added an ID to this link in HTML
    const mdbLink = document.getElementById('mdbLink'); // Assuming you've also added an ID to this link in HTML

    // Define the paths to your PDF files
    const msbPdfPath = 'pdfs/msb_diagram.pdf';
    const rectifierPdfPath = 'pdfs/rectifier_spec.pdf'; // Ensure this PDF path is correct
    const mdbPdfPath = 'pdfs/mdb_layout.pdf'; // Ensure this PDF path is correct

    // New: Image Overlay Elements
    const imageOverlay = document.getElementById('imageOverlay');
    const overlayImage = document.getElementById('overlayImage');
    const closeImageOverlayBtn = document.getElementById('closeImageOverlayBtn');

    // Define the path to the MSB image (IMPORTANT: Replace with your actual image URL)
    // The previous response used a placeholder 'https://i.imgur.com/your_msb_image_id.png'
    // If you saved the image from the API as 'image_d7812a.png' in your 'images' folder:
    const msbDiagramImagePath = 'images/image_d7812a.png';
    // If it's still externally hosted and you have a new URL, update it here.

    // Grid Line View Elements
    const gridLinesAndLabelsGroup = document.getElementById('gridLinesAndLabels');
    const allRacksContainer = document.getElementById('allRacksContainer');

    // Floor Plan Elements
    const svgContainer = document.getElementById('svgContainer');
    const floorPlanDetailPanel = document.getElementById('floorPlanDetailPanel');
    const detailPanelTitle = document.getElementById('detailPanelTitle');
    const detailPanelContent = document.getElementById('detailPanelContent');
    const closeDetailPanelButton = document.getElementById('closeDetailPanel');
    const svgTooltip = document.getElementById('svgTooltip');
    const addFloorPlanElementBtn = document.getElementById('addFloorPlanElementBtn');
    const saveFloorPlanLayoutBtn = document.getElementById('saveFloorPlanLayoutBtn');
    const addElementModal = document.getElementById('addElementModal');
    const newElementIdInput = document.getElementById('newElementId');
    const newElementNameInput = document.getElementById('newElementName');
    const newElementTypeInput = document.getElementById('newElementType');
    const newElementLayerSelect = document.getElementById('newElementLayer');
    const newElementStatusSelect = document.getElementById('newElementStatus');
    const cancelAddElementBtn = document.getElementById('cancelAddElement');
    const confirmAddElementBtn = document.getElementById('confirmAddElement');
    const layerToggles = document.querySelectorAll('[data-layer-toggle]');

    // AC Inventory Elements
    const acInventoryList = document.getElementById('acInventoryList');
    const acFilterInput = document.getElementById('acFilterInput');
    const exportCsvButton = document.getElementById('exportCsvButton');

    // New Asset View Elements (lists, filters, export buttons)
    const fm200List = document.getElementById('fm200List');
    const fm200FilterInput = document.getElementById('fm200FilterInput');
    const exportFm200CsvButton = document.getElementById('exportFm200CsvButton');

    const cameraList = document.getElementById('cameraList');
    const cameraFilterInput = document.getElementById('cameraFilterInput');
    const exportCameraCsvButton = document.getElementById('exportCameraCsvButton');

    const powerComponentsList = document.getElementById('powerComponentsList');
    const powerFilterInput = document.getElementById('powerFilterInput');
    const exportPowerCsvButton = document.getElementById('exportPowerCsvButton');

    const accessControlList = document.getElementById('accessControlList');
    const accessFilterInput = document.getElementById('accessFilterInput');
    const exportAccessCsvButton = document.getElementById('exportAccessCsvButton');

    const upsDetailList = document.getElementById('upsDetailList');
    const upsDetailFilterInput = document.getElementById('upsDetailFilterInput');
    const exportUpsDetailCsvButton = document.getElementById('exportUpsDetailCsvButton');

    const heaterList = document.getElementById('heaterList');
    const heaterFilterInput = document.getElementById('heaterFilterInput');
    const exportHeaterCsvButton = document.getElementById('exportHeaterCsvButton');

    // Customizable Dashboard Elements
    const dashboardWidgetsContainer = document.getElementById('dashboardWidgetsContainer');
    const customizeDashboardBtn = document.getElementById('customizeDashboardBtn');
    const saveLayoutBtn = document.getElementById('saveLayoutBtn');
    const addDashboardWidgetBtn = document.getElementById('addDashboardWidgetBtn');

    let sortableInstance = null; // Will hold the Sortable.js instance
    let isCustomizing = false; // State variable for customization mode

    // Store references to all existing charts to destroy/recreate if needed
    const activeCharts = {}; // { widgetId: chartInstance }

    // --- Mock Data for all sections ---
    const rackNotes = JSON.parse(localStorage.getItem('rackNotes')) || {};

    const populateInitialRackNotes = () => {
        const allSeries = ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
        allSeries.forEach(prefix => {
            for (let i = 1; i <= 8; i++) {
                const rackNum = String(i).padStart(2, '0');
                const fullRackId = `${prefix}${rackNum}`;
                const sourceAKey = `${fullRackId}-SourceA`;
                const sourceBKey = `${fullRackId}-SourceB`;

                if (!rackNotes[sourceAKey]) {
                    rackNotes[sourceAKey] = `${fullRackId} Source A: Primary system checks.`;
                }
                if (!rackNotes[sourceBKey]) {
                    rackNotes[sourceBKey] = `${fullRackId} Source B: Secondary system details.`;
                }
            }
        });
        // Specific initial notes (your existing list)
        if (!rackNotes['C01-SourceA']) rackNotes['C01-SourceA'] = 'C01 Source A: HW-GF-UPSA-DB01-LLL12.';
        if (!rackNotes['C01-SourceB']) rackNotes['C01-SourceB'] = 'C01 Source B: HW-GF-UPSB-DB01-LLL12.';
        if (!rackNotes['C02-SourceA']) rackNotes['C02-SourceA'] = 'C02 Source A: Data acquisition unit power.';
        if (!rackNotes['C02-SourceB']) rackNotes['C02-SourceB'] = 'C02 Source B: Network module power.';
        if (!rackNotes['C03-SourceA']) rackNotes['C03-SourceA'] = 'C03 Source A: Fire suppression agent release mechanism.';
        if (!rackNotes['C03-SourceB']) rackNotes['C03-SourceB'] = 'C03 Source B: Reserved.';
        if (!rackNotes['C04-SourceA']) rackNotes['C04-SourceA'] = 'C04 Source A: Status indicator light power.';
        if (!rackNotes['C04-SourceB']) rackNotes['C04-SourceB'] = 'C04 Source B: Smoke detector power.';
        if (!rackNotes['C05-SourceA']) rackNotes['C05-SourceA'] = 'C05 Source A: Temperature sensor feed.';
        if (!rackNotes['C05-SourceB']) rackNotes['C05-SourceB'] = 'C05 Source B: Humidity sensor feed.';
        if (!rackNotes['C06-SourceA']) rackNotes['C06-SourceA'] = 'C06 Source A: Manual override system.';
        if (!rackNotes['C06-SourceB']) rackNotes['C06-SourceB'] = 'C06 Source B: Heat detector power.';
        if (!rackNotes['C07-SourceA']) rackNotes['C07-SourceA'] = 'C07 Source A: Interface to BMS.';
        if (!rackNotes['C07-SourceB']) rackNotes['C07-SourceB'] = 'C07 Source B: Auxiliary power for communication.';
        if (!rackNotes['C08-SourceA']) rackNotes['C08-SourceA'] = 'C08 Source A: Main circuit breaker.';
        if (!rackNotes['C08-SourceB']) rackNotes['C08-SourceB'] = 'C08 Source B: Grounding system check.';
        if (!rackNotes['D01-SourceA']) rackNotes['D01-SourceA'] = 'D01 Source A: Primary power feed for control panel.';
        if (!rackNotes['D01-SourceB']) rackNotes['D01-SourceB'] = 'D01 Source B: Backup power for sensor array.';
        if (!rackNotes['D02-SourceA']) rackNotes['D02-SourceA'] = 'D02 Source A: Data acquisition unit power.';
        if (!rackNotes['D02-SourceB']) rackNotes['D02-SourceB'] = 'D02 Source B: Network module power.';
        if (!rackNotes['D03-SourceA']) rackNotes['D03-SourceA'] = 'D03 Source A: Fire suppression agent release mechanism.';
        if (!rackNotes['D03-SourceB']) rackNotes['D03-SourceB'] = 'D03 Source B: Status indicator light power.';
        if (!rackNotes['D04-SourceA']) rackNotes['D04-SourceA'] = 'D04 Source A: Manual override system.';
        if (!rackNotes['D04-SourceB']) rackNotes['D04-SourceB'] = 'D04 Source B: Alarm siren power.';
        if (!rackNotes['D05-SourceA']) rackNotes['D05-SourceA'] = 'D05 Source A: Temperature sensor feed.';
        if (!rackNotes['D05-SourceB']) rackNotes['D05-SourceB'] = 'D05 Source B: Humidity sensor feed.';
        if (!rackNotes['D06-SourceA']) rackNotes['D06-SourceA'] = 'D06 Source A: Smoke detector power.';
        if (!rackNotes['D06-SourceB']) rackNotes['D06-SourceB'] = 'D06 Source B: Heat detector power.';
        if (!rackNotes['D07-SourceA']) rackNotes['D07-SourceA'] = 'D07 Source A: Interface to BMS.';
        if (!rackNotes['D07-SourceB']) rackNotes['D07-SourceB'] = 'D07 Source B: Auxiliary power for communication.';
        if (!rackNotes['D08-SourceA']) rackNotes['D08-SourceA'] = 'D08 Source A: Main circuit breaker.';
        if (!rackNotes['D08-SourceB']) rackNotes['D08-SourceB'] = 'D08 Source B: Grounding system check.';
        if (!rackNotes['E01-SourceA']) rackNotes['E01-SourceA'] = 'E01 Source A: Primary power feed for control panel.';
        if (!rackNotes['E01-SourceB']) rackNotes['E01-SourceB'] = 'E01 Source B: Backup power for sensor array.';
        if (!rackNotes['E02-SourceA']) rackNotes['E02-SourceA'] = 'E02 Source A: Data acquisition unit power.';
        if (!rackNotes['E02-SourceB']) rackNotes['E02-SourceB'] = 'E02 Source B: Network module power.';
        if (!rackNotes['E03-SourceA']) rackNotes['E03-SourceA'] = 'E03 Source A: Fire suppression agent release mechanism.';
        if (!rackNotes['E03-SourceB']) rackNotes['E03-SourceB'] = 'E03 Source B: Status indicator light power.';
        if (!rackNotes['E04-SourceA']) rackNotes['E04-SourceA'] = 'E04 Source A: Manual override system.';
        if (!rackNotes['E04-SourceB']) rackNotes['E04-SourceB'] = 'E04 Source B: Alarm siren power.';
        if (!rackNotes['E05-SourceA']) rackNotes['E05-SourceA'] = 'E05 Source A: Temperature sensor feed.';
        if (!rackNotes['E05-SourceB']) rackNotes['E05-SourceB'] = 'E05 Source B: Humidity sensor feed.';
        if (!rackNotes['E06-SourceA']) rackNotes['E06-SourceA'] = 'E06 Source A: Smoke detector power.';
        if (!rackNotes['E06-SourceB']) rackNotes['E06-SourceB'] = 'E06 Source B: Heat detector power.';
        if (!rackNotes['E07-SourceA']) rackNotes['E07-SourceA'] = 'E07 Source A: Interface to BMS.';
        if (!rackNotes['E07-SourceB']) rackNotes['E07-SourceB'] = 'E07 Source B: Auxiliary power for communication.';
        if (!rackNotes['E08-SourceA']) rackNotes['E08-SourceA'] = 'E08 Source A: Main circuit breaker.';
        if (!rackNotes['E08-SourceB']) rackNotes['E08-SourceB'] = 'E08 Source B: Grounding system check.';
        if (!rackNotes['F01-SourceA']) rackNotes['F01-SourceA'] = 'F01 Source A: Primary power feed for control panel.';
        if (!rackNotes['F01-SourceB']) rackNotes['F01-SourceB'] = 'F01 Source B: Backup power for sensor array.';
        if (!rackNotes['F02-SourceA']) rackNotes['F02-SourceA'] = 'F02 Source A: Data acquisition unit power.';
        if (!rackNotes['F02-SourceB']) rackNotes['F02-SourceB'] = 'F02 Source B: Network module power.';
        if (!rackNotes['F03-SourceA']) rackNotes['F03-SourceA'] = 'F03 Source A: Fire suppression agent release mechanism.';
        if (!rackNotes['F03-SourceB']) rackNotes['F03-SourceB'] = 'F03 Source B: Status indicator light power.';
        if (!rackNotes['F04-SourceA']) rackNotes['F04-SourceA'] = 'F04 Source A: Manual override system.';
        if (!rackNotes['F04-SourceB']) rackNotes['F04-SourceB'] = 'F04 Source B: Alarm siren power.';
        if (!rackNotes['F05-SourceA']) rackNotes['F05-SourceA'] = 'F05 Source A: Temperature sensor feed.';
        if (!rackNotes['F05-SourceB']) rackNotes['F05-SourceB'] = 'F05 Source B: Humidity sensor feed.';
        if (!rackNotes['F06-SourceA']) rackNotes['F06-SourceA'] = 'F06 Source A: Smoke detector power.';
        if (!rackNotes['F06-SourceB']) rackNotes['F06-SourceB'] = 'F06 Source B: Heat detector power.';
        if (!rackNotes['F07-SourceA']) rackNotes['F07-SourceA'] = 'F07 Source A: Interface to BMS.';
        if (!rackNotes['F07-SourceB']) rackNotes['F07-SourceB'] = 'F07 Source B: Auxiliary power for communication.';
        if (!rackNotes['F08-SourceA']) rackNotes['F08-SourceA'] = 'F08 Source A: Main circuit breaker.';
        if (!rackNotes['F08-SourceB']) rackNotes['F08-SourceB'] = 'F08 Source B: Grounding system check.';
        if (!rackNotes['H01-SourceA']) rackNotes['H01-SourceA'] = 'H01 Source A: Primary power feed for control panel.';
        if (!rackNotes['H01-SourceB']) rackNotes['H01-SourceB'] = 'H01 Source B: Backup power for sensor array.';
        if (!rackNotes['H02-SourceA']) rackNotes['H02-SourceA'] = 'H02 Source A: Data acquisition unit power.';
        if (!rackNotes['H02-SourceB']) rackNotes['H02-SourceB'] = 'H02 Source B: Network module power.';
        if (!rackNotes['H03-SourceA']) rackNotes['H03-SourceA'] = 'H03 Source A: Fire suppression agent release mechanism.';
        if (!rackNotes['H03-SourceB']) rackNotes['H03-SourceB'] = 'H03 Source B: Status indicator light power.';
        if (!rackNotes['H04-SourceA']) rackNotes['H04-SourceA'] = 'H04 Source A: Manual override system.';
        if (!rackNotes['H04-SourceB']) rackNotes['H04-SourceB'] = 'H04 Source B: Alarm siren power.';
        if (!rackNotes['H05-SourceA']) rackNotes['H05-SourceA'] = 'H05 Source A: Temperature sensor feed.';
        if (!rackNotes['H05-SourceB']) rackNotes['H05-SourceB'] = 'H05 Source B: Humidity sensor feed.';
        if (!rackNotes['H06-SourceA']) rackNotes['H06-SourceA'] = 'H06 Source A: Smoke detector power.';
        if (!rackNotes['H06-SourceB']) rackNotes['H06-SourceB'] = 'H06 Source B: Heat detector power.';
        if (!rackNotes['H07-SourceA']) rackNotes['H07-SourceA'] = 'H07 Source A: Interface to BMS.';
        if (!rackNotes['H07-SourceB']) rackNotes['H07-SourceB'] = 'H07 Source B: Auxiliary power for communication.';
        if (!rackNotes['H08-SourceA']) rackNotes['H08-SourceA'] = 'H08 Source A: Main circuit breaker.';
        if (!rackNotes['H08-SourceB']) rackNotes['H08-SourceB'] = 'H08 Source B: Grounding system check.';
        if (!rackNotes['I01-SourceA']) rackNotes['I01-SourceA'] = 'I01 Source A: Primary power feed for control panel.';
        if (!rackNotes['I01-SourceB']) rackNotes['I01-SourceB'] = 'I01 Source B: Backup power for sensor array.';
        if (!rackNotes['I02-SourceA']) rackNotes['I02-SourceA'] = 'I02 Source A: Data acquisition unit power.';
        if (!rackNotes['I02-SourceB']) rackNotes['I02-SourceB'] = 'I02 Source B: Network module power.';
        if (!rackNotes['I03-SourceA']) rackNotes['I03-SourceA'] = 'I03 Source A: Fire suppression agent release mechanism.';
        if (!rackNotes['I03-SourceB']) rackNotes['I03-SourceB'] = 'I03 Source B: Status indicator light power.';
        if (!rackNotes['I04-SourceA']) rackNotes['I04-SourceA'] = 'I04 Source A: Manual override system.';
        if (!rackNotes['I04-SourceB']) rackNotes['I04-SourceB'] = 'I04 Source B: Alarm siren power.';
        if (!rackNotes['I05-SourceA']) rackNotes['I05-SourceA'] = 'I05 Source A: Temperature sensor feed.';
        if (!rackNotes['I05-SourceB']) rackNotes['I05-SourceB'] = 'I05 Source B: Humidity sensor feed.';
        if (!rackNotes['I06-SourceA']) rackNotes['I06-SourceA'] = 'I06 Source A: Smoke detector power.';
        if (!rackNotes['I06-SourceB']) rackNotes['I06-SourceB'] = 'I06 Source B: Heat detector power.';
        if (!rackNotes['I07-SourceA']) rackNotes['I07-SourceA'] = 'I07 Source A: Interface to BMS.';
        if (!rackNotes['I07-SourceB']) rackNotes['I07-SourceB'] = 'I07 Source B: Auxiliary power for communication.';
        if (!rackNotes['I08-SourceA']) rackNotes['I08-SourceA'] = 'I08 Source A: Main circuit breaker.';
        if (!rackNotes['I08-SourceB']) rackNotes['I08-SourceB'] = 'I08 Source B: Grounding system check.';
        if (!rackNotes['J01-SourceA']) rackNotes['J01-SourceA'] = 'J01 Source A: Primary power feed for control panel.';
        if (!rackNotes['J01-SourceB']) rackNotes['J01-SourceB'] = 'J01 Source B: Backup power for sensor array.';
        if (!rackNotes['J02-SourceA']) rackNotes['J02-SourceA'] = 'J02 Source A: Data acquisition unit power.';
        if (!rackNotes['J02-SourceB']) rackNotes['J02-SourceB'] = 'J02 Source B: Network module power.';
        if (!rackNotes['J03-SourceA']) rackNotes['J03-SourceA'] = 'J03 Source A: Fire suppression agent release mechanism.';
        if (!rackNotes['J03-SourceB']) rackNotes['J03-SourceB'] = 'J03 Source B: Status indicator light power.';
        if (!rackNotes['J04-SourceA']) rackNotes['J04-SourceA'] = 'J04 Source A: Manual override system.';
        if (!rackNotes['J04-SourceB']) rackNotes['J04-SourceB'] = 'J04 Source B: Alarm siren power.';
        if (!rackNotes['J05-SourceA']) rackNotes['J05-SourceA'] = 'J05 Source A: Temperature sensor feed.';
        if (!rackNotes['J05-SourceB']) rackNotes['J05-SourceB'] = 'J05 Source B: Humidity sensor feed.';
        if (!rackNotes['J06-SourceA']) rackNotes['J06-SourceA'] = 'J06 Source A: Smoke detector power.';
        if (!rackNotes['J06-SourceB']) rackNotes['J06-SourceB'] = 'J06 Source B: Heat detector power.';
        if (!rackNotes['J07-SourceA']) rackNotes['J07-SourceA'] = 'J07 Source A: Interface to BMS.';
        if (!rackNotes['J07-SourceB']) rackNotes['J07-SourceB'] = 'J07 Source B: Auxiliary power for communication.';
        if (!rackNotes['J08-SourceA']) rackNotes['J08-SourceA'] = 'J08 Source A: Main circuit breaker.';
        if (!rackNotes['J08-SourceB']) rackNotes['J08-SourceB'] = 'J08 Source B: Grounding system check.';
        if (!rackNotes['K01-SourceA']) rackNotes['K01-SourceA'] = 'K01 Source A: Primary power feed for control panel.';
        if (!rackNotes['K01-SourceB']) rackNotes['K01-SourceB'] = 'K01 Source B: Backup power for sensor array.';
        if (!rackNotes['K02-SourceA']) rackNotes['K02-SourceA'] = 'K02 Source A: Data acquisition unit power.';
        if (!rackNotes['K02-SourceB']) rackNotes['K02-SourceB'] = 'K02 Source B: Network module power.';
        if (!rackNotes['K03-SourceA']) rackNotes['K03-SourceA'] = 'K03 Source A: Fire suppression agent release mechanism.';
        if (!rackNotes['K03-SourceB']) rackNotes['K03-SourceB'] = 'K03 Source B: Status indicator light power.';
        if (!rackNotes['K04-SourceA']) rackNotes['K04-SourceA'] = 'K04 Source A: Manual override system.';
        if (!rackNotes['K04-SourceB']) rackNotes['K04-SourceB'] = 'K04 Source B: Alarm siren power.';
        if (!rackNotes['K05-SourceA']) rackNotes['K05-SourceA'] = 'K05 Source A: Temperature sensor feed.';
        if (!rackNotes['K05-SourceB']) rackNotes['K05-SourceB'] = 'K05 Source B: Humidity sensor feed.';
        if (!rackNotes['K06-SourceA']) rackNotes['K06-SourceA'] = 'K06 Source A: Smoke detector power.';
        if (!rackNotes['K06-SourceB']) rackNotes['K06-SourceB'] = 'K06 Source B: Heat detector power.';
        if (!rackNotes['K07-SourceA']) rackNotes['K07-SourceA'] = 'K07 Source A: Interface to BMS.';
        if (!rackNotes['K07-SourceB']) rackNotes['K07-SourceB'] = 'K07 Source B: Auxiliary power for communication.';
        if (!rackNotes['K08-SourceA']) rackNotes['K08-SourceA'] = 'K08 Source A: Main circuit breaker.';
        if (!rackNotes['K08-SourceB']) rackNotes['K08-SourceB'] = 'K08 Source B: Grounding system check.';
    };

    populateInitialRackNotes();

    const airConditioners = [
        { "Label": "MSC5-GF-DC-PAC-01", "Brand": "Temperzon", "Capacity": "20HP", "Location": "MSC5", "Room_Label": "Switch Room", "State": "Working", "Floor": "GF", "Remark": "Working" },
        { "Label": "MSC5-GF-DC-PAC-02", "Brand": "Temperzon", "Capacity": "20HP", "Location": "MSC5", "Room_Label": "Switch Room", "State": "Working", "Floor": "GF", "Remark": "Working" },
        { "Label": "MSC5-GF-DC-PAC-03", "Brand": "Temperzon", "Capacity": "20HP", "Location": "MSC5", "Room_Label": "Switch Room", "State": "Working", "Floor": "GF", "Remark": "Working" },
        { "Label": "MSC5-GF-DC-PAC-04", "Brand": "Temperzon", "Capacity": "20HP", "Location": "MSC5", "Room_Label": "Switch Room", "State": "Good", "Floor": "GF", "Remark": "Power off" },
        { "Label": "MSC5-GF-BB-SAC-05", "Brand": "PANASONII", "Capacity": "2.5HP", "Location": "MSC5", "Room_Label": "Battery room", "State": "Working", "Floor": "GF", "Remark": "Working" },
        { "Label": "MSC5-GF-BB-SAC-06", "Brand": "PANASONII", "Capacity": "2.5HP", "Location": "MSC5", "Room_Label": "Battery room", "State": "Working", "Floor": "GF", "Remark": "Working" },
        { "Label": "MSC5-GF-BB-SAC-07", "Brand": "PANASONII", "Capacity": "2.5HP", "Location": "MSC5", "Room_Label": "Battery room", "State": "Working", "Floor": "GF", "Remark": "Working" },
        { "Label": "MSC5-GF-BB-SAC-08", "Brand": "PANASONII", "Capacity": "2.5HP", "Location": "MSC5", "Room_Label": "Battery room", "State": "Working", "Floor": "GF", "Remark": "Working" },
        { "Label": "MSC5-GF-ZTE-SAC-09", "Brand": "PANASONII", "Capacity": "2HP", "Location": "MSC5", "Room_Label": "ZTE battery Room", "State": "Working", "Floor": "GF", "Remark": "Working" },
        { "Label": "MSC5-GF-ENTR-SAC-10", "Brand": "PANASONII", "Capacity": "1HP", "Location": "MSC5", "Room_Label": "Entrance", "State": "Working", "Floor": "GF", "Remark": "Working" },
        { "Label": "MSC5-GF-MDB-SAC-11", "Brand": "GREE", "Capacity": "1HP", "Location": "MSC5", "Room_Label": "MDB Room", "State": "Working", "Floor": "GF", "Remark": "Working" },
        { "Label": "MSC5-FF-DC-PAC-12", "Brand": "Temperzon", "Capacity": "20HP", "Location": "MSC5", "Room_Label": "Switch Room", "State": "Working", "Floor": "FF", "Remark": "Working" },
        { "Label": "MSC5-FF-DC-PAC-13", "Brand": "Temperzon", "Capacity": "20HP", "Location": "MSC5", "Room_Label": "Switch Room", "State": "Working", "Floor": "FF", "Remark": "Working" },
        { "Label": "MSC5-FF-DC-PAC-14", "Brand": "Temperzon", "Capacity": "20HP", "Location": "MSC5", "Room_Label": "Switch Room", "State": "Working", "Floor": "FF", "Remark": "Working" },
        { "Label": "MSC5-FF-DC-PAC-15", "Brand": "Temperzon", "Capacity": "20HP", "Location": "MSC5", "Room_Label": "Switch Room", "State": "Working", "Floor": "FF", "Remark": "Working" },
        { "Label": "MSC5-FF-CTRL-SAC-16", "Brand": "PANASONII", "Capacity": "1HP", "Location": "MSC5", "Room_Label": "Control Room", "State": "Working", "Floor": "FF", "Remark": "Working" },
        { "Label": "MSC5-FF-ENTR-SAC-17", "Brand": "LG", "Capacity": "1.5HP", "Location": "MSC5", "Room_Label": "Entrance", "State": "Good", "Floor": "FF", "Remark": "Power off" },
        { "Label": "MSC5-FF-GOV-SAC-18", "Brand": "PANASONII", "Capacity": "2.5HP", "Location": "MSC5", "Room_Label": "Government Room", "State": "Working", "Floor": "FF", "Remark": "Working" },
        { "Label": "MSC5-FF-GOV-SAC-19", "Brand": "PANASONII", "Capacity": "2.5HP", "Location": "MSC5", "Room_Label": "Government Room", "State": "Working", "Floor": "FF", "Remark": "Working" },
        { "Label": "MSC5-FF-DC-PAC-20", "Brand": "Temperzon", "Capacity": "10HP", "Location": "MSC5", "Room_Label": "Switch Room", "State": "Working", "Floor": "FF", "Remark": "Working" },
        { "Label": "MSC5-FF-DC-PAC-21", "Brand": "Midea", "Capacity": "5HP", "Location": "MSC5", "Room_Label": "Switch Room", "State": "Working", "Floor": "FF", "Remark": "Working" },
        { "Label": "MSC5-FF-DC-PAC-22", "Brand": "Midea", "Capacity": "5HP", "Location": "MSC5", "Room_Label": "Switch Room", "State": "Working", "Floor": "FF", "Remark": "ODU Sanyo" },
        { "Label": "MSC5-FF-DC-PAC-23", "Brand": "Panasonic", "Capacity": "5HP", "Location": "MSC5", "Room_Label": "Switch Room", "State": "Working", "Floor": "FF", "Remark": "Working" },
        { "Label": "MSC5-FF-DC-PAC-24", "Brand": "Panasonic", "Capacity": "5HP", "Location": "MSC5", "Room_Label": "Switch Room", "State": "Working", "Floor": "FF", "Remark": "Working" },
        { "Label": "MSC5-GF-DC-PAC-25", "Brand": "Panasonic", "Capacity": "5HP", "Location": "MSC5", "Room_Label": "Switch Room", "State": "Good", "Floor": "GF", "Remark": "Power off" },
        { "Label": "MSC5-GF-DC-PAC-26", "Brand": "Panasonic", "Capacity": "5HP", "Location": "MSC5", "Room_Label": "Switch Room", "State": "Working", "Floor": "GF", "Remark": "Working" },
        { "Label": "MSC5-GF-DC-PAC-27", "Brand": "PANASONII", "Capacity": "5HP", "Location": "MSC5", "Room_Label": "Switch Room", "State": "Working", "Floor": "GF", "Remark": "Working" },
        { "Label": "MSC5-GF-DC-PAC-28", "Brand": "PANASONII", "Capacity": "5HP", "Location": "MSC5", "Room_Label": "Switch Room", "State": "Good", "Floor": "GF", "Remark": "Power off" },
        { "Label": "MSC5-GF-DC-PAC-29", "Brand": "PANASONII", "Capacity": "5HP", "Location": "MSC5", "Room_Label": "Switch Room", "State": "Working", "Floor": "GF", "Remark": "Working" },
        { "Label": "MSC5-GF-DC-PAC-30", "Brand": "PANASONII", "Capacity": "5HP", "Location": "MSC5", "Room_Label": "Switch Room (JTRUST)", "State": "Working", "Floor": "GF", "Remark": "Working" },
        { "Label": "MSC5-GF-DC-SAC-31", "Brand": "Panasonic", "Capacity": "5HP", "Location": "MSC5", "Room_Label": "Switch Room (JTRUST)", "State": "Working", "Floor": "GF", "Remark": "Working" },
        { "Label": "MSC5-FF-GOV-SAC-32", "Brand": "Panasonic", "Capacity": "1HP", "Location": "MSC5", "Room_Label": "Government Room", "State": "Working", "Floor": "FF", "Remark": "Working" },
        { "Label": "MSC5-GF-DC-PAC-33", "Brand": "Panasonic", "Capacity": "5HP", "Location": "MSC5", "Room_Label": "Switch Room", "State": "Working", "Floor": "GF", "Remark": "Working" },
        { "Label": "MSC5-GF-DC-PAC-34", "Brand": "Panasonic", "Capacity": "5HP", "Location": "MSC5", "Room_Label": "Switch Room", "State": "Working", "Floor": "GF", "Remark": "Working" },
        { "Label": "MSC5-GF-DC-PAC-35", "Brand": "Panasonic", "Capacity": "5HP", "Location": "MSC5", "Room_Label": "Switch Room", "State": "Working", "Floor": "GF", "Remark": "Working" },
        { "Label": "MSC5-GF-DC-PAC-36", "Brand": "PANASONII", "Capacity": "5HP", "Location": "MSC5", "Room_Label": "Switch Room", "State": "Good", "Floor": "GF", "Remark": "Power off" },
        { "Label": "MSC5-DC-GF-NC-01", "Brand": "Huawei", "Capacity": "5HP", "Location": "MSC5", "Room_Label": "Containment Phase1", "State": "Working", "Floor": "GF", "Remark": "Working" },
        { "Label": "MSC5-DC-GF-NC-02", "Brand": "Huawei", "Capacity": "5HP", "Location": "MSC5", "Room_Label": "Containment Phase1", "State": "Working", "Floor": "GF", "Remark": "Working" },
        { "Label": "MSC5-DC-GF-NC-03", "Brand": "Huawei", "Capacity": "5HP", "Location": "MSC5", "Room_Label": "Containment Phase1", "State": "Working", "Floor": "GF", "Remark": "Working" },
        { "Label": "MSC5-DC-GF-NC-04", "Brand": "Huawei", "Capacity": "5HP", "Location": "MSC5", "Room_Label": "Containment Phase1", "State": "Working", "Floor": "GF", "Remark": "Working" },
        { "Label": "MSC5-DC-GF-NC-05", "Brand": "Huawei", "Capacity": "5HP", "Location": "MSC5", "Room_Label": "Containment Phase1", "State": "Working", "Floor": "GF", "Remark": "Working" },
        { "Label": "MSC5-DC-GF-NC-06", "Brand": "Huawei", "Capacity": "5HP", "Location": "MSC5", "Room_Label": "Containment Phase1", "State": "Working", "Floor": "GF", "Remark": "Working" },
        { "Label": "MSC5-DC-GF-NC-07", "Brand": "Huawei", "Capacity": "5HP", "Location": "MSC5", "Room_Label": "Containment Phase1", "State": "Working", "Floor": "GF", "Remark": "Working" }
    ];

    let filteredAirConditioners = [...airConditioners]; // Initialize with full data

    // Mock Data for new sections
    const fm200Units = [
        { "Unit_ID": "FM200-01", "Zone": "Data Hall A", "Status": "Normal", "Pressure_PSI": 350, "Last_Inspection": "2025-06-01", "Remark": "Operational" },
        { "Unit_ID": "FM200-02", "Zone": "Data Hall B", "Status": "Normal", "Pressure_PSI": 345, "Last_Inspection": "2025-06-01", "Remark": "Operational" },
        { "Unit_ID": "FM200-03", "Zone": "UPS Room", "Status": "Warning", "Pressure_PSI": 320, "Last_Inspection": "2025-05-15", "Remark": "Low pressure, schedule refill" },
        { "Unit_ID": "FM200-04", "Zone": "Battery Room", "Status": "Normal", "Pressure_PSI": 355, "Last_Inspection": "2025-06-10", "Remark": "Operational" }
    ];
    let filteredFm200Units = [...fm200Units];

    const cameras = [
        { "Camera_ID": "MSC5-CCTV-CAM-FF-01", "Location": "Starcase area", "Status": "Online", "Resolution": "1080p", "Camera Type": "Indoor Fixed Camera", "Remark": "Clear view" },
        { "Camera_ID": "MSC5-CCTV-CAM-FF-02", "Location": "Starcase area", "Status": "Online", "Resolution": "1080p", "Camera Type": "Indoor Fixed Camera", "Remark": "Clear view" },
        { "Camera_ID": "MSC5-CCTV-CAM-FF-03", "Location": "Starcase area", "Status": "Online", "Resolution": "1080p", "Camera Type": "Indoor Fixed Camera", "Remark": "Clear view" },
        { "Camera_ID": "MSC5-CCTV-CAM-FF-04", "Location": "Starcase area", "Status": "Online", "Resolution": "1080p", "Camera Type": "Indoor Fixed Camera", "Remark": "Clear view" },
        { "Camera_ID": "MSC5-CCTV-CAM-FF-05", "Location": "Starcase area", "Status": "Online", "Resolution": "1080p", "Camera Type": "Indoor Fixed Camera", "Remark": "Clear view" },
        { "Camera_ID": "MSC5-CCTV-CAM-FF-06", "Location": "Starcase area", "Status": "Online", "Resolution": "1080p", "Camera Type": "Indoor Fixed Camera", "Remark": "Clear view" },
        { "Camera_ID": "MSC5-CCTV-CAM-FF-07", "Location": "Starcase area", "Status": "Online", "Resolution": "1080p", "Camera Type": "Indoor Fixed Camera", "Remark": "Clear view" },
        { "Camera_ID": "MSC5-CCTV-CAM-FF-08", "Location": "Starcase area", "Status": "Online", "Resolution": "1080p", "Camera Type": "Indoor Fixed Camera", "Remark": "Clear view" },
        { "Camera_ID": "MSC5-CCTV-CAM-FF-09", "Location": "Starcase area", "Status": "Online", "Resolution": "1080p", "Camera Type": "Indoor Fixed Camera", "Remark": "Clear view" },
        { "Camera_ID": "MSC5-CCTV-CAM-FF-10", "Location": "Starcase area", "Status": "Online", "Resolution": "1080p", "Camera Type": "Indoor Fixed Camera", "Remark": "Clear view" },
        { "Camera_ID": "MSC5-CCTV-CAM-FF-11", "Location": "Starcase area", "Status": "Online", "Resolution": "1080p", "Camera Type": "Indoor Fixed Camera", "Remark": "Clear view" },
        { "Camera_ID": "MSC5-CCTV-CAM-FF-12", "Location": "Starcase area", "Status": "Online", "Resolution": "1080p", "Camera Type": "Indoor Fixed Camera", "Remark": "Clear view" },
        { "Camera_ID": "MSC5-CCTV-CAM-FF-13", "Location": "Starcase area", "Status": "Online", "Resolution": "1080p", "Camera Type": "Indoor Fixed Camera", "Remark": "Clear view" },
        { "Camera_ID": "MSC5-CCTV-CAM-FF-14", "Location": "Starcase area", "Status": "Online", "Resolution": "1080p", "Camera Type": "Indoor Fixed Camera", "Remark": "Clear view" }
    ];
    let filteredCameras = [...cameras];

    const powerComponents = [
        { "Component_ID": "TRF-01", "Type": "Transformer", "Location": "Outdoor Pad", "Status": "Normal", "Voltage_In": "11kV", "Voltage_Out": "400V", "Load_Percent": "65%", "Remark": "Stable" },
        { "Component_ID": "MDB-Main", "Type": "Main Distribution Board", "Location": "Power Room", "Status": "Normal", "Current_A": "800A", "Voltage_V": "400V", "Remark": "Healthy" },
        { "Component_ID": "PDU-A01", "Type": "Power Distribution Unit", "Location": "Rack A01", "Status": "Warning", "Current_A": "30A", "Voltage_V": "230V", "Remark": "High load on circuit 3" },
        { "Component_ID": "ATS-01", "Type": "Automatic Transfer Switch", "Location": "Generator Area", "Status": "Normal", "Last_Transfer": "2025-07-10", "Remark": "Ready" }
    ];
    let filteredPowerComponents = [...powerComponents];

    const accessControlPoints = [
        { "Point_ID": "DOOR-DH-Main", "Location": "Data Hall Main Entrance", "Status": "Secured", "Last_Access": "2025-07-20 07:30 (Admin)", "Remark": "Normal operation" },
        { "Point_ID": "DOOR-UPS-01", "Location": "UPS Room Door", "Status": "Secured", "Last_Access": "2025-07-20 07:00 (Tech)", "Remark": "Normal operation" },
        { "Point_ID": "BIO-Scan-01", "Location": "Data Hall Biometric", "Status": "Fault", "Last_Access": "N/A", "Remark": "Sensor malfunction" }
    ];
    let filteredAccessControlPoints = [...accessControlPoints];

    const upsUnits = [
        { "UPS_ID": "HUAWEI-A", "Model": "UPS-100K", "Location": "UPS Room", "Status": "Working", "Load_Percent": "34%", "Battery_Health": "Good", "Input_Voltage": "400V", "Output_Voltage": "400V", "Remark": "Stable" },
        { "UPS_ID": "HUAWEI-B", "Model": "UPS-100K", "Location": "UPS Room", "Status": "Working", "Load_Percent": "14.7%", "Battery_Health": "Good", "Input_Voltage": "400V", "Output_Voltage": "400V", "Remark": "Stable" },
        { "UPS_ID": "ZTE-A", "Model": "UPS-80KVA", "Location": "UPS Room", "Status": "Working", "Load_Percent": "20%", "Battery_Health": "Good", "Input_Voltage": "400V", "Output_Voltage": "400V", "Remark": "Stable" },
        { "UPS_ID": "GALAXY-B", "Model": "UPS-80KVA", "Location": "UPS Room", "Status": "Working", "Load_Percent": "46%", "Battery_Health": "Good", "Input_Voltage": "400V", "Output_Voltage": "400V", "Remark": "Stable" }
    ];
    let filteredUpsUnits = [...upsUnits];

    const heaterUnits = [
        { "Heater_ID": "HTR-01", "Location": "Entrance Lobby", "Status": "Off", "Current_Temp_C": "25", "Set_Point_C": "22", "Last_Run": "2025-01-01", "Remark": "Winter use only" },
        { "Heater_ID": "HTR-02", "Location": "Office Area 1", "Status": "Working", "Current_Temp_C": "21", "Set_Point_C": "21", "Last_Run": "2025-07-20", "Remark": "Maintaining comfort" }
    ];
    let filteredHeaterUnits = [...heaterUnits];

    // Initial floor plan data, can be extended with custom elements
    let floorPlanData = JSON.parse(localStorage.getItem('floorPlanLayout')) || {
        'rack-A01': { name: 'Rack A01', type: 'rect', status: 'Normal', power: '8.5 kW', temperature: '22°C', link: 'raisedFloorLink', layer: 'racks', x: 100, y: 100, width: 40, height: 80, associatedTextId: 'text-rack-A01' },
        'text-rack-A01': { name: 'A01', type: 'text', status: 'Normal', layer: 'racks', x: 120, y: 195, 'font-size': 12, 'text-anchor': 'middle', fill: '#aaa', associatedRectId: 'rack-A01' },
        'rack-A02': { name: 'Rack A02', type: 'rect', status: 'Warning', power: '4.2 kW', temperature: '28°C (High)', link: 'raisedFloorLink', layer: 'racks', x: 150, y: 100, width: 40, height: 80, associatedTextId: 'text-rack-A02' },
        'text-rack-A02': { name: 'A02', type: 'text', status: 'Warning', layer: 'racks', x: 170, y: 195, 'font-size': 12, 'text-anchor': 'middle', fill: '#aaa', associatedRectId: 'rack-A02' },
        'rack-A03': { name: 'Rack A03', type: 'rect', status: 'Normal', power: '6.1 kW', temperature: '23°C', link: 'raisedFloorLink', layer: 'racks', x: 200, y: 100, width: 40, height: 80, associatedTextId: 'text-rack-A03' },
        'text-rack-A03': { name: 'A03', type: 'text', status: 'Normal', layer: 'racks', x: 220, y: 195, 'font-size': 12, 'text-anchor': 'middle', fill: '#aaa', associatedRectId: 'rack-A03' },
        'rack-A04': { name: 'Rack A04', type: 'rect', status: 'Alert', power: '10.5 kW (Overload)', temperature: '35°C (CRITICAL)', details: 'Immediate attention required. Overheating detected. PDU 2 failure.', link: 'raisedFloorLink', layer: 'racks', x: 250, y: 100, width: 40, height: 80, associatedTextId: 'text-rack-A04' },
        'text-rack-A04': { name: 'A04', type: 'text', status: 'Alert', layer: 'racks', x: 270, y: 195, 'font-size': 12, 'text-anchor': 'middle', fill: '#aaa', associatedRectId: 'rack-A04' },
        'generator-1': { name: 'Generator G1-DC', type: 'rect', status: 'Normal', fuelLevel: '83%', lastMaintenance: '2025-06-10', link: 'dashboardLink', layer: 'power', x: 600, y: 500, width: 100, height: 50, rx: 5, associatedTextId: 'text-generator-1' },
        'text-generator-1': { name: 'G1', type: 'text', status: 'Normal', layer: 'power', x: 650, y: 525, 'font-size': 14, 'text-anchor': 'middle', fill: '#eee', associatedRectId: 'generator-1' },
        'generator-2': { name: 'Generator G2-DC', type: 'rect', status: 'Normal', fuelLevel: '83%', lastMaintenance: '2025-06-10', link: 'dashboardLink', layer: 'power', x: 480, y: 500, width: 100, height: 50, rx: 5, associatedTextId: 'text-generator-2' },
        'text-generator-2': { name: 'G2', type: 'text', status: 'Normal', layer: 'power', x: 530, y: 525, 'font-size': 14, 'text-anchor': 'middle', fill: '#eee', associatedRectId: 'generator-2' },
        'ups-huawei-a': { name: 'UPS Huawei-A', type: 'rect', status: 'Warning', load: '78%', batteryStatus: 'Degrading', details: 'Battery module 3 reporting lower capacity. Schedule inspection.', link: 'dashboardLink', layer: 'power', x: 350, y: 470, width: 80, height: 80, rx: 10, associatedTextId: 'text-ups-huawei-a' },
        'text-ups-huawei-a': { name: 'UPS-A', type: 'text', status: 'Warning', layer: 'power', x: 390, y: 500, 'font-size': 12, 'text-anchor': 'middle', fill: '#eee', associatedRectId: 'ups-huawei-a' },
        'fire-zone-main': { name: 'Main Data Hall Fire Zone', type: 'rect', status: 'Normal', lastTest: '2025-01-15', agentLevel: '100%', link: 'dashboardLink', layer: 'fire', x: 50, y: 50, width: 700, height: 400, stroke: "#ff0000", "stroke-width": 3, "stroke-dasharray": "10 5", fill: "none", associatedTextId: 'text-fire-zone-main' },
        'text-fire-zone-main': { name: 'Fire Zone', type: 'text', status: 'Normal', layer: 'fire', x: 400, y: 430, 'font-size': 16, 'text-anchor': 'middle', fill: '#ff0000', associatedRectId: 'fire-zone-main' },
        'power-rm-main': { name: 'Main Power Room', type: 'rect', status: 'Normal', voltage: '400V', totalLoad: '710KW', link: 'dashboardLink', layer: 'power', x: 50, y: 470, width: 200, height: 80, rx: 10, associatedTextId: 'text-power-rm-main' },
        'text-power-rm-main': { name: 'Power Room', type: 'text', status: 'Normal', layer: 'power', x: 150, y: 500, 'font-size': 14, 'text-anchor': 'middle', fill: '#eee', associatedRectId: 'power-rm-main' },
        'cable-tray-1': { name: 'Cable Tray Vertical', type: 'line', status: 'Normal', layer: 'misc', x1: 75, y1: 450, x2: 75, y2: 550, stroke: '#aaa', 'stroke-width': 5, 'stroke-linecap': 'round' },
        'cable-tray-2': { name: 'Cable Tray Horizontal', type: 'line', status: 'Normal', layer: 'misc', x1: 75, y1: 450, x2: 350, y2: 450, stroke: '#aaa', 'stroke-width': 5, 'stroke-linecap': 'round' },
        'text-cable-tray': { name: 'Cable Tray', type: 'text', status: 'Normal', layer: 'misc', x: 70, y: 460, fill: '#aaa', 'font-size': 10, transform: 'rotate(-90 70 460)' }
    };

    // SVG Zoom and Pan variables
    let currentScale = 1;
    let currentTranslateX = 0;
    let currentTranslateY = 0;
    let isPanning = false;
    let startPanX = 0;
    let startPanY = 0;

    // --- Core Functions ---

    /**
     * Hides all content views.
     */
    function hideAllViews() {
        dashboardContent.classList.add('hidden');
        gridLineView.classList.add('hidden');
        raisedFloorView.classList.add('hidden');
        floorPlanView.classList.add('hidden');
        airConditionerInventoryView.classList.add('hidden');
        fm200View.classList.add('hidden');
        cameraView.classList.add('hidden');
        powerComponentsView.classList.add('hidden');
        accessControlView.classList.add('hidden');
        upsDetailView.classList.add('hidden');
        heaterView.classList.add('hidden');
        floorPlanDetailPanel.classList.add('hidden');
        floorPlanDetailPanel.classList.remove('flex'); // Ensure flex is removed
    }

    /**
     * Deactivates all navigation links.
     */
    function deactivateAllLinks() {
        const allLinks = document.querySelectorAll('nav ul li a');
        allLinks.forEach(link => {
            link.classList.remove('text-purple-300', 'bg-purple-900', 'ring-2', 'ring-purple-500');
            link.classList.add('text-gray-300', 'hover:bg-gray-700');
        });
    }

    /**
     * Activates a specific navigation link.
     * @param {HTMLElement} linkElement - The link to activate.
     */
    function activateLink(linkElement) {
        deactivateAllLinks();
        linkElement.classList.add('text-purple-300', 'bg-purple-900', 'ring-2', 'ring-purple-500');
        linkElement.classList.remove('text-gray-300', 'hover:bg-gray-700');
    }

    /**
     * Navigates to a specified section, hiding others and activating the corresponding link.
     * @param {string} sectionId - The ID of the link that triggers navigation.
     */
    function navigateToSection(sectionId) {
        hideAllViews();
        deactivateAllLinks();

        let targetView;
        let targetLink;

        // Stop status simulation when navigating away from floor plan
        clearInterval(statusSimulationInterval);

        switch (sectionId) {
            case 'dashboardLink':
                targetView = dashboardContent;
                targetLink = dashboardLink;
                loadDashboardLayout(); // Load layout on dashboard view
                initializeCharts(); // Re-initialize charts if they were destroyed/moved
                break;
            case 'raisedFloorLink':
                targetView = raisedFloorView;
                targetLink = raisedFloorLink;
                renderFM2000RackLayout();
                break;
            case 'floorPlanLink':
                targetView = floorPlanView;
                targetLink = floorPlanLink;
                loadFloorPlanSVG();
                break;
            case 'airConditionerLink':
                targetView = airConditionerInventoryView;
                targetLink = airConditionerLink;
                renderTable(acInventoryList, filteredAirConditioners, 'State');
                break;
            case 'fm200Link':
                targetView = fm200View;
                targetLink = fm200Link;
                renderTable(fm200List, filteredFm200Units, 'Status');
                break;
            case 'cameraLink':
                targetView = cameraView;
                targetLink = cameraLink;
                renderTable(cameraList, filteredCameras, 'Status');
                break;
            case 'powerComponentsLink':
                targetView = powerComponentsView;
                targetLink = powerComponentsLink;
                renderTable(powerComponentsList, filteredPowerComponents, 'Status');
                break;
            case 'accessControlLink':
                targetView = accessControlView;
                targetLink = accessControlLink;
                renderTable(accessControlList, filteredAccessControlPoints, 'Status');
                break;
            case 'upsDetailLink':
                targetView = upsDetailView;
                targetLink = upsDetailLink;
                renderTable(upsDetailList, filteredUpsUnits, 'Status');
                break;
            case 'heaterLink':
                targetView = heaterView;
                targetLink = heaterLink;
                renderTable(heaterList, filteredHeaterUnits, 'Status');
                break;
            case 'gridLineLink':
                targetView = gridLineView;
                targetLink = gridLineLink;
                generateGrid();
                break;
            case 'msbLink': // Handle click for MSB navigation link
                // When clicking the nav link, display the image overlay
                overlayImage.src = msbDiagramImagePath;
                imageOverlay.classList.remove('hidden');
                // You might also want to activate the MSB link visually
                hideAllViews(); // This will hide everything else when the image is shown
                // And activate the nav link itself
                activateLink(msbLink);
                break;
            default: // Fallback to dashboard
                targetView = dashboardContent;
                targetLink = dashboardLink;
                loadDashboardLayout();
                initializeCharts();
                break;
        }

        if (targetView) {
            targetView.classList.remove('hidden');
            if (targetLink) {
                activateLink(targetLink);
            }
        }
        exitCustomizationMode(); // Always exit customization mode when switching views
    }
    // Make navigateToSection globally accessible if called from HTML onclick attributes
    window.navigateToSection = navigateToSection;

    /**
     * Opens a PDF file in a new browser tab.
     * @param {string} pdfPath - The path to the PDF file.
     */
    function openPdf(pdfPath) {
        if (pdfPath) { // Only open if a path is provided
            window.open(pdfPath, '_blank');
        } else {
            showMessageBox('PDF path not defined.', 'Info');
        }
    }

    /**
     * Displays a custom message box (modal).
     * @param {string} message - The message to display.
     * @param {string} type - 'Info' or 'Confirm'.
     * @param {function} [onConfirm=null] - Callback function for 'Confirm' type.
     */
    function showMessageBox(message, type = 'Info', onConfirm = null) {
        const existingMessageBox = document.getElementById('customMessageBox');
        if (existingMessageBox) existingMessageBox.remove();

        const messageBox = document.createElement('div');
        messageBox.id = 'customMessageBox';
        messageBox.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[1000]';
        messageBox.innerHTML = `
            <div class="bg-gray-800 p-6 rounded-lg shadow-xl border border-purple-600 max-w-sm w-full text-center">
                <h3 class="text-xl font-bold text-white mb-4">${type}</h3>
                <p class="text-gray-300 mb-6">${message}</p>
                <div class="flex justify-center space-x-4">
                    <button id="msgBoxOkBtn" class="action-button">OK</button>
                    ${type === 'Confirm' ? '<button id="msgBoxCancelBtn" class="action-button bg-gray-600 hover:bg-gray-700">Cancel</button>' : ''}
                </div>
            </div>
        `;
        document.body.appendChild(messageBox);

        document.getElementById('msgBoxOkBtn').addEventListener('click', () => {
            messageBox.remove();
            if (type === 'Confirm' && onConfirm) {
                onConfirm();
            }
        });

        if (type === 'Confirm' && document.getElementById('msgBoxCancelBtn')) {
            document.getElementById('msgBoxCancelBtn').addEventListener('click', () => {
                messageBox.remove();
            });
        }
    }

    // --- Grid Line View Functions ---

    /**
     * Generates the grid lines and labels for the Grid Line View.
     */
    function generateGrid() {
        if (!gridLinesAndLabelsGroup) {
            console.error('Grid lines container not found.');
            return;
        }
        gridLinesAndLabelsGroup.innerHTML = '';
        const gridSizeX = 33;
        const gridSizeY = 46;
        const cellSizeX = 100 / gridSizeX;
        const cellSizeY = 100 / gridSizeY;

        for (let i = 0; i <= gridSizeX; i++) {
            const x = i * cellSizeX;
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x);
            line.setAttribute('y1', 0);
            line.setAttribute('x2', x);
            line.setAttribute('y2', 100);
            line.classList.add('grid-line');
            gridLinesAndLabelsGroup.appendChild(line);
            if (i > 0 && i <= gridSizeX) {
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', x - (cellSizeX / 2));
                text.setAttribute('y', 100 - 2);
                text.classList.add('grid-label');
                text.textContent = String(i).padStart(2, '0');
                gridLinesAndLabelsGroup.appendChild(text);
            }
        }
        for (let i = 0; i <= gridSizeY; i++) {
            const y = i * cellSizeY;
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', 0);
            line.setAttribute('y1', y);
            line.setAttribute('x2', 100);
            line.setAttribute('y2', y);
            line.classList.add('grid-line');
            gridLinesAndLabelsGroup.appendChild(line);
            if (i > 0 && i <= gridSizeY) {
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', 2);
                text.setAttribute('y', 100 - y + (cellSizeY / 2));
                text.classList.add('grid-label');
                text.textContent = String(i).padStart(2, '0');
                gridLinesAndLabelsGroup.appendChild(text);
            }
        }
    }

    // --- Raised Floor View Functions ---

    /**
     * Simulates saving the note text to a backend.
     * In a real application, this would involve an API call to a database.
     */
    async function saveNote(contextId, note) {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] Attempting to save Note for "${contextId}": "${note}"`);
        try {
            rackNotes[contextId] = note;
            localStorage.setItem('rackNotes', JSON.stringify(rackNotes)); // Persist to local storage
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
            console.log(`[${timestamp}] Note for "${contextId}" saved successfully!`);
        } catch (error) {
            console.error(`[${timestamp}] Failed to save Note for "${contextId}". Error:`, error);
        }
    }

    /**
     * Renders the custom layout for FM2000 racks (C01-K08)
     */
    function renderFM2000RackLayout() {
        if (!allRacksContainer) {
            console.error('All racks container not found.');
            return;
        }
        allRacksContainer.innerHTML = '';
        allRacksContainer.classList.add('fm2000-rack-grid');

        const rackGroups = {
            'C': Array.from({ length: 8 }, (_, i) => `C${String(i + 1).padStart(2, '0')}`),
            'D': Array.from({ length: 8 }, (_, i) => `D${String(i + 1).padStart(2, '0')}`),
            'E': Array.from({ length: 8 }, (_, i) => `E${String(i + 1).padStart(2, '0')}`),
            'F': Array.from({ length: 8 }, (_, i) => `F${String(i + 1).padStart(2, '0')}`),
            'G': Array.from({ length: 8 }, (_, i) => `G${String(i + 1).padStart(2, '0')}`),
            'H': Array.from({ length: 8 }, (_, i) => `H${String(i + 1).padStart(2, '0')}`),
            'I': Array.from({ length: 8 }, (_, i) => `I${String(i + 1).padStart(2, '0')}`),
            'J': Array.from({ length: 8 }, (_, i) => `J${String(i + 1).padStart(2, '0')}`),
            'K': Array.from({ length: 8 }, (_, i) => `K${String(i + 1).padStart(2, '0')}`)
        };

        let htmlContent = '';
        for (const prefix in rackGroups) {
            htmlContent += `
                <div class="col-span-full">
                    <h3 class="text-xl font-semibold text-purple-300 mt-6 mb-3">Row ${prefix} Series Racks</h3>
                </div>
            `;
            rackGroups[prefix].forEach(rackName => {
                const fullRackId = `${prefix}${rackName.slice(1)}`;
                const isAlert = Math.random() < 0.2; // Simulate random alerts
                const statusClass = isAlert ? 'bg-red-500' : 'bg-green-500';
                const statusText = isAlert ? 'Alert' : 'Normal';

                htmlContent += `
                    <div class="fm2000-rack-item" data-rack-id="${fullRackId}">
                        <div class="fm2000-rack-status-indicator ${statusClass}"></div>
                        <div class="text-xl font-bold text-white mb-1">Rack ${prefix}-${rackName.slice(1)}</div>
                        <span class="text-sm text-gray-300">Status: ${statusText}</span>
                        <span class="text-xs text-gray-400 mt-1">Zone: MSC5-GF-${prefix}${rackName.slice(1)}</span>

                        <div class="flex justify-between mt-4 space-x-2 w-full px-2">
                            <button class="source-button red flex-1" data-source="A">Source A</button>
                            <button class="source-button blue flex-1" data-source="B">Source B</button>
                        </div>

                        <div class="hidden flex-grow flex flex-col justify-center w-full px-2 note-section">
                            <p class="note-text flex-grow" contenteditable="false">
                                Click a Source button to see a note, or double-click this text to edit.
                            </p>
                        </div>
                    </div>
                `;
            });
        }
        allRacksContainer.innerHTML = htmlContent;

        const rackItems = allRacksContainer.querySelectorAll('.fm2000-rack-item');
        rackItems.forEach(rackItemDiv => {
            const fullRackId = rackItemDiv.dataset.rackId;
            const sourceAButton = rackItemDiv.querySelector('[data-source="A"]');
            const sourceBButton = rackItemDiv.querySelector('[data-source="B"]');
            const noteSection = rackItemDiv.querySelector('.note-section');
            const noteTextElement = noteSection.querySelector('.note-text');

            sourceAButton.addEventListener('click', function() {
                noteSection.classList.remove('hidden');
                const noteKey = `${fullRackId}-SourceA`;
                noteTextElement.textContent = rackNotes[noteKey] || `No specific note for ${fullRackId}, Source A. Double-click to add.`;
                noteTextElement.dataset.noteContext = noteKey;
                noteTextElement.contentEditable = "false";
                noteTextElement.style.backgroundColor = 'transparent';
            });

            sourceBButton.addEventListener('click', function() {
                noteSection.classList.remove('hidden');
                const noteKey = `${fullRackId}-SourceB`;
                noteTextElement.textContent = rackNotes[noteKey] || `No specific note for ${fullRackId}, Source B. Double-click to add.`;
                noteTextElement.dataset.noteContext = noteKey;
                noteTextElement.contentEditable = "false";
                noteTextElement.style.backgroundColor = 'transparent';
            });

            noteTextElement.addEventListener('dblclick', function() {
                this.contentEditable = "true";
                this.focus();
                const range = document.createRange();
                range.selectNodeContents(this);
                range.collapse(false);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            });

            noteTextElement.addEventListener('blur', function() {
                this.contentEditable = "false";
                this.style.backgroundColor = 'transparent';
                const noteContext = this.dataset.noteContext;
                if (noteContext) {
                    saveNote(noteContext, this.textContent.trim());
                } else {
                    console.warn("No note context found for this note element. Note not saved.");
                }
            });

            noteTextElement.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    this.blur();
                }
            });
        });
    }

    // --- Floor Plan View Logic ---

    /**
     * Updates the SVG transform for zoom and pan.
     */
    function updateSVGTransform() {
        const floorPlanElementsGroup = document.getElementById('floorPlanElementsGroup');
        if (floorPlanElementsGroup) {
            floorPlanElementsGroup.setAttribute('transform', `translate(${currentTranslateX}, ${currentTranslateY}) scale(${currentScale})`);
        }
    }

    /**
     * Populates the detail panel for a given SVG element.
     * @param {string} elementId - The ID of the SVG element.
     */
    function showFloorPlanDetails(elementId) {
        const data = floorPlanData[elementId];
        if (!data) {
            detailPanelTitle.textContent = 'Element Not Found';
            detailPanelContent.innerHTML = '<p class="text-red-400">Details for this element could not be loaded.</p>';
            floorPlanDetailPanel.classList.remove('hidden');
            floorPlanDetailPanel.classList.add('flex');
            return;
        }

        detailPanelTitle.textContent = data.name;
        let contentHtml = `
            <p><strong>ID:</strong> ${elementId}</p>
            <p><strong>Type:</strong> ${data.type}</p>
            <p><strong>Layer:</strong> ${data.layer}</p>
            <p><strong>Status:</strong> <span class="${data.status === 'Normal' ? 'text-green-400' : (data.status === 'Warning' ? 'text-yellow-400' : 'text-red-400')}">${data.status}</span></p>
        `;
        // Add more specific details based on element type
        if (data.power) contentHtml += `<p><strong>Power:</strong> ${data.power}</p>`;
        if (data.temperature) contentHtml += `<p><strong>Temperature:</strong> ${data.temperature}</p>`;
        if (data.fuelLevel) contentHtml += `<p><strong>Fuel Level:</strong> ${data.fuelLevel}</p>`;
        if (data.lastMaintenance) contentHtml += `<p><strong>Last Maintenance:</strong> ${data.lastMaintenance}</p>`;
        if (data.batteryStatus) contentHtml += `<p><strong>Battery Status:</strong> ${data.batteryStatus}</p>`;
        if (data.lastTest) contentHtml += `<p><strong>Last Test:</strong> ${data.lastTest}</p>`;
        if (data.agentLevel) contentHtml += `<p><strong>Agent Level:</strong> ${data.agentLevel}</p>`;
        if (data.voltage) contentHtml += `<p><strong>Voltage:</strong> ${data.voltage}</p>`;
        if (data.totalLoad) contentHtml += `<p><strong>Total Load:</strong> ${data.totalLoad}</p>`;
        if (data.details) contentHtml += `<p class="mt-2 text-sm text-gray-400"><strong>Notes:</strong> ${data.details}</p>`;

        detailPanelContent.innerHTML = contentHtml;
        floorPlanDetailPanel.classList.remove('hidden');
        floorPlanDetailPanel.classList.add('flex');
    }

    /**
     * Loads the SVG content for the floor plan and renders elements.
     * MODIFIED to include click handler for MSB SVG element.
     */
    async function loadFloorPlanSVG() {
        const inlineSvgContentElement = document.getElementById('inlineSvgContent');
        if (!inlineSvgContentElement) {
            console.error('Inline SVG content element (id="inlineSvgContent") not found!');
            svgContainer.innerHTML = '<p class="text-red-400">Error: SVG content missing in HTML. Make sure your SVG is inside &lt;script type="image/svg+xml" id="inlineSvgContent"&gt;&lt;/script&gt;.</p>';
            return;
        }
        // Use textContent for safety, fall back to innerHTML if textContent is empty
        const svgText = inlineSvgContentElement.textContent.trim() || inlineSvgContentElement.innerHTML.trim();

        // Check if svgText actually contains SVG content
        if (!svgText.startsWith('<svg')) {
            console.error('inlineSvgContent does not contain valid SVG. Content:', svgText.substring(0, 200) + '...'); // Log first 200 chars
            svgContainer.innerHTML = '<p class="text-red-400">Error: Invalid SVG content found.</p>';
            return;
        }

        // It's generally better to parse the SVG string into a DOM element
        // rather than directly injecting it as innerHTML if you need to manipulate it
        // and prevent potential script injection from malicious SVG.
        // However, given the local context and direct parsing, innerHTML is often used for simplicity.
        svgContainer.innerHTML = svgText;

        const svgElement = svgContainer.querySelector('svg');
        if (!svgElement) {
            console.error('SVG element not found inside svgContainer after loading content.');
            return;
        }

        // Create a group for all interactive elements to apply zoom/pan
        let floorPlanElementsGroup = svgElement.getElementById('floorPlanElementsGroup');
        if (!floorPlanElementsGroup) {
            floorPlanElementsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            floorPlanElementsGroup.id = 'floorPlanElementsGroup';
            // Move existing elements into this group, excluding the background rect
            // Iterate over a *copy* of children to avoid issues as children are moved
            const childrenToMove = Array.from(svgElement.children);
            childrenToMove.forEach(child => {
                // Assuming the background rect is the one with fill="#1a1a2e"
                // and you want to exclude any dynamically created elements or containers
                if (!(child.tagName === 'rect' && child.getAttribute('fill') === '#1a1a2e') && child.id !== 'floorPlanElementsGroup') {
                    floorPlanElementsGroup.appendChild(child);
                }
            });
            svgElement.appendChild(floorPlanElementsGroup);
        }
        updateSVGTransform(); // Apply initial transform

        // Load saved layout, merging with initial hardcoded data
        const initialFloorPlanData = JSON.parse(localStorage.getItem('floorPlanLayout')) || {};
        Object.assign(floorPlanData, initialFloorPlanData); // Saved data takes precedence


        // Re-render all elements based on the merged floorPlanData
        // Important: If elements were already loaded from inlineSvgContent and moved into
        // floorPlanElementsGroup, this clearing and re-appending might cause visual flicker
        // or re-initialization issues for complex SVG elements.
        // For simplicity, this continues the full re-render from data logic.
        floorPlanElementsGroup.innerHTML = ''; // Clear existing elements before re-rendering from floorPlanData
        for (const id in floorPlanData) {
            const data = floorPlanData[id];
            let element;
            // Dynamically create SVG elements based on their 'type' property
            switch (data.type) {
                case 'rect':
                    element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    element.setAttribute('x', data.x);
                    element.setAttribute('y', data.y);
                    element.setAttribute('width', data.width);
                    element.setAttribute('height', data.height);
                    if (data.rx) element.setAttribute('rx', data.rx);
                    if (data.fill) element.setAttribute('fill', data.fill);
                    if (data.stroke) element.setAttribute('stroke', data.stroke);
                    if (data['stroke-width']) element.setAttribute('stroke-width', data['stroke-width']);
                    if (data['stroke-dasharray']) element.setAttribute('stroke-dasharray', data['stroke-dasharray']);
                    break;
                case 'text':
                    element = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    element.setAttribute('x', data.x);
                    element.setAttribute('y', data.y);
                    element.textContent = data.name;
                    if (data['font-size']) element.setAttribute('font-size', data['font-size']);
                    if (data['text-anchor']) element.setAttribute('text-anchor', data['text-anchor']);
                    if (data.fill) element.setAttribute('fill', data.fill);
                    if (data.transform) element.setAttribute('transform', data.transform);
                    break;
                case 'circle':
                    element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    element.setAttribute('cx', data.cx);
                    element.setAttribute('cy', data.cy);
                    element.setAttribute('r', data.r);
                    if (data.fill) element.setAttribute('fill', data.fill);
                    if (data.stroke) element.setAttribute('stroke', data.stroke);
                    if (data['stroke-width']) element.setAttribute('stroke-width', data['stroke-width']);
                    break;
                case 'line':
                    element = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    element.setAttribute('x1', data.x1);
                    element.setAttribute('y1', data.y1);
                    element.setAttribute('x2', data.x2);
                    element.setAttribute('y2', data.y2);
                    if (data.stroke) element.setAttribute('stroke', data.stroke);
                    if (data['stroke-width']) element.setAttribute('stroke-width', data['stroke-width']);
                    if (data['stroke-linecap']) element.setAttribute('stroke-linecap', data['stroke-linecap']);
                    break;
                case 'path':
                    element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    element.setAttribute('d', data.d);
                    if (data.fill) element.setAttribute('fill', data.fill);
                    if (data.stroke) element.setAttribute('stroke', data.stroke);
                    if (data['stroke-width']) element.setAttribute('stroke-width', data['stroke-width']);
                    break;
                default:
                    console.warn(`Unsupported SVG element type: ${data.type} for ID: ${id}`);
                    continue;
            }

            if (element) {
                element.id = id;
                element.classList.add('svg-element');
                element.setAttribute('data-layer', data.layer);
                element.setAttribute('data-element-type', data.type); // Store original type

                applyStatusClass(element, data.status);

                // Check for specific element clicks (e.g., MSB image display)
                if (id === 'msbSvgText' || id === 'msbRect') { // Assuming your HTML has these IDs for MSB
                    element.style.cursor = 'pointer'; // Indicate it's clickable
                    element.addEventListener('click', (e) => {
                        e.stopPropagation(); // Prevent detail panel from opening for MSB click
                        overlayImage.src = msbDiagramImagePath;
                        imageOverlay.classList.remove('hidden');
                    });
                } else {
                    // Default click behavior for other elements
                    element.addEventListener('click', () => { showFloorPlanDetails(id); });
                }

                element.addEventListener('mouseover', (e) => showTooltip(e, data));
                element.addEventListener('mouseout', hideTooltip);

                makeSvgElementDraggable(element); // Make elements draggable

                floorPlanElementsGroup.appendChild(element);
            }
        }

        // Apply initial layer visibility
        layerToggles.forEach(toggle => {
            const layer = toggle.dataset.layerToggle;
            toggleLayer(layer, toggle.checked);
        });

        startFloorPlanStatusSimulation();
    }

    /**
     * Applies the correct status class to an SVG element.
     * @param {SVGElement} element - The SVG element to style.
     * @param {string} status - The status string ('Normal', 'Warning', 'Alert').
     */
    function applyStatusClass(element, status) {
        element.classList.remove('status-normal', 'status-warning', 'status-alert');
        if (status === 'Normal') {
            element.classList.add('status-normal');
        } else if (status === 'Warning') {
            element.classList.add('status-warning');
        } else if (status === 'Alert') {
            element.classList.add('status-alert');
        }
    }

    let statusSimulationInterval;

    /**
     * Simulates real-time status updates for floor plan elements.
     */
    function startFloorPlanStatusSimulation() {
        if (statusSimulationInterval) clearInterval(statusSimulationInterval);

        statusSimulationInterval = setInterval(() => {
            const statuses = ['Normal', 'Warning', 'Alert'];
            for (const id in floorPlanData) {
                const currentStatus = floorPlanData[id].status;
                let newStatus = currentStatus;

                // Randomly change status, but make 'Alert' less likely to revert immediately
                if (Math.random() < 0.1) { // 10% chance to change status
                    if (currentStatus === 'Alert') {
                        if (Math.random() < 0.3) { // 30% chance to go back to Warning/Normal from Alert
                            newStatus = statuses[Math.floor(Math.random() * 2)]; // Normal or Warning
                        } else {
                            newStatus = 'Alert'; // Stay Alert
                        }
                    } else {
                        newStatus = statuses[Math.floor(Math.random() * statuses.length)];
                    }
                }
                floorPlanData[id].status = newStatus;

                const element = document.getElementById(id);
                if (element) {
                    applyStatusClass(element, newStatus);
                }
            }
        }, 3000); // Update every 3 seconds
    }

    // Tooltip functions for SVG elements
    function showTooltip(event, data) {
        if (!svgTooltip) return;
        svgTooltip.innerHTML = `
            <strong>${data.name}</strong><br>
            Type: ${data.type}<br>
            Status: <span class="${data.status === 'Normal' ? 'text-green-400' : (data.status === 'Warning' ? 'text-yellow-400' : 'text-red-400')}">${data.status}</span>
            ${data.power ? `<br>Power: ${data.power}` : ''}
            ${data.temperature ? `<br>Temp: ${data.temperature}` : ''}
        `;
        svgTooltip.style.left = `${event.clientX + 15}px`;
        svgTooltip.style.top = `${event.clientY + 15}px`;
        svgTooltip.style.opacity = 1;
        svgTooltip.classList.remove('hidden');
    }

    function hideTooltip() {
        if (svgTooltip) {
            svgTooltip.style.opacity = 0;
            svgTooltip.classList.add('hidden');
        }
    }

    // Draggable SVG elements logic
    let activeElement = null;
    let currentX = 0;
    let currentY = 0;
    let initialX = 0;
    let initialY = 0;
    let xOffset = 0;
    let yOffset = 0;

    function makeSvgElementDraggable(element) {
        element.addEventListener('mousedown', dragStart);
        // Add event listeners to the entire SVG container for drag, and document for dragEnd
        // This handles cases where the mouse moves off the element during drag
        svgContainer.addEventListener('mousemove', drag);
        svgContainer.addEventListener('mouseup', dragEnd);
        svgContainer.addEventListener('mouseleave', dragEnd); // End drag if mouse leaves SVG area
    }

    function dragStart(e) {
        // Only allow dragging if the target is an SVG element and not the background rect or the MSB elements (if they have special click handlers)
        if (e.target.classList.contains('svg-element') &&
            !(e.target.tagName === 'rect' && e.target.getAttribute('fill') === '#1a1a2e') &&
            e.target.id !== 'msbSvgText' && e.target.id !== 'msbRect' ) { // Exclude MSB elements from being draggable
            e.preventDefault();
            activeElement = e.target;
            initialX = e.clientX;
            initialY = e.clientY;

            // Get current position (for rect, circle, line) or transform (for text, path, or grouped elements)
            if (activeElement.tagName === 'rect') {
                xOffset = parseFloat(activeElement.getAttribute('x')) || 0;
                yOffset = parseFloat(activeElement.getAttribute('y')) || 0;
            } else if (activeElement.tagName === 'circle') {
                xOffset = parseFloat(activeElement.getAttribute('cx')) || 0;
                yOffset = parseFloat(activeElement.getAttribute('cy')) || 0;
            } else if (activeElement.tagName === 'line') {
                xOffset = parseFloat(activeElement.getAttribute('x1')) || 0; // For lines, drag x1, y1
                yOffset = parseFloat(activeElement.getAttribute('y1')) || 0;
            } else { // For text, path, or elements with transforms
                const transform = activeElement.getAttribute('transform');
                if (transform && transform.includes('translate')) {
                    const match = /translate\(([^)]+)\)/.exec(transform);
                    if (match && match[1]) {
                        const parts = match[1].split(',').map(parseFloat);
                        xOffset = parts[0] || 0;
                        yOffset = parts[1] || 0;
                    }
                } else {
                    xOffset = 0;
                    yOffset = 0;
                }
            }
            svgContainer.style.cursor = 'grabbing';
        }
    }

    function drag(e) {
        if (!activeElement) return; // Only execute if an element is actively being dragged
        e.preventDefault();
        currentX = (e.clientX - initialX) / currentScale; // Adjust for current zoom level
        currentY = (e.clientY - initialY) / currentScale; // Adjust for current zoom level

        if (activeElement.tagName === 'rect') {
            activeElement.setAttribute('x', xOffset + currentX);
            activeElement.setAttribute('y', yOffset + currentY);
        } else if (activeElement.tagName === 'circle') {
            activeElement.setAttribute('cx', xOffset + currentX);
            activeElement.setAttribute('cy', yOffset + currentY);
        } else if (activeElement.tagName === 'line') {
            activeElement.setAttribute('x1', xOffset + currentX);
            activeElement.setAttribute('y1', yOffset + currentY);
            // Adjust x2, y2 relative to the new x1, y1
            const dx = (parseFloat(activeElement.getAttribute('x2')) - xOffset);
            const dy = (parseFloat(activeElement.getAttribute('y2')) - yOffset);
            activeElement.setAttribute('x2', xOffset + currentX + dx);
            activeElement.setAttribute('y2', yOffset + currentY + dy);
        } else { // For text, path, or elements with transforms
            activeElement.setAttribute('transform', `translate(${xOffset + currentX}, ${yOffset + currentY})`);
        }
    }

    function dragEnd() {
        if (activeElement) {
            const id = activeElement.id;
            if (floorPlanData[id]) {
                // Update the floorPlanData with new position
                if (activeElement.tagName === 'rect') {
                    floorPlanData[id].x = parseFloat(activeElement.getAttribute('x'));
                    floorPlanData[id].y = parseFloat(activeElement.getAttribute('y'));
                } else if (activeElement.tagName === 'circle') {
                    floorPlanData[id].cx = parseFloat(activeElement.getAttribute('cx'));
                    floorPlanData[id].cy = parseFloat(activeElement.getAttribute('cy'));
                } else if (activeElement.tagName === 'line') {
                    floorPlanData[id].x1 = parseFloat(activeElement.getAttribute('x1'));
                    floorPlanData[id].y1 = parseFloat(activeElement.getAttribute('y1'));
                    floorPlanData[id].x2 = parseFloat(activeElement.getAttribute('x2'));
                    floorPlanData[id].y2 = parseFloat(activeElement.getAttribute('y2'));
                } else { // For text, path, or elements with transforms
                    const transform = activeElement.getAttribute('transform');
                    if (transform && transform.includes('translate')) {
                        const match = /translate\(([^)]+)\)/.exec(transform);
                        if (match && match[1]) {
                            const parts = match[1].split(',').map(parseFloat);
                            floorPlanData[id].x = parts[0]; // Store x translation
                            floorPlanData[id].y = parts[1]; // Store y translation
                            floorPlanData[id].transform = transform; // Store the full transform
                        }
                    }
                }
            }
            activeElement = null;
            xOffset = 0;
            yOffset = 0;
            saveFloorPlanLayout(); // Save layout after drag
        }
        svgContainer.style.cursor = 'grab'; // Reset cursor
    }

    // SVG Zoom and Pan event listeners
    svgContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        const svg = svgContainer.querySelector('svg');
        if (!svg) return;

        const svgRect = svg.getBoundingClientRect();
        const mouseX = e.clientX - svgRect.left;
        const mouseY = e.clientY - svgRect.top;

        const zoomFactor = 1.1;
        const oldScale = currentScale;

        if (e.deltaY < 0) {
            currentScale *= zoomFactor; // Zoom in
        } else {
            currentScale /= zoomFactor; // Zoom out
        }

        currentScale = Math.max(0.2, Math.min(5, currentScale)); // Clamp scale

        // Adjust translation to keep the mouse point fixed
        currentTranslateX = mouseX - (mouseX - currentTranslateX) * (currentScale / oldScale);
        currentTranslateY = mouseY - (mouseY - currentTranslateY) * (currentScale / oldScale);

        updateSVGTransform();
    });

    svgContainer.addEventListener('mousedown', (e) => {
        if (e.button === 0) { // Left mouse button
            isPanning = true;
            startPanX = e.clientX - currentTranslateX;
            startPanY = e.clientY - currentTranslateY;
            svgContainer.style.cursor = 'grabbing';
        }
    });

    svgContainer.addEventListener('mousemove', (e) => {
        if (!isPanning) return;
        e.preventDefault();
        currentTranslateX = e.clientX - startPanX;
        currentTranslateY = e.clientY - startPanY;
        updateSVGTransform();
    });

    svgContainer.addEventListener('mouseup', () => {
        isPanning = false;
        svgContainer.style.cursor = 'grab';
    });

    svgContainer.addEventListener('mouseleave', () => {
        isPanning = false; // Stop panning if mouse leaves container
        svgContainer.style.cursor = 'grab';
    });


    // Add new element modal logic
    addFloorPlanElementBtn.addEventListener('click', () => {
        newElementIdInput.value = '';
        newElementNameInput.value = '';
        newElementTypeInput.value = '';
        newElementLayerSelect.value = 'misc';
        newElementStatusSelect.value = 'Normal';
        addElementModal.style.display = 'flex';
    });

    cancelAddElementBtn.addEventListener('click', () => {
        addElementModal.style.display = 'none';
    });

    confirmAddElementBtn.addEventListener('click', () => {
        const id = newElementIdInput.value.trim();
        const name = newElementNameInput.value.trim();
        const type = newElementTypeInput.value.trim().toLowerCase();
        const layer = newElementLayerSelect.value;
        const status = newElementStatusSelect.value;

        if (!id || !name || !type || !layer) {
            showMessageBox('Please fill in all fields for the new element.', 'Warning');
            return;
        }
        if (floorPlanData[id]) {
            showMessageBox(`An element with ID "${id}" already exists. Please choose a unique ID.`, 'Warning');
            return;
        }

        let newElementData = {
            name: name,
            type: type,
            status: status,
            layer: layer,
        };

        // Set specific attributes based on type
        switch (type) {
            case 'rect':
                newElementData = { ...newElementData, x: 50 + Math.random() * 600, y: 50 + Math.random() * 400, width: 50, height: 50, fill: '#6a6a6a', stroke: '#aaaaaa', 'stroke-width': 1 };
                break;
            case 'circle':
                newElementData = { ...newElementData, cx: 50 + Math.random() * 600, cy: 50 + Math.random() * 400, r: 25, fill: '#6a6a6a', stroke: '#aaaaaa', 'stroke-width': 1 };
                break;
            case 'text':
                newElementData = { ...newElementData, x: 50 + Math.random() * 600, y: 50 + Math.random() * 400, 'font-size': 14, 'text-anchor': 'middle', fill: '#e0e0e0' };
                break;
            case 'line':
                newElementData = { ...newElementData, x1: 50 + Math.random() * 600, y1: 50 + Math.random() * 400, x2: 100 + Math.random() * 600, y2: 100 + Math.random() * 400, stroke: '#aaaaaa', 'stroke-width': 2, 'stroke-linecap': 'round' };
                break;
            case 'path':
                newElementData = { ...newElementData, d: 'M10 10 L20 20 L10 20 Z', fill: '#6a6a6a', stroke: '#aaaaaa', 'stroke-width': 1 };
                break;
            default:
                showMessageBox('Unsupported SVG element type. Please use rect, circle, text, line, or path.', 'Error');
                return;
        }

        floorPlanData[id] = newElementData;
        loadFloorPlanSVG(); // Re-render SVG to include new element
        saveFloorPlanLayout(); // Save the updated layout
        addElementModal.style.display = 'none';
    });

    // Save/Load Floor Plan Layout to localStorage
    function saveFloorPlanLayout() {
        localStorage.setItem('floorPlanLayout', JSON.stringify(floorPlanData));
        console.log('Floor plan layout saved!');
    }

    saveFloorPlanLayoutBtn.addEventListener('click', () => {
        saveFloorPlanLayout();
        showMessageBox('Floor plan layout saved!', 'Success');
    });

    // Layer management toggles
    layerToggles.forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const layer = e.target.dataset.layerToggle;
            const isVisible = e.target.checked;
            toggleLayer(layer, isVisible);
        });
    });

    function toggleLayer(layerName, isVisible) {
        const svgElements = document.querySelectorAll(`#floorPlanElementsGroup [data-layer="${layerName}"]`);
        svgElements.forEach(el => {
            el.style.display = isVisible ? '' : 'none';
        });
    }

    // --- Table Rendering and Export Functions ---

    /**
     * Generic function to render data as a table.
     * @param {HTMLElement} container - The DOM element to render the table into.
     * @param {Array} data - The array of objects to render.
     * @param {string} statusKey - The key in the data object that represents status (e.g., 'State', 'Status').
     */
    function renderTable(container, data, statusKey = 'Status') {
        if (!container) {
            console.error('Table container not found.');
            return;
        }
        container.innerHTML = '';

        if (data.length === 0) {
            container.innerHTML = '<p class="text-gray-400 text-center py-4">No data matches your filter.</p>';
            return;
        }

        const headers = Object.keys(data[0]);

        let tableHtml = `<table class="ac-inventory-table"><thead><tr>`;
        headers.forEach(header => {
            const readableHeader = header.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim();
            tableHtml += `<th>${readableHeader}</th>`;
        });
        tableHtml += `</tr></thead><tbody>`;

        data.forEach(item => {
            tableHtml += `<tr>`;
            headers.forEach(header => {
                let cellContent = item[header];
                let statusClass = '';
                if (header === statusKey) {
                    const lowerCaseContent = String(cellContent).toLowerCase();
                    if (lowerCaseContent.includes('working') || lowerCaseContent.includes('online') || lowerCaseContent.includes('secured') || lowerCaseContent.includes('normal') || lowerCaseContent.includes('good')) {
                        statusClass = 'ac-inventory-status Working';
                    } else if (lowerCaseContent.includes('warning') || lowerCaseContent.includes('low pressure') || lowerCaseContent.includes('degrading') || lowerCaseContent.includes('high load')) {
                        statusClass = 'ac-inventory-status Fault'; // Reusing Fault for Warning
                    } else if (lowerCaseContent.includes('offline') || lowerCaseContent.includes('fault') || lowerCaseContent.includes('power off') || lowerCaseContent.includes('malfunction') || lowerCaseContent.includes('critical')) {
                        statusClass = 'ac-inventory-status Power-off'; // Reusing Power-off for critical alerts
                    } else {
                        statusClass = `ac-inventory-status ${String(cellContent).replace(/\s/g, '-')}`;
                    }
                }
                tableHtml += `<td class="${statusClass}">${cellContent}</td>`;
            });
            tableHtml += `</tr>`;
        });

        tableHtml += `</tbody></table>`;
        container.innerHTML = tableHtml;
    }

    /**
     * Generic function to export data to CSV.
     * @param {Array} data - The array of objects to export.
     * @param {string} filename - The desired filename for the CSV.
     */
    function exportToCsv(data, filename) {
        if (data.length === 0) {
            showMessageBox('No data to export.', 'Info');
            return;
        }

        const headers = Object.keys(data[0]);
        const csvRows = [];

        csvRows.push(headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','));

        data.forEach(item => {
            const values = headers.map(header => {
                let value = item[header];
                if (value === null || value === undefined) {
                    value = '';
                }
                return `"${String(value).replace(/"/g, '""')}"`;
            });
            csvRows.push(values.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    /**
     * Factory function to create a filter event listener.
     * @param {Array} originalData - The complete, unfiltered data array.
     * @param {Function} renderFn - The function to call to render the filtered data.
     * @param {HTMLElement} container - The DOM element where the table is rendered.
     * @param {string} statusKey - The key for the status column to apply styling.
     * @returns {Function} The event listener function for the filter input.
     */
    function createFilterFunction(originalData, renderFn, container, statusKey = 'Status') {
        return function(event) {
            const searchTerm = event.target.value.toLowerCase().trim();
            let currentFilteredData;
            if (!searchTerm) {
                currentFilteredData = [...originalData];
            } else {
                currentFilteredData = originalData.filter(item => {
                    return Object.values(item).some(value =>
                        String(value).toLowerCase().includes(searchTerm)
                    );
                });
            }
            // Update the global filtered data for export
            if (originalData === airConditioners) filteredAirConditioners = currentFilteredData;
            else if (originalData === fm200Units) filteredFm200Units = currentFilteredData;
            else if (originalData === cameras) filteredCameras = currentFilteredData;
            else if (originalData === powerComponents) filteredPowerComponents = currentFilteredData;
            else if (originalData === accessControlPoints) filteredAccessControlPoints = currentFilteredData;
            else if (originalData === upsUnits) filteredUpsUnits = currentFilteredData;
            else if (originalData === heaterUnits) filteredHeaterUnits = currentFilteredData;

            renderFn(container, currentFilteredData, statusKey);
        };
    }

    // --- Customizable Dashboard Functions ---

    /**
     * Re-initializes specific Chart.js charts after they might have been moved.
     */
    function initializeCharts() {
        // Destroy existing chart instances to prevent duplicates
        for (const chartId in activeCharts) {
            if (activeCharts[chartId] && typeof activeCharts[chartId].destroy === 'function') {
                activeCharts[chartId].destroy();
            }
            delete activeCharts[chartId]; // Remove reference after destroying
        }

        const ctxLoad = document.getElementById('loadChart');
        if (ctxLoad) {
            const chartCtx = ctxLoad.getContext('2d');
            const gradient = chartCtx.createLinearGradient(0, 0, 0, 120);
            gradient.addColorStop(0, 'rgba(232, 121, 249, 0.6)');
            gradient.addColorStop(1, 'rgba(139, 92, 246, 0.3)');

            activeCharts.loadChart = new Chart(chartCtx, {
                type: 'line',
                data: {
                    labels: ['30-Apr', '15-May', '30-May', '15-Jun', '30-Jul'],
                    datasets: [{
                        label: 'Load (KW)',
                        data: [645, 650, 670, 655, 622], // Corrected data point (670 to 622)
                        backgroundColor: gradient,
                        borderColor: '#e879f9',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.3,
                        pointRadius: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            ticks: { color: '#bbb', font: { size: 10 } },
                            grid: { color: 'rgba(255,255,255,0.07)' }
                        },
                        y: {
                            min: 500,
                            max: 700,
                            ticks: { stepSize: 50, color: '#bbb', callback: value => `${value}KW`, font: { size: 10 } },
                            grid: { color: 'rgba(255,255,255,0.07)' }
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: { callbacks: { label: ctx => `Load: ${ctx.parsed.y}KW` } }
                    }
                }
            });
        }

        const ctxAssetDistribution = document.getElementById('assetDistributionChart');
        if (ctxAssetDistribution) {
            const assetData = {
                labels: ['Air Condition (43 units)', 'Camera (14 units)', 'Generator (4 units)', 'Rectifier (8 units)', 'UPS (4 units)'],
                datasets: [{
                    data: [43, 14, 4, 8, 4],
                    backgroundColor: [
                        '#c084fc', // purple-400
                        '#304034', // Black-400 (Consider a brighter color for visibility)
                        '#3b82f6', // blue-500
                        '#eab308', // yellow-500
                        '#22c55e' // green-500
                    ],
                    borderColor: '#1a1a2e',
                    borderWidth: 2
                }]
            };

            activeCharts.assetDistributionChart = new Chart(ctxAssetDistribution, {
                type: 'pie',
                data: assetData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                color: '#e0e0e0',
                                font: {
                                    size: 12
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.raw;
                                    return `${label}: ${value} units`;
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    // Enables customization mode (drag-and-drop)
    function enterCustomizationMode() {
        if (sortableInstance) {
            sortableInstance.destroy();
        }

        sortableInstance = Sortable.create(dashboardWidgetsContainer, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            dragClass: 'sortable-drag',
            handle: '.dashboard-card',
            filter: '.no-drag',
            onEnd: function(evt) {
                console.log('New order:', sortableInstance.toArray());
                // You might want to automatically save or prompt save here
            }
        });

        document.body.classList.add('customization-active');
        customizeDashboardBtn.textContent = 'Exit Customization';
        saveLayoutBtn.classList.remove('hidden');
        addDashboardWidgetBtn.classList.remove('hidden');
        isCustomizing = true;
    }

    // Disables customization mode
    function exitCustomizationMode() {
        if (sortableInstance) {
            sortableInstance.destroy();
            sortableInstance = null;
        }
        document.body.classList.remove('customization-active');
        customizeDashboardBtn.textContent = 'Customize Layout';
        saveLayoutBtn.classList.add('hidden');
        addDashboardWidgetBtn.classList.add('hidden');
        isCustomizing = false;
    }

    // Saves the current widget order to localStorage
    function saveDashboardLayout() {
        const currentOrder = sortableInstance ? sortableInstance.toArray() : Array.from(dashboardWidgetsContainer.children).map(el => el.dataset.widgetId);
        localStorage.setItem('dashboardLayout', JSON.stringify(currentOrder));
        showMessageBox('Dashboard layout saved!', 'Success');
        exitCustomizationMode(); // Exit customization after saving
    }

    // Loads the dashboard layout from localStorage
    function loadDashboardLayout() {
        const savedLayout = localStorage.getItem('dashboardLayout');
        if (savedLayout) {
            const widgetOrder = JSON.parse(savedLayout);
            const fragment = document.createDocumentFragment();

            widgetOrder.forEach(widgetId => {
                let widgetElement = dashboardWidgetsContainer.querySelector(`[data-widget-id="${widgetId}"]`);
                if (!widgetElement) {
                    // If a saved widget doesn't exist, create a placeholder.
                    // This assumes placeholder widgets can represent any missing widget.
                    widgetElement = createPlaceholderWidget(widgetId);
                }
                fragment.appendChild(widgetElement);
            });
            // Append any original widgets that were not in the saved layout (e.g., new default widgets)
            // Ensure this doesn't create duplicates of widgets already in `fragment`
            Array.from(dashboardWidgetsContainer.children).forEach(originalWidget => {
                if (!fragment.querySelector(`[data-widget-id="${originalWidget.dataset.widgetId}"]`)) {
                    fragment.appendChild(originalWidget);
                }
            });

            dashboardWidgetsContainer.innerHTML = ''; // Clear current content
            dashboardWidgetsContainer.appendChild(fragment); // Append in saved order
        }
        initializeCharts(); // Always re-initialize charts after DOM manipulation
    }

    // Function to add a new generic placeholder widget
    let nextCustomWidgetId = 1;

    function createPlaceholderWidget(id = `custom-widget-${Date.now()}-${nextCustomWidgetId++}`) {
        const newCard = document.createElement('div');
        newCard.className = 'dashboard-card p-6 rounded-lg shadow-xl mb-8';
        newCard.setAttribute('data-widget-id', id);
        newCard.innerHTML = `
            <h2 class="text-2xl font-bold text-white mb-4">Custom Widget ${id.split('-').pop()}</h2>
            <p class="text-gray-400">This is a new customizable widget.</p>
            <button class="action-button px-2 py-1 text-xs mt-4" data-action="remove-widget">Remove</button>
            <div class="mt-4 p-2 bg-[#1f2937] rounded-lg">
                <canvas id="customChart-${id}" width="400" height="200"></canvas>
            </div>
        `;
        // Attach remove event listener
        const removeButton = newCard.querySelector('[data-action="remove-widget"]');
        if (removeButton) {
            removeButton.addEventListener('click', (event) => {
                event.stopPropagation();
                showMessageBox(`Are you sure you want to remove widget "${id}"?`, 'Confirm', () => {
                    newCard.remove();
                    if (activeCharts[`customChart-${id}`]) {
                        activeCharts[`customChart-${id}`].destroy();
                        delete activeCharts[`customChart-${id}`];
                    }
                    saveDashboardLayout();
                });
            });
        }

        // Placeholder for initializing a new chart for this widget
        setTimeout(() => { // Small delay to ensure canvas is in DOM
            const canvas = newCard.querySelector(`#customChart-${id}`);
            if (canvas) {
                const chartCtx = canvas.getContext('2d');
                activeCharts[`customChart-${id}`] = new Chart(chartCtx, {
                    type: 'bar',
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr'],
                        datasets: [{
                            label: 'Sample Data',
                            data: [10, 20, 15, 25],
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: { x: { ticks: { color: '#bbb' } }, y: { ticks: { color: '#bbb' } } },
                        plugins: { legend: { display: false } }
                    }
                });
            }
        }, 0);

        return newCard;
    }


    // --- Event Listeners ---

    // Navigation links
    dashboardLink.addEventListener('click', (event) => {
        event.preventDefault();
        navigateToSection('dashboardLink');
    });

    gridLineLink.addEventListener('click', (event) => {
        event.preventDefault();
        navigateToSection('gridLineLink');
    });

    raisedFloorLink.addEventListener('click', (event) => {
        event.preventDefault();
        navigateToSection('raisedFloorLink');
    });

    floorPlanLink.addEventListener('click', (event) => {
        event.preventDefault();
        navigateToSection('floorPlanLink');
    });

    airConditionerLink.addEventListener('click', (event) => {
        event.preventDefault();
        navigateToSection('airConditionerLink');
    });

    fm200Link.addEventListener('click', (event) => {
        event.preventDefault();
        navigateToSection('fm200Link');
    });

    cameraLink.addEventListener('click', (event) => {
        event.preventDefault();
        navigateToSection('cameraLink');
    });

    powerComponentsLink.addEventListener('click', (event) => {
        event.preventDefault();
        navigateToSection('powerComponentsLink');
    });

    accessControlLink.addEventListener('click', (event) => {
        event.preventDefault();
        navigateToSection('accessControlLink');
    });

    upsDetailLink.addEventListener('click', (event) => {
        event.preventDefault();
        navigateToSection('upsDetailLink');
    });

    heaterLink.addEventListener('click', (event) => {
        event.preventDefault();
        navigateToSection('heaterLink');
    });

    // PDF Links (from navigation sidebar)
    if (msbLink) {
        msbLink.addEventListener('click', function(event) {
            event.preventDefault();
            // Instead of opening PDF, show the image overlay for MSB
            overlayImage.src = msbDiagramImagePath;
            imageOverlay.classList.remove('hidden');
            // Deactivate all other views when the image overlay is shown
            hideAllViews();
            // Activate the MSB navigation link to show it's the active view
            activateLink(msbLink);
        });
    }

    if (rectifierLink) {
        rectifierLink.addEventListener('click', function(event) {
            event.preventDefault();
            // Use the correct variable for rectifier PDF path
            openPdf(rectifierPdfPath);
        });
    }

    if (mdbLink) {
        mdbLink.addEventListener('click', function(event) {
            event.preventDefault();
            // Use the correct variable for MDB PDF path
            openPdf(mdbPdfPath);
        });
    }

    // Event listener for the close button on the image overlay
    if (closeImageOverlayBtn) {
        closeImageOverlayBtn.addEventListener('click', () => {
            imageOverlay.classList.add('hidden');
            overlayImage.src = ''; // Clear the image source to save memory
            // After closing the overlay, you might want to return to a default view
            // or the previous view. For now, let's navigate to the dashboard as a sensible default.
            // If the user was on the Floor Plan when clicking an SVG element, you might want to return there.
            navigateToSection('dashboardLink'); // Or logic to go back to previous view
        });
    }

    // Optional: Close overlay if clicked outside the image content
    if (imageOverlay) {
        imageOverlay.addEventListener('click', (event) => {
            if (event.target === imageOverlay) { // Only close if clicking the background, not the image itself
                imageOverlay.classList.add('hidden');
                overlayImage.src = ''; // Clear the image source
                navigateToSection('dashboardLink'); // Return to dashboard
            }
        });
    }

    // Filter and Export listeners for inventory tables
    acFilterInput.addEventListener('input', createFilterFunction(airConditioners, renderTable, acInventoryList, 'State'));
    exportCsvButton.addEventListener('click', () => exportToCsv(filteredAirConditioners, 'air_conditioner_inventory.csv'));

    fm200FilterInput.addEventListener('input', createFilterFunction(fm200Units, renderTable, fm200List, 'Status'));
    exportFm200CsvButton.addEventListener('click', () => exportToCsv(filteredFm200Units, 'fm200_inventory.csv'));

    cameraFilterInput.addEventListener('input', createFilterFunction(cameras, renderTable, cameraList, 'Status'));
    exportCameraCsvButton.addEventListener('click', () => exportToCsv(filteredCameras, 'camera_inventory.csv'));

    powerFilterInput.addEventListener('input', createFilterFunction(powerComponents, renderTable, powerComponentsList, 'Status'));
    exportPowerCsvButton.addEventListener('click', () => exportToCsv(filteredPowerComponents, 'power_components_inventory.csv'));

    accessFilterInput.addEventListener('input', createFilterFunction(accessControlPoints, renderTable, accessControlList, 'Status'));
    exportAccessCsvButton.addEventListener('click', () => exportToCsv(filteredAccessControlPoints, 'access_control_inventory.csv'));

    upsDetailFilterInput.addEventListener('input', createFilterFunction(upsUnits, renderTable, upsDetailList, 'Status'));
    exportUpsDetailCsvButton.addEventListener('click', () => exportToCsv(filteredUpsUnits, 'ups_details_inventory.csv'));

    heaterFilterInput.addEventListener('input', createFilterFunction(heaterUnits, renderTable, heaterList, 'Status'));
    exportHeaterCsvButton.addEventListener('click', () => exportToCsv(filteredHeaterUnits, 'heater_inventory.csv'));

    // Dashboard customization buttons
    customizeDashboardBtn.addEventListener('click', () => {
        if (isCustomizing) {
            exitCustomizationMode();
        } else {
            enterCustomizationMode();
        }
    });

    saveLayoutBtn.addEventListener('click', saveDashboardLayout);
    addDashboardWidgetBtn.addEventListener('click', () => {
        const newWidget = createPlaceholderWidget();
        dashboardWidgetsContainer.appendChild(newWidget);
    });

    closeDetailPanelButton.addEventListener('click', () => {
        floorPlanDetailPanel.classList.add('hidden');
        floorPlanDetailPanel.classList.remove('flex');
    });

    // --- Initial Load ---
    populateInitialRackNotes(); // Ensure rack notes are populated before rendering
    loadDashboardLayout(); // Load dashboard layout and initialize charts
    navigateToSection('dashboardLink'); // Show the dashboard as the initial view
});