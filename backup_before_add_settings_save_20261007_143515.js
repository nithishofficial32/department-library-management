let currentAdminPassword = 'admin123';

 let dbMembers = [
 {
 id: "110324104088",
 name: "Nithish L Lingammoorthy",
 batch: "2023-2027",
 programme: "B.E.",
 department: "Computer Science and Engineering",
 photo: "https://randomuser.me/api/portraits/men/32.jpg",
 section: "A",
 gender: "Male",
 status: "Active",
 doj: "30-09-2026",
 dol: "-",
 type: "Student",
 memberLock: "No",
 lockReason: ""
 },
 {
 id: "FAC001",
 name: "Dr. K. Ramesh",
 batch: "Staff",
 programme: "Faculty",
 department: "Computer Science and Engineering",
 photo: "",
 section: "CSE",
 gender: "Male",
 status: "Active",
 doj: "01-06-2022",
 dol: "-",
 type: "Faculty",
 memberLock: "No",
 lockReason: ""
 },
 {
 id: "110324104064",
 name: "Nithish L",
 batch: "2024-2028",
 programme: "B.E.",
 department: "Information Technology",
 photo: "https://randomuser.me/api/portraits/men/54.jpg",
 section: "B",
 gender: "Male",
 status: "Active",
 doj: "30-09-2026",
 dol: "-",
 type: "Student",
 memberLock: "No",
 lockReason: ""
 },
 {
 id: "110324104086",
 name: "dhanvanth",
 batch: "2023-2027",
 programme: "B.E.",
 department: "Computer Science and Engineering",
 photo: "",
 section: "A",
 gender: "Male",
 status: "Active",
 doj: "01-10-2026",
 dol: "-",
 type: "Student",
 memberLock: "No",
 lockReason: ""
 }
 ];

 let dbBooks = [
 { accn: "CS1001", title: "Introduction to Algorithms", author: "Cormen, Leiserson, Rivest", edition: "3rd", publisher: "MIT Press", callNo: "005.1 COR", subject: "Computer Science" },
 { accn: "CS1002", title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell, Peter Norvig", edition: "4th", publisher: "Pearson", callNo: "006.3 RUS", subject: "Artificial Intelligence" },
 { accn: "IT2001", title: "Database System Concepts", author: "Silberschatz, Korth, Sudarshan", edition: "7th", publisher: "McGraw-Hill", callNo: "005.74 SIL", subject: "Database Systems" },
 { accn: "EC3001", title: "Digital Signal Processing", author: "John G. Proakis", edition: "4th", publisher: "Pearson", callNo: "621.382 PRO", subject: "Electronics" }
 ];

 let dbIssues = [
 { id: 1, accn: "CS1001", title: "Introduction to Algorithms", memberId: "110324104088", memberName: "Nithish L Lingammoorthy", issueDate: "2026-09-15", dueDate: "2026-09-29", renewals: 0, status: "Issued" },
 { id: 2, accn: "CS1002", title: "Artificial Intelligence: A Modern Approach", memberId: "110324104064", memberName: "Nithish L", issueDate: "2026-09-10", dueDate: "2026-09-24", renewals: 1, status: "Issued" },
 { id: 3, accn: "IT2001", title: "Database System Concepts", memberId: "FAC001", memberName: "Dr. K. Ramesh", issueDate: "2026-09-01", dueDate: "2026-10-01", renewals: 0, status: "Issued" }
 ];

 let dbReservations = [
 { id: 1, accn: "CS1001", title: "Introduction to Algorithms", memberId: "110324104086", memberName: "dhanvanth", reserveDate: "2026-09-25", status: "Waiting" }
 ];

 let dbFines = [
 { id: 1, memberId: "110324104064", memberName: "Nithish L", accn: "CS1002", fineAmount: 16.00, reason: "8 Days Overdue", status: "Pending", collectedDate: "-" },
 { id: 2, memberId: "110324104088", memberName: "Nithish L Lingammoorthy", accn: "CS1001", fineAmount: 6.00, reason: "3 Days Overdue", status: "Pending", collectedDate: "-" }
 ];

 let systemUserRoles = [
 { id: 1, account: "admin_grt", role: "Super Administrator", privileges: "Full System Access, Settings, User Management", status: "Active" },
 { id: 2, account: "librarian_01", role: "Circulation Desk Operator", privileges: "Issue, Return, Renewal, Member Register", status: "Active" }
 ];

 let removedMembersLog = [];
 let counterTransactionValues = {};
 const visitorLogStorageKey = 'grtVisitorLog';
 let visitorLogs = loadVisitorLogs();
 let gateScanTimeout;
 let currentFilteredLogs = [];
 let isSidebarCollapsed = false;

 function toggleSidebar() {
 const sidebar = document.getElementById('sidebarMenu');
 const icon = document.getElementById('sidebarToggleIcon');
 const btn = document.getElementById('sidebarToggleBtn');

 isSidebarCollapsed = !isSidebarCollapsed;

 if (isSidebarCollapsed) {
 sidebar.classList.add('collapsed-sidebar');
 icon.classList.add('rotate-180');
 btn.title = "Expand Menu";
 } else {
 sidebar.classList.remove('collapsed-sidebar');
 icon.classList.remove('rotate-180');
 btn.title = "Collapse Menu";
 }
 }

 function loadVisitorLogs() {
 try {
 const storedLogs = JSON.parse(localStorage.getItem(visitorLogStorageKey) || '[]');
 return Array.isArray(storedLogs) ? storedLogs : [];
 } catch {
 return [];
 }
 }

 function saveVisitorLogs() {
 localStorage.setItem(visitorLogStorageKey, JSON.stringify(visitorLogs));
 }

 function escapeHtml(value) {
 return String(value ?? '').replace(/[&<>"']/g, character => ({
 '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
 })[character]);
 }

 function previewSelectedImage(event) {
 const file = event.target.files[0];
 const previewImg = document.getElementById('photoPreview');
 const defaultPlaceholder = document.getElementById('defaultPhotoPlaceholder');

 if (file && file.type.startsWith('image/')) {
 const reader = new FileReader();
 reader.onload = function(e) {
 previewImg.src = e.target.result;
 previewImg.classList.remove('hidden');
 defaultPlaceholder.classList.add('hidden');
 };
 reader.readAsDataURL(file);
 } else {
 previewImg.src = '';
 previewImg.classList.add('hidden');
 defaultPlaceholder.classList.remove('hidden');
 }
 }

 function processGateScan(event) {
 event.preventDefault();
 const memberId = document.getElementById('gateMemberId').value.trim();
 const member = dbMembers.find(candidate => candidate.id.toLowerCase() === memberId.toLowerCase());
 const result = document.getElementById('gateScanResult');

 clearTimeout(gateScanTimeout);

 if (!member || member.status !== 'Active' || member.memberLock === 'Yes') {
 const message = !member
 ? 'Member ID not found. Check the barcode and try again.'
 : member.memberLock === 'Yes'
 ? 'This member account is LOCKED. Access denied.'
 : 'This member account is currently inactive.';
 result.innerHTML = `
 <div class="animate-bounce overflow-hidden rounded-2xl border-2 border-rose-300 bg-rose-50 shadow-lg p-6 text-center max-w-2xl mx-auto">
 <svg class="w-12 h-12 text-rose-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
 <p class="text-lg font-bold text-rose-800">${message}</p>
 </div>`;
 document.getElementById('gateMemberId').value = '';
 resetGateUIAfterDelay();
 return;
 }

 const department = member.department || member.programme || 'Not specified';
 const openVisit = visitorLogs.find(log => log.memberId === member.id && !log.checkOut);
 const scannedAt = new Date().toISOString();
 let action;

 if (openVisit) {
 openVisit.checkOut = scannedAt;
 action = 'Thank you';
 } else {
 visitorLogs.push({
 memberId: member.id,
 name: member.name,
 department,
 batch: member.batch,
 checkIn: scannedAt,
 checkOut: ''
 });
 action = 'Welcome';
 }
 saveVisitorLogs();

 const badgeColor = openVisit ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200';
 const actionColor = openVisit ? 'text-rose-600' : 'text-emerald-600';

 const roleType = member.type || 'Student';
 let roleBatchMarkup = '';

 if (roleType.toLowerCase() === 'faculty' || roleType.toLowerCase() === 'staff' || member.batch.toLowerCase() === 'staff') {
 roleBatchMarkup = `
 <div>
 <p class="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-0.5">Role</p>
 <p class="text-sm font-semibold text-gray-800">${escapeHtml(roleType)}</p>
 </div>
 `;
 } else {
 roleBatchMarkup = `
 <div>
 <p class="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-0.5">Role</p>
 <p class="text-sm font-semibold text-gray-800">${escapeHtml(roleType)}</p>
 </div>
 <div>
 <p class="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-0.5">Batch</p>
 <p class="text-sm font-semibold text-gray-800">${escapeHtml(member.batch)}</p>
 </div>
 `;
 }

 const fallbackAvatar = `<svg class="w-[85%] h-[85%] text-gray-400 mt-[15%]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;

 result.innerHTML = `
 <div class="transition-all duration-300 transform scale-95 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg mx-auto w-full max-w-2xl" style="animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;">
 <style>@keyframes popIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }</style>
 <div class="p-6">
 <div class="flex items-start justify-between border-b border-gray-100 pb-5 mb-5">
 <div class="flex items-center gap-5">
 <div class="h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden border border-gray-200 bg-gray-100 shrink-0 flex flex-col items-center justify-center">
 ${member.photo
 ? `<img src="${escapeHtml(member.photo)}" alt="${escapeHtml(member.name)}" class="w-full h-full object-cover">`
 : fallbackAvatar
 }
 </div>
 <div class="flex flex-col">
 <h3 class="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight leading-none mb-1.5">${escapeHtml(member.name)}</h3>
 <p class="text-sm font-bold text-gray-500 font-mono">${escapeHtml(member.id)}</p>
 </div>
 </div>
 <span class="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${badgeColor}">
 ${openVisit ? 'CHECKED OUT' : 'CHECKED IN'}
 </span>
 </div>

 <div class="grid grid-cols-2 md:grid-cols-3 gap-6 mb-5 px-2">
 <div>
 <p class="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-0.5">Department</p>
 <p class="text-sm font-semibold text-gray-800">${escapeHtml(department)}</p>
 </div>
 ${roleBatchMarkup}
 </div>

 <div class="flex items-center justify-between bg-gray-50 rounded-xl p-4 border border-gray-100">
 <p class="text-xl font-black ${actionColor}">${action}!</p>
 <p class="text-xs font-bold text-gray-500 flex items-center gap-1.5">
 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
 ${new Date(scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
 </p>
 </div>
 </div>
 </div>
 `;

 document.getElementById('gateMemberId').value = '';
 document.getElementById('gateMemberId').focus();

 resetGateUIAfterDelay();
 }

 function resetGateUIAfterDelay() {
 gateScanTimeout = setTimeout(() => {
 const result = document.getElementById('gateScanResult');
 if (result) {
 result.innerHTML = `
 <div class="flex flex-col items-center justify-center h-full text-gray-400 border-[1.5px] border-dashed border-gray-300 rounded-xl p-12 bg-[#fafafa]">
 <svg class="w-10 h-10 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
 </svg>
 <p class="text-[11px] font-bold tracking-widest uppercase text-gray-400">Waiting for scan...</p>
 </div>
 `;
 }
 }, 3000);
 }

 function renderVisitorLogRows(logsArray = null) {
 const logsToRender = logsArray || visitorLogs.slice().reverse();
 if (logsToRender.length === 0) {
 return '<tr><td colspan="7" class="py-12 text-center text-gray-400">No visitor entries found matching criteria.</td></tr>';
 }

 return logsToRender.map(log => {
 const inDate = log.checkIn ? new Date(log.checkIn).toLocaleDateString([], {day: '2-digit', month: 'short', year: 'numeric'}) : '-';
 const inTime = log.checkIn ? new Date(log.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}) : '-';
 const outTime = log.checkOut ? new Date(log.checkOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}) : '<span class="font-semibold text-emerald-600 animate-pulse">● On campus</span>';

 return `
 <tr class="border-b hover:bg-gray-50 transition-colors">
 <td class="p-2 font-mono font-bold text-blue-900 border-r border-gray-200">${escapeHtml(log.memberId)}</td>
 <td class="p-2 font-semibold border-r border-gray-200">${escapeHtml(log.name)}</td>
 <td class="p-2 border-r border-gray-200 text-gray-700">${escapeHtml(log.department)}</td>
 <td class="p-2 border-r border-gray-200 text-gray-700">${escapeHtml(log.batch)}</td>
 <td class="p-2 border-r border-gray-200 text-gray-600">${escapeHtml(inDate)}</td>
 <td class="p-2 border-r border-gray-200 text-gray-600">${escapeHtml(inTime)}</td>
 <td class="p-2">${outTime}</td>
 </tr>
 `;
 }).join('');
 }

 function filterVisitorLogs() {
 const searchId = document.getElementById('vFilterId').value.toLowerCase();
 const searchBatch = document.getElementById('vFilterBatch').value;
 const searchTime = document.getElementById('vFilterTime').value.toLowerCase();
 const searchStatus = document.getElementById('vFilterStatus').value;

 const reversedLogs = visitorLogs.slice().reverse();
 const filtered = reversedLogs.filter(log => {
 const matchId = !searchId || log.memberId.toLowerCase().includes(searchId) || log.name.toLowerCase().includes(searchId);
 const matchBatch = !searchBatch || log.batch === searchBatch;
 const fullInStr = log.checkIn ? new Date(log.checkIn).toLocaleString().toLowerCase() : '';
 const fullOutStr = log.checkOut ? new Date(log.checkOut).toLocaleString().toLowerCase() : '';
 const matchTime = !searchTime || fullInStr.includes(searchTime) || fullOutStr.includes(searchTime);

 let matchStatus = true;
 if (searchStatus === 'in') matchStatus = !log.checkOut;
 if (searchStatus === 'out') matchStatus = !!log.checkOut;

 return matchId && matchBatch && matchTime && matchStatus;
 });

 document.getElementById('visitorLogTableBody').innerHTML = renderVisitorLogRows(filtered);
 const countSpan = document.getElementById('vLogCount');
 if (countSpan) countSpan.innerText = `${filtered.length} entries`;

 const checkoutAllBtn = document.getElementById('checkoutAllBtn');
 if (checkoutAllBtn) {
 if (searchStatus === 'in' && filtered.length > 0) {
 checkoutAllBtn.classList.remove('hidden');
 } else {
 checkoutAllBtn.classList.add('hidden');
 }
 }
 }

 // Automated 3:30 PM Auto-Checkout Function
 function checkOutRemainingVisitors() {
 const now = new Date();
 const currentHours = now.getHours();
 const currentMinutes = now.getMinutes();

 // 15:30 is 3:30 PM
 if (currentHours > 15 || (currentHours === 15 && currentMinutes >= 30)) {
 const todayStr = now.toDateString();
 const lastRunKey = 'grtAutoCheckoutDate';
 const lastRunDate = localStorage.getItem(lastRunKey);

 // Run only once per day automatically
 if (lastRunDate !== todayStr) {
 let updatedCount = 0;
 visitorLogs.forEach(log => {
 if (!log.checkOut) {
 const checkoutTime = new Date(now);
 checkoutTime.setHours(15, 30, 0, 0);
 log.checkOut = checkoutTime.toISOString();
 updatedCount++;
 }
 });

 if (updatedCount > 0) {
 saveVisitorLogs();
 localStorage.setItem(lastRunKey, todayStr);
 console.log(`Auto-checkout executed: ${updatedCount} visitor(s) checked out at 3:30 PM.`);
 }
 }
 }
 }

 // Run auto-checkout check every minute in the background
 setInterval(checkOutRemainingVisitors, 60000);

 function checkOutAllOnCampus() {
 if (confirm("Are you sure you want to bulk check-out all members currently on campus?")) {
 const now = new Date().toISOString();
 let count = 0;

 visitorLogs.forEach(log => {
 if (!log.checkOut) {
 log.checkOut = now;
 count++;
 }
 });

 if (count > 0) {
 saveVisitorLogs();
 filterVisitorLogs();
 alert(`Successfully checked out ${count} member(s).`);
 } else {
 alert("No members are currently on campus.");
 }
 }
 }

 function generateSummaryReport() {
 const fromDateVal = document.getElementById('summaryFromDate').value;
 const toDateVal = document.getElementById('summaryToDate').value;
 const fromTimeVal = document.getElementById('summaryFromTime').value;
 const toTimeVal = document.getElementById('summaryToTime').value;
 const tbody = document.getElementById('summaryTableBody');

 if (!fromDateVal || !toDateVal) {
 alert("Please select both From Date and To Date.");
 return;
 }

 const fromDate = new Date(fromDateVal);
 if (fromTimeVal) {
 const [startH, startM] = fromTimeVal.split(':');
 fromDate.setHours(parseInt(startH, 10), parseInt(startM, 10), 0, 0);
 } else {
 fromDate.setHours(0, 0, 0, 0);
 }

 const toDate = new Date(toDateVal);
 if (toTimeVal) {
 const [endH, endM] = toTimeVal.split(':');
 toDate.setHours(parseInt(endH, 10), parseInt(endM, 10), 59, 999);
 } else {
 toDate.setHours(23, 59, 59, 999);
 }

 currentFilteredLogs = visitorLogs.filter(log => {
 if (!log.checkIn) return false;
 const logDate = new Date(log.checkIn);
 return logDate >= fromDate && logDate <= toDate;
 });

 const printHeader = document.getElementById('printDateRange');
 if (printHeader) {
 const timeOpts = { hour: '2-digit', minute: '2-digit' };
 const fromDisplay = `${fromDate.toLocaleDateString()}${fromTimeVal ? ' ' + fromDate.toLocaleTimeString([], timeOpts) : ''}`;
 const toDisplay = `${toDate.toLocaleDateString()}${toTimeVal ? ' ' + toDate.toLocaleTimeString([], timeOpts) : ''}`;
 printHeader.innerText = `Report From: ${fromDisplay} To: ${toDisplay}`;
 }

 if (currentFilteredLogs.length === 0) {
 tbody.innerHTML = '<tr><td colspan="6" class="text-center py-12 text-gray-400 italic">No records found for the selected date and time range.</td></tr>';
 return;
 }

 tbody.innerHTML = currentFilteredLogs.map(log => {
 const checkInDate = new Date(log.checkIn);
 const dateStr = checkInDate.toLocaleDateString();
 const inTime = checkInDate.toLocaleTimeString();
 const outTime = log.checkOut ? new Date(log.checkOut).toLocaleTimeString() : 'On Campus';

 return `
 <tr class="border-b hover:bg-gray-50">
 <td class="p-2 border-r border-gray-200 text-gray-700">${escapeHtml(dateStr)}</td>
 <td class="p-2 border-r border-gray-200 font-mono font-bold text-blue-800">${escapeHtml(log.memberId)}</td>
 <td class="p-2 border-r border-gray-200 font-semibold">${escapeHtml(log.name)}</td>
 <td class="p-2 border-r border-gray-200 text-gray-600">${escapeHtml(log.batch)}</td>
 <td class="p-2 border-r border-gray-200 text-emerald-700 font-medium">${escapeHtml(inTime)}</td>
 <td class="p-2 text-rose-700 font-medium">${escapeHtml(outTime)}</td>
 </tr>
 `;
 }).join('');
 }

 function resetSummaryReport() {
 ['summaryFromDate', 'summaryFromTime', 'summaryToDate', 'summaryToTime'].forEach(id => {
 const el = document.getElementById(id);
 if (el) el.value = '';
 });

 const tbody = document.getElementById('summaryTableBody');
 if (tbody) {
 tbody.innerHTML = '<tr><td colspan="6" class="text-center py-12 text-gray-400 italic">Select a date/time range and click Search Logs</td></tr>';
 }

 const printHeader = document.getElementById('printDateRange');
 if (printHeader) printHeader.innerText = '';

 currentFilteredLogs = [];
 }

 function exportSummaryPDF() {
 if (!currentFilteredLogs || currentFilteredLogs.length === 0) {
 alert("No data to export. Please select a date range and click Search Logs first.");
 return;
 }
 if (typeof html2pdf === 'undefined') {
 alert("PDF library could not be loaded. Check your internet connection and reload the page.");
 return;
 }

 const element = document.getElementById('summaryPrintArea');
 const pdfHeader = document.getElementById('pdfHeader');

 if (pdfHeader) {
 pdfHeader.classList.remove('hidden');
 pdfHeader.classList.add('block');
 }

 const opt = {
 margin: 0.5,
 filename: 'visitor_summary_report.pdf',
 image: { type: 'jpeg', quality: 0.98 },
 html2canvas: { scale: 2 },
 jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
 };

 html2pdf().set(opt).from(element).save().then(() => {
 if (pdfHeader) {
 pdfHeader.classList.remove('block');
 pdfHeader.classList.add('hidden');
 }
 });
 }

 const sidebars = {
 member: ["Member", "Member Removal", "Undo Removal", "Locked Members", "Member History"],
 egate: ["Gate Register", "Visitor Log", "Summary"],
 catalogue: ["Book Entry"],
 search: ["Simple Search", "Advanced Search", "OPAC Catalog", "New Arrivals"],
 circulation: ["Issue", "Active Circulation", "Return", "Renewal", "Reservation", "Fine Collection", "Settings"],
 admin: ["User Roles", "System Settings", "Audit Logs"],
 help: ["User Manual", "About ", "Contact Support"]
 };

 function togglePassword(fieldId, iconId) {
 const passwordInput = document.getElementById(fieldId);
 const eyeIcon = document.getElementById(iconId);

 if (passwordInput.type === 'password') {
 passwordInput.type = 'text';
 eyeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 012.29-3.791m4.352-2.352A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />`;
 } else {
 passwordInput.type = 'password';
 eyeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />`;
 }
 }

 function goToPage(pageId) {
 document.querySelectorAll('.app-page').forEach(page => {
 page.classList.add('hidden');
 });
 document.getElementById(pageId).classList.remove('hidden');

 const userBar = document.getElementById('topHeaderUserBar');
 if (userBar) {
 if (pageId === 'page-dashboard-container') {
 userBar.classList.remove('hidden');
 } else {
 userBar.classList.add('hidden');
 }
 }

 window.scrollTo({ top: 0, behavior: 'smooth' });
 }

 function handleAdminLogin(event) {
 event.preventDefault();

 const userInput = document.getElementById('adminUser');
 const passInput = document.getElementById('adminPass');

 const user = userInput ? userInput.value.trim() : '';
 const pass = passInput ? passInput.value : '';

 const validUser =
 user === 'admin' ||
 user === 'admin_grt' ||
 user === 'lmsadmin';

 const validPassword =
 pass === currentAdminPassword ||
 pass === 'admin123';

 if (validUser && validPassword) {

 // Keep login only for the current browser session.
 // Refresh = stay logged in.
 // Closing the browser/tab = session normally ends.
 try {
 sessionStorage.setItem('lmsLoggedIn', 'true');
 sessionStorage.setItem('lmsUsername', user);
 } catch (e) {
 console.warn('Session storage unavailable:', e);
 }

 // Open dashboard.
 goToPage('page-dashboard-container');

 // After login, open MEMBER page by default.
 loadSidebar('member');

 if (typeof loadSubpage === 'function') {
 loadSubpage('Member');
 }

 // Clear password field after successful login.
 if (passInput) {
 passInput.value = '';
 }

 return false;
 }

 alert('Invalid Admin User ID or Password. Default is admin / admin123');

 if (passInput) {
 passInput.value = '';
 passInput.focus();
 }

 return false;
}

function loadSidebar(module) {
 const container = document.getElementById('sidebarContainer');
 if (container) {
 container.classList.toggle('hidden', module === 'search');
 }

 const sidebar = document.getElementById('sidebarMenu');
 const items = sidebars[module] || [];
 let html = '<ul class="space-y-0.5">';

 items.forEach((item, index) => {
 const activeClass = index === 0
 ? 'font-bold text-gray-900 bg-gray-200/95 shadow-sm'
 : 'text-gray-700 hover:bg-gray-200';

 const prefix = index === 0 ? '&gt; ' : '';
 html += `<li><a href="#" onclick="selectSubmenu(this, '${item}', '${module}')" class="block px-3 py-1.5 rounded ${activeClass}">${prefix}${item}</a></li>`;
 });

 html += '</ul>';
 sidebar.innerHTML = html;
 }

 function selectSubmenu(element, title, module) {
 document.querySelectorAll('#sidebarMenu a').forEach(el => {
 el.classList.remove('font-bold', 'text-gray-900', 'bg-gray-200/95', 'shadow-sm');
 el.classList.add('text-gray-700');
 el.innerHTML = el.innerHTML.replace('&gt; ', '');
 });

 element.classList.add('font-bold', 'text-gray-900', 'bg-gray-200/95', 'shadow-sm');
 element.classList.remove('text-gray-700');
 element.innerHTML = '&gt; ' + element.innerHTML;

 if (module === 'member') {
 loadSubpage(title);
 } else {
 loadModuleSubpage(module, title);
 }
 }

 /* --- USER ROLES EDIT HANDLERS --- */
 function editUserRole(id) {
 const userRecord = systemUserRoles.find(u => u.id === id);
 if (!userRecord) return;

 const card = document.getElementById('workspaceCard');
 const inputClass = "w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600";

 card.innerHTML = `
 <div class="flex justify-between items-center mb-2">
 <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">ADMINISTRATION & SECURITY (EDIT USER ROLE)</h2>
 <button onclick="loadModuleSubpage('admin', 'User Roles')" class="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs font-bold">&larr; Back</button>
 </div>
 <form onsubmit="saveUserRole(event, ${userRecord.id})" class="border border-gray-300 rounded bg-white shadow-sm p-6 w-full max-w-3xl space-y-4 text-xs">
 <div class="flex items-center space-x-4">
 <label class="w-36 font-semibold text-gray-700">User Account</label>
 <input type="text" id="editUserAccount" readonly value="${escapeHtml(userRecord.account)}" class="${inputClass} bg-gray-100 font-mono font-bold text-blue-900">
 </div>
 <div class="flex items-center space-x-4">
 <label class="w-36 font-semibold text-gray-700">*Assigned Role</label>
 <input type="text" id="editUserRoleName" required value="${escapeHtml(userRecord.role)}" class="${inputClass}">
 </div>
 <div class="flex items-center space-x-4">
 <label class="w-36 font-semibold text-gray-700">*Privileges</label>
 <input type="text" id="editUserPrivileges" required value="${escapeHtml(userRecord.privileges)}" class="${inputClass}">
 </div>
 <div class="flex items-center space-x-4">
 <label class="w-36 font-semibold text-gray-700">*Status</label>
 <select id="editUserStatus" class="${inputClass}">
 <option ${userRecord.status === 'Active' ? 'selected' : ''}>Active</option>
 <option ${userRecord.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
 </select>
 </div>
 <div class="pt-2 flex justify-end space-x-2">
 <button type="button" onclick="loadModuleSubpage('admin', 'User Roles')" class="px-5 py-2 bg-gray-400 hover:bg-gray-500 text-white font-bold rounded shadow">Cancel</button>
 <button type="submit" class="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded shadow">Save Changes</button>
 </div>
 </form>
 `;
 }

 function saveUserRole(event, id) {
 event.preventDefault();
 const record = systemUserRoles.find(u => u.id === id);
 if (record) {
 record.role = document.getElementById('editUserRoleName').value.trim();
 record.privileges = document.getElementById('editUserPrivileges').value.trim();
 record.status = document.getElementById('editUserStatus').value;
 alert(`User role for "${record.account}" updated successfully!`);
 loadModuleSubpage('admin', 'User Roles');
 }
 }

 function triggerUniqueBackup() {
 const btn = document.getElementById('backupBtnText');
 const loader = document.getElementById('backupSpinner');
 const cardBox = document.getElementById('backupActiveCard');

 if (loader) loader.classList.remove('hidden');
 if (btn) btn.innerText = "Generating SQL Dump...";

 setTimeout(() => {
 if (loader) loader.classList.add('hidden');
 if (btn) btn.innerText = "📥 Download Backup Archive (.sql)";
 alert('Database backup package generated successfully and ready for download!');

 if (cardBox) {
 cardBox.classList.add('ring-2', 'ring-emerald-500', 'bg-emerald-50/40');
 setTimeout(() => cardBox.classList.remove('ring-2', 'ring-emerald-500', 'bg-emerald-50/40'), 1500);
 }
 }, 1200);
 }

 /* --- UNIQUE SYSTEM SETTINGS PASSWORD UPDATE HANDLER --- */
 function updateAdminPassword(event) {
 event.preventDefault();
 const currentPass = document.getElementById('currAdminPass').value;
 const newPass = document.getElementById('newAdminPass').value;
 const confirmPass = document.getElementById('confirmAdminPass').value;

 if (currentPass !== currentAdminPassword) {
 alert('Current password entered is incorrect.');
 return;
 }

 if (newPass !== confirmPass) {
 alert('New passwords do not match.');
 return;
 }

 if (newPass.length < 4) {
 alert('Password must be at least 4 characters long.');
 return;
 }

 currentAdminPassword = newPass;

 const btnText = document.getElementById('settingsBtnText');
 const spinner = document.getElementById('settingsSpinner');
 if(spinner) spinner.classList.remove('hidden');
 if(btnText) btnText.innerText = "Securing System...";

 setTimeout(() => {
 if(spinner) spinner.classList.add('hidden');
 if(btnText) btnText.innerText = "Update Password";
 alert('Admin password updated successfully! Please use your new password on next login.');
 document.getElementById('currAdminPass').value = '';
 document.getElementById('newAdminPass').value = '';
 document.getElementById('confirmAdminPass').value = '';
 updatePasswordStrengthIndicator('');
 }, 800);
 }

 function updatePasswordStrengthIndicator(val) {
 const bar = document.getElementById('pwStrengthBar');
 const text = document.getElementById('pwStrengthText');
 if (!bar || !text) return;

 if (!val) {
 bar.style.width = '0%';
 bar.className = 'h-full transition-all duration-300 rounded-full bg-gray-200';
 text.innerText = 'Enter new password';
 text.className = 'text-[11px] text-gray-400 font-bold';
 return;
 }

 let score = 0;
 if (val.length >= 6) score++;
 if (/[A-Z]/.test(val)) score++;
 if (/[0-9]/.test(val)) score++;
 if (/[^A-Za-z0-9]/.test(val)) score++;

 if (score <= 1) {
 bar.style.width = '33%';
 bar.className = 'h-full transition-all duration-300 rounded-full bg-rose-500';
 text.innerText = 'Weak Password';
 text.className = 'text-[11px] text-rose-600 font-bold';
 } else if (score === 2 || score === 3) {
 bar.style.width = '66%';
 bar.className = 'h-full transition-all duration-300 rounded-full bg-amber-500';
 text.innerText = 'Medium Security';
 text.className = 'text-[11px] text-amber-600 font-bold';
 } else {
 bar.style.width = '100%';
 bar.className = 'h-full transition-all duration-300 rounded-full bg-emerald-500';
 text.innerText = 'Strong Security';
 text.className = 'text-[11px] text-emerald-600 font-bold';
 }
 }

 

/* ============================================================
   GRT - eGATE STYLE BOOK BARCODE SCANNER
   USB barcode scanner works like a keyboard.
   Scan -> barcode enters field -> book details appear.
   ============================================================ */

function grtFindBookByScannedCode(code) {

    const scanned = String(code || '')
        .trim()
        .toLowerCase();

    if (!scanned) return null;

    return dbBooks.find(book => {

        const accession = String(
            book.accn ||
            book.accession ||
            book.accessionNumber ||
            ''
        ).trim().toLowerCase();

        const barcode = String(
            book.barcode ||
            book.barCode ||
            book.isbn ||
            ''
        ).trim().toLowerCase();

        return (
            accession === scanned ||
            barcode === scanned
        );

    }) || null;
}


function grtShowScannedBookDetails(book) {

    const oldBox =
        document.getElementById('grtScannedBookDetails');

    if (oldBox) {
        oldBox.remove();
    }

    const input =
        document.getElementById('issueAccn');

    if (!input || !book) return;

    const accession = String(
        book.accn ||
        book.accession ||
        book.accessionNumber ||
        ''
    ).trim();

    input.value = accession;

    const box =
        document.createElement('div');

    box.id =
        'grtScannedBookDetails';

    box.className =
        'mt-3 p-4 rounded-lg border ' +
        'border-emerald-200 bg-emerald-50';

    const safe = value =>
        typeof escapeHtml === 'function'
            ? escapeHtml(String(value || '-'))
            : String(value || '-');

    box.innerHTML = `
        <div class="flex items-center gap-2 mb-3">
            <span class="text-emerald-700 text-lg">✓</span>
            <span class="font-bold text-emerald-800">
                BOOK FOUND
            </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-2
                    text-xs text-gray-700">

            <div>
                <strong>Accession No:</strong>
                ${safe(accession)}
            </div>

            <div>
                <strong>Barcode:</strong>
                ${safe(
                    book.barcode ||
                    book.barCode ||
                    book.isbn ||
                    '-'
                )}
            </div>

            <div>
                <strong>Title:</strong>
                ${safe(book.title)}
            </div>

            <div>
                <strong>Author:</strong>
                ${safe(book.author)}
            </div>

            <div>
                <strong>Edition:</strong>
                ${safe(book.edition)}
            </div>

            <div>
                <strong>Publisher:</strong>
                ${safe(book.publisher)}
            </div>

            <div>
                <strong>Subject:</strong>
                ${safe(book.subject)}
            </div>

        </div>
    `;

    const parent =
        input.parentElement;

    if (parent) {
        parent.insertAdjacentElement(
            'afterend',
            box
        );
    }

    input.dispatchEvent(
        new Event('input', {
            bubbles: true
        })
    );
}


function grtHandleBookBarcodeInput() {

    const input =
        document.getElementById('issueAccn');

    if (!input) return;

    const code =
        input.value.trim();

    if (!code) return;

    const book =
        grtFindBookByScannedCode(code);

    if (!book) {

        const oldBox =
            document.getElementById(
                'grtScannedBookDetails'
            );

        if (oldBox) {
            oldBox.remove();
        }

        return;
    }

    grtShowScannedBookDetails(book);
}


/*
 * USB barcode scanners normally type the barcode
 * followed by Enter.
 */
function grtSetupIssueBarcodeScanner() {

    const input =
        document.getElementById('issueAccn');

    if (!input) return;

    if (
        input.dataset.barcodeScannerReady === 'yes'
    ) {
        return;
    }

    input.dataset.barcodeScannerReady = 'yes';

    input.placeholder =
        'Scan book barcode or enter accession number';

    input.addEventListener(
        'input',
        function () {
            grtHandleBookBarcodeInput();
        }
    );

    input.addEventListener(
        'change',
        function () {
            grtHandleBookBarcodeInput();
        }
    );

    input.addEventListener(
        'keydown',
        function (event) {

            if (event.key === 'Enter') {

                event.preventDefault();

                grtHandleBookBarcodeInput();
            }

        }
    );

    /*
     * Small helper text below the barcode field.
     */
    const parent =
        input.parentElement;

    if (
        parent &&
        !document.getElementById(
            'grtBarcodeHelpText'
        )
    ) {

        const help =
            document.createElement('div');

        help.id =
            'grtBarcodeHelpText';

        help.className =
            'mt-1 text-[11px] text-gray-500';


    }
}


/*
 * Issue page is dynamically loaded.
 * MutationObserver detects when issueAccn appears.
 */
(function grtWatchIssueBarcodeField() {

    function setup() {

        if (
            document.getElementById('issueAccn')
        ) {
            grtSetupIssueBarcodeScanner();
        }
    }

    setup();

    if (document.body) {

        const observer =
            new MutationObserver(function () {
                setup();
            });

        observer.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );
    }

})();


/* --- CIRCULATION MODULE FUNCTIONS --- */

/* ============================================================
 ISSUE PAGE - LIVE MEMBER LOOKUP
 Added by targeted UI fix.
 ============================================================ */

function grtIssueMemberLookup() {

 const input = document.getElementById("issueMemberId");

 if (!input) {
 return;
 }

 const memberId = input.value.trim();

 const nameField = document.getElementById("issueMemberName");
 const batchField = document.getElementById("issueMemberBatch");
 const typeField = document.getElementById("issueMemberType");
 const departmentField = document.getElementById("issueMemberDepartment");
 const groupField = document.getElementById("issueMemberGroup");
 const photo = document.getElementById("issueMemberPhoto");
 const placeholder = document.getElementById("issueMemberPhotoPlaceholder");
 const message = document.getElementById("issueMemberMessage");

 if (!nameField) {
 return;
 }

 // Clear fields while typing.
 nameField.value = "";
 batchField.value = "";
 typeField.value = "";
 departmentField.value = "";
 groupField.value = "";

 if (photo) {
 photo.removeAttribute("src");
 photo.classList.add("hidden");
 }

 if (placeholder) {
 placeholder.classList.remove("hidden");
 }

 if (message) {
 message.textContent = "";
 message.className = "text-xs font-semibold text-gray-500";
 }

 if (!memberId) {
 return;
 }

 if (!Array.isArray(dbMembers)) {
 if (message) {
 message.textContent = "Member database is not available.";
 message.className = "text-xs font-semibold text-red-600";
 }
 return;
 }

 const member = dbMembers.find(m =>
 String(m.id || "").trim().toLowerCase() === memberId.toLowerCase()
 );

 if (!member) {
 if (message) {
 message.textContent = "Member ID not found.";
 message.className = "text-xs font-semibold text-red-600";
 }
 return;
 }

 nameField.value = member.name || "";
 batchField.value = member.batch || "";

 // Requested: Type instead of Programme.
 typeField.value =
 member.type ||
 member.memberType ||
 member.memberGroup ||
 "";

 departmentField.value =
 member.department ||
 (String(member.type || "").toLowerCase() === "faculty" ? "Faculty" : "");

 // Use a real group field if one exists.
 // If the current member records do not have a separate group,
 // fall back to the existing type rather than inventing data.
 groupField.value =
 member.group ||
 member.memberGroup ||
 member.groupName ||
 member.type ||
 "";

 const memberPhoto =
 member.photo ||
 member.photoUrl ||
 member.image ||
 member.imageUrl ||
 "";

 if (memberPhoto && photo) {

 photo.src = memberPhoto;
 photo.classList.remove("hidden");

 if (placeholder) {
 placeholder.classList.add("hidden");
 }

 } else {

 if (photo) {
 photo.removeAttribute("src");
 photo.classList.add("hidden");
 }

 if (placeholder) {
 placeholder.classList.remove("hidden");
 }
 }

 if (message) {
 message.textContent = "Member found.";
 message.className = "text-xs font-semibold text-green-600";
 }
}


/* ============================================================
 ISSUE PAGE - LIVE BOOK LOOKUP
 ============================================================ */

function grtIssueBookLookup() {

    const input =
        document.getElementById('issueAccn');

    if (!input) {
        return;
    }

    const code =
        String(input.value || '').trim();

    const title =
        document.getElementById('issueBookTitle');

    const author =
        document.getElementById('issueBookAuthor');

    const publisher =
        document.getElementById('issueBookPublisher');

    const edition =
        document.getElementById('issueBookEdition');

    const accessionDisplay =
        document.getElementById('issueBookAccessionDisplay');

    const message =
        document.getElementById('issueBookMessage');


    if (!code) {

        if (title) title.value = '';
        if (author) author.value = '';
        if (publisher) publisher.value = '';
        if (edition) edition.value = '';
        if (accessionDisplay) accessionDisplay.value = '';

        if (message) {
            message.textContent =
                'Scan or enter a book to continue.';
            message.className =
                'mt-5 text-sm text-slate-500';
        }

        return;
    }


    let book = null;

    if (typeof grtFindBookByScannedCode === 'function') {
        book = grtFindBookByScannedCode(code);
    }


    if (!book && Array.isArray(dbBooks)) {

        const normalized =
            code.toLowerCase();

        book = dbBooks.find(b => {

            const accn =
                String(
                    b.accn ||
                    b.accession ||
                    b.accessionNumber ||
                    ''
                ).trim().toLowerCase();

            const barcode =
                String(
                    b.barcode ||
                    b.barCode ||
                    b.isbn ||
                    ''
                ).trim().toLowerCase();

            return (
                accn === normalized ||
                barcode === normalized
            );

        }) || null;

    }


    if (!book) {

        if (title) title.value = '';
        if (author) author.value = '';
        if (publisher) publisher.value = '';
        if (edition) edition.value = '';
        if (accessionDisplay) accessionDisplay.value = '';

        if (message) {
            message.textContent =
                'Book not found in catalogue.';
            message.className =
                'mt-5 text-sm text-red-600 font-semibold';
        }

        return;
    }


    const accession =
        String(
            book.accn ||
            book.accession ||
            book.accessionNumber ||
            ''
        ).trim();


    if (accessionDisplay) {
        accessionDisplay.value = accession;
    }

    if (title) {
        title.value =
            book.title || '';
    }

    if (author) {
        author.value =
            book.author || '';
    }

    if (publisher) {
        publisher.value =
            book.publisher || '';
    }

    if (edition) {
        edition.value =
            book.edition || '';
    }


    if (input && accession) {

        /*
         * Keep the real accession number in the issue field.
         * This allows the existing LMS flow to continue normally.
         */
        input.value = accession;

    }


    if (message) {

        message.textContent =
            `Book found: ${book.title || accession}`;

        message.className =
            'mt-5 text-sm text-green-600 font-semibold';

    }

}




/* ============================================================
   3-PAGE ISSUE WORKFLOW
   PAGE 1 -> MEMBER
   PAGE 2 -> BOOK
   PAGE 3 -> ACTIVE CIRCULATION
   ============================================================ */

window.grtIssueSelectedMember = null;

function grtIssueGoToBookPage(event) {
    if (event) {
        event.preventDefault();
    }

    const memberInput = document.getElementById('issueMemberId');

    if (!memberInput) {
        alert('Member ID field was not found.');
        return false;
    }

    const memberId = String(memberInput.value || '').trim();

    if (!memberId) {
        alert('Please enter or scan the Member ID.');
        memberInput.focus();
        return false;
    }

    const member = Array.isArray(dbMembers)
        ? dbMembers.find(m =>
            String(m.id || '').trim().toLowerCase() === memberId.toLowerCase()
        )
        : null;

    if (!member) {
        alert(`Member ID "${memberId}" was not found.`);
        memberInput.focus();
        return false;
    }

    const memberStatus = String(member.status || 'Active').trim().toLowerCase();
    const memberLock = String(member.memberLock || 'No').trim().toLowerCase();

    if (memberStatus !== 'active') {
        alert('Cannot continue. This member account is inactive.');
        return false;
    }

    if (memberLock === 'yes') {
        alert('Cannot continue. This member account is locked.');
        return false;
    }

    window.grtIssueSelectedMember = member;

    grtIssueShowBookPage(member);

    return false;
}


function grtIssueShowBookPage(member) {

    const workspaceCard =
        document.getElementById('workspaceCard') ||
        document.querySelector('.workspace-card');

    if (!workspaceCard) {
        alert('Issue workspace was not found.');
        return;
    }

    const memberName = member.name || member.fullName || '-';
    const memberId = member.id || '-';

    workspaceCard.innerHTML = `
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            <div class="px-6 py-5 border-b border-slate-200 bg-slate-50">

                <div class="flex items-center justify-between gap-4">

                    <div>
                        <h2 class="text-xl font-bold text-slate-800">
                            Issue Book
                        </h2>

                        <p class="text-sm text-slate-500 mt-1">
                            Step 2 of 3 — Enter Book Details
                        </p>
                    </div>

                    <div class="flex items-center gap-2 text-xs font-semibold">

                        <span class="px-3 py-1.5 rounded-full bg-green-100 text-green-700">
                            ✓ Member
                        </span>

                        <span class="text-slate-400">→</span>

                        <span class="px-3 py-1.5 rounded-full bg-blue-600 text-white">
                            2 Book
                        </span>

                        <span class="text-slate-400">→</span>

                        <span class="px-3 py-1.5 rounded-full bg-slate-100 text-slate-500">
                            3 Active Circulation
                        </span>

                    </div>

                </div>

            </div>

            <form
                id="grtIssueBookStepForm"
                onsubmit="processIssueBook(event)"
                class="p-6"
            >

                <div class="max-w-3xl mx-auto">

                    <div class="mb-6">

                        <h3 class="text-lg font-bold text-slate-800">
                            Book Details
                        </h3>



                    </div>


                    <div class="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-100">

                        <p class="text-xs font-bold text-blue-600 uppercase">
                            Selected Member
                        </p>

                        <p class="text-base font-bold text-slate-800 mt-1">
                            ${memberName}
                        </p>

                        <p class="text-sm text-slate-500 mt-1">
                            Member ID: ${memberId}
                        </p>

                    </div>


                    <div>

                        <label class="block text-sm font-semibold text-slate-700 mb-2">
                            Book Barcode / Accession Number
                        </label>

                        <input
                            type="text"
                            id="issueAccn"
                            required
                            autocomplete="off"
                            autofocus
                            placeholder="Scan book barcode or enter accession number"
                            oninput="grtIssueBookLookup()"
                            class="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        >


                    </div>


                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

                        <div>

                            <label class="block text-sm font-semibold text-slate-700 mb-2">
                                Accession Number
                            </label>

                            <input
                                type="text"
                                id="issueBookAccessionDisplay"
                                readonly
                                class="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl"
                            >

                        </div>


                        <div>

                            <label class="block text-sm font-semibold text-slate-700 mb-2">
                                Book Title
                            </label>

                            <input
                                type="text"
                                id="issueBookTitle"
                                readonly
                                class="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl"
                            >

                        </div>


                        <div>

                            <label class="block text-sm font-semibold text-slate-700 mb-2">
                                Author
                            </label>

                            <input
                                type="text"
                                id="issueBookAuthor"
                                readonly
                                class="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl"
                            >

                        </div>


                        <div>

                            <label class="block text-sm font-semibold text-slate-700 mb-2">
                                Publisher
                            </label>

                            <input
                                type="text"
                                id="issueBookPublisher"
                                readonly
                                class="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl"
                            >

                        </div>


                        <div>

                            <label class="block text-sm font-semibold text-slate-700 mb-2">
                                Edition
                            </label>

                            <input
                                type="text"
                                id="issueBookEdition"
                                readonly
                                class="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl"
                            >

                        </div>

                    </div>


                    <div
                        id="issueBookMessage"
                        class="mt-5 text-sm text-slate-500"
                    >
                        Scan or enter a book to continue.
                    </div>


                    <div class="mt-8 flex items-center justify-between gap-4">

                        <button
                            type="button"
                            onclick="grtIssueBackToMember()"
                            class="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
                        >
                            ← Back
                        </button>


                        <button
                            type="submit"
                            id="grtIssueBookButton"
                            class="px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                        >
                            Issue Book
                        </button>

                    </div>

                </div>

            </form>

        </div>
    `;

    setTimeout(() => {

        const input = document.getElementById('issueAccn');

        if (input) {
            input.focus();
        }

        if (typeof grtSetupIssueBarcodeScanner === 'function') {
            try {
                grtSetupIssueBarcodeScanner();
            } catch (error) {
                console.error('Issue barcode scanner setup error:', error);
            }
        }

    }, 100);

}


function grtIssueBackToMember() {
    loadModuleSubpage('circulation', 'Issue');
}


function processIssueBook(event) {

    if (event) {
        event.preventDefault();
    }

    try {

        const member =
            window.grtIssueSelectedMember ||
            null;

        if (!member) {
            alert('Member information was not selected.');
            loadModuleSubpage('circulation', 'Issue');
            return false;
        }


        const input =
            document.getElementById('issueAccn');

        const scannedCode =
            String(input ? input.value : '').trim();


        if (!scannedCode) {
            alert('Please scan or enter the book barcode.');
            if (input) input.focus();
            return false;
        }


        /*
         * Resolve either:
         * - physical barcode
         * - accession number
         * - ISBN
         */
        let book = null;

        if (typeof grtFindBookByScannedCode === 'function') {

            book = grtFindBookByScannedCode(scannedCode);

        } else {

            const normalized =
                scannedCode.toLowerCase();

            book = Array.isArray(dbBooks)
                ? dbBooks.find(b => {

                    const accession =
                        String(
                            b.accn ||
                            b.accession ||
                            b.accessionNumber ||
                            ''
                        ).trim().toLowerCase();

                    const barcode =
                        String(
                            b.barcode ||
                            b.barCode ||
                            b.isbn ||
                            ''
                        ).trim().toLowerCase();

                    return (
                        accession === normalized ||
                        barcode === normalized
                    );

                })
                : null;
        }


        if (!book) {
            alert(
                `Book "${scannedCode}" was not found in the catalogue.`
            );

            if (input) input.focus();

            return false;
        }


        const accession =
            String(
                book.accn ||
                book.accession ||
                book.accessionNumber ||
                ''
            ).trim().toUpperCase();


        if (!accession) {
            alert('This book does not have a valid accession number.');
            return false;
        }


        const alreadyIssued =
            Array.isArray(dbIssues) &&
            dbIssues.some(issue => {

                const issueAccession =
                    String(
                        issue.accn ||
                        issue.accession ||
                        issue.accessionNumber ||
                        ''
                    ).trim().toUpperCase();

                return (
                    issueAccession === accession &&
                    String(issue.status || '').toLowerCase() === 'issued'
                );

            });


        if (alreadyIssued) {

            alert(
                `Book "${book.title || accession}" (${accession}) is already currently issued.`
            );

            return false;
        }


        const today = new Date();

        const dueDate = new Date(today);

        dueDate.setDate(
            today.getDate() + grtGetLoanDays()
        );


        const issueDateText =
            today.toISOString().split('T')[0];

        const dueDateText =
            dueDate.toISOString().split('T')[0];


        if (!Array.isArray(dbIssues)) {
            dbIssues = [];
        }


        const newIssue = {

            id:
                dbIssues.length
                ? Math.max(
                    ...dbIssues.map(i =>
                        Number(i.id) || 0
                    )
                ) + 1
                : 1,

            accn: accession,

            title:
                book.title ||
                'Unknown Book',

            memberId:
                member.id,

            memberName:
                member.name ||
                member.fullName ||
                '',

            issueDate:
                issueDateText,

            dueDate:
                dueDateText,

            renewals:
                0,

            status:
                'Issued'

        };


        dbIssues.push(newIssue);


        /*
         * Save using the existing LMS persistence system.
         */
        if (typeof grtSaveAllLibraryData === 'function') {

            grtSaveAllLibraryData();

        } else if (typeof saveAllLibraryData === 'function') {

            saveAllLibraryData();

        }


        window.grtIssueSelectedMember = null;


        alert(
            `Book "${book.title || accession}" successfully issued to ${member.name || member.id}.`
        );


        /*
         * PAGE 3
         */
        loadModuleSubpage(
            'circulation',
            'Active Circulation'
        );


        return false;


    } catch (error) {

        console.error(
            'Issue Book error:',
            error
        );

        alert(
            'Unable to issue the book. Please try again.'
        );

        return false;
    }
}



 function processReturnBook(accn) {
 const issueIdx = dbIssues.findIndex(i => i.accn.toUpperCase() === accn.toUpperCase() && i.status === "Issued");
 if (issueIdx === -1) {
 alert("Issue record not found.");
 return;
 }

 const issue = dbIssues[issueIdx];
 const today = new Date();
 const dueDate = new Date(issue.dueDate);
 const diffTime = today - dueDate;
 const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

 if (diffDays > 0) {
 const fineAmt = diffDays * grtGetFinePerDay();
 dbFines.push({
 id: dbFines.length + 1,
 memberId: issue.memberId,
 memberName: issue.memberName,
 accn: issue.accn,
 fineAmount: fineAmt,
 reason: `${diffDays} Days Overdue`,
 status: "Pending",
 collectedDate: "-"
 });
 alert(`Book returned with ${diffDays} day(s) overdue! ₹${fineAmt.toFixed(2)} fine has been logged.`);
 } else {
 alert(`Book "${issue.title}" returned on time successfully!`);
 }

 dbIssues[issueIdx].status = "Returned";

 grtSaveAllLibraryData();

 loadModuleSubpage('circulation', 'Return');
 }

 function processRenewalBook(accn) {
 const issue = dbIssues.find(i => i.accn.toUpperCase() === accn.toUpperCase() && i.status === "Issued");
 if (!issue) {
 alert("Book is not currently issued.");
 return;
 }
 if (issue.renewals >= 2) {
 alert("Maximum renewal limit (2 times) reached for this book.");
 return;
 }

 const due = new Date(issue.dueDate);
 due.setDate(due.getDate() + 14);
 issue.dueDate = due.toISOString().split('T')[0];
 issue.renewals += 1;

 grtSaveAllLibraryData();

 alert(`Book renewed successfully! New Due Date: ${issue.dueDate} (Renewal count: ${issue.renewals})`);
 loadModuleSubpage('circulation', 'Renewal');
 }

 function processReservationBook(event) {
 event.preventDefault();
 const memberId = document.getElementById('resMemberId').value.trim();
 const accn = document.getElementById('resAccn').value.trim().toUpperCase();

 const member = dbMembers.find(m => m.id.toLowerCase() === memberId.toLowerCase());
 if (!member) {
 alert(`Member ID "${memberId}" not found.`);
 return;
 }

 const book = dbBooks.find(b => b.accn.toUpperCase() === accn);
 if (!book) {
 alert(`Book Accession "${accn}" not found.`);
 return;
 }

 dbReservations.push({
 id: dbReservations.length + 1,
 accn: book.accn,
 title: book.title,
 memberId: member.id,
 memberName: member.name,
 reserveDate: new Date().toISOString().split('T')[0],
 status: "Waiting"
 });

 grtSaveAllLibraryData();

 alert(`Reservation placed for "${book.title}" on member ${member.name}!`);
 loadModuleSubpage('circulation', 'Reservation');
 }

 function cancelReservation(id) {
 const idx = dbReservations.findIndex(r => r.id === id);
 if (idx !== -1) {
 dbReservations.splice(idx, 1);

 grtSaveAllLibraryData();

 alert("Reservation cancelled successfully.");
 loadModuleSubpage('circulation', 'Reservation');
 }
 }

 function collectFine(id) {
 const fine = dbFines.find(f => f.id === id);
 if (fine) {
 fine.status = "Paid";
 fine.collectedDate = new Date().toLocaleDateString('en-GB');

 grtSaveAllLibraryData();

 alert(`Collected fine of ₹${fine.fineAmount.toFixed(2)} from ${fine.memberName}!`);
 loadModuleSubpage('circulation', 'Fine Collection');
 }
 }

 function openNewMemberForm(memberType = 'Student') {
 const card = document.getElementById('workspaceCard');

 card.innerHTML = `
 <div class="flex justify-between items-center mb-3">
 <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">
 ADD MEMBER
 </h2>
 <button type="button"
 onclick="loadSubpage('Member')"
 class="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-xs font-bold">
 ← Back
 </button>
 </div>

 <form onsubmit="return saveNewMember(event)"
 class="border border-gray-300 rounded-xl p-5 bg-gray-50 shadow-sm text-xs w-full max-w-5xl">

 <div class="grid grid-cols-1 md:grid-cols-3 gap-5">

 <div class="md:col-span-2 space-y-3">

 <div class="grid grid-cols-1 md:grid-cols-2 gap-3">

 <div>
 <label class="block font-bold text-gray-700 mb-1">Member Type</label>
 <select id="memberType"
 onchange="openNewMemberForm(this.value)"
 class="w-full px-3 py-2 bg-white border border-gray-300 rounded"
 required>
 <option value="Student" ${memberType === 'Student' ? 'selected' : ''}>Student</option>
 <option value="Faculty" ${memberType === 'Faculty' ? 'selected' : ''}>Faculty</option>
 </select>
 </div>

 <div>
 <label class="block font-bold text-gray-700 mb-1">Member ID</label>
 <input id="memberId" type="text"
 placeholder="${memberType === 'Student' ? 'Student ID' : 'Faculty ID'}"
 required
 class="w-full px-3 py-2 bg-white border border-gray-300 rounded">
 </div>

 <div>
 <label class="block font-bold text-gray-700 mb-1">Name</label>
 <input id="memberName" type="text"
 placeholder="Full Name"
 required
 class="w-full px-3 py-2 bg-white border border-gray-300 rounded">
 </div>

 <div>
 <label class="block font-bold text-gray-700 mb-1">Batch</label>
 <input id="memberBatch" type="text"
 value="${memberType === 'Faculty' ? 'Staff' : '2024-2028'}"
 class="w-full px-3 py-2 bg-white border border-gray-300 rounded">
 </div>

 <div>
 <label class="block font-bold text-gray-700 mb-1">Type</label>
 <input id="memberProgramme" type="text"
 placeholder="${memberType === 'Faculty' ? 'Department / Programme' : 'B.E. CSE'}"
 class="w-full px-3 py-2 bg-white border border-gray-300 rounded">
 </div>

 <div>
 <label class="block font-bold text-gray-700 mb-1">Section</label>
 <input id="memberSection" type="text"
 placeholder="Section"
 class="w-full px-3 py-2 bg-white border border-gray-300 rounded">
 </div>

 <div>
 <label class="block font-bold text-gray-700 mb-1">Gender</label>
 <select id="memberGender"
 class="w-full px-3 py-2 bg-white border border-gray-300 rounded">
 <option value="">Select</option>
 <option>Male</option>
 <option>Female</option>
 <option>Other</option>
 </select>
 </div>

 <div>
 <label class="block font-bold text-gray-700 mb-1">Phone</label>
 <input id="memberPhone" type="text"
 placeholder="Phone Number"
 class="w-full px-3 py-2 bg-white border border-gray-300 rounded">
 </div>

 <div>
 <label class="block font-bold text-gray-700 mb-1">Email</label>
 <input id="memberEmail" type="email"
 placeholder="Email"
 class="w-full px-3 py-2 bg-white border border-gray-300 rounded">
 </div>

 <div>
 <label class="block font-bold text-gray-700 mb-1">Date of Joining</label>
 <input id="memberDOJ" type="date"
 class="w-full px-3 py-2 bg-white border border-gray-300 rounded">
 </div>

 <div>
 <label class="block font-bold text-gray-700 mb-1">Status</label>
 <select id="memberStatus"
 class="w-full px-3 py-2 bg-white border border-gray-300 rounded">
 <option value="Active" selected>Active</option>
 <option value="Inactive">Inactive</option>
 </select>
 </div>

 </div>

 <input type="hidden" id="memberDOL" value="">
 <input type="hidden" id="memberDepartment" value="${memberType === 'Faculty' ? 'Faculty' : 'CSE'}">

 </div>

 <div class="flex flex-col items-center">
 <div class="w-36 h-44 border-2 border-dashed border-gray-300 rounded-lg bg-white flex items-center justify-center overflow-hidden">
 <img id="memberPhotoPreview"
 src=""
 alt="Member Photo"
 class="hidden w-full h-full object-cover">
 <span id="memberPhotoPlaceholder"
 class="text-gray-400 text-center px-3">
 Member Photo
 </span>
 </div>

 <label class="mt-3 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded cursor-pointer font-bold text-xs">
 Upload Photo
 <input id="memberPhoto" type="file"
 accept="image/*"
 class="hidden"
 onchange="previewMemberPhoto(this)">
 </label>
 </div>

 </div>

 <div class="flex justify-end gap-2 mt-5 pt-4 border-t border-gray-200">
 <button type="button"
 onclick="loadSubpage('Member')"
 class="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-bold">
 Cancel
 </button>

 <button type="submit"
 class="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded font-bold shadow">
 Save Member
 </button>
 </div>
 </form>
 `;
 }





function previewMemberPhoto(input) {

 const preview = document.getElementById('memberPhotoPreview');
 const placeholder = document.getElementById('memberPhotoPlaceholder');

 if (!preview || !placeholder) {
 console.warn('Member photo preview elements were not found.');
 return;
 }

 if (!input || !input.files || !input.files.length) {
 preview.src = '';
 preview.classList.add('hidden');
 placeholder.classList.remove('hidden');
 return;
 }

 const file = input.files[0];

 if (!file.type.startsWith('image/')) {
 alert('Please select a valid image file.');
 input.value = '';
 preview.src = '';
 preview.classList.add('hidden');
 placeholder.classList.remove('hidden');
 return;
 }

 if (file.size > 1024 * 1024) {
 alert('Please choose a photo smaller than 1 MB.');
 input.value = '';
 preview.src = '';
 preview.classList.add('hidden');
 placeholder.classList.remove('hidden');
 return;
 }

 const reader = new FileReader();

 reader.onload = function (event) {
 preview.src = event.target.result;
 preview.classList.remove('hidden');
 placeholder.classList.add('hidden');
 };

 reader.onerror = function () {
 alert('The selected photo could not be read.');
 input.value = '';
 preview.src = '';
 preview.classList.add('hidden');
 placeholder.classList.remove('hidden');
 };

 reader.readAsDataURL(file);
}

function saveMembersToStorage() {
 localStorage.setItem(
 'grt_lms_members',
 JSON.stringify(dbMembers)
 );

 localStorage.setItem(
 'dbMembers',
 JSON.stringify(dbMembers)
 );

 // Also keep the complete library data store synchronized.
 if (typeof grtSaveAllLibraryData === 'function') {
     grtSaveAllLibraryData();
 }
 }


/* ============================================================
   FULL DATA PERSISTENCE LAYER - 20261006
   Keeps Books, Members, Issues, Reservations and Fines
   available after browser refresh.
   ============================================================ */

const GRT_DATA_STORAGE_KEYS = {
    books: 'grt_lms_books',
    members: 'grt_lms_members',
    issues: 'grt_lms_issues',
    reservations: 'grt_lms_reservations',
    fines: 'grt_lms_fines'
};

function grtSaveAllLibraryData() {
    try {
        localStorage.setItem(
            GRT_DATA_STORAGE_KEYS.books,
            JSON.stringify(dbBooks)
        );

        localStorage.setItem(
            GRT_DATA_STORAGE_KEYS.members,
            JSON.stringify(dbMembers)
        );

        localStorage.setItem(
            GRT_DATA_STORAGE_KEYS.issues,
            JSON.stringify(dbIssues)
        );

        localStorage.setItem(
            GRT_DATA_STORAGE_KEYS.reservations,
            JSON.stringify(dbReservations)
        );

        localStorage.setItem(
            GRT_DATA_STORAGE_KEYS.fines,
            JSON.stringify(dbFines)
        );

        // Keep the older book key in sync because existing
        // Catalogue / Bulk Entry code also uses this key.
        localStorage.setItem(
            'dbBooks',
            JSON.stringify(dbBooks)
        );

        // Keep the older member key in sync.
        localStorage.setItem(
            'dbMembers',
            JSON.stringify(dbMembers)
        );

        console.log('🟢 GRT library data saved');
    } catch (error) {
        console.warn(
            '⚠️ Library data save failed:',
            error
        );
    }
}

function grtLoadAllLibraryData() {
    try {
        const savedBooks =
            localStorage.getItem(GRT_DATA_STORAGE_KEYS.books) ||
            localStorage.getItem('dbBooks');

        if (savedBooks) {
            const parsedBooks = JSON.parse(savedBooks);

            if (Array.isArray(parsedBooks)) {
                dbBooks = parsedBooks;
            }
        }

        const savedMembers =
            localStorage.getItem(GRT_DATA_STORAGE_KEYS.members) ||
            localStorage.getItem('dbMembers');

        if (savedMembers) {
            const parsedMembers = JSON.parse(savedMembers);

            if (Array.isArray(parsedMembers)) {
                dbMembers = parsedMembers;
            }
        }

        const savedIssues =
            localStorage.getItem(GRT_DATA_STORAGE_KEYS.issues);

        if (savedIssues) {
            const parsedIssues = JSON.parse(savedIssues);

            if (Array.isArray(parsedIssues)) {
                dbIssues = parsedIssues;
            }
        }

        const savedReservations =
            localStorage.getItem(GRT_DATA_STORAGE_KEYS.reservations);

        if (savedReservations) {
            const parsedReservations =
                JSON.parse(savedReservations);

            if (Array.isArray(parsedReservations)) {
                dbReservations = parsedReservations;
            }
        }

        const savedFines =
            localStorage.getItem(GRT_DATA_STORAGE_KEYS.fines);

        if (savedFines) {
            const parsedFines = JSON.parse(savedFines);

            if (Array.isArray(parsedFines)) {
                dbFines = parsedFines;
            }
        }

        console.log('🟢 Saved GRT library data restored');
    } catch (error) {
        console.warn(
            '⚠️ Library data restore failed:',
            error
        );
    }
}

function loadMembersFromStorage() {
 try {
 const saved = localStorage.getItem('grt_lms_members');
 if (saved) {
 const parsed = JSON.parse(saved);
 if (Array.isArray(parsed)) {
 dbMembers = parsed;
 }
 }
 } catch (error) {
 console.warn('Member storage load failed:', error);
 }
 }

function saveNewMember(event) {
 event.preventDefault();

 const id = document.getElementById('memberId').value.trim();
 const name = document.getElementById('memberName').value.trim();
 const memberType = document.getElementById('memberType').value;

 if (!id || !name) {
 alert('Please provide both Member ID and Full Name.');
 return false;
 }

 if (
 Array.isArray(dbMembers) &&
 dbMembers.some(
 m => String(m.id || '').trim().toLowerCase() === id.toLowerCase()
 )
 ) {
 alert(`Member ID "${id}" already exists. Please choose a different ID.`);
 return false;
 }

 const newMember = {
 id: id,
 name: name,
 email: document.getElementById('memberEmail').value.trim(),
 phone: document.getElementById('memberPhone').value.trim(),
 batch: document.getElementById('memberBatch').value.trim(),
 programme: document.getElementById('memberProgramme').value.trim(),
 department: document.getElementById('memberDepartment').value.trim(),
 photo: '',
 section: memberType === 'Faculty'
 ? '-'
 : document.getElementById('memberSection').value.trim(),
 gender: document.getElementById('memberGender').value,
 status: document.getElementById('memberStatus').value,
 doj: document.getElementById('memberDOJ').value || '-',
 dol: '-',
 type: memberType,
 memberLock: 'No',
 lockReason: ''
 };

 const photoInput = document.getElementById('memberPhoto');
 const photoFile =
 photoInput && photoInput.files
 ? photoInput.files[0]
 : null;

 if (photoFile && photoFile.size > 1024 * 1024) {
 alert('Please choose a photo smaller than 1 MB.');
 return false;
 }

 const finishSave = () => {

 const duplicateMember = dbMembers.some(
 m =>
 String(m.id || '').trim().toLowerCase() ===
 String(newMember.id).trim().toLowerCase()
 );

 if (duplicateMember) {
 alert(`Member ID "${newMember.id}" already exists.`);
 return false;
 }

 dbMembers.push(newMember);

 saveMembersToStorage();

 alert(
 `Member "${newMember.name}" (${newMember.id}) added successfully!`
 );

 loadSubpage('Member');

 return true;
 };

 if (photoFile) {
 const reader = new FileReader();

 reader.onload = () => {
 newMember.photo = reader.result;
 finishSave();
 };

 reader.onerror = () => {
 alert('The selected photo could not be read.');
 };

 reader.readAsDataURL(photoFile);

 return false;
 }

 return finishSave();
 }

 function lockMember(id) {
 const member = dbMembers.find(m => m.id === id);
 if (!member) return;

 // Remove any previous lock modal.
 const oldModal = document.getElementById('grtLockReasonModal');
 if (oldModal) oldModal.remove();

 // ----------------------------------------------------------
 // UNLOCK EXISTING LOCKED MEMBER
 // ----------------------------------------------------------
 if (member.memberLock === 'Yes') {

   const modal = document.createElement('div');
   modal.id = 'grtLockReasonModal';

   modal.innerHTML = `
     <div style="
       position:fixed;
       inset:0;
       z-index:99999;
       background:rgba(15,23,42,.55);
       display:flex;
       align-items:center;
       justify-content:center;
       padding:20px;
     ">
       <div style="
         width:min(430px,100%);
         background:#fff;
         border-radius:16px;
         box-shadow:0 20px 50px rgba(0,0,0,.25);
         overflow:hidden;
         font-family:Arial,sans-serif;
       ">

         <div style="
           background:#004080;
           color:#fff;
           padding:17px 20px;
           font-size:17px;
           font-weight:800;
         ">
           Unlock Member
         </div>

         <div style="padding:20px;">

           <div style="
             color:#1e293b;
             font-size:14px;
             line-height:1.6;
             margin-bottom:20px;
           ">
             Are you sure you want to unlock
             <strong>${escapeHtml(member.name)}</strong>
             (${escapeHtml(member.id)})?
           </div>

           <div style="
             display:flex;
             justify-content:flex-end;
             gap:10px;
           ">

             <button
               type="button"
               id="grtUnlockCancel"
               style="
                 padding:9px 18px;
                 border:1px solid #cbd5e1;
                 border-radius:9px;
                 background:#f8fafc;
                 color:#334155;
                 font-weight:700;
                 cursor:pointer;
               ">
               Cancel
             </button>

             <button
               type="button"
               id="grtUnlockConfirm"
               style="
                 padding:9px 18px;
                 border:0;
                 border-radius:9px;
                 background:#16a34a;
                 color:#fff;
                 font-weight:700;
                 cursor:pointer;
               ">
               Unlock Member
             </button>

           </div>
         </div>
       </div>
     </div>
   `;

   document.body.appendChild(modal);

   document.getElementById('grtUnlockCancel').onclick = function() {
     modal.remove();
   };

   document.getElementById('grtUnlockConfirm').onclick = function() {

     member.memberLock = 'No';
     member.lockReason = '';

     modal.remove();

     // Website acknowledgement above the bottom area.
     grtBottomNotify(
       `Member "${member.name}" has been unlocked.`,
       'success',
       3500
     );

     loadSubpage('Member');
   };

   return;
 }

 // ----------------------------------------------------------
 // LOCK MEMBER - CUSTOM REASON BOX
 // ----------------------------------------------------------

 const modal = document.createElement('div');
 modal.id = 'grtLockReasonModal';

 modal.innerHTML = `
   <div style="
     position:fixed;
     inset:0;
     z-index:99999;
     background:rgba(15,23,42,.55);
     display:flex;
     align-items:center;
     justify-content:center;
     padding:20px;
   ">
     <div style="
       width:min(500px,100%);
       background:#fff;
       border-radius:16px;
       box-shadow:0 20px 50px rgba(0,0,0,.25);
       overflow:hidden;
       font-family:Arial,sans-serif;
     ">

       <div style="
         background:#004080;
         color:#fff;
         padding:17px 20px;
         font-size:17px;
         font-weight:800;
       ">
         Lock Member
       </div>

       <div style="padding:20px;">

         <div style="
           margin-bottom:15px;
           color:#1e293b;
           font-size:14px;
           line-height:1.5;
         ">
           <strong>${escapeHtml(member.name)}</strong><br>
           <span style="color:#64748b;">
             Member ID: ${escapeHtml(member.id)}
           </span>
         </div>

         <label style="
           display:block;
           margin-bottom:7px;
           color:#334155;
           font-size:13px;
           font-weight:700;
         ">
           Reason for locking
         </label>

         <textarea
           id="grtLockReasonInput"
           rows="4"
           placeholder="Enter reason for locking this member..."
           style="
             width:100%;
             box-sizing:border-box;
             resize:vertical;
             padding:11px;
             border:1px solid #cbd5e1;
             border-radius:9px;
             outline:none;
             font-family:Arial,sans-serif;
             font-size:14px;
             color:#0f172a;
           "
         ></textarea>

         <div style="
           display:flex;
           justify-content:flex-end;
           gap:10px;
           margin-top:18px;
         ">

           <button
             type="button"
             id="grtLockCancel"
             style="
               padding:9px 18px;
               border:1px solid #cbd5e1;
               border-radius:9px;
               background:#f8fafc;
               color:#334155;
               font-weight:700;
               cursor:pointer;
             ">
             Cancel
           </button>

           <button
             type="button"
             id="grtLockConfirm"
             style="
               padding:9px 18px;
               border:0;
               border-radius:9px;
               background:#004080;
               color:#fff;
               font-weight:700;
               cursor:pointer;
             ">
             Lock Member
           </button>

         </div>
       </div>
     </div>
   </div>
 `;

 document.body.appendChild(modal);

 const input = document.getElementById('grtLockReasonInput');

 input.focus();

 document.getElementById('grtLockCancel').onclick = function() {
   modal.remove();
 };

 document.getElementById('grtLockConfirm').onclick = function() {

   const reason = input.value.trim();

   if (!reason) {
     input.focus();

     input.style.borderColor = '#dc2626';

     setTimeout(function() {
       input.style.borderColor = '#cbd5e1';
     }, 1500);

     return;
   }

   member.memberLock = 'Yes';
   member.lockReason = reason;

   modal.remove();

   // Website acknowledgement above the bottom area.
   grtBottomNotify(
     `Member "${member.name}" has been locked successfully.`,
     'success',
     3500
   );

   loadSubpage('Member');
 };
}

 function unlockMember(id) {
 const member = dbMembers.find(m => m.id === id);
 if (member) {
 member.memberLock = 'No';
 member.lockReason = '';
 alert(`Member "${member.name}" (${member.id}) has been unlocked.`);
 loadSubpage('Locked Members');
 }
 }






function editMember(id) {

    const targetId = String(id || '').trim();

    const member = dbMembers.find(m => {
        const currentId = String(
            m.id ||
            m.memberId ||
            m.rollNo ||
            m.registerNo ||
            ''
        ).trim();

        return currentId === targetId;
    });

    if (!member) {
        alert('Member details were not found.');
        return;
    }

    const card = document.getElementById('workspaceCard');

    if (!card) {
        alert('Member edit area was not found.');
        return;
    }

    const inputClass =
        "w-full px-3 py-2 bg-white border border-gray-300 rounded " +
        "focus:outline-none focus:ring-2 focus:ring-blue-500/20 " +
        "focus:border-blue-600";

    const labelClass =
        "font-semibold text-gray-700 w-40 shrink-0";

    const safe = value => {
        if (typeof escapeHtml === 'function') {
            return escapeHtml(String(value ?? ''));
        }

        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    const selected = (value, current) =>
        String(value || '') === String(current || '')
            ? 'selected'
            : '';

    const memberId =
        member.id ||
        member.memberId ||
        member.rollNo ||
        member.registerNo ||
        '';

    const email =
        member.email ||
        member.emailId ||
        member.mail ||
        '';

    const phone =
        member.phone ||
        member.phoneNumber ||
        member.mobile ||
        member.mobileNumber ||
        '';

    card.innerHTML = `
        <div class="mb-5 flex justify-between items-center">

            <h2 class="text-sm font-bold text-[#004080] tracking-wider uppercase">
                EDIT MEMBER DETAILS
            </h2>

            <button
                type="button"
                onclick="loadSubpage('Member')"
                class="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs font-bold">
                &larr; Back
            </button>

        </div>

        <form
            id="memberEditForm"
            class="border border-gray-200 rounded-lg p-6 md:p-8 bg-white text-xs w-full max-w-6xl shadow-sm">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">

                <div class="flex items-center">
                    <label class="${labelClass}">*Member ID</label>
                    <input
                        type="text"
                        id="newId"
                        required
                        class="${inputClass}"
                        value="${safe(memberId)}">
                </div>

                <div class="flex items-center">
                    <label class="${labelClass}">*Full Name</label>
                    <input
                        type="text"
                        id="newName"
                        required
                        class="${inputClass}"
                        value="${safe(member.name || '')}">
                </div>

                <div class="flex items-center">
                    <label class="${labelClass}">Email</label>
                    <input
                        type="email"
                        id="newEmail"
                        class="${inputClass}"
                        value="${safe(email)}"
                        placeholder="example@grt.edu.in">
                </div>

                <div class="flex items-center">
                    <label class="${labelClass}">Phone No.</label>
                    <input
                        type="tel"
                        id="newPhone"
                        class="${inputClass}"
                        value="${safe(phone)}"
                        placeholder="Enter phone number">
                </div>

                <div class="flex items-center">
                    <label class="${labelClass}">*Member Type</label>
                    <select
                        id="newType"
                        required
                        class="${inputClass}">

                        <option value="Student"
                            ${selected('Student', member.type)}>
                            Student
                        </option>

                        <option value="Faculty"
                            ${selected('Faculty', member.type)}>
                            Faculty
                        </option>

                    </select>
                </div>

                <div class="flex items-center">
                    <label class="${labelClass}">*Gender</label>
                    <select
                        id="newGender"
                        required
                        class="${inputClass}">

                        <option value="Male"
                            ${selected('Male', member.gender)}>
                            Male
                        </option>

                        <option value="Female"
                            ${selected('Female', member.gender)}>
                            Female
                        </option>

                    </select>
                </div>

                <div class="flex items-center">
                    <label class="${labelClass}">*Batch</label>

                    <select
                        id="newBatch"
                        required
                        class="${inputClass}">

                        ${
                            typeof lmsBatchOptions_20261005 === 'function'
                            ? lmsBatchOptions_20261005(member.batch || '')
                            : `<option value="${safe(member.batch || '')}" selected>${safe(member.batch || '')}</option>`
                        }

                    </select>
                </div>

                <div class="flex items-center">
                    <label class="${labelClass}">*Programme</label>

                    <select
                        id="newProg"
                        required
                        class="${inputClass}">

                        <option value="B.E."
                            ${selected('B.E.', member.programme)}>
                            B.E.
                        </option>

                        <option value="B.Tech"
                            ${selected('B.Tech', member.programme)}>
                            B.Tech
                        </option>

                        <option value="Faculty"
                            ${selected('Faculty', member.programme)}>
                            Faculty
                        </option>

                    </select>
                </div>

                <div class="flex items-center">
                    <label class="${labelClass}">*Department</label>

                    <select
                        id="newDepartment"
                        required
                        class="${inputClass}">

                        <option value="Computer Science and Engineering"
                            ${selected(
                                'Computer Science and Engineering',
                                member.department
                            )}>
                            Computer Science and Engineering
                        </option>

                        <option value="Information Technology"
                            ${selected(
                                'Information Technology',
                                member.department
                            )}>
                            Information Technology
                        </option>

                        <option value="Electronics and Communication Engineering"
                            ${selected(
                                'Electronics and Communication Engineering',
                                member.department
                            )}>
                            Electronics and Communication Engineering
                        </option>

                        <option value="Mechanical Engineering"
                            ${selected(
                                'Mechanical Engineering',
                                member.department
                            )}>
                            Mechanical Engineering
                        </option>

                        <option value="Civil Engineering"
                            ${selected(
                                'Civil Engineering',
                                member.department
                            )}>
                            Civil Engineering
                        </option>

                    </select>
                </div>

                <div class="flex items-center">
                    <label class="${labelClass}">*Section</label>

                    <select
                        id="newSec"
                        required
                        class="${inputClass}">

                        <option value="A"
                            ${selected('A', member.section)}>
                            A
                        </option>

                        <option value="B"
                            ${selected('B', member.section)}>
                            B
                        </option>

                        <option value="Staff"
                            ${selected('Staff', member.section)}>
                            Staff
                        </option>

                    </select>
                </div>

                <div class="flex items-center">
                    <label class="${labelClass}">Status</label>

                    <select
                        id="newStatus"
                        class="${inputClass}">

                        <option value="Active"
                            ${selected('Active', member.status)}>
                            Active
                        </option>

                        <option value="Inactive"
                            ${selected('Inactive', member.status)}>
                            Inactive
                        </option>

                    </select>
                </div>

                <div class="flex items-center">
                    <label class="${labelClass}">Photo</label>

                    <input
                        type="file"
                        id="newPhoto"
                        accept="image/*"
                        class="w-full text-xs text-gray-600">
                </div>

            </div>

            <div class="pt-8 flex justify-end gap-3">

                <button
                    type="button"
                    onclick="loadSubpage('Member')"
                    class="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white font-bold rounded">
                    Cancel
                </button>

                <button
                    type="submit"
                    class="px-6 py-2 bg-[#004080] hover:bg-blue-900 text-white font-bold rounded">
                    Update Member Details
                </button>

            </div>

        </form>
    `;

    const form = document.getElementById('memberEditForm');

    if (form) {
        form.addEventListener('submit', function(event) {
            updateMember(event, memberId);
        });
    }
}


function updateMember(event, oldId) {

    event.preventDefault();

    const oldMemberId = String(oldId || '').trim();

    const index = dbMembers.findIndex(m => {

        const currentId = String(
            m.id ||
            m.memberId ||
            m.rollNo ||
            m.registerNo ||
            ''
        ).trim();

        return currentId === oldMemberId;
    });

    if (index === -1) {
        alert('Member details were not found.');
        return;
    }

    const oldMember = dbMembers[index];

    const newId =
        String(document.getElementById('newId')?.value || '').trim();

    const newName =
        String(document.getElementById('newName')?.value || '').trim();

    const newEmail =
        String(document.getElementById('newEmail')?.value || '').trim();

    const newPhone =
        String(document.getElementById('newPhone')?.value || '').trim();

    if (!newId) {
        alert('Please enter Member ID.');
        return;
    }

    if (!newName) {
        alert('Please enter Member Name.');
        return;
    }

    const duplicateId = dbMembers.some((m, i) => {

        if (i === index) {
            return false;
        }

        const currentId = String(
            m.id ||
            m.memberId ||
            m.rollNo ||
            m.registerNo ||
            ''
        ).trim().toLowerCase();

        return currentId === newId.toLowerCase();
    });

    if (duplicateId) {
        alert('This Member ID already exists.');
        return;
    }

    const updatedMember = {
        ...oldMember,

        id: newId,
        name: newName,
        email: newEmail,
        phone: newPhone,

        type:
            document.getElementById('newType')?.value ||
            oldMember.type ||
            '',

        gender:
            document.getElementById('newGender')?.value ||
            oldMember.gender ||
            '',

        batch:
            document.getElementById('newBatch')?.value ||
            oldMember.batch ||
            '',

        programme:
            document.getElementById('newProg')?.value ||
            oldMember.programme ||
            '',

        department:
            document.getElementById('newDepartment')?.value ||
            oldMember.department ||
            '',

        section:
            document.getElementById('newSec')?.value ||
            oldMember.section ||
            '',

        status:
            document.getElementById('newStatus')?.value ||
            oldMember.status ||
            '',

        doj: oldMember.doj || '',
        dol: oldMember.dol || '',

        memberLock: oldMember.memberLock || 'No',
        lockReason: oldMember.lockReason || ''
    };

    const photoInput = document.getElementById('newPhoto');

    if (
        photoInput &&
        photoInput.files &&
        photoInput.files.length > 0
    ) {

        const photoFile = photoInput.files[0];

        if (photoFile.size > 1024 * 1024) {
            alert('Please choose a photo smaller than 1 MB.');
            return;
        }

        const reader = new FileReader();

        reader.onload = function(e) {

            updatedMember.photo = e.target.result;

            finishMemberUpdate(index, updatedMember);
        };

        reader.onerror = function() {
            alert('Unable to read the selected photo.');
        };

        reader.readAsDataURL(photoFile);

    } else {

        updatedMember.photo = oldMember.photo || '';

        finishMemberUpdate(index, updatedMember);
    }
}


function finishMemberUpdate(index, updatedMember) {

    dbMembers[index] = updatedMember;

    try {

        if (typeof saveData === 'function') {
            saveData();
        }

        if (typeof saveMembers === 'function') {
            saveMembers();
        }

        if (typeof grtSaveLibraryDataToMongoDB === 'function') {
            grtSaveLibraryDataToMongoDB();
        }

    } catch (error) {

        console.error(
            'Member save error:',
            error
        );
    }

    alert('Member details updated successfully!');

    if (typeof loadSubpage === 'function') {
        loadSubpage('Member');
    }
}


 function openBulkImportModal() {
 const card = document.getElementById('workspaceCard');

 card.innerHTML = `
 <div class="flex justify-between items-center mb-2">
 <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">
 BULK IMPORT MEMBERS
 </h2>

 <button onclick="loadSubpage('Member')"
 class="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs font-bold">
 &larr; Back
 </button>
 </div>

 <div class="border border-gray-300 rounded p-6 bg-gray-50/80 shadow-sm text-xs w-full max-w-4xl space-y-4">

 <div class="border-2 border-dashed border-gray-400 rounded-xl p-8 text-center bg-white">

 <div class="text-sm font-semibold text-gray-700 mb-2">
 Upload Member File
 </div>

 <div class="text-xs text-gray-500 mb-4">
 Supported formats: PDF and CSV
 </div>

 <input
 id="grtBulkMemberFile"
 type="file"
 accept=".pdf,.csv,application/pdf,text/csv"
 onchange="grtPrepareBulkMemberFile(this)"
 class="block mx-auto text-xs text-gray-500"
 >

 <div id="grtBulkMemberFileName"
 class="mt-3 text-xs font-semibold text-blue-700">
 </div>

 </div>

 <div id="grtBulkImportStatus"
 class="hidden p-3 rounded bg-blue-50 border border-blue-200 text-blue-800 text-xs">
 </div>

 <div class="pt-2 flex justify-between items-center">

 <button onclick="loadSubpage('Member')"
 class="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white font-bold rounded">
 Cancel
 </button>

 <button
 id="grtBulkImportButton"
 onclick="grtImportMembersFile()"
 class="hidden px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded">
 Import PDF / CSV
 </button>

 </div>
 </div>
 `;
}


function grtPrepareBulkMemberFile(input) {

 const button = document.getElementById('grtBulkImportButton');
 const nameBox = document.getElementById('grtBulkMemberFileName');
 const status = document.getElementById('grtBulkImportStatus');

 if (!input || !input.files || !input.files.length) {
 button.classList.add('hidden');
 nameBox.textContent = '';
 status.classList.add('hidden');
 return;
 }

 const file = input.files[0];
 const name = file.name.toLowerCase();

 if (!name.endsWith('.pdf') && !name.endsWith('.csv')) {

 alert('Please select only a PDF or CSV file.');

 input.value = '';
 button.classList.add('hidden');
 nameBox.textContent = '';
 status.classList.add('hidden');

 return;
 }

 nameBox.textContent = 'Selected file: ' + file.name;

 status.textContent =
 name.endsWith('.pdf')
 ? 'PDF file ready. Click Import PDF / CSV.'
 : 'CSV file ready. Click Import PDF / CSV.';

 status.classList.remove('hidden');
 button.classList.remove('hidden');
}


function grtParseCsvLine(line) {

 const result = [];
 let current = '';
 let insideQuotes = false;

 for (let i = 0; i < line.length; i++) {

 const char = line[i];

 if (char === '"') {

 if (insideQuotes && line[i + 1] === '"') {
 current += '"';
 i++;
 } else {
 insideQuotes = !insideQuotes;
 }

 } else if (char === ',' && !insideQuotes) {

 result.push(current.trim());
 current = '';

 } else {

 current += char;
 }
 }

 result.push(current.trim());

 return result;
}


function grtParseCsvText(text) {

 const lines = text
 .replace(/\r\n/g, '\n')
 .replace(/\r/g, '\n')
 .split('\n')
 .filter(line => line.trim() !== '');

 return lines.map(line => grtParseCsvLine(line));
}


function grtNormalizeMemberHeader(value) {

 return String(value || '')
 .toLowerCase()
 .replace(/[^a-z0-9]/g, '');
}


function grtFindCsvColumn(headers, names) {

 for (const name of names) {

 const target = grtNormalizeMemberHeader(name);

 const index = headers.findIndex(
 header => grtNormalizeMemberHeader(header) === target
 );

 if (index !== -1) {
 return index;
 }
 }

 return -1;
}


function grtCsvValue(row, headers, names, fallbackIndex) {

 const index = grtFindCsvColumn(headers, names);

 if (index !== -1) {
 return String(row[index] || '').trim();
 }

 if (fallbackIndex !== undefined && row[fallbackIndex] !== undefined) {
 return String(row[fallbackIndex] || '').trim();
 }

 return '';
}


function grtBuildImportedMember(row, headers) {

 const memberId = grtCsvValue(
 row,
 headers,
 ['Member ID', 'MemberId', 'ID', 'Id', 'Admission No', 'Admission Number'],
 1
 );

 const name = grtCsvValue(
 row,
 headers,
 ['Name', 'Member Name', 'Student Name', 'Faculty Name'],
 2
 );

 if (!memberId || !name) {
 return null;
 }

 const memberTypeValue = grtCsvValue(
 row,
 headers,
 ['Member Type', 'MemberType', 'Category'],
 0
 );

 const type =
 String(memberTypeValue).toLowerCase() === 'faculty'
 ? 'Faculty'
 : 'Student';

 let section = grtCsvValue(
 row,
 headers,
 ['Section', 'Sec'],
 5
 );

 if (type === 'Faculty') {
 section = '-';
 }

 const programme = grtCsvValue(
 row,
 headers,
 ['Programme', 'Program', 'Course', 'Type'],
 4
 );

 const doj = grtCsvValue(
 row,
 headers,
 ['Date of Joining', 'Date Of Joining', 'DOJ', 'Joining Date'],
 9
 );

 return {
 id: String(memberId).trim(),

 memberId: String(memberId).trim(),

 name: String(name).trim(),

 batch: grtCsvValue(
 row,
 headers,
 ['Batch', 'Year', 'Academic Year'],
 3
 ),

 programme: programme,

 type: type,

 department: grtCsvValue(
 row,
 headers,
 ['Department', 'Dept'],
 3
 ),

 section: section || (type === 'Faculty' ? '-' : ''),

 gender: grtCsvValue(
 row,
 headers,
 ['Gender', 'Sex'],
 6
 ),

 phone: grtCsvValue(
 row,
 headers,
 ['Phone', 'Mobile', 'Mobile Number', 'Contact'],
 7
 ),

 email: grtCsvValue(
 row,
 headers,
 ['Email', 'Email ID', 'Email Address'],
 8
 ),

 doj: doj || new Date().toLocaleDateString('en-GB'),

 dol: '-',

 status: grtCsvValue(
 row,
 headers,
 ['Status'],
 10
 ) || 'Active',

 photo: '',

 memberLock: 'No',

 lockReason: ''
 };
}

function grtImportMembersFromCsv(file) {

 return file.text().then(text => {

 const rows = grtParseCsvText(text);

 if (!rows.length) {
 throw new Error('CSV file is empty.');
 }

 const headers = rows[0];

 const normalizedHeaders = headers.map(header =>
 grtNormalizeMemberHeader(header)
 );

 const hasHeader =
 normalizedHeaders.includes('memberid') &&
 normalizedHeaders.includes('name');

 const dataRows = hasHeader ? rows.slice(1) : rows;

 const imported = [];

 dataRows.forEach(row => {

 const member = grtBuildImportedMember(
 row,
 hasHeader ? headers : [
 'Member Type',
 'Member ID',
 'Name',
 'Batch',
 'Type',
 'Section',
 'Gender',
 'Phone',
 'Email',
 'Date of Joining',
 'Status'
 ]
 );

 if (member) {
 imported.push(member);
 }
 });

 return imported;
 });
}


function grtLoadPdfJs() {

 if (window.pdfjsLib) {
 return Promise.resolve(window.pdfjsLib);
 }

 if (window.__grtPdfJsPromise) {
 return window.__grtPdfJsPromise;
 }

 window.__grtPdfJsPromise = new Promise((resolve, reject) => {

 const script = document.createElement('script');

 script.src =
 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';

 script.onload = () => {

 if (!window.pdfjsLib) {
 reject(new Error('PDF library could not be loaded.'));
 return;
 }

 window.pdfjsLib.GlobalWorkerOptions.workerSrc =
 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

 resolve(window.pdfjsLib);
 };

 script.onerror = () => {
 reject(new Error('Could not load PDF reader.'));
 };

 document.head.appendChild(script);
 });

 return window.__grtPdfJsPromise;
}


async function grtExtractPdfRows(file) {

 const pdfjsLib = await grtLoadPdfJs();

 const buffer = await file.arrayBuffer();

 const pdf = await pdfjsLib
 .getDocument({ data: buffer })
 .promise;

 const allRows = [];

 for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {

 const page = await pdf.getPage(pageNumber);

 const content = await page.getTextContent();

 const rows = [];

 content.items.forEach(item => {

 const text = String(item.str || '').trim();

 if (!text) {
 return;
 }

 const x = item.transform[4];
 const y = item.transform[5];

 let row = rows.find(existing =>
 Math.abs(existing.y - y) <= 4
 );

 if (!row) {

 row = {
 y: y,
 items: []
 };

 rows.push(row);
 }

 row.items.push({
 x: x,
 text: text
 });
 });

 rows.sort((a, b) => b.y - a.y);

 rows.forEach(row => {

 row.items.sort((a, b) => a.x - b.x);

 const line = row.items
 .map(item => item.text)
 .join(' | ')
 .trim();

 if (line) {
 allRows.push(line);
 }
 });
 }

 return allRows;
}


function grtParsePdfMemberRow(line) {

 const parts = line
 .split('|')
 .map(value => value.trim())
 .filter(Boolean);

 if (parts.length < 2) {
 return null;
 }

 const joined = parts.join(' ').toLowerCase();

 if (
 joined.includes('member id') &&
 joined.includes('name')
 ) {
 return null;
 }

 let id = parts[0];

 if (!id || !/[0-9]/.test(id)) {
 return null;
 }

 const name = parts[1] || '';

 if (!name) {
 return null;
 }

 const batch =
 parts.find(value =>
 /^\d{4}\s*[-–]\s*\d{4}$/.test(value)
 ) || parts[2] || '';

 const gender =
 parts.find(value =>
 /^(male|female|other)$/i.test(value)
 ) || '';

 const type =
 parts.find(value =>
 /^(student|faculty)$/i.test(value)
 ) || 'Student';

 const section =
 type.toLowerCase() === 'faculty'
 ? '-'
 : (
 parts.find(value =>
 /^(a|b|c|d|staff)$/i.test(value)
 ) || parts[4] || ''
 );

 const department =
 parts[3] || '';

 const programme =
 parts[7] || '';

 const status =
 parts[8] || 'Active';

 return {
 id: id,
 name: name,
 batch: batch,
 programme: programme,
 department: department,
 photo: '',
 section: section,
 gender: gender,
 status: status,
 doj: new Date().toLocaleDateString('en-GB'),
 dol: '-',
 type: /^faculty$/i.test(type) ? 'Faculty' : 'Student',
 memberLock: 'No',
 lockReason: ''
 };
}


async function grtImportMembersFromPdf(file) {

 const rows = await grtExtractPdfRows(file);

 if (!rows.length) {
 throw new Error(
 'No readable text was found in this PDF. Scanned/image-only PDFs need OCR.'
 );
 }

 const imported = [];

 rows.forEach(line => {

 const member = grtParsePdfMemberRow(line);

 if (member) {
 imported.push(member);
 }
 });

 return imported;
}


async function grtImportMembersFile() {

 const input = document.getElementById('grtBulkMemberFile');

 const button = document.getElementById('grtBulkImportButton');

 const status = document.getElementById('grtBulkImportStatus');

 if (!input || !input.files || !input.files.length) {

 alert('Please select a PDF or CSV file first.');

 return;
 }

 const file = input.files[0];

 const fileName = file.name.toLowerCase();

 button.disabled = true;
 button.textContent = 'Importing...';

 status.classList.remove('hidden');
 status.textContent = 'Reading ' + file.name + '...';

 try {

 let importedMembers = [];

 if (fileName.endsWith('.csv')) {

 importedMembers =
 await grtImportMembersFromCsv(file);

 } else if (fileName.endsWith('.pdf')) {

 importedMembers =
 await grtImportMembersFromPdf(file);

 } else {

 throw new Error('Only PDF and CSV files are supported.');
 }

 if (!Array.isArray(importedMembers) || !importedMembers.length) {

 throw new Error(
 'No valid member records were found in the file.'
 );
 }

 if (typeof dbMembers === 'undefined' || !Array.isArray(dbMembers)) {

 throw new Error(
 'Member database was not found.'
 );
 }

 const existingIds = new Set(
 dbMembers.map(member =>
 String(member.id || member.memberId || '').trim().toLowerCase()
 )
 );

 const newMembers = [];

 importedMembers.forEach(member => {

 const id = String(member.id || '')
 .trim()
 .toLowerCase();

 if (!id) {
 return;
 }

 if (existingIds.has(id)) {
 return;
 }

 existingIds.add(id);

 newMembers.push(member);
 });

 if (!newMembers.length) {

 throw new Error(
 'All imported Member IDs already exist.'
 );
 }

 dbMembers.push(...newMembers);

 // Save bulk-imported members to the main persistent storage.
 saveMembersToStorage();

 // Keep the complete library persistence store synchronized.
 if (typeof grtSaveAllLibraryData === 'function') {
     grtSaveAllLibraryData();
 }

 status.textContent =
 newMembers.length +
 ' member(s) imported successfully.';

 alert(
 'Bulk import successful!\\n\\n' +
 newMembers.length +
 ' new member(s) added.'
 );

 loadSubpage('Member');

 } catch (error) {

 console.error('Bulk member import error:', error);

 alert(
 'Import failed.\\n\\n' +
 error.message
 );

 status.textContent =
 'Import failed: ' + error.message;

 button.disabled = false;
 button.textContent = 'Import PDF / CSV';
 }
}


function simulateBulkImport(count) {
 for (let i = 1; i <= count; i++) {
 let paddedNum = String(i).padStart(3, '0');
 dbMembers.push({
 id: `110324104${paddedNum}`,
 name: `Student Member ${i}`,
 batch: i % 2 === 0 ? "2024-2028" : "2023-2027",
 programme: "B.E.",
 department: "Computer Science and Engineering",
 photo: "",
 section: i % 2 === 0 ? "B" : "A",
 gender: i % 3 === 0 ? "Female" : "Male",
 status: "Active",
 doj: "30-09-2026",
 dol: "-",
 type: "Student",
 memberLock: "No",
 lockReason: ""
 });
 }
 alert(`Successfully imported ${count} member records into database!`);
 loadSubpage('Member');
 }

 function filterMembersTable() {
 const selectedBatch = document.getElementById('filterBatch').value;
 const searchId = document.getElementById('filterMemberId').value.toLowerCase();
 const selectedStatus = document.getElementById('filterStatus').value;

 const filtered = dbMembers.filter(m => {
 let matchBatch = !selectedBatch || selectedBatch === '-Select-' || m.batch === selectedBatch;
 let matchId = !searchId || m.id.toLowerCase().includes(searchId) || m.name.toLowerCase().includes(searchId);
 let matchStatus = !selectedStatus || selectedStatus === '-Select-' || m.status === selectedStatus;
 return matchBatch && matchId && matchStatus;
 });

 let rows = filtered.length > 0 ? filtered.map(m => `
 <tr class="hover:bg-gray-50 border-b">
 <td class="p-2 font-mono font-bold text-blue-900">${m.id}</td>
 <td class="p-2 font-semibold">${m.name}</td>
 <td class="p-2">${m.batch}</td>
 <td class="p-2">${m.programme}</td>
 <td class="p-2">${m.section}</td>
 <td class="p-2">${m.gender}</td>
 <td class="p-2"><span class="px-2 py-0.5 ${m.memberLock === 'Yes' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'} rounded font-bold text-[10px]">${m.memberLock === 'Yes' ? 'Locked' : m.status}</span></td>
 <td class="p-2">${m.doj}</td>
 <td class="p-2 border-r">${m.dol}</td>
 <td class="p-2 border-r">
 <button onclick="editMember('${m.id}')" class="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-600 hover:text-white rounded shadow-sm font-bold transition-all flex items-center gap-1.5">
 <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
 Edit
 </button>
 </td>
 <td class="p-2 text-center">
 <button onclick="lockMember('${m.id}')" title="${m.memberLock === 'Yes' ? 'Locked (Click to unlock)' : 'Lock Member'}" class="w-7 h-7 inline-flex items-center justify-center ${m.memberLock === 'Yes' ? 'bg-rose-100 text-rose-700 border border-rose-300 hover:bg-rose-600 hover:text-white' : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-rose-600 hover:text-white hover:border-rose-600'} rounded shadow-sm transition-all">
 <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
 </svg>
 </button>
 </td>
 </tr>
 `).join('') : `<tr><td colspan="11" class="text-center py-12 text-gray-400 italic">No matching members found</td></tr>`;

 document.getElementById('memberTableBody').innerHTML = rows;
 }
 function executeMemberRemoval(event) {
 event.preventDefault();
 const memberId = document.getElementById('removeMemberId').value.trim();
 const index = dbMembers.findIndex(m => m.id === memberId);

 if (index !== -1) {
 const removed = dbMembers.splice(index, 1)[0];
 removedMembersLog.push(removed);
 alert(`Successfully removed member: ${removed.name} (${removed.id})`);
 loadSubpage('Member Removal');
 } else {
 alert(`Member ID "${memberId}" not found in active database.`);
 }
 }

 function restoreMember(id) {
 const idx = removedMembersLog.findIndex(m => m.id === id);
 if (idx !== -1) {
 const restored = removedMembersLog.splice(idx, 1)[0];
 dbMembers.push(restored);
 alert(`Successfully restored member: ${restored.name} (${restored.id})`);
 loadSubpage('Undo Removal');
 }
 }

 function deletePermanently(id) {
 const idx = removedMembersLog.findIndex(m => m.id === id);
 if (idx !== -1) {
 const deleted = removedMembersLog.splice(idx, 1)[0];
 alert(`Permanently deleted member: ${deleted.name} (${deleted.id})`);
 loadSubpage('Undo Removal');
 }
 }

 function counterPhotoMarkup(member) {
 const placeholder = `
 <svg viewBox="0 0 100 110" aria-hidden="true">
 <circle cx="50" cy="30" r="19" fill="currentColor"/>
 <path d="M15 102V82c0-21 16-35 35-35s35 14 35 35v20Z" fill="currentColor"/>
 <path d="m38 52 12 32 12-32-12 9Z" fill="white"/>
 </svg>
 <p>NO IMAGE AVAILABLE</p>`;

 if (!member || !member.photo) {
 return `<div>${placeholder}</div>`;
 }

 return `
 <img src="${escapeHtml(member.photo)}" alt="${escapeHtml(member.name)}"
 style="width:90px;height:105px;margin:0 auto 8px;object-fit:cover;border-radius:6px;border:1px solid #cbd5e1;background:#fff;display:block;"
 onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
 <div style="display:none;">${placeholder}</div>
 <p style="font-size:9px;font-weight:600;letter-spacing:0.5px;">${escapeHtml(member.name)}</p>`;
 }

 function loadCounterTransaction(mode = 'Issue') {
 document.querySelectorAll('[data-counter-field]').forEach(input => {
 counterTransactionValues[input.id] = input.value;
 });

 const today = new Date();
 const currentDate = [
 today.getFullYear(),
 String(today.getMonth() + 1).padStart(2, '0'),
 String(today.getDate()).padStart(2, '0')
 ].join('-');

 const field = (label, id, defaultValue = '', readonly = false, type = 'text') => {
 const value = counterTransactionValues[id] ?? defaultValue;
 return `
 <div class="ct-field">
 <label for="${id}">${label}</label>
 <input id="${id}" data-counter-field type="${type}" value="${escapeHtml(value)}" ${readonly ? 'readonly' : ''} ${type === 'number' ? 'min="0" step="0.01"' : ''}>
 </div>
 `;
 };

 const resourcePanel = (heading, prefix, labels) => `
 <section class="ct-panel">
 <h3 class="ct-panel-title">${heading}</h3>
 <div class="ct-fields">
 ${labels.map((label, index) => field(label, prefix + index, '', true)).join('')}
 </div>
 </section>
 `;

 document.getElementById('workspaceCard').innerHTML = `
 <section class="counter-transaction">
 <header class="ct-header">
 <div>
 <p class="ct-eyebrow">Circulation</p>
 <h2 class="ct-heading">Counter Transaction · ${mode}</h2>
 </div>
 <div class="ct-tabs" aria-label="Transaction type">
 ${['Issue', 'Return', 'Renew', 'Reserve'].map(item => `
 <button type="button" class="ct-tab ${item === mode ? 'is-active' : ''}" aria-pressed="${item === mode}" onclick="loadCounterTransaction('${item}')">${item}</button>
 `).join('')}
 </div>
 </header>

 <div class="ct-body">
 <div class="ct-member-grid">
 <section class="ct-panel">
 <h3 class="ct-panel-title">Member Details</h3>
 <div class="ct-fields">
 <div class="ct-field">
 <label for="counterMemberId">*Member ID</label>
 <input id="counterMemberId" data-counter-field value="${escapeHtml(counterTransactionValues.counterMemberId || '')}" onchange="fillCounterMember(this.value)">
 </div>
 ${field('Name', 'counterName', '', true)}
 ${field('Batch', 'counterBatch', '', true)}
 ${field('Programme', 'counterProgramme', '', true)}
 ${field('Department', 'counterDepartment', '', true)}
 ${field('Group', 'counterGroup', '', true)}
 <p id="counterMemberMessage" class="ct-member-message" aria-live="polite"></p>
 </div>
 </section>

 ${resourcePanel('General Resources', 'counterGeneral', ['No. of Resources', 'Renewals', 'Period (in Days)', 'Overnight (in Days)'])}
 ${resourcePanel('Book Bank', 'counterBank', ['No. of Resources', 'Renewals', 'Period (in Days)'])}

 <div class="ct-photo" id="counterPhotoBox">${counterPhotoMarkup(dbMembers.find(item => item.id === String(counterTransactionValues.counterMemberId || '').trim()))}</div>
 </div>

 <div class="ct-table-wrap">
 <table class="ct-table">
 <thead>
 <tr>
 <th>S.No.</th>
 <th>Res.Type</th>
 <th>Accn No.</th>
 <th>Title</th>
 <th>Issue Date</th>
 <th>Due Date</th>
 </tr>
 </thead>
 <tbody>
 <tr><td>1</td><td></td><td></td><td></td><td></td><td></td></tr>
 </tbody>
 </table>
 </div>

 <div class="ct-details-grid">
 <section class="ct-panel">
 <h3 class="ct-panel-title">Resource Details</h3>
 <div class="ct-fields">
 <div class="ct-two-columns">
 ${field('*Accn No.', 'counterAccn')}
 ${field('*Res. Type', 'counterResourceType', 'BOOK')}
 </div>
 ${field('Title', 'counterTitle', '', true)}
 ${field('Author(s)', 'counterAuthors', '', true)}
 <div class="ct-two-columns">
 ${field('Edition', 'counterEdition', '', true)}
 ${field('Volume', 'counterVolume', '', true)}
 </div>
 <div class="ct-two-columns">
 ${field('Publisher', 'counterPublisher', '', true)}
 ${field('Call No.', 'counterCallNumber', '', true)}
 </div>
 </div>
 </section>

 <section class="ct-panel">
 <h3 class="ct-panel-title">${mode === 'Return' ? 'Return & Fine Details' : 'Transaction Dates'}</h3>
 <div class="ct-fields">
 ${field('*Issue Date', 'counterIssueDate', currentDate, false, 'date')}
 ${field('Due Date', 'counterDueDate', '', false, 'date')}
 ${mode === 'Return' ? `
 ${field('*Return Date', 'counterReturnDate', currentDate, false, 'date')}${field('Fine Amount', 'counterFineAmount', '0', false, 'number')}
 ` : ''}
 </div>
 </section>

 <div class="ct-cover">
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
 <rect x="3" y="3" width="18" height="18" rx="2"/>
 <circle cx="8" cy="8" r="1.5"/>
 <path d="m4 17 5-5 4 4 3-3 5 5"/>
 </svg>
 <span>NO IMAGE AVAILABLE</span>
 </div>
 </div>

 ${mode === 'Return' ? `
 <div class="ct-actions">
 <button type="button" class="ct-button ct-button-primary" onclick="counterReturnAction('define')">Define Fine & Return</button>
 <button type="button" class="ct-button ct-button-teal" onclick="counterReturnAction('collect')">Collect Fine & Return</button>
 <button type="button" class="ct-button ct-button-light" onclick="counterReturnAction('without')">Return without Fine</button>
 <button type="button" class="ct-button ct-button-close" onclick="loadCounterTransaction('Issue')">Close</button>
 </div>
 ` : ''}

 <p id="counterTransactionMessage" class="ct-message" role="status" aria-live="polite"></p>
 </div>
 </section>
 `;

 const memberId = document.getElementById('counterMemberId').value;
 if (memberId.trim()) {
 fillCounterMember(memberId);
 }
 }

 function fillCounterMember(id) {
 const member = dbMembers.find(item => item.id === id.trim());
 const fields = {
 counterName: 'name',
 counterBatch: 'batch',
 counterProgramme: 'programme',
 counterDepartment: 'department',
 counterGroup: 'type'
 };

 Object.entries(fields).forEach(([inputId, property]) => {
 const input = document.getElementById(inputId);
 if (input) {
 input.value = member ? (member[property] || '') : '';
 counterTransactionValues[inputId] = input.value;
 }
 });

 counterTransactionValues.counterMemberId = id;
 const photoBox = document.getElementById('counterPhotoBox');
 if (photoBox) photoBox.innerHTML = counterPhotoMarkup(member);
 const message = document.getElementById('counterMemberMessage');
 if (message) {
 message.textContent = id.trim() && !member ? 'Member ID not found.' : '';
 }
 }

 function counterReturnAction(action) {
 const message = document.getElementById('counterTransactionMessage');
 const memberId = document.getElementById('counterMemberId');
 const accession = document.getElementById('counterAccn');
 const fine = document.getElementById('counterFineAmount');

 if (!memberId.value.trim()) {
 message.textContent = 'Enter the Member ID.';
 memberId.focus();
 return;
 }

 const member = dbMembers.find(item => item.id === memberId.value.trim());
 if (!member) {
 message.textContent = 'Enter a valid Member ID.';
 memberId.focus();
 return;
 }

 if (!accession.value.trim()) {
 message.textContent = 'Enter the book accession number.';
 accession.focus();
 return;
 }

 if (action === 'define') {
 message.textContent = 'Enter the fine amount. Saving the fine and return requires a connected book transaction database.';
 fine.focus();
 return;
 }

 if (action === 'collect') {
 if (!fine.checkValidity() || fine.value === '') {
 message.textContent = 'Enter a valid fine amount.';
 fine.reportValidity();
 fine.focus();
 return;
 }
 message.textContent = 'Fine collection and book return processed.';
 return;
 }

 message.textContent = 'Book returned successfully without fine.';
 }

 function loadModuleSubpage(module, title) {
 const card = document.getElementById('workspaceCard');

 /* --- EGATE MODULE --- */
 if (module === 'egate') {
 if (title === 'Gate Register') {
 card.innerHTML = `
 <div class="max-w-xl mx-auto w-full mt-4">
 <div class="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 overflow-hidden mb-6">
 <div class="bg-gradient-to-r from-[#0d47a1] to-[#1976d2] px-6 py-4 flex items-center justify-between">
 <h2 class="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-3">
 <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
 <path d="M3 4h4v2H5v2H3V4zm14 0h4v4h-2V6h-2V4zM3 16h2v2h2v2H3v-4zm14 4h2v-2h2v-4h2v6h-6v-2zM9 4h6v2H9V4zm0 14h6v2H9v-2zM5 9h2v6H5V9zm12 0h2v6h-2V9zm-8 0h6v6H9V9zm2 2v2h2v-2h-2z"/>
 </svg>
 eGATE SCANNER TERMINAL
 </h2>
 <span class="flex h-3 w-3 relative">
 <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
 <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
 </span>
 </div>

 <div class="p-10 bg-white">
 <form onsubmit="processGateScan(event)" class="space-y-8 text-center max-w-[360px] mx-auto">
 <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">Please scan barcode or enter Member ID</p>

 <div class="relative group">
 <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
 <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" />
 </svg>
 </div>
 <input id="gateMemberId" type="text" autocomplete="off" autofocus required placeholder="e.g. 110324104088" class="block w-full pl-12 pr-4 py-3.5 text-lg font-mono font-bold text-center border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all shadow-sm bg-white text-gray-800 placeholder-gray-300 outline-none">
 </div>

 <button type="submit" class="inline-flex items-center justify-center gap-2 px-8 py-2.5 bg-[#003366] hover:bg-blue-900 text-white text-sm font-bold rounded-lg shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0">
 Process Entry
 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
 </button>
 </form>
 </div>
 </div>

 <div id="gateScanResult" class="min-h-[200px]" aria-live="polite">
 <div class="flex flex-col items-center justify-center h-full text-gray-400 border-[1.5px] border-dashed border-gray-300 rounded-xl p-12 bg-[#fafafa]">
 <svg class="w-10 h-10 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
 </svg>
 <p class="text-[11px] font-bold tracking-widest uppercase text-gray-400">Waiting for scan...</p>
 </div>
 </div>
 </div>
 `;
 document.getElementById('gateMemberId').focus();
 return;
 }

 if (title === 'Visitor Log') {
 const uniqueBatches = [...new Set(visitorLogs.map(l => l.batch))].filter(Boolean);
 const batchOptions = uniqueBatches.map(b => `<option value="${escapeHtml(b)}">${escapeHtml(b)}</option>`).join('');

 card.innerHTML = `
 <div class="flex justify-between items-center mb-2">
 <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">VISITOR LOG</h2>
 <div class="flex items-center gap-3">
 <button id="checkoutAllBtn" onclick="checkOutAllOnCampus()" class="hidden px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded shadow text-xs transition-all flex items-center gap-2">
 <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
 Check Out All On Campus
 </button>
 <span class="text-xs text-gray-500 font-semibold bg-gray-100 px-3 py-1 rounded-full" id="vLogCount">${visitorLogs.length} entries</span>
 </div>
 </div>

 <div class="border border-gray-300 rounded-xl p-4 bg-gray-50/60 shadow-sm text-xs w-full mb-4">
 <p class="text-gray-700 font-bold mb-3 flex items-center gap-2">Filter Visitor Logs</p>
 <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
 <div class="flex flex-col space-y-1">
 <label class="font-semibold text-gray-600">ID / Name</label>
 <input type="text" id="vFilterId" oninput="filterVisitorLogs()" placeholder="Search ID or Name..." class="px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-inner transition-colors duration-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600">
 </div>
 <div class="flex flex-col space-y-1">
 <label class="font-semibold text-gray-600">Batch</label>
 <select id="vFilterBatch" onchange="filterVisitorLogs()" class="px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-inner transition-colors duration-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600">
 <option value="">- All Batches -</option>
 ${batchOptions}
 </select>
 </div>
 <div class="flex flex-col space-y-1">
 <label class="font-semibold text-gray-600">Date / Time</label>
 <input type="text" id="vFilterTime" oninput="filterVisitorLogs()" placeholder="e.g., 10/1/2026" class="px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-inner transition-colors duration-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600">
 </div>
 <div class="flex flex-col space-y-1">
 <label class="font-semibold text-gray-600">Status</label>
 <select id="vFilterStatus" onchange="filterVisitorLogs()" class="px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-inner transition-colors duration-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600">
 <option value="">- All Statuses -</option>
 <option value="in">Currently On Campus</option>
 <option value="out">Checked Out</option>
 </select>
 </div>
 </div>
 </div>
 <div class="w-full overflow-hidden border border-gray-300 rounded-xl bg-white shadow-sm flex flex-col max-h-[450px]">
 <div class="overflow-x-auto overflow-y-auto">
 <table class="w-full min-w-[850px] border-collapse text-left text-[11px]">
 <thead class="sticky top-0 z-10 bg-gray-100 uppercase text-gray-700 shadow-sm">
 <tr>
 <th class="border-r border-b border-gray-300 p-3">Member ID</th>
 <th class="border-r border-b border-gray-300 p-3">Name</th>
 <th class="border-r border-b border-gray-300 p-3">Department</th>
 <th class="border-r border-b border-gray-300 p-3">Batch</th>
 <th class="border-r border-b border-gray-300 p-3">Entry Date</th>
 <th class="border-r border-b border-gray-300 p-3">Check-In</th>
 <th class="border-b border-gray-300 p-3">Check-Out</th>
 </tr>
 </thead>
 <tbody id="visitorLogTableBody">
 ${renderVisitorLogRows()}
 </tbody>
 </table>
 </div>
 </div>
 `;
 return;
 }

 if (title === 'Summary') {
 card.innerHTML = `
 <div class="flex justify-between items-center mb-4">
 <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">VISITOR SUMMARY REPORT</h2>
 </div>
 <div class="border border-gray-300 rounded-xl p-6 bg-white shadow-sm text-xs w-full mb-6">
 <div class="flex flex-wrap items-end gap-4">
 <div class="flex flex-col space-y-1">
 <label class="font-semibold text-gray-600">From Date</label>
 <input type="date" id="summaryFromDate" class="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
 </div>
 <div class="flex flex-col space-y-1">
 <label class="font-semibold text-gray-600">From Time</label>
 <input type="time" id="summaryFromTime" class="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
 </div>
 <div class="flex flex-col space-y-1">
 <label class="font-semibold text-gray-600">To Date</label>
 <input type="date" id="summaryToDate" class="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
 </div>
 <div class="flex flex-col space-y-1">
 <label class="font-semibold text-gray-600">To Time</label>
 <input type="time" id="summaryToTime" class="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
 </div>
 <div class="flex gap-2">
 <button onclick="generateSummaryReport()" class="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded shadow transition-colors">Search Logs</button>
 <button onclick="resetSummaryReport()" class="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded shadow transition-colors">Reset</button>
 </div>

 <div class="ml-auto flex gap-2">
 <button onclick="exportSummaryPDF()" class="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded shadow flex items-center gap-2">
 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
 Download PDF
 </button>
 </div>
 </div>
 </div>

 <div class="border border-gray-300 rounded bg-white shadow-sm overflow-hidden w-full min-h-[300px] flex flex-col" id="summaryPrintArea">
 <div id="pdfHeader" class="p-4 bg-gray-50 border-b border-gray-200 hidden">
 <h2 class="text-lg font-bold text-center text-gray-900">GRT Institute Of Engineering And Technology</h2>
 <h3 class="text-md font-semibold text-center text-gray-700">eGate Visitor Summary Report</h3>
 <p class="text-xs text-center text-gray-500" id="printDateRange"></p>
 </div>
 <div class="overflow-x-auto">
 <table class="w-full text-left border-collapse text-[11px]">
 <thead class="bg-gray-100 text-gray-700 uppercase border-b border-gray-300">
 <tr>
 <th class="p-3 border-r">Date</th>
 <th class="p-3 border-r">Member ID</th>
 <th class="p-3 border-r">Name</th>
 <th class="p-3 border-r">Batch/Role</th>
 <th class="p-3 border-r">Check-In</th>
 <th class="p-3">Check-Out</th>
 </tr>
 </thead>
 <tbody id="summaryTableBody">
 <tr><td colspan="6" class="text-center py-12 text-gray-400 italic">Select a date/time range and click Search Logs</td></tr>
 </tbody>
 </table>
 </div>
 </div>
 `;
 return;
 }


 }

 /* --- CIRCULATION MODULE --- */
 if (module === 'circulation') {
 if (title === 'Counter Transaction') {
 loadCounterTransaction();
 return;
 }

 
if (title === 'Issue') {

    /*
     * ========================================================
     * ISSUE WORKFLOW - PAGE 1
     * MEMBER DETAILS
     * ========================================================
     */

    card.innerHTML = `
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            <div class="px-6 py-5 border-b border-slate-200 bg-slate-50">
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <h2 class="text-xl font-bold text-slate-800">
                            Issue Book
                        </h2>
                        <p class="text-sm text-slate-500 mt-1">
                            Step 1 of 3 — Enter Member Details
                        </p>
                    </div>

                    <div class="flex items-center gap-2 text-xs font-semibold">
                        <span class="px-3 py-1.5 rounded-full bg-blue-600 text-white">
                            1 Member
                        </span>
                        <span class="text-slate-400">→</span>
                        <span class="px-3 py-1.5 rounded-full bg-slate-100 text-slate-500">
                            2 Book
                        </span>
                        <span class="text-slate-400">→</span>
                        <span class="px-3 py-1.5 rounded-full bg-slate-100 text-slate-500">
                            3 Active Circulation
                        </span>
                    </div>
                </div>
            </div>

            <form id="grtIssueMemberStepForm"
                  onsubmit="grtIssueGoToBookPage(event)"
                  class="p-6">

                <div class="max-w-3xl mx-auto">

                    <div class="mb-6">
                        <h3 class="text-lg font-bold text-slate-800">
                            Member Details
                        </h3>
                        <p class="text-sm text-slate-500 mt-1">
                            Enter or scan the Member ID. Member information will be filled automatically.
                        </p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">
                                Member ID
                            </label>

                            <input
                                type="text"
                                id="issueMemberId"
                                required
                                autocomplete="off"
                                placeholder="Enter / scan Member ID"
                                oninput="grtIssueMemberLookup()"
                                class="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                            >
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">
                                Member Name
                            </label>

                            <input
                                type="text"
                                id="issueMemberName"
                                readonly
                                class="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl"
                            >
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">
                                Batch
                            </label>

                            <input
                                type="text"
                                id="issueMemberBatch"
                                readonly
                                class="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl"
                            >
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">
                                Member Type
                            </label>

                            <input
                                type="text"
                                id="issueMemberType"
                                readonly
                                class="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl"
                            >
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">
                                Department
                            </label>

                            <input
                                type="text"
                                id="issueMemberDepartment"
                                readonly
                                class="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl"
                            >
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">
                                Section / Group
                            </label>

                            <input
                                type="text"
                                id="issueMemberGroup"
                                readonly
                                class="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl"
                            >
                        </div>

                    </div>

                    <div class="mt-6 flex items-center gap-4">

                        <div
                            id="issueMemberPhotoPlaceholder"
                            class="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center text-xs text-slate-400"
                        >
                            NO PHOTO
                        </div>

                        <img
                            id="issueMemberPhoto"
                            class="hidden w-20 h-20 rounded-xl object-cover border border-slate-200"
                            alt="Member Photo"
                        >

                        <div>
                            <p class="text-sm font-semibold text-slate-700">
                                Member Verification
                            </p>

                            <p
                                id="issueMemberMessage"
                                class="text-sm text-slate-500 mt-1"
                            >
                                Enter a valid Member ID.
                            </p>
                        </div>

                    </div>

                    <div class="mt-8 flex justify-end">

                        <button
                            type="submit"
                            id="grtIssueNextToBookBtn"
                            class="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                        >
                            Next →
                        </button>

                    </div>

                </div>
            </form>
        </div>
    `;

    return;
}

if (title === 'Active Circulation') {

    /*
     * ========================================================
     * ISSUE WORKFLOW - PAGE 3
     * ACTIVE CIRCULATION
     * ========================================================
     */

    const activeIssues = Array.isArray(dbIssues)
        ? dbIssues.filter(i =>
            String(i.status || '').toLowerCase() === 'issued'
        )
        : [];

    const rows = activeIssues.length
        ? activeIssues.map((issue, index) => `
            <tr class="border-b border-slate-100">
                <td class="px-4 py-4 text-sm text-slate-600">
                    ${index + 1}
                </td>

                <td class="px-4 py-4">
                    <div class="font-semibold text-slate-800">
                        ${issue.accn || '-'}
                    </div>
                </td>

                <td class="px-4 py-4">
                    <div class="font-semibold text-slate-800">
                        ${issue.title || '-'}
                    </div>
                </td>

                <td class="px-4 py-4">
                    <div class="font-semibold text-slate-800">
                        ${issue.memberName || '-'}
                    </div>
                    <div class="text-xs text-slate-500 mt-1">
                        ${issue.memberId || '-'}
                    </div>
                </td>

                <td class="px-4 py-4 text-sm text-slate-600">
                    ${issue.issueDate || '-'}
                </td>

                <td class="px-4 py-4 text-sm text-slate-600">
                    ${issue.dueDate || '-'}
                </td>

                <td class="px-4 py-4">
                    <span class="inline-flex px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                        ISSUED
                    </span>
                </td>
            </tr>
        `).join('')
        : `
            <tr>
                <td colspan="7" class="px-6 py-12 text-center text-slate-500">
                    No active circulated books found.
                </td>
            </tr>
        `;

    card.innerHTML = `
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            <div class="px-6 py-5 border-b border-slate-200 bg-slate-50">

                <div class="flex items-center justify-between gap-4">

                    <div>
                        <h2 class="text-xl font-bold text-slate-800">
                            Active Circulation
                        </h2>

                        <p class="text-sm text-slate-500 mt-1">
                            Step 3 of 3 — Currently Circulated Books
                        </p>
                    </div>

                    <span class="px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-bold">
                        ${activeIssues.length} Active
                    </span>

                </div>

            </div>

            <div class="p-6">

                <div class="overflow-x-auto">

                    <table class="w-full text-left">

                        <thead>
                            <tr class="border-b border-slate-200">

                                <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase">
                                    #
                                </th>

                                <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase">
                                    Accession No.
                                </th>

                                <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase">
                                    Book
                                </th>

                                <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase">
                                    Member
                                </th>

                                <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase">
                                    Issue Date
                                </th>

                                <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase">
                                    Due Date
                                </th>

                                <th class="px-4 py-3 text-xs font-bold text-slate-500 uppercase">
                                    Status
                                </th>

                            </tr>
                        </thead>

                        <tbody>
                            ${rows}
                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    `;

    return;
}

if (title === 'Return') {
 const activeIssues = dbIssues.filter(i => i.status === "Issued");
 const returnRows = activeIssues.map(i => {
 const today = new Date();
 const due = new Date(i.dueDate);
 const isOverdue = today > due;
 const diffDays = isOverdue ? Math.ceil((today - due) / (1000 * 60 * 60 * 24)) : 0;
 return `
 <tr class="hover:bg-gray-50 border-b">
 <td class="p-2 font-mono font-bold text-blue-900 border-r">${escapeHtml(i.accn)}</td>
 <td class="p-2 font-semibold border-r">${escapeHtml(i.title)}</td>
 <td class="p-2 font-mono border-r">${escapeHtml(i.memberId)}</td>
 <td class="p-2 border-r">${escapeHtml(i.memberName)}</td>
 <td class="p-2 border-r font-bold ${isOverdue ? 'text-rose-600' : 'text-gray-700'}">${escapeHtml(i.dueDate)}</td>
 <td class="p-2 border-r">
 <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isOverdue ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}">
 ${isOverdue ? `${diffDays} Days Overdue (₹${diffDays * 2})` : 'Normal'}
 </span>
 </td>
 <td class="p-2 text-center">
 <button onclick="processReturnBook('${i.accn}')" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-sm text-xs">Return</button>
 </td>
 </tr>
 `;
 }).join('');

 card.innerHTML = `
 <div class="flex justify-between items-center mb-2">
 <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">BOOK RETURN DESK</h2>
 <span class="text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">${activeIssues.length} Awaiting Return</span>
 </div>

 <div class="border border-gray-300 rounded bg-white shadow-sm overflow-hidden w-full max-w-5xl flex flex-col">
 <table class="w-full text-left border-collapse text-[11px]">
 <thead class="bg-gray-100 text-gray-700 uppercase border-b border-gray-300">
 <tr>
 <th class="p-2 border-r">Accession</th>
 <th class="p-2 border-r">Title</th>
 <th class="p-2 border-r">Member ID</th>
 <th class="p-2 border-r">Member Name</th>
 <th class="p-2 border-r">Due Date</th>
 <th class="p-2 border-r">Overdue Status</th>
 <th class="p-2 text-center">Action</th>
 </tr>
 </thead>
 <tbody>
 ${returnRows.length > 0 ? returnRows : `<tr><td colspan="7" class="text-center py-12 text-gray-400 italic">No issued books pending return!</td></tr>`}
 </tbody>
 </table>
 </div>
 `;
 return;
 }

 if (title === 'Renewal') {
 const activeIssues = dbIssues.filter(i => i.status === "Issued");
 const renewalRows = activeIssues.map(i => `
 <tr class="hover:bg-gray-50 border-b">
 <td class="p-2 font-mono font-bold text-blue-900 border-r">${escapeHtml(i.accn)}</td>
 <td class="p-2 font-semibold border-r">${escapeHtml(i.title)}</td>
 <td class="p-2 font-mono border-r">${escapeHtml(i.memberId)}</td>
 <td class="p-2 border-r">${escapeHtml(i.memberName)}</td>
 <td class="p-2 border-r">${escapeHtml(i.dueDate)}</td>
 <td class="p-2 border-r font-bold ${i.renewals >= 2 ? 'text-rose-600' : 'text-blue-800'}">${i.renewals} / 2</td>
 <td class="p-2 text-center">
 <button onclick="processRenewalBook('${i.accn}')" ${i.renewals >= 2 ? 'disabled' : ''} class="px-3 py-1 ${i.renewals >= 2 ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-blue-700 hover:bg-blue-800 text-white'} font-bold rounded shadow-sm text-xs">
 ${i.renewals >= 2 ? 'Max Limit' : 'Renew (+14 Days)'}
 </button>
 </td>
 </tr>
 `).join('');

 card.innerHTML = `
 <div class="flex justify-between items-center mb-2">
 <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">BOOK RENEWALS</h2>
 </div>
 <div class="border border-gray-300 rounded bg-white shadow-sm overflow-hidden w-full max-w-5xl flex flex-col">
 <table class="w-full text-left border-collapse text-[11px]">
 <thead class="bg-gray-100 text-gray-700 uppercase border-b border-gray-300">
 <tr>
 <th class="p-2 border-r">Accession</th>
 <th class="p-2 border-r">Title</th>
 <th class="p-2 border-r">Member ID</th>
 <th class="p-2 border-r">Member Name</th>
 <th class="p-2 border-r">Current Due Date</th>
 <th class="p-2 border-r">Renewals Done</th>
 <th class="p-2 text-center">Action</th>
 </tr>
 </thead>
 <tbody>
 ${renewalRows.length > 0 ? renewalRows : `<tr><td colspan="7" class="text-center py-12 text-gray-400 italic">No books available for renewal.</td></tr>`}
 </tbody>
 </table>
 </div>
 `;
 return;
 }

 if (title === 'Reservation') {
 const resRows = dbReservations.map(r => `
 <tr class="hover:bg-gray-50 border-b">
 <td class="p-2 font-mono font-bold text-blue-900 border-r">${escapeHtml(r.accn)}</td>
 <td class="p-2 font-semibold border-r">${escapeHtml(r.title)}</td>
 <td class="p-2 font-mono border-r">${escapeHtml(r.memberId)}</td>
 <td class="p-2 border-r">${escapeHtml(r.memberName)}</td>
 <td class="p-2 border-r">${escapeHtml(r.reserveDate)}</td>
 <td class="p-2 border-r"><span class="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded text-[10px]">${r.status}</span></td>
 <td class="p-2 text-center">
 <button onclick="cancelReservation(${r.id})" class="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded shadow-sm text-xs">Cancel</button>
 </td>
 </tr>
 `).join('');

 card.innerHTML = `
 <div class="flex justify-between items-center mb-2">
 <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">BOOK RESERVATION / HOLD LIST</h2>
 </div>

 <form onsubmit="processReservationBook(event)" class="border border-gray-300 rounded-xl p-5 bg-gray-50/70 shadow-sm text-xs w-full max-w-4xl space-y-4">
 <p class="text-gray-800 font-bold">Place New Reservation for Circulated Book</p>
 <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div class="flex flex-col space-y-1">
 <label class="font-semibold text-gray-700">*Member ID</label>
 <input type="text" id="resMemberId" required placeholder="Enter Member ID (e.g. 110324104086)" class="px-3 py-2 bg-white border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600">
 </div>
 <div class="flex flex-col space-y-1">
 <label class="font-semibold text-gray-700">*Book Accession No</label>
 <input type="text" id="resAccn" required placeholder="Accession No (e.g. CS1001)" class="px-3 py-2 bg-white border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 uppercase">
 </div>
 </div>
 <div class="pt-2 flex justify-end">
 <button type="submit" class="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded shadow transition-all">Reserve Book</button>
 </div>
 </form>

 <div class="border border-gray-300 rounded bg-white shadow-sm overflow-hidden w-full max-w-5xl mt-3 flex flex-col">
 <table class="w-full text-left border-collapse text-[11px]">
 <thead class="bg-gray-100 text-gray-700 uppercase border-b border-gray-300">
 <tr>
 <th class="p-2 border-r">Accession</th>
 <th class="p-2 border-r">Title</th>
 <th class="p-2 border-r">Member ID</th>
 <th class="p-2 border-r">Member Name</th>
 <th class="p-2 border-r">Reserved Date</th>
 <th class="p-2 border-r">Status</th>
 <th class="p-2 text-center">Action</th>
 </tr>
 </thead>
 <tbody>
 ${resRows.length > 0 ? resRows : `<tr><td colspan="7" class="text-center py-12 text-gray-400 italic">No active book reservations.</td></tr>`}
 </tbody>
 </table>
 </div>
 `;
 return;
 }

 
/* GRT_FINE_SETTINGS_SAFE_V2 */

const GRT_FINE_SETTINGS_KEY = 'GRT_FINE_SETTINGS';

function grtGetFineSettings() {
    try {
        const saved = localStorage.getItem(GRT_FINE_SETTINGS_KEY);
        const data = saved ? JSON.parse(saved) : {};

        return {
            loanDays: Math.max(1, Math.min(365, Number(data.loanDays) || 14)),
            finePerDay: Math.max(0, Math.min(10000, Number(data.finePerDay) || 2))
        };
    } catch (error) {
        return {
            loanDays: 14,
            finePerDay: 2
        };
    }
}

function grtGetLoanDays() {
    return grtGetFineSettings().loanDays;
}

function grtGetFinePerDay() {
    return grtGetFineSettings().finePerDay;
}

function grtOpenFineSettings() {
    const old = document.getElementById('grtFineSettingsModal');

    if (old) {
        old.remove();
    }

    const settings = grtGetFineSettings();

    const modal = document.createElement('div');

    modal.id = 'grtFineSettingsModal';

    modal.className =
        'fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4';

    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md">

            <div class="bg-blue-800 text-white px-5 py-4">
                <h2 class="text-lg font-bold">
                    Fine Collection Settings
                </h2>

                <p class="text-xs text-blue-100 mt-1">
                    Change due period and fine amount
                </p>
            </div>

            <div class="p-5 space-y-5">

                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">
                        Loan / Due Period
                    </label>

                    <div class="flex items-center gap-2">
                        <input
                            id="grtFineLoanDays"
                            type="number"
                            min="1"
                            max="365"
                            value="${settings.loanDays}"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >

                        <span class="text-sm font-semibold">
                            Days
                        </span>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">
                        Fine per Overdue Day
                    </label>

                    <div class="flex items-center gap-2">
                        <span class="font-bold">₹</span>

                        <input
                            id="grtFinePerDay"
                            type="number"
                            min="0"
                            max="10000"
                            step="0.01"
                            value="${settings.finePerDay}"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >

                        <span class="text-sm font-semibold">
                            / day
                        </span>
                    </div>
                </div>

            </div>

            <div class="px-5 py-4 bg-gray-50 border-t flex justify-end gap-3">

                <button
                    type="button"
                    id="grtFineSettingsCancel"
                    class="px-4 py-2 rounded-lg border border-gray-300 font-semibold"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    id="grtFineSettingsSave"
                    class="px-5 py-2 rounded-lg bg-blue-700 text-white font-bold"
                >
                    Save Settings
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(modal);

    document
        .getElementById('grtFineSettingsCancel')
        .onclick = function () {
            modal.remove();
        };

    document
        .getElementById('grtFineSettingsSave')
        .onclick = function () {

            const loanDays =
                Number(document.getElementById('grtFineLoanDays').value);

            const finePerDay =
                Number(document.getElementById('grtFinePerDay').value);

            if (!Number.isFinite(loanDays) || loanDays < 1 || loanDays > 365) {
                alert('Enter a due period between 1 and 365 days.');
                return;
            }

            if (!Number.isFinite(finePerDay) || finePerDay < 0 || finePerDay > 10000) {
                alert('Enter a fine amount between ₹0 and ₹10,000 per day.');
                return;
            }

            localStorage.setItem(
                GRT_FINE_SETTINGS_KEY,
                JSON.stringify({
                    loanDays: loanDays,
                    finePerDay: finePerDay
                })
            );

            modal.remove();

            alert('Fine Collection settings saved successfully.');

            if (typeof loadModuleSubpage === 'function') {
                loadModuleSubpage('circulation', 'Fine Collection');
            }
        };
}

/* END GRT_FINE_SETTINGS_SAFE_V2 */


if (title === 'Settings') {
    const settings = grtGetFineSettings();

    subpage.innerHTML = `
        <div class="max-w-3xl mx-auto">
            <div class="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
                <div class="bg-blue-800 text-white px-6 py-5">
                    <h2 class="text-xl font-bold">Circulation Settings</h2>
                    <p class="text-sm text-blue-100 mt-1">
                        Configure loan period and overdue fine amount.
                    </p>
                </div>

                <div class="p-6 space-y-6">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">
                            Loan / Due Period (Days)
                        </label>
                        <input
                            id="grtSettingsLoanDays"
                            type="number"
                            min="1"
                            max="365"
                            value="${settings.loanDays}"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                        <p class="text-xs text-gray-500 mt-1">
                            Example: 14 days
                        </p>
                    </div>

                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">
                            Fine per Overdue Day (₹)
                        </label>
                        <input
                            id="grtSettingsFinePerDay"
                            type="number"
                            min="0"
                            max="10000"
                            step="0.01"
                            value="${settings.finePerDay}"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                        <p class="text-xs text-gray-500 mt-1">
                            Example: ₹2 per overdue day
                        </p>
                    </div>

                    <div class="flex justify-end">
                        <button
                            type="button"
                            onclick="grtSaveCirculationSettings()"
                            class="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg"
                        >
                            Save Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    return;
}

if (title === 'Fine Collection') {
 const totalPending = dbFines.filter(f => f.status === 'Pending').reduce((acc, f) => acc + f.fineAmount, 0);
 const fineRows = dbFines.map(f => `
 <tr class="hover:bg-gray-50 border-b">
 <td class="p-2 font-mono font-bold text-blue-900 border-r">${escapeHtml(f.memberId)}</td>
 <td class="p-2 font-semibold border-r">${escapeHtml(f.memberName)}</td>
 <td class="p-2 font-mono border-r">${escapeHtml(f.accn)}</td>
 <td class="p-2 font-bold text-rose-700 border-r">₹${f.fineAmount.toFixed(2)}</td>
 <td class="p-2 text-gray-600 border-r">${escapeHtml(f.reason)}</td>
 <td class="p-2 border-r">
 <span class="px-2 py-0.5 rounded text-[10px] font-bold ${f.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
 ${f.status}
 </span>
 </td>
 <td class="p-2 border-r">${f.collectedDate}</td>
 <td class="p-2 text-center">
 ${f.status === 'Pending' ? `
 <button onclick="collectFine(${f.id})" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-sm text-xs">Collect Fine</button>
 ` : `<span class="text-gray-400 font-bold">Settled</span>`}
 </td>
 </tr>
 `).join('');

 card.innerHTML = `
 <div class="flex justify-between items-center mb-2">
 <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">FINE COLLECTION REGISTER</h2>
 <span class="text-xs text-rose-700 font-bold bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">Total Pending: ₹${totalPending.toFixed(2)}</span>
 </div>

 <div class="border border-gray-300 rounded bg-white shadow-sm overflow-hidden w-full max-w-5xl flex flex-col">
 <table class="w-full text-left border-collapse text-[11px]">
 <thead class="bg-gray-100 text-gray-700 uppercase border-b border-gray-300">
 <tr>
 <th class="p-2 border-r">Member ID</th>
 <th class="p-2 border-r">Member Name</th>
 <th class="p-2 border-r">Accession No</th>
 <th class="p-2 border-r">Fine (₹)</th>
 <th class="p-2 border-r">Reason</th>
 <th class="p-2 border-r">Status</th>
 <th class="p-2 border-r">Payment Date</th>
 <th class="p-2 text-center">Action</th>
 </tr>
 </thead>
 <tbody>
 ${fineRows.length > 0 ? fineRows : `<tr><td colspan="8" class="text-center py-12 text-gray-400 italic">No fines on record.</td></tr>`}
 </tbody>
 </table>
 </div>
 `;
 return;
 }
 }

 /* --- CATALOGUE MODULE --- */
 if (module === 'catalogue') {
 if (title === 'Book Entry') {
 const bookRows = dbBooks.map(b => `
 <tr class="hover:bg-gray-50 border-b">
 <td class="p-2 font-mono font-bold text-blue-900 border-r">${escapeHtml(b.accn)}</td>
 <td class="p-2 font-semibold border-r">${escapeHtml(b.title)}</td>
 <td class="p-2 border-r">${escapeHtml(b.author)}</td>
 <td class="p-2 border-r">${escapeHtml(b.publisher)}</td>
 <td class="p-2 border-r">${escapeHtml(b.edition)}</td>
 <td class="p-2 text-center whitespace-nowrap">
   <button
     type="button"
     onclick="editCatalogueBook('${String(b.accn).replace("'", "\\'")}')"
     class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-[10px] mr-1">
     Edit
   </button>

   <button
     type="button"
     onclick="deleteCatalogueBook('${String(b.accn).replace("'", "\\'")}')"
     class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-[10px]">
     Delete
   </button>
 </td>
 </tr>
 `).join('');

 card.innerHTML = `
 <div class="flex justify-between items-center mb-2">
 <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">BOOK ENTRY & CATALOGUE CATALOG</h2>
 <span class="text-xs text-blue-700 font-bold bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">${dbBooks.length} Total Titles</span>
 </div>

 <form onsubmit="return saveNewBookEntry(event)" class="border border-gray-300 rounded-xl p-4 bg-gray-50/70 shadow-sm text-xs w-full max-w-4xl space-y-3 mb-4">
 <p class="text-gray-800 font-bold">Add New Book Entry</p>
 <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
 <input id="catalogueAccession" type="text" placeholder="Accession No (e.g. CS1003)" required class="px-3 py-2 bg-white border border-gray-300 rounded">
 <input id="catalogueTitle" type="text" placeholder="Book Title" required class="px-3 py-2 bg-white border border-gray-300 rounded">
 <input id="catalogueAuthor" type="text" placeholder="Author(s)" required class="px-3 py-2 bg-white border border-gray-300 rounded">
 <input id="cataloguePublisher" type="text" placeholder="Publisher" class="px-3 py-2 bg-white border border-gray-300 rounded">
 <input id="catalogueEdition" type="text" placeholder="Edition" class="px-3 py-2 bg-white border border-gray-300 rounded">
 </div>
 <div class="flex justify-end">
 <button type="submit" class="px-5 py-1.5 bg-blue-700 text-white font-bold rounded shadow text-xs">Save Book Entry</button>
 <button type="button"
 onclick="openBulkBookImportModal()"
 class="px-5 py-1.5 hover: text-white font-bold rounded shadow text-xs bg-red-600 hover:bg-red-700" style="background-color:#dc2626 !important;">
 Bulk Book Entry
 </button>

 </div>
 </form>

 <div class="border border-gray-300 rounded bg-white shadow-sm overflow-hidden w-full max-w-5xl flex flex-col">
 <table class="w-full text-left border-collapse text-[11px]">
 <thead class="bg-gray-100 text-gray-700 uppercase border-b">
 <tr>
 <th class="p-2 border-r">Accn No</th>
 <th class="p-2 border-r">Title</th>
 <th class="p-2 border-r">Author</th>
 <th class="p-2 border-r">Publisher</th>
 <th class="p-2 border-r">Edition</th>
 <th class="p-2 text-center">Action</th>
 </tr>
 </thead>
 <tbody>${bookRows}</tbody>
 </table>
 </div>
 `;
 return;
 }

 if (title === 'Author Master') {
 card.innerHTML = `
 <div class="flex justify-between items-center mb-2">
 <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">AUTHOR MASTER DIRECTORY</h2>
 </div>
 <div class="border border-gray-300 rounded bg-white shadow-sm overflow-hidden w-full max-w-3xl p-4 space-y-3">
 <div class="flex gap-2">
 <input type="text" placeholder="Enter Author Name (e.g. Cormen, Leiserson)" class="flex-1 px-3 py-2 border rounded text-xs">
 <button onclick="alert('Author added successfully!')" class="px-4 py-2 bg-blue-700 text-white font-bold rounded text-xs">Add Author</button>
 </div>
 <table class="w-full text-left border-collapse text-[11px] mt-2">
 <thead class="bg-gray-100 uppercase"><tr><th class="p-2 border-r">Author Name</th><th class="p-2">Total Books</th></tr></thead>
 <tbody>
 <tr class="border-b"><td class="p-2 border-r font-semibold">Cormen, Leiserson, Rivest</td><td class="p-2">1</td></tr>
 <tr class="border-b"><td class="p-2 border-r font-semibold">Stuart Russell, Peter Norvig</td><td class="p-2">1</td></tr>
 <tr class="border-b"><td class="p-2 border-r font-semibold">Silberschatz, Korth, Sudarshan</td><td class="p-2">1</td></tr>
 </tbody>
 </table>
 </div>
 `;
 return;
 }

 if (title === 'Publisher Master') {
 card.innerHTML = `
 <div class="flex justify-between items-center mb-2">
 <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">PUBLISHER MASTER DIRECTORY</h2>
 </div>
 <div class="border border-gray-300 rounded bg-white shadow-sm overflow-hidden w-full max-w-3xl p-4 space-y-3">
 <div class="flex gap-2">
 <input type="text" placeholder="Enter Publisher Name (e.g. Pearson, MIT Press)" class="flex-1 px-3 py-2 border rounded text-xs">
 <button onclick="alert('Publisher added successfully!')" class="px-4 py-2 bg-blue-700 text-white font-bold rounded text-xs">Add Publisher</button>
 </div>
 <table class="w-full text-left border-collapse text-[11px] mt-2">
 <thead class="bg-gray-100 uppercase"><tr><th class="p-2 border-r">Publisher Name</th><th class="p-2">Status</th></tr></thead>
 <tbody>
 <tr class="border-b"><td class="p-2 border-r font-semibold">MIT Press</td><td class="p-2 text-emerald-700 font-bold">Active</td></tr>
 <tr class="border-b"><td class="p-2 border-r font-semibold">Pearson</td><td class="p-2 text-emerald-700 font-bold">Active</td></tr>
 <tr class="border-b"><td class="p-2 border-r font-semibold">McGraw-Hill</td><td class="p-2 text-emerald-700 font-bold">Active</td></tr>
 </tbody>
 </table>
 </div>
 `;
 return;
 }

 if (title === 'Subject Master') {
 card.innerHTML = `
 <div class="flex justify-between items-center mb-2">
 <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">SUBJECT MASTER DIRECTORY</h2>
 </div>
 <div class="border border-gray-300 rounded bg-white shadow-sm overflow-hidden w-full max-w-3xl p-4 space-y-3">
 <div class="flex gap-2">
 <input type="text" placeholder="Enter Subject Category" class="flex-1 px-3 py-2 border rounded text-xs">
 <button onclick="alert('Subject added successfully!')" class="px-4 py-2 bg-blue-700 text-white font-bold rounded text-xs">Add Subject</button>
 </div>
 <table class="w-full text-left border-collapse text-[11px] mt-2">
 <thead class="bg-gray-100 uppercase"><tr><th class="p-2 border-r">Subject Name</th><th class="p-2">Department</th></tr></thead>
 <tbody>
 <tr class="border-b"><td class="p-2 border-r font-semibold">Computer Science & Algorithms</td><td class="p-2">CSE</td></tr>
 <tr class="border-b"><td class="p-2 border-r font-semibold">Artificial Intelligence & Machine Learning</td><td class="p-2">AI & DS</td></tr>
 <tr class="border-b"><td class="p-2 border-r font-semibold">Database Systems</td><td class="p-2">IT</td></tr>
 </tbody>
 </table>
 </div>
 `;
 return;
 }

 }


 /* --- ADMIN MODULE --- */
 if (module === 'admin') {
 if (title === 'System Settings') {
 card.innerHTML = `
 <div class="flex justify-between items-center mb-2">
 <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">ADMINISTRATION & SECURITY (SYSTEM SETTINGS & PASSWORD CHANGE)</h2>
 </div>

 <div class="relative overflow-hidden border border-slate-200/90 rounded-2xl bg-gradient-to-br from-white via-slate-50/50 to-blue-50/20 shadow-xl p-8 w-full max-w-3xl space-y-6">
 <div class="absolute -right-12 -top-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

 <div class="flex items-center space-x-4 border-b border-slate-200/80 pb-5">
 <div class="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-700 shadow-inner shrink-0">
 <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
 </div>
 <div>
 <h3 class="text-base font-black text-slate-900 tracking-tight">Change Admin Password</h3>
 <p class="text-xs text-slate-500 mt-0.5">Secure your administrator account by enforcing robust master credentials.</p>
 </div>
 </div>

 <form onsubmit="updateAdminPassword(event)" class="space-y-4 text-xs">
 <div class="space-y-1.5">
 <label class="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">Current Password</label>
 <div class="relative">
 <input type="password" id="currAdminPass" required placeholder="••••••••••••" class="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 pr-10">
 <button type="button" onclick="togglePassword('currAdminPass', 'eyeCurr')" class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
 <svg id="eyeCurr" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
 </button>
 </div>
 </div>

 <div class="space-y-1.5">
 <label class="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">New Password</label>
 <div class="relative">
 <input type="password" id="newAdminPass" required placeholder="••••••••••••" oninput="updatePasswordStrengthIndicator(this.value)" class="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 pr-10">
 <button type="button" onclick="togglePassword('newAdminPass', 'eyeNew')" class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
 <svg id="eyeNew" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
 </button>
 </div>
 <div class="flex items-center justify-between pt-1 px-1">
 <div class="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
 <div id="pwStrengthBar" class="h-full w-0 transition-all duration-300 rounded-full"></div>
 </div>
 <span id="pwStrengthText" class="text-[11px] text-gray-400 font-bold">Enter new password</span>
 </div>
 </div>

 <div class="space-y-1.5">
 <label class="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">Confirm New Password</label>
 <div class="relative">
 <input type="password" id="confirmAdminPass" required placeholder="••••••••••••" class="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 pr-10">
 <button type="button" onclick="togglePassword('confirmAdminPass', 'eyeConfirm')" class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
 <svg id="eyeConfirm" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
 </button>
 </div>
 </div>

 <div class="pt-4 flex items-center justify-between border-t border-slate-200/80">
 <p class="text-[11px] text-slate-500 italic">Minimum 4 characters required for system updates.</p>
 <button type="submit" class="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 cursor-pointer active:scale-95">
 <svg id="settingsSpinner" class="w-4 h-4 animate-spin hidden" fill="none" viewBox="0 0 24 24">
 <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
 <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
 </svg>
 <span id="settingsBtnText">Update Password</span>
 </button>
 </div>
 </form>
 </div>
 `;
 return;
 }

 if (title === 'User Roles') {
 const roleRows = systemUserRoles.map(u => `
 <tr class="hover:bg-gray-50 border-b">
 <td class="p-2 font-mono font-bold text-blue-900 border-r">${escapeHtml(u.account)}</td>
 <td class="p-2 font-semibold border-r">${escapeHtml(u.role)}</td>
 <td class="p-2 text-gray-700 border-r">${escapeHtml(u.privileges)}</td>
 <td class="p-2 border-r"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${u.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">${escapeHtml(u.status)}</span></td>
 <td class="p-2 text-center">
 <button onclick="editUserRole(${u.id})" class="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-600 hover:text-white rounded shadow-sm font-bold transition-all flex items-center gap-1.5 mx-auto">
 <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
 Edit
 </button>
 </td>
 </tr>
 `).join('');

 card.innerHTML = `
 <div class="flex justify-between items-center mb-2">
 <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">ADMINISTRATION & SECURITY (USER ROLES)</h2>
 </div>
 <div class="border border-gray-300 rounded bg-white shadow-sm overflow-hidden w-full max-w-5xl p-4 space-y-3 text-xs">
 <p class="text-gray-700 font-semibold">Manage system operator roles and permission matrices for library staff.</p>
 <table class="w-full text-left border-collapse text-[11px] mt-2">
 <thead class="bg-gray-100 uppercase border-b">
 <tr>
 <th class="p-2 border-r">User Account</th>
 <th class="p-2 border-r">Assigned Role</th>
 <th class="p-2 border-r">Privileges</th>
 <th class="p-2 border-r">Status</th>
 <th class="p-2 text-center">Action</th>
 </tr>
 </thead>
 <tbody>${roleRows}</tbody>
 </table>
 </div>
 `;
 return;
 }

 if (title === 'Database Backup') {
 card.innerHTML = `
 <div class="flex justify-between items-center mb-2">
 <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">ADMINISTRATION & SECURITY (DATABASE BACKUP)</h2>
 </div>

 <div id="backupActiveCard" class="relative overflow-hidden border border-slate-200/90 rounded-2xl bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 shadow-xl p-8 w-full max-w-4xl space-y-6 transition-all duration-300">
 <div class="absolute -right-12 -top-12 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>

 <div class="flex items-start justify-between">
 <div class="flex items-center space-x-4">
 <div class="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600 shadow-inner">
 <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/></svg>
 </div>
 <div>
 <h3 class="text-base font-black text-slate-900 tracking-tight">Central Database Snapshot</h3>
 <p class="text-xs text-slate-500 mt-0.5">Securely backup members, catalog indices, circulation logs, and eGate attendance records.</p>
 </div>
 </div>
 <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full text-[11px] font-bold shadow-2xs">
 <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> System Healthy
 </span>
 </div>

 <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
 <div class="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
 <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Last Backup Time</span>
 <p class="text-sm font-bold text-slate-800 mt-1">Today, 12:30 AM</p>
 </div>
 <div class="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
 <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Archive Size</span>
 <p class="text-sm font-bold text-slate-800 mt-1 font-mono">4.8 MB (.SQL)</p>
 </div>
 <div class="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
 <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Encryption Status</span>
 <p class="text-sm font-bold text-emerald-700 mt-1 flex items-center gap-1">
 <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg> AES-256 Secured
 </p>
 </div>
 </div>

 <div class="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/60">
 <p class="text-xs text-slate-500 italic">Recommended: Export a fresh backup weekly before large student roll allocations.</p>
 <div class="flex items-center gap-3">
 <button onclick="triggerUniqueBackup()" class="group relative px-6 py-3 bg-gradient-to-r from-blue-700 to-[#004080] hover:from-blue-800 hover:to-blue-900 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 cursor-pointer active:scale-95">
 <svg id="backupSpinner" class="w-4 h-4 animate-spin hidden" fill="none" viewBox="0 0 24 24">
 <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
 <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
 </svg>
 <span id="backupBtnText">📥 Download Backup Archive (.sql)</span>
 </button>
 </div>
 </div>
 </div>
 `;
 return;
 }

 if (title === 'Audit Logs') {
 card.innerHTML = `
 <div class="flex justify-between items-center mb-2">
 <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">ADMINISTRATION & SECURITY (AUDIT LOGS)</h2>
 </div>
 <div class="border border-gray-300 rounded bg-white shadow-sm overflow-hidden w-full max-w-5xl p-4 space-y-3 text-xs">
 <p class="text-gray-700 font-semibold">Review security event histories and administrative actions.</p>
 <table class="w-full text-left border-collapse text-[11px] mt-2">
 <thead class="bg-gray-100 uppercase">
 <tr><th class="p-2 border-r">Timestamp</th><th class="p-2 border-r">User</th><th class="p-2 border-r">Action Performed</th><th class="p-2">IP Address</th></tr>
 </thead>
 <tbody>
 <tr class="border-b"><td class="p-2 border-r font-mono">02 Oct 2026, 03:41 PM</td><td class="p-2 border-r font-bold">admin_grt</td><td class="p-2 border-r">Admin Gateway Successful Login</td><td class="p-2 font-mono">192.168.1.50</td></tr>
 <tr class="border-b"><td class="p-2 border-r font-mono">01 Oct 2026, 10:15 AM</td><td class="p-2 border-r font-bold">librarian_01</td><td class="p-2 border-r">Book Issue Processed (CS1001)</td><td class="p-2 font-mono">192.168.1.52</td></tr>
 </tbody>
 </table>
 </div>
 `;
 return;
 }
 }

 /* --- HELP MODULE --- */
 if (module === 'help') {
 if (title === 'User Manual') {
 card.innerHTML = `
 <div class="flex justify-between items-center mb-2">
 <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">HELP & SUPPORT (USER MANUAL)</h2>
 </div>
 <div class="border border-gray-300 rounded bg-white shadow-sm p-6 w-full max-w-4xl space-y-4 text-xs">
 <h3 class="font-bold text-sm text-blue-900">GRTIET Library Management System - User Guide</h3>
 <p class="text-gray-700">This manual details how to navigate member registries, process book issues/returns, and manage eGate attendance scans.</p>
 <ul class="list-disc pl-5 space-y-1 text-gray-600">
 <li><strong>Member Module:</strong> Add, edit, lock, or bulk import students and faculty members.</li>
 <li><strong>Circulation:</strong> Issue books by scanning member ID and book accession number.</li>
 <li><strong>eGate:</strong> Real-time campus library entry/exit log scanner.</li>
 </ul>
 </div>
 `;
 return;
 }
 if (title === 'About ') {
 card.innerHTML = `
 <div class="flex justify-between items-center mb-2">
 <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">HELP & SUPPORT (ABOUT )</h2>
 </div>
 <div class="border border-gray-300 rounded bg-white shadow-sm p-6 w-full max-w-4xl space-y-4 text-xs">
 <h3 class="font-bold text-sm text-blue-900">GRT Institute of Engineering and Technology Library System</h3>
 <p class="text-gray-700">Custom institutional edition configured for GRT Institute of Engineering and Technology, Tiruttani - 631209.</p>
 <p class="text-gray-600">Accredited by NAAC with "A++" Grade & An ISO 9001:2015 Certified Institution.</p>
 </div>
 `;
 return;
 }
 if (title === 'Contact Support') {
 card.innerHTML = `
 <div class="flex justify-between items-center mb-2">
 <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">HELP & SUPPORT (CONTACT SUPPORT)</h2>
 </div>
 <div class="border border-gray-300 rounded bg-white shadow-sm p-6 w-full max-w-4xl space-y-4 text-xs">
 <h3 class="font-bold text-sm text-blue-900">Library Helpdesk & Support Contacts</h3>
 <div class="bg-gray-50 p-4 rounded border space-y-2">
 <p class="text-gray-700">📧 Email: library@grtietcoe.org</p>
 <p class="text-gray-700">📞 Campus Library Desk: +91 44 2788 5400</p>
 </div>
 </div>
 `;
 return;
 }
 }

 card.innerHTML = `
 <div class="text-center py-12">
 <h2 class="text-lg font-black text-gray-900 mb-1 uppercase">${title} Module</h2>
 <p class="text-xs text-gray-600 mb-5">Manage and view records for ${module} &rarr; ${title} securely through .</p>
 </div>
 `;
 }

 function loadSubpage(title) {
 const card = document.getElementById('workspaceCard');

 if (title === 'Member' || title === 'Member Register') {
 let rows = dbMembers.map(m => `
 <tr class="hover:bg-gray-50 border-b">
 <td class="p-2 font-mono font-bold text-blue-900">${m.id}</td>
 <td class="p-2 font-semibold">${m.name}</td>
 <td class="p-2">${m.batch}</td>
 <td class="p-2">${m.programme}</td>
 <td class="p-2">${m.section}</td>
 <td class="p-2">${m.gender}</td>
 <td class="p-2"><span class="px-2 py-0.5 ${m.memberLock === 'Yes' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'} rounded font-bold text-[10px]">${m.memberLock === 'Yes' ? 'Locked' : m.status}</span></td>
 <td class="p-2">${m.doj}</td>
 <td class="p-2 border-r">${m.dol}</td>
 <td class="p-2 border-r">
 <button onclick="editMember('${m.id}')" class="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-600 hover:text-white rounded shadow-sm font-bold transition-all flex items-center gap-1.5">
 <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
 Edit
 </button>
 </td>
 <td class="p-2 text-center">
 <button onclick="lockMember('${m.id}')" title="${m.memberLock === 'Yes' ? 'Locked (Click to unlock)' : 'Lock Member'}" class="w-7 h-7 inline-flex items-center justify-center ${m.memberLock === 'Yes' ? 'bg-rose-100 text-rose-700 border border-rose-300 hover:bg-rose-600 hover:text-white' : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-rose-600 hover:text-white hover:border-rose-600'} rounded shadow-sm transition-all">
 <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
 </svg>
 </button>
 </td>
 </tr>
 `).join('');

 card.innerHTML = `
 <div class="flex justify-between items-center mb-2">
 <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">MEMBER DIRECTORY & REGISTRATION</h2>
 </div>

 <div class="border border-gray-300 rounded p-4 bg-gray-50/60 shadow-sm text-xs w-full max-w-5xl mb-3">
 <p class="text-gray-700 font-bold mb-3">Search by the criteria below :</p>
 <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
 <div class="flex items-center space-x-2">
 <label class="w-20 font-semibold text-gray-600">Batch</label>
 <select id="filterBatch" onchange="filterMembersTable()" class="flex-1 px-3 py-2 bg-white border border-gray-300 rounded shadow-inner transition-colors duration-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600">
 <option>-Select-</option>
 <option value="2023-2027">2023-2027</option>
 <option value="2024-2028">2024-2028</option>
 <option value="Staff">Staff</option>
 </select>
 </div>
 <div class="flex items-center space-x-2">
 <label class="w-24 font-semibold text-gray-600">Member ID</label>
 <input type="text" id="filterMemberId" oninput="filterMembersTable()" placeholder="ID or Name..." class="flex-1 px-3 py-2 bg-white border border-gray-300 rounded shadow-inner transition-colors duration-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600">
 </div>
 <div class="flex items-center space-x-2">
 <label class="w-20 font-semibold text-gray-600">Status</label>
 <select id="filterStatus" onchange="filterMembersTable()" class="flex-1 px-3 py-2 bg-white border border-gray-300 rounded shadow-inner transition-colors duration-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600">
 <option>-Select-</option>
 <option value="Active" selected>Active</option>
 <option value="Inactive">Inactive</option>
 </select>
 </div>
 </div>
 </div>

 <div class="flex space-x-2 mb-3">
 <button onclick="openNewMemberForm('Student')" class="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded shadow text-xs">+ Add Member</button>
 <button onclick="openBulkImportModal()" class="px-4 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded shadow text-xs">Import (Bulk)</button>
 </div>

 <div class="border border-gray-300 rounded bg-white shadow-sm overflow-hidden w-full max-w-5xl min-h-[220px] max-h-[350px] overflow-y-auto flex flex-col">
 <table class="w-full text-left border-collapse text-[11px]">
 <thead class="bg-gray-100 text-gray-700 uppercase border-b border-gray-300 sticky top-0">
 <tr>
 <th class="p-2 border-r">Member ID</th>
 <th class="p-2 border-r">Name</th>
 <th class="p-2 border-r">Batch</th>
 <th class="p-2 border-r">Type</th>
 <th class="p-2 border-r">Section</th>
 <th class="p-2 border-r">Gender</th>
 <th class="p-2 border-r">Status</th>
 <th class="p-2 border-r">DOJ</th>
 <th class="p-2 border-r">DOL</th>
 <th class="p-2 border-r">Action</th>
 <th class="p-2 text-center">Lock</th>
 </tr>
 </thead>
 <tbody id="memberTableBody">${rows}</tbody>
 </table>
 </div>
 `;
 } else if (title === 'Member ID Allotment') {
 card.innerHTML = `
 <div class="flex justify-between items-center mb-2">
 <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">MEMBER ID ALLOTMENT</h2>
 </div>
 <div class="border border-gray-300 rounded p-6 bg-gray-50/80 shadow-sm text-xs w-full max-w-3xl space-y-4">
 <div class="grid grid-cols-2 gap-4">
 <div class="flex items-center justify-between"><label class="font-semibold text-gray-700">Batch</label><select class="w-60 px-3 py-2 bg-white border border-gray-300 rounded transition-colors duration-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"><option>-Select-</option><option>2023-2027</option><option>2024-2028</option></select></div>
 <div class="flex items-center justify-between"><label class="font-semibold text-gray-700">Type</label><select class="w-60 px-3 py-2 bg-white border border-gray-300 rounded transition-colors duration-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"><option>-Select-</option><option>B.E.</option><option>B.Tech</option></select></div>
 </div>
 <div class="pt-2 flex justify-end">
 <button onclick="alert('Member IDs successfully generated for batch!')" class="px-6 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded shadow">Generate ID Numbers</button>
 </div>
 </div>
 `;
 } else if (title === 'Section Allotment') {
 card.innerHTML = `
 <div class="flex justify-between items-center mb-2">
 <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">SECTION ALLOTMENT</h2>
 </div>
 <div class="border border-gray-300 rounded p-6 bg-gray-50/80 shadow-sm text-xs w-full max-w-3xl space-y-4">
 <div class="grid grid-cols-2 gap-4">
 <div class="flex items-center justify-between"><label class="font-semibold text-gray-700">Batch</label><select class="w-60 px-3 py-2 bg-white border border-gray-300 rounded transition-colors duration-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"><option>-Select-</option><option>2023-2027</option><option>2024-2028</option></select></div>
 <div class="flex items-center justify-between"><label class="font-semibold text-gray-700">Section</label><select class="w-60 px-3 py-2 bg-white border border-gray-300 rounded transition-colors duration-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"><option>-Select-</option><option>A</option><option>B</option></select></div>
 </div>
 <div class="pt-2 flex justify-end">
 <button onclick="alert('Sections successfully updated!')" class="px-6 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded shadow">Update Sections</button>
 </div>
 </div>
 `;
 } else if (title === 'Member Group Allotment') {
 card.innerHTML = `
 <div class="flex justify-between items-center mb-2">
 <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">MEMBER GROUP ALLOTMENT</h2>
 </div>
 <div class="border border-gray-300 rounded p-6 bg-gray-50/80 shadow-sm text-xs w-full max-w-3xl space-y-4">
 <div class="flex items-center space-x-4 max-w-lg">
 <label class="font-semibold text-gray-700 w-28">Member Group</label>
 <select class="flex-1 px-3 py-2 bg-white border border-gray-300 rounded transition-colors duration-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"><option>-Select Group-</option><option>UG Students</option><option>Faculty Staff</option></select>
 </div>
 <div class="pt-2 flex justify-end">
 <button onclick="alert('Member group privileges allocated successfully!')" class="px-6 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded shadow">Allocate Group</button>
 </div>
 </div>
 `;

 if (title === 'General Resource') {
 card.innerHTML = `
 <div class="flex justify-between items-center mb-3">
 <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">
 MEMBER - GENERAL RESOURCE
 </h2>
 </div>

 <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div class="border border-gray-300 rounded-xl bg-white p-5 shadow-sm">
 <h3 class="font-bold text-blue-900 mb-3">General Resource Details</h3>
 <label class="block text-xs font-semibold mb-1">Member ID</label>
 <input id="generalResourceMemberId"
 class="w-full border rounded px-3 py-2 text-xs mb-3"
 placeholder="Enter Member ID">

 <label class="block text-xs font-semibold mb-1">Resource</label>
 <input id="generalResourceName"
 class="w-full border rounded px-3 py-2 text-xs mb-3"
 placeholder="Resource name">

 <button type="button"
 onclick="alert('General Resource details are ready to be recorded for this member.')"
 class="px-4 py-2 bg-blue-700 text-white rounded font-bold text-xs">
 Save Details
 </button>
 </div>

 <div class="border border-gray-300 rounded-xl bg-gray-50 p-5">
 <h3 class="font-bold text-gray-700 mb-2">Member Resource Information</h3>
 <p class="text-xs text-gray-600">
 Manage general library resources associated with a member.
 </p>
 </div>
 </div>
 `;
 return;
 }

 if (title === 'Book Bank') {
 card.innerHTML = `
 <div class="flex justify-between items-center mb-3">
 <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">
 MEMBER - BOOK BANK
 </h2>
 </div>

 <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div class="border border-gray-300 rounded-xl bg-white p-5 shadow-sm">
 <h3 class="font-bold text-blue-900 mb-3">Book Bank Details</h3>

 <label class="block text-xs font-semibold mb-1">Member ID</label>
 <input id="bookBankMemberId"
 class="w-full border rounded px-3 py-2 text-xs mb-3"
 placeholder="Enter Member ID">

 <label class="block text-xs font-semibold mb-1">Accession No</label>
 <input id="bookBankAccn"
 class="w-full border rounded px-3 py-2 text-xs mb-3"
 placeholder="Enter Book Accession No">

 <label class="block text-xs font-semibold mb-1">Period (Days)</label>
 <input id="bookBankPeriod"
 type="number"
 min="1"
 class="w-full border rounded px-3 py-2 text-xs mb-3"
 value="30">

 <button type="button"
 onclick="alert('Book Bank details are ready to be recorded for this member.')"
 class="px-4 py-2 bg-indigo-700 text-white rounded font-bold text-xs">
 Save Details
 </button>
 </div>

 <div class="border border-gray-300 rounded-xl bg-gray-50 p-5">
 <h3 class="font-bold text-gray-700 mb-2">Book Bank Information</h3>
 <p class="text-xs text-gray-600">
 Manage books assigned through the Book Bank section.
 </p>
 </div>
 </div>
 `;
 return;
 }

 } else if (title === 'Member Removal') {
 let optionsList = dbMembers.map(m => `<option value="${m.id}">${m.id} - ${m.name} (${m.batch})</option>`).join('');
 card.innerHTML = `
 <div class="flex justify-between items-center mb-2">
 <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">MEMBER REMOVAL / DEACTIVATION</h2>
 </div>
 <form onsubmit="executeMemberRemoval(event)" class="border border-gray-300 rounded p-6 bg-gray-50/80 shadow-sm text-xs w-full max-w-3xl space-y-4">
 <p class="text-gray-700 font-semibold">Select or enter the Member ID you wish to remove from the library system:</p>
 <div class="flex items-center space-x-3">
 <label class="w-24 font-bold text-gray-700">Member ID</label>
 <input type="text" id="removeMemberId" list="activeMemberList" required placeholder="Type or select Member ID..." class="flex-1 px-3 py-2 bg-white border border-gray-300 rounded shadow-inner transition-colors duration-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600">
 <datalist id="activeMemberList">${optionsList}</datalist>
 </div>
 <div class="pt-2 flex justify-end">
 <button type="submit" class="px-6 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded shadow">Remove Member</button>
 </div>
 </form>
 `;
 } else if (title === 'Undo Removal') {
 let undoRows = removedMembersLog.length > 0 ? removedMembersLog.map(m => `
 <tr class="hover:bg-gray-50 border-b">
 <td class="p-2 font-mono font-bold text-rose-800">${m.id}</td>
 <td class="p-2 font-semibold">${m.name}</td>
 <td class="p-2">${m.batch}</td>
 <td class="p-2 space-x-2">
 <button onclick="restoreMember('${m.id}')" class="px-3 py-0.5 bg-emerald-600 text-white rounded font-bold">Restore</button>
 <button onclick="deletePermanently('${m.id}')" class="px-3 py-0.5 bg-rose-600 text-white rounded font-bold">Delete</button>
 </td>
 </tr>
 `).join('') : `<tr><td colspan="4" class="text-center py-12 text-gray-400 italic">No recently removed members to restore</td></tr>`;

 card.innerHTML = `
 <div class="flex justify-between items-center mb-2">
 <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">UNDO MEMBER REMOVAL</h2>
 </div>
 <div class="border border-gray-300 rounded bg-white shadow-sm overflow-hidden w-full max-w-5xl min-h-[220px] flex flex-col">
 <table class="w-full text-left border-collapse text-[11px]">
 <thead class="bg-gray-100 text-gray-700 uppercase border-b border-gray-300">
 <tr>
 <th class="p-2 border-r">Member ID</th>
 <th class="p-2 border-r">Name</th>
 <th class="p-2 border-r">Batch</th>
 <th class="p-2">Action</th>
 </tr>
 </thead>
 <tbody>${undoRows}</tbody>
 </table>
 </div>
 `;
 } else if (title === 'Locked Members') {
 const lockedList = dbMembers.filter(m => m.memberLock === 'Yes');
 let lockedRows = lockedList.length > 0 ? lockedList.map(m => `
 <tr class="hover:bg-gray-50 border-b">
 <td class="p-2 font-mono font-bold text-rose-800">${escapeHtml(m.id)}</td>
 <td class="p-2 font-semibold">${escapeHtml(m.name)}</td>
 <td class="p-2 text-gray-700">${escapeHtml(m.lockReason || 'Administrative Lock')}</td>
 <td class="p-2">
 <button onclick="unlockMember('${m.id}')" class="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white rounded shadow-sm font-bold transition-all flex items-center gap-1.5">
 <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/></svg>
 Unlock
 </button>
 </td>
 </tr>
 `).join('') : `<tr><td colspan="4" class="text-center py-16 text-gray-400 italic">No locked members currently</td></tr>`;

 card.innerHTML = `
 <div class="flex justify-between items-center mb-2">
 <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">LOCKED MEMBERS LIST</h2>
 <span class="text-xs text-rose-600 font-bold bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">${lockedList.length} Locked</span>
 </div>
 <div class="border border-gray-300 rounded bg-white shadow-sm overflow-hidden w-full max-w-5xl min-h-[220px] flex flex-col">
 <table class="w-full text-left border-collapse text-[11px]">
 <thead class="bg-gray-100 text-gray-700 uppercase border-b border-gray-300">
 <tr>
 <th class="p-2 border-r">Member ID</th>
 <th class="p-2 border-r">Name</th>
 <th class="p-2 border-r">Reason</th>
 <th class="p-2">Action</th>
 </tr>
 </thead>
 <tbody>${lockedRows}</tbody>
 </table>
 </div>
 `;
 } else if (title === 'Member History') {
 card.innerHTML = `
 <div class="flex justify-between items-center mb-2">
 <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">MEMBER TRANSACTION HISTORY</h2>
 </div>
 <div class="border border-gray-300 rounded p-4 bg-gray-50/60 shadow-sm text-xs w-full max-w-5xl mb-3">
 <div class="flex space-x-3 items-center max-w-md">
 <label class="font-semibold text-gray-700 w-24">Member ID</label>
 <input type="text" placeholder="Search Member ID..." class="flex-1 px-3 py-2 bg-white border border-gray-300 rounded transition-colors duration-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600">
 <button class="px-4 py-2 bg-blue-700 text-white font-bold rounded">View History</button>
 </div>
 </div>
 <div class="border border-gray-300 rounded bg-white shadow-sm overflow-hidden w-full max-w-5xl min-h-[220px] flex flex-col">
 <table class="w-full text-left border-collapse text-[11px]">
 <thead class="bg-gray-100 text-gray-700 uppercase border-b border-gray-300">
 <tr>
 <th class="p-2 border-r">Book Acc No</th>
 <th class="p-2 border-r">Title</th>
 <th class="p-2 border-r">Issue Date</th>
 <th class="p-2">Return Date</th>
 </tr>
 </thead>
 <tbody>
 <tr><td colspan="4" class="text-center py-16 text-gray-400 italic">No transaction history available</td></tr>
 </tbody>
 </table>
 </div>
 `;
 }
 }

 function switchTab(buttonElement, module) {
 try {
 console.log("Switching module:", module);

 // Load the correct left sidebar
 loadSidebar(module);

 // Remove active state from all navbar buttons
 document.querySelectorAll("nav .nav-pill-btn").forEach(btn => {
 btn.classList.remove("tab-active");
 });

 // Add active state to clicked button
 if (buttonElement) {
 buttonElement.classList.add("tab-active");
 }

 // Load correct workspace
 if (module === "search") {

 loadSearchSubpage("Simple Search");

 } else if (module === "member") {

 loadSubpage("Member");

 } else {

 const firstSubItem =
 sidebars[module]
 ? sidebars[module][0]
 : module;

 loadModuleSubpage(
 module,
 firstSubItem
 );
 }

 console.log(
 "✅ Module loaded:",
 module
 );

 } catch (error) {

 console.error(
 "❌ Navbar error:",
 error
 );

 }
}


window.onload = function() {
 loadSidebar('member');
 loadSubpage('Member');
 };

/* --- SEARCH MODULE SUBPAGES --- */
 function loadSearchSubpage(title, searchResults = null) {
 const card = document.getElementById("workspaceCard");

 if (title === "Simple Search") {
 card.innerHTML = `
 <div class="w-full max-w-4xl mx-auto pt-4">
 <h2 class="text-center font-black text-gray-800 text-sm tracking-widest uppercase mb-6">SIMPLE SEARCH</h2>

 <form onsubmit="executeSimpleSearch(event)" class="bg-[#f8fafc] border border-gray-300 rounded-2xl p-8 shadow-sm space-y-5 text-xs">
 <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
 <label class="md:col-span-3 font-bold text-gray-700 text-right pr-4">Res. Type</label>
 <div class="md:col-span-9">
 <select id="searchResType" class="w-full max-w-sm px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
 <option value="">-Select-</option>
 <option value="BOOK">BOOK</option>
 <option value="PERIODICAL">PERIODICAL</option>
 </select>
 </div>
 </div>

 <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
 <label class="md:col-span-3 font-bold text-gray-700 text-right pr-4">Keyword</label>
 <div class="md:col-span-9">
 <input type="text" id="searchKeyword" placeholder="Enter title, author, publisher or subject..." class="w-full max-w-md px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
 </div>
 </div>

 <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
 <label class="md:col-span-3 font-bold text-gray-700 text-right pr-4">Search By</label>
 <div class="md:col-span-9">
 <select id="searchByField" class="w-full max-w-sm px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
 <option value="All">All Fields</option>
 <option value="Title">Title</option>
 <option value="Author">Author</option>
 <option value="Accn">Accn No.</option>
 <option value="Subject">Subject</option>
 </select>
 </div>
 </div>

 <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
 <label class="md:col-span-3 font-bold text-gray-700 text-right pr-4">Sort By</label>
 <div class="md:col-span-9">
 <select id="searchSortBy" class="w-full max-w-sm px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
 <option value="Accn No.">Accn No.</option>
 <option value="Title">Title</option>
 <option value="Author">Author</option>
 </select>
 </div>
 </div>

 <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
 <label class="md:col-span-3 font-bold text-gray-700 text-right pr-4">Language</label>
 <div class="md:col-span-9">
 <select id="searchLanguage" class="w-full max-w-sm px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
 <option value="">-Select-</option>
 <option value="English">English</option>
 </select>
 </div>
 </div>

 <div class="pt-4 flex justify-center">
 <button type="submit" class="px-8 py-2 bg-[#0284c7] hover:bg-[#02689d] text-white font-bold rounded-lg shadow transition-all text-xs uppercase tracking-wider">Search</button>
 </div>
 </form>

 <div id="simpleSearchResultsArea" class="mt-8">
 ${searchResults ? renderSearchResultsTable(searchResults) : ""}
 </div>
 </div>
 `;
 } else {
 card.innerHTML = `
 <div class="text-center py-12">
 <h2 class="text-lg font-black text-gray-900 mb-1 uppercase">${title}</h2>
 <p class="text-xs text-gray-600 mb-5">Search module for GRTIET Library.</p>
 </div>
 `;
 }
 }

 function executeSimpleSearch(event) {
 event.preventDefault();

 const resTypeEl = document.getElementById("searchResType");
 const keywordEl = document.getElementById("searchKeyword");
 const searchByEl = document.getElementById("searchByField");
 const sortByEl = document.getElementById("searchSortBy");
 const languageEl = document.getElementById("searchLanguage");

 const resType = resTypeEl ? resTypeEl.value : "";
 const keyword = keywordEl ? keywordEl.value.trim().toLowerCase() : "";
 const searchBy = searchByEl ? searchByEl.value : "All";
 const sortBy = sortByEl ? sortByEl.value : "";
 const language = languageEl ? languageEl.value : "";

 const value = function(v) {
 return String(v ?? '').trim().toLowerCase();
 };

 const filtered = dbBooks.filter(b => {

 const recordType = value(b.resType || 'BOOK');
 const recordLanguage = value(b.language);

 const matchRes =
 !resType ||
 resType === recordType ||
 resType.toLowerCase() === recordType;

 const matchLang =
 !language ||
 !recordLanguage ||
 language.toLowerCase() === recordLanguage;

 if (!matchRes || !matchLang) {
 return false;
 }

 if (!keyword) {
 return true;
 }

 const fields = {
 Title: value(b.title),
 Author: value(b.author),
 Accn: value(b.accn),
 Subject: value(b.subject),
 "Subject Code": value(b.subjectCode || b.subject_code),
 Publisher: value(b.publisher),
 Category: value(b.category),
 Language: value(b.language)
 };

 if (searchBy && fields[searchBy] !== undefined) {
 return fields[searchBy].includes(keyword);
 }

 return Object.values(fields).some(
 field => field.includes(keyword)
 );
 });

 filtered.sort((a, b) => {
 if (sortBy === "Title") {
 return value(a.title).localeCompare(value(b.title));
 }

 if (sortBy === "Author") {
 return value(a.author).localeCompare(value(b.author));
 }

 return value(a.accn).localeCompare(value(b.accn));
 });

 const resultsContainer =
 document.getElementById("simpleSearchResultsArea");

 if (resultsContainer) {
 resultsContainer.innerHTML =
 renderSearchResultsTable(filtered);
 }
 }

 function renderSearchResultsTable(results) {
 if (results.length === 0) {
 return `
 <div class="border border-amber-200 bg-amber-50 rounded-xl p-6 text-center text-amber-800 font-semibold text-xs">
 No matching catalogue records found.
 </div>
 `;
 }

 const rows = results.map(b => `
 <tr class="hover:bg-gray-50 border-b text-xs">
 <td class="p-2.5 font-mono font-bold text-blue-900 border-r">
 ${escapeHtml(b.accn || '')}
 </td>
 <td class="p-2.5 font-semibold border-r">
 ${escapeHtml(b.title || '')}
 </td>
 <td class="p-2.5 border-r">
 ${escapeHtml(b.author || '')}
 </td>
 <td class="p-2.5 border-r">
 ${escapeHtml(b.publisher || '')}
 </td>
 <td class="p-2.5 border-r">
 ${escapeHtml(b.category || '')}
 </td>
 <td class="p-2.5 border-r">
 ${escapeHtml(b.subjectCode || b.subject_code || '')}
 </td>
 <td class="p-2.5 border-r">
 ${escapeHtml(b.language || '')}
 </td>
 <td class="p-2.5 text-center">
 <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
 ${escapeHtml(b.status || 'Available')}
 </span>
 </td>
 </tr>
 `).join("");

 return `
 <div class="border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
 <div class="bg-gray-100 px-4 py-2 border-b text-xs font-bold text-gray-700">
 Search Results (${results.length} found)
 </div>

 <div class="overflow-x-auto">
 <table class="w-full text-left border-collapse text-xs">
 <thead class="bg-gray-50 text-gray-700 uppercase border-b text-[11px]">
 <tr>
 <th class="p-2.5 border-r">Accn No</th>
 <th class="p-2.5 border-r">Title</th>
 <th class="p-2.5 border-r">Author</th>
 <th class="p-2.5 border-r">Publisher</th>
 <th class="p-2.5 border-r">Category</th>
 <th class="p-2.5 border-r">Subject Code</th>
 <th class="p-2.5 border-r">Language</th>
 <th class="p-2.5 text-center">Status</th>
 </tr>
 </thead>
 <tbody>${rows}</tbody>
 </table>
 </div>
 </div>
 `;
 }


;
 // ===============================
// E-GATE UNIQUE ENTRY VALIDATION
// ===============================

const EGATE_STORAGE_KEY = "grt_lms_egate";

function getEGateEntries() {
 try {
 return JSON.parse(localStorage.getItem(EGATE_STORAGE_KEY)) || [];
 } catch (error) {
 console.error("E-Gate storage error:", error);
 return [];
 }
}

function saveEGateEntries(entries) {
 localStorage.setItem(EGATE_STORAGE_KEY, JSON.stringify(entries));
}

function addEGateEntry(entry) {
 const entries = getEGateEntries();

 const registerNumber = String(entry.registerNumber || "")
 .trim()
 .toLowerCase();

 if (!registerNumber) {
 return {
 success: false,
 message: "Register Number is required."
 };
 }

 const alreadyInside = entries.some(item =>
 String(item.registerNumber || "").trim().toLowerCase() === registerNumber &&
 item.status === "Inside"
 );

 if (alreadyInside) {
 return {
 success: false,
 message: "This Register Number already has an active E-Gate entry."
 };
 }

 const newEntry = {
 id: "EG-" + Date.now(),
 registerNumber: entry.registerNumber,
 name: entry.name || "",
 entryTime: new Date().toLocaleString(),
 status: "Inside"
 };

 entries.push(newEntry);
 saveEGateEntries(entries);

 return {
 success: true,
 message: "E-Gate entry saved successfully.",
 entry: newEntry
 };
}



// ===============================
// E-GATE UNIQUE ENTRY VALIDATION
// ===============================


function getEGateEntries() {
 try {
 return JSON.parse(localStorage.getItem(EGATE_STORAGE_KEY)) || [];
 } catch (error) {
 console.error("E-Gate storage error:", error);
 return [];
 }
}

function saveEGateEntries(entries) {
 localStorage.setItem(EGATE_STORAGE_KEY, JSON.stringify(entries));
}

function addEGateEntry(entry) {
 const entries = getEGateEntries();

 const registerNumber = String(entry.registerNumber || "")
 .trim()
 .toLowerCase();

 if (!registerNumber) {
 return {
 success: false,
 message: "Register Number is required."
 };
 }

 const alreadyInside = entries.some(item =>
 String(item.registerNumber || "").trim().toLowerCase() === registerNumber &&
 item.status === "Inside"
 );

 if (alreadyInside) {
 return {
 success: false,
 message: "This Register Number already has an active E-Gate entry."
 };
 }

 const newEntry = {
 id: "EG-" + Date.now(),
 registerNumber: entry.registerNumber,
 name: entry.name || "",
 entryTime: new Date().toLocaleString(),
 status: "Inside"
 };

 entries.push(newEntry);
 saveEGateEntries(entries);

 return {
 success: true,
 message: "E-Gate entry saved successfully.",
 entry: newEntry
 };
}

/* MEMBER_RESOURCE_BOOKBANK_UPDATE */
/*
 * Requested member additions only:
 * - General Resource
 * - Book Bank
 * - Student / Faculty filtering
 * - Member photo at top-right
 *
 * Existing application logic is preserved.
 */

(function () {
 "use strict";

 function getMembers() {
 try {
 const keys = [
 "members",
 "libraryMembers",
 "lmsMembers",
 "students",
 "faculty"
 ];

 let result = [];

 keys.forEach(function (key) {
 try {
 const value = JSON.parse(localStorage.getItem(key));
 if (Array.isArray(value)) result = result.concat(value);
 } catch (e) {}
 });

 return result;
 } catch (e) {
 return [];
 }
 }

 function memberType(member) {
 const value = String(
 member.type ||
 member.memberType ||
 member.category ||
 member.role ||
 ""
 ).toLowerCase();

 if (value.includes("faculty") || value.includes("staff")) {
 return "Faculty";
 }

 return "Student";
 }

 function renderMemberFilter(type) {
 const members = getMembers();

 if (!members.length) return;

 const filtered =
 type === "All"
 ? members
 : members.filter(function (m) {
 return memberType(m) === type;
 });

 const container =
 document.querySelector("#memberList") ||
 document.querySelector(".member-list") ||
 document.querySelector("[data-member-list]");

 if (!container) return;

 const oldRows = container.querySelectorAll(
 "[data-generated-member-row]"
 );

 oldRows.forEach(function (row) {
 row.remove();
 });

 filtered.forEach(function (member) {
 const row = document.createElement("div");
 row.setAttribute("data-generated-member-row", "true");

 const name =
 member.name ||
 member.memberName ||
 member.studentName ||
 member.facultyName ||
 "Unnamed Member";

 const id =
 member.memberId ||
 member.id ||
 member.rollNo ||
 member.registerNo ||
 "";

 row.innerHTML =
 '<div style="display:flex;align-items:center;gap:12px;padding:10px;border-bottom:1px solid #e5e7eb;">' +
 '<div style="width:45px;height:45px;border-radius:50%;overflow:hidden;flex-shrink:0;">' +
 (
 member.image ||
 member.photo ||
 member.profileImage
 )
 ? '<img src="' +
 (member.image ||
 member.photo ||
 member.profileImage) +
 '" style="width:100%;height:100%;object-fit:cover;">'
 : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#e5e7eb;">' +
 String(name).charAt(0).toUpperCase() +
 "</div>" +
 "</div>" +
 '<div><strong>' +
 name +
 "</strong><br><small>" +
 id +
 " • " +
 memberType(member) +
 "</small></div>" +
 "</div>";

 container.appendChild(row);
 });
 }

 function createFilterButtons() {
 const existing =
 document.querySelector("[data-member-type-filter]");

 if (existing) return;

 const memberPage =
 document.querySelector("#memberList") ||
 document.querySelector(".member-list") ||
 document.querySelector("[data-member-list]");

 if (!memberPage) return;

 const wrapper = document.createElement("div");
 wrapper.setAttribute("data-member-type-filter", "true");
 wrapper.style.cssText =
 "display:flex;gap:8px;margin:12px 0;flex-wrap:wrap;";

 ["All", "Student", "Faculty"].forEach(function (type) {
 const button = document.createElement("button");
 button.type = "button";
 button.textContent = type;
 button.style.cssText =
 "padding:8px 14px;border:1px solid #d1d5db;border-radius:6px;cursor:pointer;background:white;";

 button.addEventListener("click", function () {
 renderMemberFilter(type);
 });

 wrapper.appendChild(button);
 });

 memberPage.parentNode.insertBefore(wrapper, memberPage);

 renderMemberFilter("All");
 }



 function initRequestedChanges() {
 createFilterButtons();

 }

 if (document.readyState === "loading") {
 document.addEventListener(
 "DOMContentLoaded",
 initRequestedChanges
 );
 } else {
 initRequestedChanges();
 }

 const observer = new MutationObserver(function () {

 });

 observer.observe(document.body, {
 childList: true,
 subtree: true
 });

})();


/* ============================================================
 GRT - MANUAL BOOK ENTRY SAVE
 Connects the existing Catalogue form to dbBooks.
 ============================================================ */

function saveNewBookEntry(event) {
    if (event) {
        event.preventDefault();
    }

    try {
        // Use the actual catalogue database declared in this file:
        // let dbBooks = [...]
        if (!Array.isArray(dbBooks)) {
            throw new Error('Book catalogue database was not found.');
        }

        const accessionInput =
            document.getElementById('catalogueAccession');

        const titleInput =
            document.getElementById('catalogueTitle');

        const authorInput =
            document.getElementById('catalogueAuthor');

        const publisherInput =
            document.getElementById('cataloguePublisher');

        const editionInput =
            document.getElementById('catalogueEdition');

        if (!accessionInput || !titleInput || !authorInput) {
            throw new Error(
                'Catalogue book entry fields were not found.'
            );
        }

        const accession = accessionInput.value.trim();
        const title = titleInput.value.trim();
        const author = authorInput.value.trim();
        const publisher = publisherInput
            ? publisherInput.value.trim()
            : '';
        const edition = editionInput
            ? editionInput.value.trim()
            : '';

        if (!accession || !title || !author) {
            alert(
                'Please enter Accession No, Book Title and Author.'
            );
            return false;
        }

        // Prevent duplicate accession numbers.
        const duplicate = dbBooks.some(book => {
            const existingAccession = String(
                book.accn ||
                book.accession ||
                book.accessionNumber ||
                ''
            ).trim();

            return existingAccession.toLowerCase() ===
                accession.toLowerCase();
        });

        if (duplicate) {
            alert(
                `Accession Number "${accession}" already exists.`
            );
            return false;
        }

        const newBook = {
            id: Date.now(),
            accn: accession,
            accession: accession,
            accessionNumber: accession,

            title: title,
            author: author,
            publisher: publisher,
            edition: edition,

            subject: '',
            category: '',
            subjectCode: '',
            year: '',

            copies: 1,
            copies_total: 1,
            copies_available: 1,

            status: 'Available',
            language: 'English'
        };

        // Add directly to the actual catalogue array.
        dbBooks.push(newBook);

        // Save using the existing Catalogue persistence system.
        saveCatalogueBooks();

        console.log(
            '🟢 Manual book added:',
            newBook
        );

        alert(
            `Book "${title}" (${accession}) added successfully!`
        );

        // Clear the form.
        accessionInput.value = '';
        titleInput.value = '';
        authorInput.value = '';

        if (publisherInput) {
            publisherInput.value = '';
        }

        if (editionInput) {
            editionInput.value = '';
        }

        // Refresh the existing Book Entry page.
        if (typeof loadSubpage === 'function') {
            loadSubpage('Book Entry');
        }

        return false;

    } catch (error) {
        console.error(
            'Manual book entry error:',
            error
        );

        alert(
            'Unable to save the book entry.\n\n' +
            error.message
        );

        return false;
    }
}

/* ============================================================
 GRT - BULK BOOK ENTRY
 Added: 2026-10-05
 This section is isolated and does not replace existing
 Catalogue / Search / Book Entry functions.
 ============================================================ */



/* ============================================================
 GRT - DELETE CATALOGUE BOOK
 Removes one book by accession number.
 ============================================================ */

function deleteCatalogueBook(accession) {
    try {
        const accn = String(accession || '').trim();

        if (!accn) {
            alert('Invalid book accession number.');
            return false;
        }

        const book = dbBooks.find(item => {
            const existing = String(
                item.accn ||
                item.accession ||
                item.accessionNumber ||
                ''
            ).trim();

            return existing.toLowerCase() === accn.toLowerCase();
        });

        if (!book) {
            alert('Book not found.');
            return false;
        }

        const bookTitle = book.title || 'this book';

        /*
         * LMS CENTER CONFIRMATION MODAL
         * No browser confirm() popup.
         */
        let modal = document.getElementById('grtCatalogueDeleteModal');

        if (modal) {
            modal.remove();
        }

        modal = document.createElement('div');
        modal.id = 'grtCatalogueDeleteModal';

        modal.innerHTML = `
            <div class="grt-delete-modal-backdrop">
                <div class="grt-delete-modal-box">

                    <div class="grt-delete-modal-icon">
                        !
                    </div>

                    <h2 class="grt-delete-modal-title">
                        Delete Book?
                    </h2>

                    <p class="grt-delete-modal-text">
                        Are you sure you want to delete this book?
                    </p>

                    <div class="grt-delete-modal-book">
                        <div>
                            <span>Accession No.</span>
                            <strong>${escapeHtml(accn)}</strong>
                        </div>

                        <div>
                            <span>Book Title</span>
                            <strong>${escapeHtml(bookTitle)}</strong>
                        </div>
                    </div>

                    <div class="grt-delete-modal-actions">
                        <button
                            type="button"
                            id="grtDeleteCancelBtn"
                            class="grt-delete-cancel-btn">
                            Cancel
                        </button>

                        <button
                            type="button"
                            id="grtDeleteConfirmBtn"
                            class="grt-delete-confirm-btn">
                            OK
                        </button>
                    </div>

                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeModal = () => {
            const current = document.getElementById(
                'grtCatalogueDeleteModal'
            );

            if (current) {
                current.remove();
            }
        };

        document
            .getElementById('grtDeleteCancelBtn')
            .addEventListener('click', closeModal);

        document
            .getElementById('grtDeleteConfirmBtn')
            .addEventListener('click', () => {

                closeModal();

                const index = dbBooks.findIndex(item => {
                    const existing = String(
                        item.accn ||
                        item.accession ||
                        item.accessionNumber ||
                        ''
                    ).trim();

                    return existing.toLowerCase() === accn.toLowerCase();
                });

                if (index === -1) {
                    alert('Book not found.');
                    return;
                }

                dbBooks.splice(index, 1);

                // Existing Catalogue persistence system.
                saveCatalogueBooks();

                console.log(
                    '🗑️ Catalogue book deleted:',
                    accn,
                    bookTitle
                );

                // Existing global notification system.
                alert(
                    `Book "${bookTitle}" (${accn}) deleted successfully.`
                );

                // Refresh existing Book Entry page.
                if (typeof loadSubpage === 'function') {
                    loadSubpage('Book Entry');
                } else if (
                    typeof loadModuleSubpage === 'function'
                ) {
                    loadModuleSubpage(
                        'catalogue',
                        'Book Entry'
                    );
                }
            });

        return false;

    } catch (error) {
        console.error(
            'Catalogue book delete error:',
            error
        );

        alert(
            'Unable to delete the book. Please try again.'
        );

        return false;
    }
}


function saveCatalogueBooks() {
    // Browser storage
    localStorage.setItem(
        'grt_lms_books',
        JSON.stringify(dbBooks)
    );

    // Legacy book storage key
    localStorage.setItem(
        'dbBooks',
        JSON.stringify(dbBooks)
    );

    // Keep all local library data synchronized.
    if (typeof grtSaveAllLibraryData === 'function') {
        grtSaveAllLibraryData();
    }

    // MongoDB storage
    fetch('/api/books/sync', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            books: dbBooks
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('MongoDB book sync failed');
        }
        return response.json();
    })
    .then(() => {
        console.log('🟢 Catalogue synced to MongoDB');
    })
    .catch(error => {
        console.warn(
            '⚠️ MongoDB book sync unavailable:',
            error.message
        );
    });
}


function grtImportBulkBooks_20261005() {

 const textarea =
 document.getElementById('grtBulkBookText_20261005');

 const result =
 document.getElementById('grtBulkBookResult_20261005');

 if (!textarea || !result) {
 alert('Bulk Book Entry form was not found.');
 return;
 }

 const raw = textarea.value.trim();

 if (!raw) {
 alert('Please enter at least one book.');
 return;
 }

 /*
 Use the existing global dbBooks.
 We do NOT create another book database.
 */
 if (!Array.isArray(window.dbBooks)) {

 if (typeof dbBooks !== 'undefined' && Array.isArray(dbBooks)) {
 window.dbBooks = dbBooks;
 } else {
 alert('Existing Catalogue book database was not found. No changes were made.');
 return;
 }
 }

 const lines = raw
 .split(/\r?\n/)
 .map(line => line.trim())
 .filter(Boolean);

 let added = 0;
 let skipped = 0;
 let invalid = 0;

 const errors = [];

 lines.forEach((line, index) => {

 /*
 Supports:
 |
 ,
 ;
 */

 let parts;

 if (line.includes('|')) {
 parts = line.split('|');
 } else if (line.includes(',')) {
 parts = line.split(',');
 } else if (line.includes(';')) {
 parts = line.split(';');
 } else {
 invalid++;
 errors.push(`Line ${index + 1}: Invalid format`);
 return;
 }

 parts = parts.map(value => value.trim());

 if (parts.length < 2) {
 invalid++;
 errors.push(`Line ${index + 1}: Missing book details`);
 return;
 }

 const accession = parts[0];

 if (!accession) {
 invalid++;
 errors.push(`Line ${index + 1}: Accession Number missing`);
 return;
 }

 /*
 Check duplicates against existing catalogue books.
 */
 const duplicate = window.dbBooks.some(book => {

 const existingAccn =
 String(
 book.accn ??
 book.accession ??
 book.accessionNumber ??
 book.book_id ??
 book.bookId ??
 ''
 ).trim().toLowerCase();

 return existingAccn === accession.toLowerCase();
 });

 if (duplicate) {
 skipped++;
 errors.push(`Line ${index + 1}: Accession "${accession}" already exists`);
 return;
 }

 const title = parts[1] || '';
 const author = parts[2] || '';
 const category = parts[3] || '';
 const subjectCode = parts[4] || '';
 const publisher = parts[5] || '';
 const year = parts[6] || '';
 const copies = Math.max(
 1,
 parseInt(parts[7] || '1', 10) || 1
 );

 /*
 Match the existing dbBooks structure used by the
 Catalogue/Search implementation.
 */
 const newBook = {
 id: Date.now() + added,
 accn: accession,
 accession: accession,
 accessionNumber: accession,

 title: title,
 author: author,
 category: category,
 subjectCode: subjectCode,
 subject_code: subjectCode,
 publisher: publisher,
 year: year,

 copies: copies,
 copies_total: copies,
 copies_available: copies,

 status: 'Available',

 language: 'English'
 };

 window.dbBooks.push(newBook);
 added++;
 });


 /*
 Save into the same localStorage key used by the existing
 Catalogue/Search feature.
 */
 try {
 localStorage.setItem(
 'dbBooks',
 JSON.stringify(window.dbBooks)
 );
 } catch (storageError) {
 console.error('Bulk book localStorage error:', storageError);
 alert('Books were added in the current page, but localStorage could not be updated.');
 return;
 }


 result.innerHTML = `
 <div class="border border-emerald-200 bg-emerald-50 rounded-lg p-4 text-xs">

 <p class="font-bold text-emerald-800 mb-2">
 Bulk Book Entry Completed
 </p>

 <p class="text-emerald-700">
 Successfully added:
 <strong>${added}</strong> book(s)
 </p>

 <p class="text-amber-700">
 Duplicate/skipped:
 <strong>${skipped}</strong>
 </p>

 <p class="text-red-700">
 Invalid:
 <strong>${invalid}</strong>
 </p>

 ${
 errors.length
 ? `
 <div class="mt-3 border-t border-emerald-200 pt-3">
 <p class="font-bold text-gray-700 mb-1">
 Details:
 </p>
 <ul class="list-disc ml-5 text-gray-600">
 ${errors.slice(0, 20).map(e => `<li>${escapeHtml(e)}</li>`).join('')}
 </ul>
 </div>
 `
 : ''
 }

 </div>
 `;

 /*
 Keep the user on the Bulk Book Entry page so they can
 see the result. Existing Catalogue/Search is untouched.
 */
}




// Restore all saved library data before the application is used.
grtLoadAllLibraryData();
// Member data is already restored by grtLoadAllLibraryData() during startup.
// Refresh the Member page only after the DOM is ready.
// Do not load dbMembers a second time here because that can overwrite
// newly added member data.
document.addEventListener('DOMContentLoaded', function () {
    try {
        const memberTableBody = document.getElementById('memberTableBody');

        if (memberTableBody && typeof loadSubpage === 'function') {
            loadSubpage('Member');
        }
    } catch (error) {
        console.warn('Member startup refresh failed:', error);
    }
});


 function openBulkBookImportModal() {
 const input = document.createElement('input');
 input.type = 'file';
 input.accept = '.csv,text/csv';
 input.style.display = 'none';

 input.onchange = function(event) {
 importBulkBooksFromCSV(event);
 };

 document.body.appendChild(input);
 input.click();

 setTimeout(() => {
 if (input.parentNode) {
 input.parentNode.removeChild(input);
 }
 }, 1000);
 }

 function importBulkBooksFromCSV(event) {
 const file = event.target.files && event.target.files[0];

 if (!file) return;

 const reader = new FileReader();

 reader.onload = function(e) {
 const text = String(e.target.result || '').trim();

 if (!text) {
 alert('The selected CSV file is empty.');
 return;
 }

 const lines = text.split(/\r?\n/).filter(line => line.trim());

 if (lines.length < 2) {
 alert('CSV must contain a header row and at least one book.');
 return;
 }

 const parseCSVLine = function(line) {
 const values = [];
 let current = '';
 let quoted = false;

 for (let i = 0; i < line.length; i++) {
 const ch = line[i];

 if (ch === '"') {
 if (quoted && line[i + 1] === '"') {
 current += '"';
 i++;
 } else {
 quoted = !quoted;
 }
 } else if (ch === ',' && !quoted) {
 values.push(current.trim());
 current = '';
 } else {
 current += ch;
 }
 }

 values.push(current.trim());
 return values;
 };

 const headers = parseCSVLine(lines[0]).map(h =>
 h.toLowerCase().replace(/[^a-z0-9]/g, '')
 );

 const getValue = function(values, names) {
 for (const name of names) {
 const index = headers.indexOf(name);
 if (index !== -1) {
 return values[index] || '';
 }
 }
 return '';
 };

 let added = 0;
 let skipped = 0;

 for (let i = 1; i < lines.length; i++) {
 const values = parseCSVLine(lines[i]);

 const accn = getValue(values, [
 'accn',
 'accession',
 'accessionno',
 'accessionnumber'
 ]).trim();

 const title = getValue(values, [
 'title',
 'booktitle',
 'name'
 ]).trim();

 const author = getValue(values, [
 'author',
 'authors'
 ]).trim();

 if (!accn || !title) {
 skipped++;
 continue;
 }

 const duplicate = dbBooks.some(
 b => String(b.accn || '').trim().toLowerCase() === accn.toLowerCase()
 );

 if (duplicate) {
 skipped++;
 continue;
 }

 dbBooks.push({
 accn: accn,
 title: title,
 author: author,
 publisher: getValue(values, ['publisher', 'publication']),
 edition: getValue(values, ['edition']),
 subject: getValue(values, ['subject']),
 subjectCode: getValue(values, ['subjectcode', 'subjectid']),
 category: getValue(values, ['category', 'bookcategory']),
 language: getValue(values, ['language', 'lang']),
 resType: getValue(values, ['restype', 'resourcetype']) || 'BOOK',
 status: getValue(values, ['status']) || 'Available'
 });

 added++;
 }

 saveCatalogueBooks();

 alert(
 `Bulk Book Entry Completed\n\n` +
 `Added: ${added}\n` +
 `Skipped/Duplicate: ${skipped}`
 );

 if (typeof loadModuleSubpage === 'function') {
 loadModuleSubpage('catalogue', 'Book Entry');
 }
 };

 reader.readAsText(file);
 }




/* LMS_SESSION_LOGIN_RESTORE_FINAL_20261005 */

function lmsRestoreLoginSession() {
 try {
 const loggedIn = sessionStorage.getItem('lmsLoggedIn');

 if (loggedIn === 'true') {
 const loginPage = document.getElementById('page-admin-login');
 const dashboard = document.getElementById('page-dashboard-container');
 const userBar = document.getElementById('topHeaderUserBar');

 if (loginPage) {
 loginPage.classList.add('hidden');
 }

 if (dashboard) {
 dashboard.classList.remove('hidden');
 }

 if (userBar) {
 userBar.classList.remove('hidden');
 }

 if (typeof loadSidebar === 'function') {
 loadSidebar('member');
 }

 if (typeof loadSubpage === 'function') {
 loadSubpage('Member');
 }

 return true;
 }
 } catch (e) {
 console.warn(' session restore failed:', e);
 }

 return false;
}

function lmsLogout() {
 try {
 sessionStorage.removeItem('lmsLoggedIn');
 sessionStorage.removeItem('lmsUsername');
 } catch (e) {
 console.warn(' logout session cleanup failed:', e);
 }

 goToPage('page-admin-login');

 const userInput = document.getElementById('adminUser');
 const passInput = document.getElementById('adminPass');

 if (userInput) userInput.value = '';
 if (passInput) passInput.value = '';
}

document.addEventListener('DOMContentLoaded', function () {
 lmsRestoreLoginSession();
});

/* LMS_SESSION_LOGIN_CLEANUP_20261005 */
try {
 localStorage.removeItem("lmsLoggedIn");
 localStorage.removeItem("lmsUsername");
} catch (e) {
 console.warn("Old login cleanup skipped:", e);
}


/* GRT - MEMBER TYPE VISIBILITY FIX */

function grtMemberFormVisibilityFix() {
 const memberType =
 document.getElementById("memberType") ||
 document.getElementById("newType");

 const sectionField =
 document.getElementById("memberSection") ||
 document.getElementById("newSec");

 if (!memberType) {
 return;
 }

 /*
 * Student -> Section visible + required
 * Faculty -> Section hidden + not required
 */
 if (sectionField) {
 const sectionContainer =
 sectionField.closest(".flex.items-center") ||
 sectionField.parentElement;

 const isStudent =
 memberType.value.trim().toLowerCase() === "student";

 if (sectionContainer) {
 sectionContainer.style.display = isStudent ? "" : "none";
 }

 sectionField.required = isStudent;

 if (!isStudent) {
 sectionField.value = "-";
 }
 }

 /*
 * Remove only the Resource Details block when
 * the Add Member form is currently displayed.
 */
 const workspace = document.getElementById("workspaceCard");

 if (workspace && document.getElementById("newType")) {
 const headings = workspace.querySelectorAll("h1,h2,h3,h4,h5,h6");

 headings.forEach(function (heading) {
 if (heading.textContent.trim().toLowerCase() !== "resource details") {
 return;
 }

 const block =
 heading.closest("section") ||
 heading.closest(".border") ||
 heading.parentElement;

 if (block) {
 block.remove();
 }
 });
 }
}

/* Apply when Member Type is changed. */
document.addEventListener("change", function (event) {
 if (event.target && event.target.id === "newType") {
 grtMemberFormVisibilityFix();
 }
});

/* Apply when New Student / New Faculty opens the form. */
document.addEventListener("click", function (event) {
 const button = event.target.closest("button");

 if (!button) {
 return;
 }

 const buttonText = (button.textContent || "").trim();

 if (/new\s+(student|faculty)/i.test(buttonText)) {
 setTimeout(grtMemberFormVisibilityFix, 0);
 }
});

/* Also check once after the current page is loaded. */
document.addEventListener("DOMContentLoaded", function () {
 setTimeout(grtMemberFormVisibilityFix, 100);
});


/* GRT - FINAL MEMBER TYPE SECTION FIX */

/*
 Student:
 - Section visible
 - Section required

 Faculty:
 - Section hidden
 - Section not required
*/

function grtUpdateMemberTypeFields() {

 const memberType = document.getElementById("newType");
 const sectionField = document.getElementById("newSec");

 if (!memberType || !sectionField) {
 return;
 }

 const isStudent =
 memberType.value.trim().toLowerCase() === "student";

 /*
 Find ONLY the row containing the Section field.
 */
 let sectionRow =
 sectionField.closest(".flex.items-center");

 if (!sectionRow) {
 sectionRow = sectionField.parentElement;
 }

 if (sectionRow) {
 sectionRow.style.display = isStudent ? "" : "none";
 }

 sectionField.required = isStudent;

 if (!isStudent) {
 sectionField.value = "";
 }
}


/*
 Remove ONLY the Resource Details panel from
 the Add Member screen.
*/
function grtRemoveMemberResourceDetails() {

 const workspace = document.getElementById("workspaceCard");

 if (!workspace) {
 return;
 }

 const elements = workspace.querySelectorAll("*");

 for (const element of elements) {

 const text = (element.textContent || "").trim();

 if (text !== "Resource Details") {
 continue;
 }

 /*
 Remove the closest small section/panel,
 not the entire workspace.
 */
 let block =
 element.closest("section");

 if (!block) {
 block =
 element.closest(".border");
 }

 if (!block) {
 block = element.parentElement;
 }

 if (block && block !== workspace) {
 block.remove();
 break;
 }
 }
}


/*
 Run the member-page fixes after the dynamic form
 has been inserted into workspaceCard.
*/
function grtApplyMemberPageFixes() {

 setTimeout(function () {

 grtUpdateMemberTypeFields();
 grtRemoveMemberResourceDetails();

 }, 50);
}


/*
 Member Type dropdown.
*/
document.addEventListener("change", function(event) {

 if (
 event.target &&
 event.target.id === "newType"
 ) {
 grtUpdateMemberTypeFields();
 }

});


/*
 When Add Member / New Student / New Faculty
 is opened, the form is dynamically generated.
*/
document.addEventListener("click", function(event) {

 const button =
 event.target.closest("button");

 if (!button) {
 return;
 }

 const text =
 (button.textContent || "")
 .trim()
 .toLowerCase();

 if (
 text.includes("new student") ||
 text.includes("new faculty") ||
 text === "new member"
 ) {

 setTimeout(function() {
 grtApplyMemberPageFixes();
 }, 100);

 }

});


/*
 Also handle direct navigation to the Add Member
 page through existing functions.
*/
setInterval(function() {

 const memberType =
 document.getElementById("newType");

 const sectionField =
 document.getElementById("newSec");

 if (memberType && sectionField) {

 grtUpdateMemberTypeFields();
 grtRemoveMemberResourceDetails();

 }

}, 500);




/* =========================================================
 GRT - FINAL TARGETED MEMBER FORM FIX
 ========================================================= */

window.GRT_FINAL_MEMBER_FORM_FIX = window.GRT_FINAL_MEMBER_FORM_FIX || {};

window.GRT_FINAL_MEMBER_FORM_FIX.updateSectionVisibility = function () {

 const memberType = document.getElementById("newType");
 const sectionField = document.getElementById("newSec");

 if (!memberType || !sectionField) {
 return;
 }

 const isStudent =
 memberType.value.trim().toLowerCase() === "student";

 /*
 * Hide/show the complete Section row.
 * This hides both the "Section" label and the select box.
 */
 let sectionRow = sectionField.closest(".flex.items-center");

 if (!sectionRow) {
 sectionRow = sectionField.parentElement;
 }

 if (sectionRow) {
 sectionRow.style.display = isStudent ? "" : "none";
 }

 sectionField.required = isStudent;

 if (!isStudent) {
 sectionField.value = "";
 }
};


/*
 * Remove the Resource Details block that was being injected
 * into the Add Member form.
 */
window.GRT_FINAL_MEMBER_FORM_FIX.removeResourceDetails = function () {

 document
 .querySelectorAll("[data-member-resource-fields]")
 .forEach(function (element) {
 element.remove();
 });
};


/*
 * The old function was adding Resource Details automatically.
 * Disable ONLY that unwanted injection function.
 */
window.addMemberResourceFields = function () {
 return;
};


/*
 * Apply the fix to the currently displayed Member form.
 */
window.GRT_FINAL_MEMBER_FORM_FIX.apply = function () {

 window.GRT_FINAL_MEMBER_FORM_FIX.removeResourceDetails();

 window.GRT_FINAL_MEMBER_FORM_FIX.updateSectionVisibility();
};


/*
 * Wrap the existing Add Member function.
 * The original function is still executed.
 * We only apply our fixes after it creates the form.
 */
if (
 typeof window.openNewMemberForm === "function" &&
 !window.GRT_FINAL_MEMBER_FORM_FIX.openWrapped
) {

 window.GRT_FINAL_MEMBER_FORM_FIX.originalOpenNewMemberForm =
 window.openNewMemberForm;

 window.openNewMemberForm = function () {

 const result =
 window.GRT_FINAL_MEMBER_FORM_FIX.originalOpenNewMemberForm.apply(
 this,
 arguments
 );

 window.GRT_FINAL_MEMBER_FORM_FIX.apply();

 return result;
 };

 window.GRT_FINAL_MEMBER_FORM_FIX.openWrapped = true;
}


/*
 * Member Type change:
 *
 * Student -> Section visible
 * Faculty -> Section hidden
 */
if (!window.GRT_FINAL_MEMBER_FORM_FIX.changeListenerInstalled) {

 document.addEventListener(
 "change",
 function (event) {

 if (!event.target) {
 return;
 }

 if (
 event.target.id === "newType" ||
 event.target.id === "memberType"
 ) {

 window.GRT_FINAL_MEMBER_FORM_FIX.updateSectionVisibility();

 window.GRT_FINAL_MEMBER_FORM_FIX.removeResourceDetails();
 }

 },
 true
 );

 window.GRT_FINAL_MEMBER_FORM_FIX.changeListenerInstalled = true;
}


/*
 * If a form already exists when this code loads,
 * apply the fix immediately.
 */
if (document.readyState === "loading") {

 document.addEventListener(
 "DOMContentLoaded",
 function () {
 window.GRT_FINAL_MEMBER_FORM_FIX.apply();
 },
 { once: true }
 );

} else {

 window.GRT_FINAL_MEMBER_FORM_FIX.apply();
}


/* =========================================================
 END FINAL TARGETED MEMBER FORM FIX
 ========================================================= */


/* ============================================================
   GRT_MONGODB_LIBRARY_SYNC_20261007
   Loads the existing LMS data from MongoDB and saves changes
   through the existing grtSaveAllLibraryData() function.
   ============================================================ */

async function grtLoadLibraryDataFromMongoDB() {
    try {
        const response = await fetch("/api/library-data", {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(
                "MongoDB data request failed: HTTP " + response.status
            );
        }

        const data = await response.json();

        if (!data || data.success !== true) {
            throw new Error("MongoDB returned an invalid response.");
        }

        /*
         * Only replace local data when MongoDB actually has
         * a saved library record.
         *
         * This prevents an empty new database from destroying
         * the existing browser data.
         */
        if (data.exists === true) {

            if (Array.isArray(data.books)) {
                dbBooks = data.books;
                localStorage.setItem(
                    GRT_DATA_STORAGE_KEYS.books,
                    JSON.stringify(dbBooks)
                );
                localStorage.setItem(
                    "dbBooks",
                    JSON.stringify(dbBooks)
                );
            }

            if (Array.isArray(data.members)) {
                dbMembers = data.members;
                localStorage.setItem(
                    GRT_DATA_STORAGE_KEYS.members,
                    JSON.stringify(dbMembers)
                );
                localStorage.setItem(
                    "dbMembers",
                    JSON.stringify(dbMembers)
                );
            }

            if (Array.isArray(data.issues)) {
                dbIssues = data.issues;
                localStorage.setItem(
                    GRT_DATA_STORAGE_KEYS.issues,
                    JSON.stringify(dbIssues)
                );
            }

            if (Array.isArray(data.reservations)) {
                dbReservations = data.reservations;
                localStorage.setItem(
                    GRT_DATA_STORAGE_KEYS.reservations,
                    JSON.stringify(dbReservations)
                );
            }

            if (Array.isArray(data.fines)) {
                dbFines = data.fines;
                localStorage.setItem(
                    GRT_DATA_STORAGE_KEYS.fines,
                    JSON.stringify(dbFines)
                );
            }

            console.log("🟢 MongoDB library data loaded successfully.");

            /*
             * Refresh currently visible member/book screens
             * if the existing functions are available.
             */
            try {
                if (typeof refreshMemberPage === "function") {
                    refreshMemberPage();
                }
            } catch (e) {
                console.warn("Member refresh skipped:", e);
            }

            try {
                if (typeof loadSubpage === "function") {
                    const activeModule =
                        document.querySelector(".nav-pill-btn.tab-active");

                    if (activeModule) {
                        const moduleName =
                            activeModule.getAttribute("data-module");

                        if (moduleName === "member") {
                            loadSubpage("Member");
                        }
                    }
                }
            } catch (e) {
                console.warn("Current page refresh skipped:", e);
            }

        } else {
            console.log(
                "ℹ️ MongoDB library record does not exist yet."
            );
        }

    } catch (error) {
        console.warn(
            "⚠️ MongoDB library data could not be loaded:",
            error
        );
    }
}


async function grtSaveLibraryDataToMongoDB() {
    try {

        const payload = {
            books: Array.isArray(dbBooks) ? dbBooks : [],
            members: Array.isArray(dbMembers) ? dbMembers : [],
            issues: Array.isArray(dbIssues) ? dbIssues : [],
            reservations: Array.isArray(dbReservations)
                ? dbReservations
                : [],
            fines: Array.isArray(dbFines) ? dbFines : []
        };

        const response = await fetch("/api/library-data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(
                "MongoDB save failed: HTTP " + response.status
            );
        }

        const result = await response.json();

        if (result.success !== true) {
            throw new Error(
                result.message || "MongoDB save failed."
            );
        }

        console.log(
            "🟢 MongoDB library data saved:",
            result.counts
        );

    } catch (error) {
        console.warn(
            "⚠️ MongoDB library data save failed:",
            error
        );
    }
}


/*
 * Replace the existing local-only save function with a wrapper
 * that keeps localStorage AND sends the same data to MongoDB.
 *
 * The original function is preserved under a different name.
 */
if (
    typeof grtSaveAllLibraryData === "function" &&
    typeof window.grtOriginalSaveAllLibraryData !== "function"
) {

    window.grtOriginalSaveAllLibraryData =
        grtSaveAllLibraryData;

    window.grtSaveAllLibraryData =
        function () {

            try {
                window.grtOriginalSaveAllLibraryData();
            } catch (error) {
                console.warn(
                    "⚠️ Existing local library save failed:",
                    error
                );
            }

            grtSaveLibraryDataToMongoDB();
        };

    console.log(
        "🟢 Existing library save connected to MongoDB."
    );
}


/*
 * Load MongoDB data after the existing page startup code has
 * finished loading its localStorage data.
 */
window.addEventListener(
    "load",
    function () {
        setTimeout(
            grtLoadLibraryDataFromMongoDB,
            300
        );
    }
);



/* ============================================================
   GRT LMS - REAL CATALOGUE BOOK EDIT
   Uses the existing dbBooks catalogue database.
   ============================================================ */

function editCatalogueBook(accession) {
    try {
        const accn = String(accession || '').trim();

        if (!accn) {
            alert('Invalid book accession number.');
            return false;
        }

        if (!Array.isArray(dbBooks)) {
            alert('Book catalogue database was not found.');
            return false;
        }

        const book = dbBooks.find(item => {
            const existing = String(
                item.accn ||
                item.accession ||
                item.accessionNumber ||
                ''
            ).trim();

            return existing.toLowerCase() === accn.toLowerCase();
        });

        if (!book) {
            alert(`Book "${accn}" was not found.`);
            return false;
        }

        const accessionInput =
            document.getElementById('catalogueAccession');

        const titleInput =
            document.getElementById('catalogueTitle');

        const authorInput =
            document.getElementById('catalogueAuthor');

        const publisherInput =
            document.getElementById('cataloguePublisher');

        const editionInput =
            document.getElementById('catalogueEdition');

        if (
            !accessionInput ||
            !titleInput ||
            !authorInput ||
            !publisherInput ||
            !editionInput
        ) {
            alert('Book Entry form was not found.');
            return false;
        }

        accessionInput.value =
            book.accn ||
            book.accession ||
            book.accessionNumber ||
            '';

        titleInput.value = book.title || '';
        authorInput.value = book.author || '';
        publisherInput.value = book.publisher || '';
        editionInput.value = book.edition || '';

        window.editingCatalogueAccession = accn;

        titleInput.focus();

        alert(
            `Book "${book.title || accn}" loaded for editing.`
        );

        return true;

    } catch (error) {
        console.error('Catalogue edit error:', error);

        alert(
            'Unable to load the book for editing.\n\n' +
            error.message
        );

        return false;
    }
}


/* ============================================================
   GRT LMS - REPLACE REAL CATALOGUE SAVE WITH EDIT SUPPORT
   ============================================================ */

(function () {

    const originalSaveNewBookEntry =
        window.saveNewBookEntry;

    if (typeof originalSaveNewBookEntry !== 'function') {
        console.warn(
            '⚠️ saveNewBookEntry was not found. Edit save hook skipped.'
        );
        return;
    }

    window.saveNewBookEntry = function (event) {

        const editingAccession =
            window.editingCatalogueAccession;

        // Normal Add operation.
        if (!editingAccession) {
            return originalSaveNewBookEntry(event);
        }

        if (event) {
            event.preventDefault();
        }

        try {

            if (!Array.isArray(dbBooks)) {
                throw new Error(
                    'Book catalogue database was not found.'
                );
            }

            const accessionInput =
                document.getElementById('catalogueAccession');

            const titleInput =
                document.getElementById('catalogueTitle');

            const authorInput =
                document.getElementById('catalogueAuthor');

            const publisherInput =
                document.getElementById('cataloguePublisher');

            const editionInput =
                document.getElementById('catalogueEdition');

            if (
                !accessionInput ||
                !titleInput ||
                !authorInput ||
                !publisherInput ||
                !editionInput
            ) {
                throw new Error(
                    'Book Entry form fields were not found.'
                );
            }

            const newAccession =
                accessionInput.value.trim();

            const title =
                titleInput.value.trim();

            const author =
                authorInput.value.trim();

            const publisher =
                publisherInput.value.trim();

            const edition =
                editionInput.value.trim();

            if (!newAccession || !title || !author) {
                alert(
                    'Please enter Accession No, Book Title and Author.'
                );
                return false;
            }

            const bookIndex = dbBooks.findIndex(item => {

                const existing = String(
                    item.accn ||
                    item.accession ||
                    item.accessionNumber ||
                    ''
                ).trim();

                return existing.toLowerCase() ===
                    String(editingAccession).toLowerCase();
            });

            if (bookIndex === -1) {
                alert(
                    `Book "${editingAccession}" was not found.`
                );

                window.editingCatalogueAccession = null;

                return false;
            }

            // Prevent changing to another existing accession number.
            const duplicate = dbBooks.some((item, index) => {

                if (index === bookIndex) {
                    return false;
                }

                const existing = String(
                    item.accn ||
                    item.accession ||
                    item.accessionNumber ||
                    ''
                ).trim();

                return existing.toLowerCase() ===
                    newAccession.toLowerCase();
            });

            if (duplicate) {
                alert(
                    `Accession Number "${newAccession}" already exists.`
                );
                return false;
            }

            const oldBook = dbBooks[bookIndex];

            dbBooks[bookIndex] = {
                ...oldBook,

                id: oldBook.id || Date.now(),

                accn: newAccession,
                accession: newAccession,
                accessionNumber: newAccession,

                title: title,
                author: author,
                publisher: publisher,
                edition: edition
            };

            // Keep the existing catalogue persistence system.
            saveCatalogueBooks();

            console.log(
                '🟢 Catalogue book updated:',
                dbBooks[bookIndex]
            );

            alert(
                `Book "${title}" updated successfully!`
            );

            window.editingCatalogueAccession = null;

            accessionInput.value = '';
            titleInput.value = '';
            authorInput.value = '';
            publisherInput.value = '';
            editionInput.value = '';

            if (typeof loadSubpage === 'function') {
                loadSubpage('Book Entry');
            } else if (
                typeof loadModuleSubpage === 'function'
            ) {
                loadModuleSubpage(
                    'catalogue',
                    'Book Entry'
                );
            }

            return false;

        } catch (error) {

            console.error(
                'Catalogue book update error:',
                error
            );

            alert(
                'Unable to update the book.\n\n' +
                error.message
            );

            return false;
        }
    };

    console.log(
        '🟢 Real Catalogue Book Edit connected.'
    );

})();


/* ============================================================
   GRT LMS - FOOTER REPLACEMENT BOTTOM NOTIFICATIONS
   ============================================================ */

function grtBottomNotify(message, type = 'success', duration = 3500) {
    const area = document.getElementById('grtBottomNotificationArea');

    if (!area) {
        console.log(`[${type}] ${message}`);
        return;
    }

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    const icon = icons[type] || icons.info;

    area.innerHTML = `
        <div class="grt-bottom-toast grt-bottom-toast-${type}">
            <span class="grt-bottom-toast-icon">${icon}</span>
            <span class="grt-bottom-toast-message">${escapeHtml(message)}</span>
        </div>
    `;

    if (duration > 0) {
        clearTimeout(window.__grtBottomToastTimer);

        window.__grtBottomToastTimer = setTimeout(() => {
            const toast = area.querySelector('.grt-bottom-toast');

            if (toast) {
                toast.classList.add('grt-bottom-toast-hide');

                setTimeout(() => {
                    if (area.querySelector('.grt-bottom-toast') === toast) {
                        area.innerHTML = '';
                    }
                }, 250);
            }
        }, duration);
    }
}

/*
 * Replace browser alert() with the LMS bottom notification.
 * This keeps existing modules working without changing every alert()
 * manually.
 */

window.alert = function(message) {
    const msg = String(message || '').trim();

    if (!msg) return;

    let type = 'info';
    const lower = msg.toLowerCase();

    /*
     * SUCCESS / ACKNOWLEDGEMENT
     */
    const successWords = [
        'successfully',
        'success',
        'updated successfully',
        'saved successfully',
        'added successfully',
        'deleted successfully',
        'removed successfully',
        'restored successfully',
        'generated successfully',
        'allocated successfully',
        'renewed successfully',
        'cancelled successfully',
        'placed successfully',
        'unlocked',
        'locked',
        'completed',
        'imported'
    ];

    /*
     * REAL ERRORS
     */
    const errorWords = [
        'error',
        'invalid',
        'not found',
        'failed',
        'cannot',
        'could not',
        'unable',
        'required',
        'please select',
        'please enter',
        'please provide',
        'already exists',
        'duplicate',
        'too large',
        'empty'
    ];

    if (successWords.some(word => lower.includes(word))) {
        type = 'success';
    } else if (errorWords.some(word => lower.includes(word))) {
        type = 'error';
    }

    /*
     * Use the existing LMS notification area.
     * No browser popup is opened.
     */
    let area = document.getElementById('grtBottomNotificationArea');

    if (!area) {
        area = document.createElement('div');
        area.id = 'grtBottomNotificationArea';
        document.body.appendChild(area);
    }

    const icons = {
        success: '✓',
        error: '!',
        warning: '⚠',
        info: 'ℹ'
    };

    area.innerHTML = `
        <div class="grt-bottom-toast grt-bottom-toast-${type}">
            <span class="grt-bottom-toast-icon">${icons[type]}</span>
            <span class="grt-bottom-toast-message">${escapeHtml(msg)}</span>
        </div>
    `;

    clearTimeout(window.__grtBottomToastTimer);

    const toast = area.querySelector('.grt-bottom-toast');

    window.__grtBottomToastTimer = setTimeout(() => {
        if (!toast) return;

        toast.classList.add('grt-bottom-toast-hide');

        setTimeout(() => {
            if (area.querySelector('.grt-bottom-toast') === toast) {
                area.innerHTML = '';
            }
        }, 350);
    }, 3000);
};
