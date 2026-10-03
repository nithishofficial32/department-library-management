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
            if(countSpan) countSpan.innerText = `${filtered.length} entries`;
        }

        const sidebars = {
            member: [
                "Member",
                "Member ID Allotment",
                "Section Allotment",
                "Member Group Allotment",
                "Member Removal",
                "Undo Removal",
                "Member Register",
                "Locked Members",
                "No Due Certificate",
                "Member History"
            ],
            egate: ["Gate Register", "Visitor Log", "Daily Report", "Settings"],
            catalogue: ["Book Entry", "Author Master", "Publisher Master", "Subject Master", "Catalogue Search"],
            serials: ["Subscription", "Receipt", "Binding", "Supplier Directory"],
            search: ["Simple Search", "Advanced Search", "OPAC Catalog", "New Arrivals"],
            circulation: ["Counter Transaction", "Issue", "Return", "Renewal", "Reservation", "Fine Collection"],
            admin: ["User Roles", "Database Backup", "System Settings", "Audit Logs"],
            help: ["User Manual", "About LMS", "Contact Support"]
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
            const user = document.getElementById('adminUser').value.trim();
            const pass = document.getElementById('adminPass').value;
            if ((user === 'admin' || user === 'admin_grt' || user === 'lmsadmin') && (pass === currentAdminPassword || pass === 'admin123')) {
                goToPage('page-dashboard-container');
                loadSidebar('search');
                loadSearchSubpage('Simple Search');
            } else {
                alert('Invalid Admin User ID or Password. Default is admin / admin123');
            }
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

            alert(`Reservation placed for "${book.title}" on member ${member.name}!`);
            loadModuleSubpage('circulation', 'Reservation');
        }

        function cancelReservation(id) {
            const idx = dbReservations.findIndex(r => r.id === id);
            if (idx !== -1) {
                dbReservations.splice(idx, 1);
                alert("Reservation cancelled successfully.");
                loadModuleSubpage('circulation', 'Reservation');
            }
        }

        function collectFine(id) {
            const fine = dbFines.find(f => f.id === id);
            if (fine) {
                fine.status = "Paid";
                fine.collectedDate = new Date().toLocaleDateString('en-GB');
                alert(`Collected fine of ₹${fine.fineAmount.toFixed(2)} from ${fine.memberName}!`);
                loadModuleSubpage('circulation', 'Fine Collection');
            }
        }

        function openNewMemberForm() {
            const card = document.getElementById('workspaceCard');
            const inputClass = "w-full px-3 py-2 bg-white border border-gray-300 rounded transition-all duration-200 hover:border-blue-400 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600";
            const labelClass = "font-semibold text-gray-700 w-40 shrink-0";
            
            card.innerHTML = `
                <div class="mb-4 flex justify-between items-center">
                    <h2 class="text-sm font-bold text-[#004080] tracking-wider uppercase">ADD NEW STUDENT / FACULTY MEMBER</h2>
                    <button onclick="loadSubpage('Member')" class="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs font-bold">&larr; Back</button>
                </div>

                <form onsubmit="saveNewMember(event)" class="border border-gray-200 rounded-lg p-8 bg-white text-xs w-full max-w-5xl shadow-sm">
                    <div class="flex flex-col md:flex-row gap-x-12 gap-y-6">
                        <div class="flex-1 flex flex-col space-y-6">
                            <div class="flex items-center">
                                <label class="${labelClass}">*Member ID</label>
                                <input type="text" id="newId" required class="${inputClass}" placeholder="e.g. 110324104001">
                            </div>
                            <div class="flex items-center">
                                <label class="${labelClass}">*Full Name</label>
                                <input type="text" id="newName" required class="${inputClass}" placeholder="Enter Full Name">
                            </div>
                            <div class="flex items-center">
                                <label class="${labelClass}">*Batch</label>
                                <select id="newBatch" class="${inputClass}">
                                    <option>2023-2027</option>
                                    <option>2024-2028</option>
                                    <option>Staff</option>
                                </select>
                            </div>
                            <div class="flex items-center">
                                <label class="${labelClass}">*Department</label>
                                <select id="newDepartment" class="${inputClass}">
                                    <option>Computer Science and Engineering</option>
                                    <option>Information Technology</option>
                                    <option>Electronics and Communication Engineering</option>
                                    <option>Mechanical Engineering</option>
                                    <option>Civil Engineering</option>
                                </select>
                            </div>
                            <div class="flex items-center mt-auto pt-6">
                                <label class="${labelClass}">*Section</label>
                                <select id="newSec" class="${inputClass}">
                                    <option>A</option>
                                    <option>B</option>
                                    <option>Staff</option>
                                </select>
                            </div>
                        </div>

                        <div class="flex-1 flex flex-col space-y-6">
                            <div class="flex items-center">
                                <label class="${labelClass}">*Member Type</label>
                                <select id="newType" class="${inputClass}">
                                    <option>Student</option>
                                    <option>Faculty</option>
                                </select>
                            </div>
                            <div class="flex items-center">
                                <label class="${labelClass}">*Gender</label>
                                <select id="newGender" class="${inputClass}">
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                            </div>
                            <div class="flex items-center">
                                <label class="${labelClass}">*Programme</label>
                                <select id="newProg" class="${inputClass}">
                                    <option>B.E.</option>
                                    <option>B.Tech</option>
                                    <option>Faculty</option>
                                </select>
                            </div>
                            <div class="flex items-start">
                                <label class="${labelClass} pt-2">Photo</label>
                                <div class="w-full flex flex-col space-y-3">
                                    <div class="w-[110px] h-[130px] border border-gray-300 bg-[#e6eff6] flex flex-col items-center justify-center relative overflow-hidden rounded-sm">
                                        <div id="defaultPhotoPlaceholder" class="flex flex-col items-center justify-center text-center p-2">
                                            <svg class="w-10 h-10 text-[#6893b8] mb-1" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                            </svg>
                                            <span class="text-[8px] font-bold text-[#6893b8] tracking-tight uppercase leading-tight">No Image Available</span>
                                        </div>
                                        <img id="photoPreview" class="absolute inset-0 w-full h-full object-cover hidden" alt="Preview">
                                    </div>
                                    <input type="file" id="newPhoto" accept="image/*" class="w-full text-xs text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:border file:border-gray-300 file:bg-gray-100 file:text-gray-700 file:rounded-sm file:cursor-pointer hover:file:bg-gray-200 transition-colors" onchange="previewSelectedImage(event)">
                                </div>
                            </div>
                            <div class="flex items-center mt-auto">
                                <label class="${labelClass}">Status</label>
                                <select id="newStatus" class="${inputClass}">
                                    <option>Active</option>
                                    <option>Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="pt-10 flex justify-end space-x-3">
                        <button type="button" onclick="loadSubpage('Member')" class="px-6 py-2 bg-[#9ca3af] hover:bg-gray-500 text-white font-bold rounded shadow-sm transition-colors text-xs">Cancel</button>
                        <button type="submit" class="px-6 py-2 bg-[#0f9d58] hover:bg-[#0b8043] text-white font-bold rounded shadow-sm transition-colors text-xs">Save Member Details</button>
                    </div>
                </form>
            `;
        }

        function saveNewMember(event) {
            event.preventDefault();

            const id = document.getElementById('newId').value.trim();
            const name = document.getElementById('newName').value.trim();

            if (!id || !name) {
                alert('Please provide both Member ID and Full Name.');
                return;
            }

            if (dbMembers.some(m => m.id.toLowerCase() === id.toLowerCase())) {
                alert(`Member ID "${id}" already exists. Please choose a different ID.`);
                return;
            }

            const today = new Date();
            const formattedDate = [
                String(today.getDate()).padStart(2, '0'),
                String(today.getMonth() + 1).padStart(2, '0'),
                today.getFullYear()
            ].join('-');

            const newMember = {
                id: id,
                name: name,
                batch: document.getElementById('newBatch').value,
                programme: document.getElementById('newProg').value,
                department: document.getElementById('newDepartment').value,
                photo: '',
                section: document.getElementById('newSec').value,
                gender: document.getElementById('newGender').value,
                status: document.getElementById('newStatus').value,
                doj: formattedDate,
                dol: '-',
                type: document.getElementById('newType').value,
                memberLock: 'No',
                lockReason: ''
            };

            const photoFile = document.getElementById('newPhoto').files[0];
            if (photoFile && photoFile.size > 1024 * 1024) {
                alert('Please choose a photo smaller than 1 MB.');
                return;
            }

            const finishSave = () => {
                dbMembers.push(newMember);
                alert('Member details saved successfully!');
                loadSubpage('Member');
            };

            if (photoFile) {
                const reader = new FileReader();
                reader.onload = () => {
                    newMember.photo = reader.result;
                    finishSave();
                };
                reader.onerror = () => alert('The selected photo could not be read.');
                reader.readAsDataURL(photoFile);
            } else {
                finishSave();
            }
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
                                <select id="newBatch" class="${inputClass}">
                                    <option ${sel('2023-2027', member.batch)}>2023-2027</option>
                                    <option ${sel('2024-2028', member.batch)}>2024-2028</option>
                                    <option ${sel('Staff', member.batch)}>Staff</option>
                                </select>
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
                                <label class="${labelClass}">*Programme</label>
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
                    <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">BULK IMPORT MEMBERS (100+ AT A TIME)</h2>
                    <button onclick="loadSubpage('Member')" class="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs font-bold">&larr; Back</button>
                </div>

                <div class="border border-gray-300 rounded p-6 bg-gray-50/80 shadow-sm text-xs w-full max-w-4xl space-y-4">
                    <p class="text-gray-700">Upload an Excel/CSV file containing your member records, or click below to simulate generating 100 students instantly into the directory.</p>

                    <div class="border-2 border-dashed border-gray-400 rounded-xl p-8 text-center bg-white">
                        <span class="text-sm font-semibold text-gray-700">Upload CSV / Excel File (.csv, .xlsx)</span>
                        <input type="file" class="block mx-auto mt-2 text-xs text-gray-500">
                    </div>

                    <div class="pt-2 flex justify-between items-center">
                        <button onclick="simulateBulkImport(100)" class="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded shadow">⚡ Auto-Generate & Import 100 Members Now</button>
                        <button onclick="loadSubpage('Member')" class="px-4 py-2 bg-gray-400 text-white font-bold rounded">Cancel</button>
                    </div>
                </div>
            `;
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
            alert(`Successfully imported ${count} member records into LMS database!`);
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

                            <div class="ct-photo">
                                <svg viewBox="0 0 100 110" aria-hidden="true">
                                    <circle cx="50" cy="30" r="19" fill="currentColor"/>
                                    <path d="M15 102V82c0-21 16-35 35-35s35 14 35 35v20Z" fill="currentColor"/>
                                    <path d="m38 52 12 32 12-32-12 9Z" fill="white"/>
                                </svg>
                                <p>NO IMAGE AVAILABLE</p>
                            </div>
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
                        <div class="flex justify-between items-center mb-2">
                            <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">EGATE SCANNER TERMINAL</h2>
                        </div>
                        <div class="border border-gray-300 rounded p-6 bg-white shadow-sm text-xs w-full max-w-4xl space-y-4">
                            <form onsubmit="processGateScan(event)" class="flex gap-2">
                                <input type="text" id="gateMemberId" required autofocus placeholder="Scan or type Member ID (e.g. 110324104088)..." class="flex-1 px-4 py-2 border rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <button type="submit" class="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded shadow">Process Scan</button>
                            </form>
                            <div id="gateScanResult" class="min-h-[200px]">
                                <div class="flex flex-col items-center justify-center h-full text-gray-400 border-[1.5px] border-dashed border-gray-300 rounded-xl p-12 bg-[#fafafa]">
                                    <p class="text-[11px] font-bold tracking-widest uppercase text-gray-400">Waiting for scan...</p>
                                </div>
                            </div>
                        </div>
                    `;
                    return;
                }
                if (title === 'Visitor Log') {
                    card.innerHTML = `
                        <div class="flex justify-between items-center mb-2">
                            <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">VISITOR LOG MONITOR</h2>
                            <span id="vLogCount" class="text-xs text-blue-700 font-bold bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">${visitorLogs.length} entries</span>
                        </div>
                        <div class="border border-gray-300 rounded p-4 bg-gray-50/60 shadow-sm text-xs w-full max-w-5xl mb-3">
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                                <input type="text" id="vFilterId" oninput="filterVisitorLogs()" placeholder="Filter ID or Name..." class="px-3 py-2 bg-white border rounded">
                                <select id="vFilterBatch" onchange="filterVisitorLogs()" class="px-3 py-2 bg-white border rounded">
                                    <option value="">All Batches</option>
                                    <option value="2023-2027">2023-2027</option>
                                    <option value="2024-2028">2024-2028</option>
                                    <option value="Staff">Staff</option>
                                </select>
                                <input type="text" id="vFilterTime" oninput="filterVisitorLogs()" placeholder="Filter date/time..." class="px-3 py-2 bg-white border rounded">
                                <select id="vFilterStatus" onchange="filterVisitorLogs()" class="px-3 py-2 bg-white border rounded">
                                    <option value="">All Status</option>
                                    <option value="in">On Campus</option>
                                    <option value="out">Checked Out</option>
                                </select>
                            </div>
                        </div>
                        <div class="border border-gray-300 rounded bg-white shadow-sm overflow-hidden w-full max-w-5xl flex flex-col">
                            <table class="w-full text-left border-collapse text-[11px]">
                                <thead class="bg-gray-100 uppercase border-b">
                                    <tr><th class="p-2 border-r">Member ID</th><th class="p-2 border-r">Name</th><th class="p-2 border-r">Department</th><th class="p-2 border-r">Batch</th><th class="p-2 border-r">Date</th><th class="p-2 border-r">Check In</th><th class="p-2">Check Out / Status</th></tr>
                                </thead>
                                <tbody id="visitorLogTableBody">
                                    ${renderVisitorLogRows()}
                                </tbody>
                            </table>
                        </div>
                    `;
                    return;
                }
                if (title === 'Daily Report' || title === 'Settings') {
                    card.innerHTML = `
                        <div class="flex justify-between items-center mb-2">
                            <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">EGATE (${title.toUpperCase()})</h2>
                        </div>
                        <div class="border border-gray-300 rounded p-6 bg-white shadow-sm text-xs w-full max-w-3xl space-y-4">
                            <p class="text-gray-700 font-semibold">eGate attendance reports and hardware barcode reader configurations.</p>
                            <button onclick="alert('${title} settings updated successfully!')" class="px-4 py-2 bg-blue-700 text-white font-bold rounded">Save Configuration</button>
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
                            <p class="text-gray-800 font-bold">Issue New Book to Member</p>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="flex flex-col space-y-1">
                                    <label class="font-semibold text-gray-700">*Member ID</label>
                                    <input type="text" id="issueMemberId" required placeholder="Type Member ID (e.g. 110324104088)" class="px-3 py-2 bg-white border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600">
                                </div>
                                <div class="flex flex-col space-y-1">
                                    <label class="font-semibold text-gray-700">*Accession Number</label>
                                    <input type="text" id="issueAccn" required placeholder="Type Book Accession (e.g. CS1001)" class="px-3 py-2 bg-white border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 uppercase">
                                </div>
                            </div>
                            <div class="pt-2 flex justify-end">
                                <button type="submit" class="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded shadow transition-all">Issue Book</button>
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
                            <td class="p-2">${escapeHtml(b.callNo)}</td>
                        </tr>
                    `).join('');

                    card.innerHTML = `
                        <div class="flex justify-between items-center mb-2">
                            <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">BOOK ENTRY & CATALOGUE CATALOG</h2>
                            <span class="text-xs text-blue-700 font-bold bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">${dbBooks.length} Total Titles</span>
                        </div>

                        <form onsubmit="event.preventDefault(); alert('New book accession added successfully!');" class="border border-gray-300 rounded-xl p-4 bg-gray-50/70 shadow-sm text-xs w-full max-w-4xl space-y-3 mb-4">
                            <p class="text-gray-800 font-bold">Add New Book Entry</p>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <input type="text" placeholder="Accession No (e.g. CS1003)" required class="px-3 py-2 bg-white border border-gray-300 rounded">
                                <input type="text" placeholder="Book Title" required class="px-3 py-2 bg-white border border-gray-300 rounded">
                                <input type="text" placeholder="Author(s)" required class="px-3 py-2 bg-white border border-gray-300 rounded">
                                <input type="text" placeholder="Publisher" class="px-3 py-2 bg-white border border-gray-300 rounded">
                                <input type="text" placeholder="Edition" class="px-3 py-2 bg-white border border-gray-300 rounded">
                                <input type="text" placeholder="Call Number" class="px-3 py-2 bg-white border border-gray-300 rounded">
                            </div>
                            <div class="flex justify-end">
                                <button type="submit" class="px-5 py-1.5 bg-blue-700 text-white font-bold rounded shadow text-xs">Save Book Entry</button>
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
                                        <th class="p-2">Call No</th>
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

                if (title === 'Catalogue Search') {
                    card.innerHTML = `
                        <div class="flex justify-between items-center mb-2">
                            <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">CATALOGUE SEARCH DESK</h2>
                        </div>
                        <div class="border border-gray-300 rounded p-4 bg-gray-50 shadow-sm text-xs w-full max-w-3xl space-y-3">
                            <div class="flex gap-2">
                                <input type="text" placeholder="Search by book title, author or accession..." class="flex-1 px-3 py-2 border rounded text-xs">
                                <button onclick="alert('Search executed successfully!')" class="px-5 py-2 bg-blue-700 text-white font-bold rounded text-xs">Search Catalogue</button>
                            </div>
                        </div>
                    `;
                    return;
                }
            }

            /* --- SERIALS MODULE --- */
            if (module === 'serials') {
                card.innerHTML = `
                    <div class="flex justify-between items-center mb-2">
                        <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">PERIODICALS & SERIALS (${title.toUpperCase()})</h2>
                    </div>
                    <div class="border border-gray-300 rounded bg-white shadow-sm overflow-hidden w-full max-w-5xl p-4 space-y-3">
                        <p class="text-gray-700 font-semibold text-xs">Manage journal subscriptions, magazine receipts, binding logs, and supplier directories for GRTIET Central Library.</p>
                        <div class="border rounded overflow-hidden">
                            <table class="w-full text-left border-collapse text-[11px]">
                                <thead class="bg-gray-100 uppercase">
                                    <tr><th class="p-2 border-r">Serial Ref ID</th><th class="p-2 border-r">Journal / Magazine Name</th><th class="p-2 border-r">Publisher / Vendor</th><th class="p-2">Status</th></tr>
                                </thead>
                                <tbody>
                                    <tr class="border-b"><td class="p-2 border-r font-mono font-bold text-blue-900">SER-2026-01</td><td class="p-2 border-r font-semibold">IEEE Transactions on Computers</td><td class="p-2 border-r">IEEE India</td><td class="p-2 text-emerald-700 font-bold">Active Subscription</td></tr>
                                    <tr class="border-b"><td class="p-2 border-r font-mono font-bold text-blue-900">SER-2026-02</td><td class="p-2 border-r font-semibold">Communications of the ACM</td><td class="p-2 border-r">ACM Publications</td><td class="p-2 text-emerald-700 font-bold">Active Subscription</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
                return;
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
                if (title === 'About LMS') {
                    card.innerHTML = `
                        <div class="flex justify-between items-center mb-2">
                            <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">HELP & SUPPORT (ABOUT LMS)</h2>
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
                    <p class="text-xs text-gray-600 mb-5">Manage and view records for ${module} &rarr; ${title} securely through LMS.</p>
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
                        <button onclick="openNewMemberForm()" class="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded shadow text-xs">+ New Student / Faculty</button>
                        <button onclick="openBulkImportModal()" class="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded shadow text-xs">Import (100+ Bulk)</button>
                    </div>

                    <div class="border border-gray-300 rounded bg-white shadow-sm overflow-hidden w-full max-w-5xl min-h-[220px] max-h-[350px] overflow-y-auto flex flex-col">
                        <table class="w-full text-left border-collapse text-[11px]">
                            <thead class="bg-gray-100 text-gray-700 uppercase border-b border-gray-300 sticky top-0">
                                <tr>
                                    <th class="p-2 border-r">Member ID</th>
                                    <th class="p-2 border-r">Name</th>
                                    <th class="p-2 border-r">Batch</th>
                                    <th class="p-2 border-r">Programme</th>
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
                            <div class="flex items-center justify-between"><label class="font-semibold text-gray-700">Programme</label><select class="w-60 px-3 py-2 bg-white border border-gray-300 rounded transition-colors duration-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"><option>-Select-</option><option>B.E.</option><option>B.Tech</option></select></div>
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
            } else if (title === 'No Due Certificate') {
                card.innerHTML = `
                    <div class="flex justify-between items-center mb-2">
                        <h2 class="text-sm font-bold text-blue-900 tracking-wider uppercase">NO DUE CERTIFICATE GENERATOR</h2>
                    </div>
                    <div class="border border-gray-300 rounded p-6 bg-gray-50/80 shadow-sm text-xs w-full max-w-3xl space-y-4">
                        <div class="flex items-center space-x-3 max-w-md">
                            <label class="font-semibold text-gray-700 w-24">Member ID</label>
                            <input type="text" placeholder="Enter Member ID..." class="flex-1 px-3 py-2 bg-white border border-gray-300 rounded transition-colors duration-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600">
                            <button onclick="alert('No dues found! Certificate generated successfully.')" class="px-4 py-2 bg-emerald-700 text-white font-bold rounded shadow">Check & Print</button>
                        </div>
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
            const resType = document.getElementById("searchResType").value;
            const keyword = document.getElementById("searchKeyword").value.trim().toLowerCase();
            const searchBy = document.getElementById("searchByField").value;
            const sortBy = document.getElementById("searchSortBy").value;
            const language = document.getElementById("searchLanguage").value;

            const filtered = dbBooks.filter(b => {
                let matchRes = !resType || b.resType === resType;
                let matchLang = !language || b.language === language;
                let matchKey = true;

                if (keyword) {
                    if (searchBy === "Title") matchKey = b.title.toLowerCase().includes(keyword);
                    else if (searchBy === "Author") matchKey = b.author.toLowerCase().includes(keyword);
                    else if (searchBy === "Accn") matchKey = b.accn.toLowerCase().includes(keyword);
                    else if (searchBy === "Subject") matchKey = b.subject.toLowerCase().includes(keyword);
                    else {
                        matchKey = b.title.toLowerCase().includes(keyword) || 
                                   b.author.toLowerCase().includes(keyword) || 
                                   b.accn.toLowerCase().includes(keyword) || 
                                   b.subject.toLowerCase().includes(keyword);
                    }
                }
                return matchRes && matchLang && matchKey;
            });

            filtered.sort((a, b) => {
                if (sortBy === "Title") return a.title.localeCompare(b.title);
                if (sortBy === "Author") return a.author.localeCompare(b.author);
                return a.accn.localeCompare(b.accn);
            });

            const resultsContainer = document.getElementById("simpleSearchResultsArea");
            if (resultsContainer) {
                resultsContainer.innerHTML = renderSearchResultsTable(filtered);
            }
        }

        function renderSearchResultsTable(results) {
            if (results.length === 0) {
                return `<div class="border border-amber-200 bg-amber-50 rounded-xl p-6 text-center text-amber-800 font-semibold text-xs">No matching catalogue records found.</div>`;
            }
            const rows = results.map(b => `
                <tr class="hover:bg-gray-50 border-b text-xs">
                    <td class="p-2.5 font-mono font-bold text-blue-900 border-r">${escapeHtml(b.accn)}</td>
                    <td class="p-2.5 font-semibold border-r">${escapeHtml(b.title)}</td>
                    <td class="p-2.5 border-r">${escapeHtml(b.author)}</td>
                    <td class="p-2.5 border-r">${escapeHtml(b.publisher || "Pearson")}</td>
                    <td class="p-2.5 text-center"><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Available</span></td>
                </tr>
            `).join("");

            return `
                <div class="border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
                    <div class="bg-gray-100 px-4 py-2 border-b text-xs font-bold text-gray-700">Search Results (${results.length} found)</div>
                    <table class="w-full text-left border-collapse text-xs">
                        <thead class="bg-gray-50 text-gray-700 uppercase border-b text-[11px]">
                            <tr><th class="p-2.5 border-r">Accn No</th><th class="p-2.5 border-r">Title</th><th class="p-2.5 border-r">Author</th><th class="p-2.5 border-r">Publisher</th><th class="p-2.5 text-center">Status</th></tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            `;
        };