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
 egate: ["Gate Register", "Visitor Log", "Summary", "Settings"],
 catalogue: ["Book Entry"],
 search: ["Simple Search", "Advanced Search", "OPAC Catalog", "New Arrivals"],
 circulation: ["Issue", "Return", "Renewal", "Reservation", "Fine Collection"],
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

 const input = document.getElementById("issueAccn");

 if (!input) {
 return;
 }

 const accn = input.value.trim().toLowerCase();

 const titleField = document.getElementById("issueBookTitle");
 const authorField = document.getElementById("issueBookAuthor");
 const publisherField = document.getElementById("issueBookPublisher");
 const editionField = document.getElementById("issueBookEdition");
 const message = document.getElementById("issueBookMessage");

 if (!titleField) {
 return;
 }

 titleField.value = "";
 authorField.value = "";
 publisherField.value = "";
 editionField.value = "";

 if (message) {
 message.textContent = "";
 message.className = "text-xs font-semibold text-gray-500";
 }

 if (!accn) {
 return;
 }

 if (!Array.isArray(dbBooks)) {
 if (message) {
 message.textContent = "Book catalogue is not available.";
 message.className = "text-xs font-semibold text-red-600";
 }
 return;
 }

 const book = dbBooks.find(b =>
 String(b.accn || "").trim().toLowerCase() === accn
 );

 if (!book) {
 if (message) {
 message.textContent = "Accession Number not found in catalogue.";
 message.className = "text-xs font-semibold text-red-600";
 }
 return;
 }

 titleField.value =
 book.title ||
 book.bookTitle ||
 "";

 authorField.value =
 book.author ||
 book.authors ||
 "";

 publisherField.value =
 book.publisher ||
 "";

 editionField.value =
 book.edition ||
 "";

 if (message) {
 message.textContent = "Book found.";
 message.className = "text-xs font-semibold text-green-600";
 }
}


function processIssueBook(event) {
 event.preventDefault();
 const memberId = document.getElementById('issueMemberId').value.trim();
 const accn = document.getElementById('issueAccn').value.trim().toUpperCase();

 const member = dbMembers.find(m => m.id.toLowerCase() === memberId.toLowerCase());
 if (!member) {
 alert(`Member ID "${memberId}" not found.`);
 return;
 }
 if (member.status !== "Active" || member.memberLock === "Yes") {
 alert(`Cannot issue book: Member account is ${member.memberLock === "Yes" ? "LOCKED" : "Inactive"}.`);
 return;
 }

 const book = dbBooks.find(b => b.accn.toUpperCase() === accn);
 if (!book) {
 alert(`Accession Number "${accn}" not found in catalogue.`);
 return;
 }

 const isAlreadyIssued = dbIssues.some(i => i.accn.toUpperCase() === accn && i.status === "Issued");
 if (isAlreadyIssued) {
 alert(`Book "${book.title}" (${accn}) is already currently issued to another member.`);
 return;
 }

 const today = new Date();
 const dueDate = new Date();
 dueDate.setDate(today.getDate() + 14);

 dbIssues.push({
 id: dbIssues.length + 1,
 accn: book.accn,
 title: book.title,
 memberId: member.id,
 memberName: member.name,
 issueDate: today.toISOString().split('T')[0],
 dueDate: dueDate.toISOString().split('T')[0],
 renewals: 0,
 status: "Issued"
 });

 grtSaveAllLibraryData();

 alert(`Book "${book.title}" successfully issued to ${member.name}! Due Date: ${dueDate.toISOString().split('T')[0]}`);
 loadModuleSubpage('circulation', 'Issue');
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
 const fineAmt = diffDays * 2.0; 
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

 if (member.memberLock === 'Yes') {
 const confirmUnlock = confirm(`Member "${member.name}" (${member.id}) is currently locked.\nDo you want to unlock this member?`);
 if (confirmUnlock) {
 member.memberLock = 'No';
 member.lockReason = '';
 alert(`Member "${member.name}" has been unlocked.`);
 loadSubpage('Member');
 }
 return;
 }

 const reason = prompt(`Enter reason for locking ${member.name} (${member.id}):`, "Pending library fine / Document pending");
 if (reason === null) return;

 member.memberLock = 'Yes';
 member.lockReason = reason.trim() || 'Administrative Lock';
 alert(`Member "${member.name}" (${member.id}) has been locked and added to the Locked Members list.`);
 loadSubpage('Member');
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
 const member = dbMembers.find(m => m.id === id);
 if (!member) return;

 const card = document.getElementById('workspaceCard');
 const inputClass = "w-full px-3 py-2 bg-white border border-gray-300 rounded transition-all duration-200 hover:border-blue-400 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600";
 const labelClass = "font-semibold text-gray-700 w-40 shrink-0";
 
 const sel = (val, current) => val === current ? 'selected' : '';

 card.innerHTML = `
 <div class="mb-4 flex justify-between items-center">
 <h2 class="text-sm font-bold text-[#004080] tracking-wider uppercase">EDIT MEMBER DETAILS</h2>
 <button onclick="loadSubpage('Member')" class="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs font-bold">&larr; Back</button>
 </div>

 <form onsubmit="updateMember(event, '${escapeHtml(member.id)}')" class="border border-gray-200 rounded-lg p-8 bg-white text-xs w-full max-w-5xl shadow-sm">
 <div class="flex flex-col md:flex-row gap-x-12 gap-y-6">
 <div class="flex-1 flex flex-col space-y-6">
 <div class="flex items-center">
 <label class="${labelClass}">*Member ID</label>
 <input type="text" id="newId" required class="${inputClass}" value="${escapeHtml(member.id)}">
 </div>
 <div class="flex items-center">
 <label class="${labelClass}">*Full Name</label>
 <input type="text" id="newName" required class="${inputClass}" value="${escapeHtml(member.name)}">
 </div>
 <div class="flex items-center">
 <label class="${labelClass}">*Batch</label>
 <select id="newBatch"
 class="${inputClass}"
 data-current-batch="${escapeHtml(member.batch || '')}"
 onchange="lmsHandleBatchChange_20261005(this)">
 ${lmsBatchOptions_20261005(member.batch || '')}
 </select>
 <button type="button"
 
 class="ml-2 px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded font-bold whitespace-nowrap">
 Edit Batches
 </button>
 </div>
 <div class="flex items-center">
 <label class="${labelClass}">*Department</label>
 <select id="newDepartment" class="${inputClass}">
 <option ${sel('Computer Science and Engineering', member.department)}>Computer Science and Engineering</option>
 <option ${sel('Information Technology', member.department)}>Information Technology</option>
 <option ${sel('Electronics and Communication Engineering', member.department)}>Electronics and Communication Engineering</option>
 <option ${sel('Mechanical Engineering', member.department)}>Mechanical Engineering</option>
 <option ${sel('Civil Engineering', member.department)}>Civil Engineering</option>
 </select>
 </div>
 <div class="flex items-center mt-auto pt-6">
 <label class="${labelClass}">*Section</label>
 <select id="newSec" class="${inputClass}">
 <option ${sel('A', member.section)}>A</option>
 <option ${sel('B', member.section)}>B</option>
 <option ${sel('Staff', member.section)}>Staff</option>
 </select>
 </div>
 </div>

 <div class="flex-1 flex flex-col space-y-6">
 <div class="flex items-center">
 <label class="${labelClass}">*Member Type</label>
 <select id="newType" class="${inputClass}">
 <option ${sel('Student', member.type)}>Student</option>
 <option ${sel('Faculty', member.type)}>Faculty</option>
 </select>
 </div>
 <div class="flex items-center">
 <label class="${labelClass}">*Gender</label>
 <select id="newGender" class="${inputClass}">
 <option ${sel('Male', member.gender)}>Male</option>
 <option ${sel('Female', member.gender)}>Female</option>
 </select>
 </div>
 <div class="flex items-center">
 <label class="${labelClass}">*Type</label>
 <select id="newProg" class="${inputClass}">
 <option ${sel('B.E.', member.programme)}>B.E.</option>
 <option ${sel('B.Tech', member.programme)}>B.Tech</option>
 <option ${sel('Faculty', member.programme)}>Faculty</option>
 </select>
 </div>
 <div class="flex items-start">
 <label class="${labelClass} pt-2">Photo</label>
 <div class="w-full flex flex-col space-y-3">
 <div class="w-[110px] h-[130px] border border-gray-300 bg-[#e6eff6] flex flex-col items-center justify-center relative overflow-hidden rounded-sm">
 <div id="defaultPhotoPlaceholder" class="flex flex-col items-center justify-center text-center p-2 ${member.photo ? 'hidden' : ''}">
 <svg class="w-10 h-10 text-[#6893b8] mb-1" fill="currentColor" viewBox="0 0 24 24">
 <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
 </svg>
 <span class="text-[8px] font-bold text-[#6893b8] tracking-tight uppercase leading-tight">No Image Available</span>
 </div>
 <img id="photoPreview" src="${escapeHtml(member.photo || '')}" class="absolute inset-0 w-full h-full object-cover ${member.photo ? '' : 'hidden'}" alt="Preview">
 </div>
 <input type="file" id="newPhoto" accept="image/*" class="w-full text-xs text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:border file:border-gray-300 file:bg-gray-100 file:text-gray-700 file:rounded-sm file:cursor-pointer hover:file:bg-gray-200 transition-colors" onchange="previewSelectedImage(event)">
 </div>
 </div>
 <div class="flex items-center mt-auto">
 <label class="${labelClass}">Status</label>
 <select id="newStatus" class="${inputClass}">
 <option ${sel('Active', member.status)}>Active</option>
 <option ${sel('Inactive', member.status)}>Inactive</option>
 </select>
 </div>
 </div>
 </div>
 <div class="pt-10 flex justify-end space-x-3">
 <button type="button" onclick="loadSubpage('Member')" class="px-6 py-2 bg-[#9ca3af] hover:bg-gray-500 text-white font-bold rounded shadow-sm transition-colors text-xs">Cancel</button>
 <button type="submit" class="px-6 py-2 bg-[#004080] hover:bg-blue-900 text-white font-bold rounded shadow-sm transition-colors text-xs">Update Member Details</button>
 </div>
 </form>
 `;
 }

 function updateMember(event, oldId) {
 event.preventDefault();
 const index = dbMembers.findIndex(m => m.id === oldId);
 if (index === -1) return;

 const updatedMember = {
 id: document.getElementById('newId').value,
 name: document.getElementById('newName').value,
 type: document.getElementById('newType').value,
 gender: document.getElementById('newGender').value,
 batch: document.getElementById('newBatch').value,
 programme: document.getElementById('newProg').value,
 department: document.getElementById('newDepartment').value,
 photo: dbMembers[index].photo, 
 section: document.getElementById('newSec').value,
 status: document.getElementById('newStatus').value,
 doj: dbMembers[index].doj,
 dol: dbMembers[index].dol,
 memberLock: dbMembers[index].memberLock,
 lockReason: dbMembers[index].lockReason
 };

 const photoFile = document.getElementById('newPhoto').files[0];
 if (photoFile && photoFile.size > 1024 * 1024) {
 alert('Please choose a photo smaller than 1 MB.');
 return;
 }

 const finishUpdate = () => {
 dbMembers[index] = updatedMember;
 alert('Member details updated successfully!');
 loadSubpage('Member');
 };

 if (photoFile) {
 const reader = new FileReader();
 reader.onload = () => {
 updatedMember.photo = reader.result;
 finishUpdate();
 };
 reader.onerror = () => alert('The selected photo could not be read.');
 reader.readAsDataURL(photoFile);
 } else {
 finishUpdate();
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

 if (title === 'Settings') {
 card.innerHTML = `
 <div class="flex justify-between items-center mb-2">
 <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">EGATE (SETTINGS)</h2>
 </div>
 <div class="border border-gray-300 rounded p-6 bg-white shadow-sm text-xs w-full max-w-3xl space-y-4">
 <p class="text-gray-700 font-semibold">eGate attendance reports and hardware barcode reader configurations.</p>
 <button onclick="alert('Settings updated successfully!')" class="px-4 py-2 bg-blue-700 text-white font-bold rounded">Save Configuration</button>
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
 const activeIssues = dbIssues.filter(i => i.status === "Issued");
 const issueRows = activeIssues.map(i => `
 <tr class="hover:bg-gray-50 border-b">
 <td class="p-2 font-mono font-bold text-blue-900 border-r">${escapeHtml(i.accn)}</td>
 <td class="p-2 font-semibold border-r">${escapeHtml(i.title)}</td>
 <td class="p-2 font-mono border-r">${escapeHtml(i.memberId)}</td>
 <td class="p-2 border-r">${escapeHtml(i.memberName)}</td>
 <td class="p-2 border-r">${escapeHtml(i.issueDate)}</td>
 <td class="p-2 font-bold text-amber-700">${escapeHtml(i.dueDate)}</td>
 </tr>
 `).join('');

 card.innerHTML = `
 <div class="flex justify-between items-center mb-2">
 <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">BOOK ISSUE MANAGEMENT</h2>
 <span class="text-xs text-blue-700 font-bold bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">${activeIssues.length} Currently Issued</span>
 </div>

 
<form onsubmit="processIssueBook(event)" class="border border-gray-300 rounded-xl p-5 bg-gray-50/70 shadow-sm text-xs w-full max-w-4xl space-y-4">

 <p class="text-gray-800 font-bold text-sm">
 Issue New Book to Member
 </p>

 <!-- MEMBER DETAILS -->
 <div class="border border-blue-200 rounded-lg bg-white p-4 space-y-3">

 <p class="font-bold text-blue-900">
 Member Details
 </p>

 <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

 <div class="flex flex-col space-y-1">
 <label class="font-semibold text-gray-700">
 *Member ID
 </label>

 <input
 type="text"
 id="issueMemberId"
 required
 autocomplete="off"
 placeholder="Type Member ID"
 oninput="grtIssueMemberLookup()"
 class="px-3 py-2 bg-white border border-gray-300 rounded uppercase"
 >
 </div>

 <div class="flex flex-col space-y-1">
 <label class="font-semibold text-gray-700">
 Member Name
 </label>

 <input
 type="text"
 id="issueMemberName"
 readonly
 class="px-3 py-2 bg-gray-100 border border-gray-300 rounded"
 >
 </div>

 <div class="flex flex-col space-y-1">
 <label class="font-semibold text-gray-700">
 Batch
 </label>

 <input
 type="text"
 id="issueMemberBatch"
 readonly
 class="px-3 py-2 bg-gray-100 border border-gray-300 rounded"
 >
 </div>

 <div class="flex flex-col space-y-1">
 <label class="font-semibold text-gray-700">
 Type
 </label>

 <input
 type="text"
 id="issueMemberType"
 readonly
 class="px-3 py-2 bg-gray-100 border border-gray-300 rounded"
 >
 </div>

 <div class="flex flex-col space-y-1">
 <label class="font-semibold text-gray-700">
 Department
 </label>

 <input
 type="text"
 id="issueMemberDepartment"
 readonly
 class="px-3 py-2 bg-gray-100 border border-gray-300 rounded"
 >
 </div>

 <div class="flex flex-col space-y-1">
 <label class="font-semibold text-gray-700">
 Group
 </label>

 <input
 type="text"
 id="issueMemberGroup"
 readonly
 class="px-3 py-2 bg-gray-100 border border-gray-300 rounded"
 >
 </div>

 </div>

 <div class="flex items-center gap-4 pt-2">

 <div class="w-24 h-28 border border-gray-300 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
 <img
 id="issueMemberPhoto"
 src=""
 alt="Member Photo"
 class="w-full h-full object-cover hidden"
 >

 <span
 id="issueMemberPhotoPlaceholder"
 class="text-[10px] text-gray-400 text-center px-2"
 >
 NO PHOTO
 </span>
 </div>

 <p
 id="issueMemberMessage"
 class="text-xs font-semibold text-gray-500"
 ></p>

 </div>

 </div>

 <!-- BOOK DETAILS -->
 <div class="border border-indigo-200 rounded-lg bg-white p-4 space-y-3">

 <p class="font-bold text-indigo-900">
 Book Details
 </p>

 <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

 <div class="flex flex-col space-y-1">
 <label class="font-semibold text-gray-700">
 *Accession Number
 </label>

 <input
 type="text"
 id="issueAccn"
 required
 autocomplete="off"
 placeholder="Type Book Accession"
 oninput="grtIssueBookLookup()"
 class="px-3 py-2 bg-white border border-gray-300 rounded uppercase"
 >
 </div>

 <div class="flex flex-col space-y-1">
 <label class="font-semibold text-gray-700">
 Book Title
 </label>

 <input
 type="text"
 id="issueBookTitle"
 readonly
 class="px-3 py-2 bg-gray-100 border border-gray-300 rounded"
 >
 </div>

 <div class="flex flex-col space-y-1">
 <label class="font-semibold text-gray-700">
 Author
 </label>

 <input
 type="text"
 id="issueBookAuthor"
 readonly
 class="px-3 py-2 bg-gray-100 border border-gray-300 rounded"
 >
 </div>

 <div class="flex flex-col space-y-1">
 <label class="font-semibold text-gray-700">
 Publisher
 </label>

 <input
 type="text"
 id="issueBookPublisher"
 readonly
 class="px-3 py-2 bg-gray-100 border border-gray-300 rounded"
 >
 </div>

 <div class="flex flex-col space-y-1">
 <label class="font-semibold text-gray-700">
 Edition
 </label>

 <input
 type="text"
 id="issueBookEdition"
 readonly
 class="px-3 py-2 bg-gray-100 border border-gray-300 rounded"
 >
 </div>

 </div>

 <p
 id="issueBookMessage"
 class="text-xs font-semibold text-gray-500"
 ></p>

 </div>

 <div class="pt-2 flex justify-end">

 <button
 type="submit"
 class="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded shadow"
 >
 Issue Book
 </button>

 </div>

</form>


 <div class="border border-gray-300 rounded bg-white shadow-sm overflow-hidden w-full max-w-5xl mt-3 flex flex-col">
 <h3 class="p-3 bg-gray-100 font-bold text-xs uppercase text-gray-700 border-b">Active Circulated Books</h3>
 <table class="w-full text-left border-collapse text-[11px]">
 <thead class="bg-gray-50 text-gray-700 uppercase border-b border-gray-200">
 <tr>
 <th class="p-2 border-r">Accession No</th>
 <th class="p-2 border-r">Book Title</th>
 <th class="p-2 border-r">Member ID</th>
 <th class="p-2 border-r">Member Name</th>
 <th class="p-2 border-r">Issue Date</th>
 <th class="p-2">Due Date</th>
 </tr>
 </thead>
 <tbody>
 ${issueRows.length > 0 ? issueRows : `<tr><td colspan="6" class="text-center py-8 text-gray-400 italic">No active book issues found.</td></tr>`}
 </tbody>
 </table>
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
 <td class="p-2 text-center">
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

 // Update footer URL
 const footer =
 document.getElementById("footerUrl");

 if (footer) {
 footer.innerText =
 "https://grtietcoe.org/library/" +
 module +
 "/index.php?act=viewscreen&" +
 Math.floor(
 Math.random() * 1000000000
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

/* =========================================================
 GRT - BOOK STORAGE / EDIT / DELETE
 ========================================================= */

(function () {
 const STORAGE_KEY = "grt_lms_books";

 function getBooks() {
 try {
 return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
 } catch (e) {
 console.error("Unable to read books:", e);
 return [];
 }
 }

 function saveBooks(books) {
 localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
 }

 function findBookContainer() {
 return (
 document.querySelector("#bookTableBody") ||
 document.querySelector("#booksTableBody") ||
 document.querySelector("#catalogueList") ||
 document.querySelector("#bookList") ||
 document.querySelector("table tbody")
 );
 }

 function displayBooks() {
 const tbody = findBookContainer();
 if (!tbody) return;

 const books = getBooks();

 tbody.innerHTML = "";

 if (books.length === 0) {
 tbody.innerHTML = `
 <tr>
 <td colspan="20" style="text-align:center;padding:20px;">
 No books available
 </td>
 </tr>
 `;
 return;
 }

 books.forEach((book, index) => {
 const row = document.createElement("tr");

 row.innerHTML = `
 <td>${escapeHTML(book.accessionNo)}</td>
 <td>${escapeHTML(book.title)}</td>
 <td>${escapeHTML(book.author)}</td>
 <td>${escapeHTML(book.publisher)}</td>
 <td>${escapeHTML(book.subject)}</td>
 <td>${escapeHTML(book.isbn)}</td>
 <td>${escapeHTML(book.edition)}</td>
 <td>${escapeHTML(book.year)}</td>
 <td>${escapeHTML(book.quantity)}</td>
 <td>
 <button type="button" onclick="editLibraryBook(${index})">
 Edit
 </button>

 <button type="button" onclick="deleteLibraryBook(${index})">
 Delete
 </button>
 </td>
 `;

 tbody.appendChild(row);
 });
 }

 function escapeHTML(value) {
 return String(value ?? "")
 .replace(/&/g, "&amp;")
 .replace(/</g, "&lt;")
 .replace(/>/g, "&gt;")
 .replace(/"/g, "&quot;")
 .replace(/'/g, "&#039;");
 }

 function getValue(selectors) {
 for (const selector of selectors) {
 const element = document.querySelector(selector);
 if (element) return element.value.trim();
 }
 return "";
 }

 function setValue(selectors, value) {
 for (const selector of selectors) {
 const element = document.querySelector(selector);
 if (element) {
 element.value = value ?? "";
 return;
 }
 }
 }

 window.saveLibraryBook = function () {
 const book = {
 accessionNo: getValue([
 "#accessionNo",
 "#accession",
 "[name='accessionNo']",
 "[name='accession']"
 ]),

 title: getValue([
 "#bookTitle",
 "#title",
 "[name='bookTitle']",
 "[name='title']"
 ]),

 author: getValue([
 "#author",
 "[name='author']"
 ]),

 publisher: getValue([
 "#publisher",
 "[name='publisher']"
 ]),

 subject: getValue([
 "#subject",
 "[name='subject']"
 ]),

 isbn: getValue([
 "#isbn",
 "[name='isbn']"
 ]),

 edition: getValue([
 "#edition",
 "[name='edition']"
 ]),

 year: getValue([
 "#year",
 "#publicationYear",
 "[name='year']"
 ]),

 quantity: getValue([
 "#quantity",
 "[name='quantity']"
 ])
 };

 if (!book.title) {
 alert("Please enter the Book Title.");
 return;
 }

 const books = getBooks();

 const editingIndex = window.editingLibraryBookIndex;

 if (
 editingIndex !== undefined &&
 editingIndex !== null &&
 editingIndex >= 0
 ) {
 books[editingIndex] = book;
 window.editingLibraryBookIndex = null;

 saveBooks(books);

 alert("Book details updated successfully.");
 } else {
 books.push(book);
 saveBooks(books);

 alert("Book added successfully.");
 }

 displayBooks();

 const form = document.querySelector("form");

 if (form) {
 form.reset();
 }
 };

 window.editLibraryBook = function (index) {
 const books = getBooks();
 const book = books[index];

 if (!book) return;

 setValue([
 "#accessionNo",
 "#accession",
 "[name='accessionNo']",
 "[name='accession']"
 ], book.accessionNo);

 setValue([
 "#bookTitle",
 "#title",
 "[name='bookTitle']",
 "[name='title']"
 ], book.title);

 setValue([
 "#author",
 "[name='author']"
 ], book.author);

 setValue([
 "#publisher",
 "[name='publisher']"
 ], book.publisher);

 setValue([
 "#subject",
 "[name='subject']"
 ], book.subject);

 setValue([
 "#isbn",
 "[name='isbn']"
 ], book.isbn);

 setValue([
 "#edition",
 "[name='edition']"
 ], book.edition);

 setValue([
 "#year",
 "#publicationYear",
 "[name='year']"
 ], book.year);

 setValue([
 "#quantity",
 "[name='quantity']"
 ], book.quantity);

 window.editingLibraryBookIndex = index;

 alert("Book loaded. Edit the details and click Save/Add Book.");
 };

 window.deleteLibraryBook = function (index) {
 const books = getBooks();

 if (!books[index]) return;

 if (!confirm("Are you sure you want to delete this book?")) {
 return;
 }

 books.splice(index, 1);

 saveBooks(books);
 displayBooks();

 alert("Book deleted successfully.");
 };

 document.addEventListener("DOMContentLoaded", function () {
 displayBooks();
 });

})();



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

        const confirmed = confirm(
            `Are you sure you want to delete this book?\n\n` +
            `Accession No: ${accn}\n` +
            `Title: ${bookTitle}`
        );

        if (!confirmed) {
            return false;
        }

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
            return false;
        }

        dbBooks.splice(index, 1);

        // Save using the existing Catalogue persistence system.
        saveCatalogueBooks();

        console.log(
            '🗑️ Catalogue book deleted:',
            accn,
            bookTitle
        );

        alert(
            `Book "${bookTitle}" (${accn}) deleted successfully.`
        );

        // Refresh the existing Book Entry page.
        if (typeof loadSubpage === 'function') {
            loadSubpage('Book Entry');
        } else if (typeof loadModuleSubpage === 'function') {
            loadModuleSubpage('catalogue', 'Book Entry');
        }

        return false;

    } catch (error) {
        console.error('Catalogue book delete error:', error);

        alert(
            'Unable to delete the book.\n\n' +
            error.message
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

