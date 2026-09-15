const KEY="adminpro_working_v1",LOW=10;
const U0=[{id:1,name:"Ali Khan",email:"ali@example.com",role:"Admin",status:"Active"},{id:2,name:"Sara Ahmed",email:"sara@example.com",role:"Manager",status:"Active"},{id:3,name:"Hamza Malik",email:"hamza@example.com",role:"Customer",status:"Active"}];
const P0=[{id:1,name:"Wireless Headphones",cat:"Electronics",sku:"WH-1001",price:89,stock:8},{id:2,name:"Smart Watch Pro",cat:"Electronics",sku:"SW-2045",price:149,stock:46},{id:3,name:"Premium Hoodie",cat:"Clothing",sku:"PH-3031",price:59,stock:23},{id:4,name:"Desk Lamp",cat:"Home",sku:"DL-4412",price:39,stock:4}];
const O0=[{id:"#1049",customer:"Ali Khan",date:"Aug 24, 2026",amount:289,status:"Delivered"},{id:"#1048",customer:"Sara Ahmed",date:"Aug 23, 2026",amount:149,status:"Processing"},{id:"#1047",customer:"Hamza Malik",date:"Aug 23, 2026",amount:89,status:"Pending"}];
const C0=[{id:1,name:"Ali Khan",email:"ali@example.com",orders:24,spent:2840},{id:2,name:"Sara Ahmed",email:"sara@example.com",orders:18,spent:1960},{id:3,name:"Hamza Malik",email:"hamza@example.com",orders:11,spent:1120}];
let users=cp(U0),products=cp(P0),orders=cp(O0),customers=cp(C0),logs=["Dashboard started"];
function cp(x){return JSON.parse(JSON.stringify(x))}function money(n){return "$"+Number(n).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}
function esc(x){return String(x??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function save(){localStorage.setItem(KEY,JSON.stringify({users,products,orders,customers,logs}))}
function load(){try{let x=JSON.parse(localStorage.getItem(KEY));if(x){users=x.users||users;products=x.products||products;orders=x.orders||orders;customers=x.customers||customers;logs=x.logs||logs}}catch(e){}}
load();
function toast(x){let t=document.getElementById("toast");t.textContent=x;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}
function log(x){logs.unshift(x+" • "+new Date().toLocaleTimeString());save();renderLogs()}
function bd(x){let c=x==="Active"||x==="Delivered"?"ok":x==="Cancelled"||x==="Inactive"?"bad":"warn";return `<span class="badge ${c}">${esc(x)}</span>`}
function go(id){document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));document.getElementById(id).classList.add("active");document.querySelectorAll(".nav button").forEach(x=>x.classList.toggle("active",x.dataset.page===id));document.getElementById("title").textContent=id[0].toUpperCase()+id.slice(1);document.getElementById("side").classList.remove("open");renderAll()}
document.querySelectorAll(".nav button").forEach(x=>x.onclick=()=>go(x.dataset.page));
function bars(id,a,l){document.getElementById(id).innerHTML=a.map((v,i)=>`<div class="bw"><div class="bar" style="height:${v}%"></div><span>${l[i]}</span></div>`).join("")}
function renderDash(){let r=orders.reduce((a,x)=>a+x.amount,0),low=products.filter(x=>x.stock<LOW).length;rev.textContent=money(r);ord.textContent=orders.length;usr.textContent=users.length;prd.textContent=products.length;stockmsg.textContent=low+" low stock";bars("chart",[40,55,48,72,63,88,78],["Feb","Mar","Apr","May","Jun","Jul","Aug"]);recent.innerHTML=orders.slice(0,5).map(x=>`<tr><td>${x.id}</td><td>${esc(x.customer)}</td><td>${money(x.amount)}</td><td>${bd(x.status)}</td></tr>`).join("");lowList.innerHTML=products.filter(x=>x.stock<LOW).map(x=>`<p>${esc(x.name)} <b style="float:right">${x.stock}</b></p>`).join("")||"<p class=empty>All stock levels are healthy</p>"}
function renderAnalytics(){bars("achart",[35,52,47,70,63,86,75,92],["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"])}
function renderUsers(){let q=us.value.toLowerCase(),r=ur.value,a=users.filter(x=>(x.name+x.email).toLowerCase().includes(q)&&(!r||x.role===r));ut.innerHTML=a.map(x=>`<tr><td>${esc(x.name)}</td><td>${esc(x.email)}</td><td>${x.role}</td><td>${bd(x.status)}</td><td class=actions-cell><button onclick="editUser(${x.id})">✏</button><button onclick="toggleUser(${x.id})">↕</button><button onclick="delUser(${x.id})">🗑</button></td></tr>`).join("")||"<tr><td colspan=5 class=empty>No users</td></tr>"}
function renderCustomers(){let q=cs.value.toLowerCase();ct.innerHTML=customers.filter(x=>(x.name+x.email).toLowerCase().includes(q)).map(x=>`<tr><td>${esc(x.name)}</td><td>${esc(x.email)}</td><td>${x.orders}</td><td>${money(x.spent)}</td><td>${bd("Active")}</td></tr>`).join("")}
function renderProducts(){let q=ps.value.toLowerCase(),c=pc.value;let a=products.filter(x=>x.name.toLowerCase().includes(q)&&(!c||x.cat===c));pt.innerHTML=a.map(x=>`<tr><td>${esc(x.name)}</td><td>${x.cat}</td><td>${x.sku}</td><td>${money(x.price)}</td><td>${x.stock}</td><td class=actions-cell><button onclick="editProduct(${x.id})">✏</button><button onclick="delProduct(${x.id})">🗑</button></td></tr>`).join("")||"<tr><td colspan=6 class=empty>No products</td></tr>"}
function renderOrders(){let q=os.value.toLowerCase(),f=of.value;let a=orders.filter(x=>(x.id+x.customer).toLowerCase().includes(q)&&(!f||x.status===f));ot.innerHTML=a.map(x=>`<tr><td>${x.id}</td><td>${esc(x.customer)}</td><td>${x.date}</td><td>${money(x.amount)}</td><td>${bd(x.status)}</td><td class=actions-cell><button onclick="cycleOrder('${x.id}')">↻</button><button onclick="delOrder('${x.id}')">🗑</button></td></tr>`).join("")||"<tr><td colspan=6 class=empty>No orders</td></tr>"}
function renderInventory(){let low=products.filter(x=>x.stock>0&&x.stock<LOW).length,out=products.filter(x=>x.stock===0).length;skus.textContent=products.length;document.getElementById("low").textContent=low;document.getElementById("out").textContent=out;ival.textContent=money(products.reduce((a,x)=>a+x.price*x.stock,0));it.innerHTML=products.map(x=>`<tr><td>${esc(x.name)}</td><td>${x.sku}</td><td>${x.stock}</td><td>${bd(x.stock<LOW?"Low":"Active")}</td><td><button class=btn onclick="editProduct(${x.id})">Edit</button></td></tr>`).join("")}
function renderLogs(){const el=document.getElementById("logs");if(!el)return;el.innerHTML=logs.length?logs.map(x=>`<p style="padding:8px;border-bottom:1px solid var(--line)">• ${esc(x)}</p>`).join(""):"<div class=empty>No logs</div>"}

let tickets=JSON.parse(localStorage.getItem("adminpro_tickets")||"[]");
let tasks=JSON.parse(localStorage.getItem("adminpro_tasks")||"[]");
let events=JSON.parse(localStorage.getItem("adminpro_events")||"[]");
function persistExtras(){localStorage.setItem("adminpro_tickets",JSON.stringify(tickets));localStorage.setItem("adminpro_tasks",JSON.stringify(tasks));localStorage.setItem("adminpro_events",JSON.stringify(events))}
function renderUpgrades(){
 let total=orders.reduce((a,x)=>a+x.amount,0);
 if(document.getElementById("profit"))document.getElementById("profit").textContent=money(total*.28);
 if(document.getElementById("aov"))document.getElementById("aov").textContent=money(orders.length?total/orders.length:0);
 if(document.getElementById("custCount"))document.getElementById("custCount").textContent=customers.length;
 if(document.getElementById("lowDash"))document.getElementById("lowDash").textContent=products.filter(x=>x.stock<LOW).length;
 if(document.getElementById("paidTotal"))document.getElementById("paidTotal").textContent=money(orders.filter(x=>x.status==="Delivered").reduce((a,x)=>a+x.amount,0));
 if(document.getElementById("pendingTotal"))document.getElementById("pendingTotal").textContent=money(orders.filter(x=>x.status!=="Delivered"&&x.status!=="Cancelled").reduce((a,x)=>a+x.amount,0));
 if(document.getElementById("payTable"))payTable.innerHTML=orders.map((x,i)=>`<tr><td>TX-${10000+i}</td><td>${x.id}</td><td>${esc(x.customer)}</td><td>${money(x.amount)}</td><td>${bd(x.status==="Delivered"?"Paid":x.status==="Cancelled"?"Refunded":"Pending")}</td></tr>`).join("");
 if(document.getElementById("invTable"))invTable.innerHTML=orders.map((x,i)=>`<tr><td>INV-${1000+i}</td><td>${esc(x.customer)}</td><td>${x.id}</td><td>${money(x.amount)}</td><td>${bd(x.status)}</td><td><button class=btn onclick="printInvoice(${i})">Print</button></td></tr>`).join("");
 renderTickets();renderTasks();renderCalendar();
}
function renderTickets(){if(!document.getElementById("ticketList"))return;let f=ticketFilter.value;ticketList.innerHTML=tickets.filter(x=>!f||x.status===f).map((x,i)=>`<div class=ticket><b>${esc(x.subject)}</b> <span class=pill>${x.priority}</span><span style="float:right">${bd(x.status)}</span><div class=muted>${esc(x.customer)} • ${esc(x.email)}</div><button class=btn style="margin-top:8px" onclick="cycleTicket(${i})">Change status</button> <button class="btn danger" onclick="deleteTicket(${i})">Delete</button></div>`).join("")||'<div class=empty>No tickets</div>'}
function cycleTicket(i){let s=["Open","Pending","Resolved"],x=tickets[i];x.status=s[(s.indexOf(x.status)+1)%3];persistExtras();renderTickets();toast("Ticket updated")}
function deleteTicket(i){tickets.splice(i,1);persistExtras();renderTickets();toast("Ticket deleted")}
function openTicket(){modal("New Support Ticket",`<form class=form onsubmit="saveTicket(event)"><label>Subject<input id=t1 required></label><label>Customer<input id=t2 required></label><label>Email<input id=t3 type=email required></label><label>Priority<select id=t4><option>Low</option><option>Medium</option><option>High</option></select></label><div class=foot><button type=button class=btn onclick=closeModal()>Cancel</button><button class="btn primary">Create</button></div></form>`)}
function saveTicket(e){e.preventDefault();tickets.unshift({subject:t1.value,customer:t2.value,email:t3.value,priority:t4.value,status:"Open"});persistExtras();closeModal();renderTickets();toast("Ticket created");log("Created support ticket")}
function renderTasks(){if(!document.getElementById("todoCol"))return;todoCol.innerHTML=progressCol.innerHTML=doneCol.innerHTML="";let map={"Todo":todoCol,"In Progress":progressCol,"Completed":doneCol};tasks.forEach((x,i)=>{map[x.status].innerHTML+=`<div class=task><b>${esc(x.title)}</b><div class=muted>${x.priority} priority</div><button class=btn style="margin-top:7px" onclick="cycleTask(${i})">Move →</button> <button class=btn onclick="deleteTask(${i})">×</button></div>`})}
function cycleTask(i){let s=["Todo","In Progress","Completed"],x=tasks[i];x.status=s[(s.indexOf(x.status)+1)%3];persistExtras();renderTasks()}
function deleteTask(i){tasks.splice(i,1);persistExtras();renderTasks()}
function openTask(){modal("New Task",`<form class=form onsubmit="saveTask(event)"><label>Task<input id=tk1 required></label><label>Priority<select id=tk2><option>Low</option><option>Medium</option><option>High</option></select></label><div class=foot><button type=button class=btn onclick=closeModal()>Cancel</button><button class="btn primary">Create</button></div></form>`)}
function saveTask(e){e.preventDefault();tasks.push({title:tk1.value,priority:tk2.value,status:"Todo"});persistExtras();closeModal();renderTasks();toast("Task added")}
function renderCalendar(){if(!document.getElementById("calendarList"))return;calendarList.innerHTML=events.map((x,i)=>`<div class=card><b>${esc(x.title)}</b><span style="float:right">${esc(x.date)}</span><div class=muted>${esc(x.note||"")}</div><button class="btn danger" style="margin-top:7px" onclick="events.splice(${i},1);persistExtras();renderCalendar()">Delete</button></div>`).join("")||"<div class=empty>No events scheduled</div>"}
function openEvent(){modal("Add Calendar Event",`<form class=form onsubmit="saveEvent(event)"><label>Event<input id=ev1 required></label><label>Date<input id=ev2 type=date required></label><label>Notes<textarea id=ev3></textarea></label><div class=foot><button type=button class=btn onclick=closeModal()>Cancel</button><button class="btn primary">Add</button></div></form>`)}
function saveEvent(e){e.preventDefault();events.push({title:ev1.value,date:ev2.value,note:ev3.value});persistExtras();closeModal();renderCalendar();toast("Event added")}
function openInvoice(){let x=orders[0]||{id:"#1001",customer:"Demo Customer",amount:100};modal("Create Invoice",`<div style="background:#fff;color:#111;padding:20px;border-radius:10px"><h2>ADMINPRO INVOICE</h2><hr><p>Customer: ${esc(x.customer)}<br>Order: ${x.id}</p><h2 style="text-align:right">${money(x.amount)}</h2><button class="btn primary" onclick="window.print()">Print / Save PDF</button></div>`)}
function printInvoice(i){let x=orders[i];modal("Invoice",`<div style="background:#fff;color:#111;padding:20px;border-radius:10px"><h2>ADMINPRO</h2><p>Invoice #INV-${1000+i}<br>Customer: ${esc(x.customer)}<br>Order: ${x.id}<br>Date: ${x.date}</p><h2 style="text-align:right">Total ${money(x.amount)}</h2><button class="btn primary" onclick="window.print()">Print Invoice</button></div>`)}

function renderAll(){renderDash();renderAnalytics();renderUsers();renderCustomers();renderCategories();renderProducts();renderOrders();renderInventory();renderLogs();renderUpgrades()}



function supplierForm(){return `<form class=form onsubmit="event.preventDefault();closeModal();toast('Supplier added')"><label>Supplier<input required placeholder="Company name"></label><label>Email<input type=email required placeholder="supplier@example.com"></label><label>Category<select><option>Electronics</option><option>Clothing</option><option>Home</option></select></label><div class=foot><button type=button class=btn onclick=closeModal()>Cancel</button><button class="btn primary">Save Supplier</button></div></form>`}
function categoryForm(){return `<form class=form onsubmit="event.preventDefault();closeModal();toast('Category added')"><label>Category Name<input required placeholder="e.g. Accessories"></label><label>Description<textarea placeholder="Short description"></textarea></label><div class=foot><button type=button class=btn onclick=closeModal()>Cancel</button><button class="btn primary">Save Category</button></div></form>`}
const CATEGORY_KEY="adminpro_categories_v2";
const DEFAULT_CATEGORIES=[{id:1,name:"Electronics",description:"Electronic devices and accessories"},{id:2,name:"Clothing",description:"Apparel and fashion items"},{id:3,name:"Home",description:"Home and office products"},{id:4,name:"Accessories",description:"Useful accessories and add-ons"}];
let categories=(()=>{try{const x=JSON.parse(localStorage.getItem(CATEGORY_KEY));return Array.isArray(x)&&x.length?x:cp(DEFAULT_CATEGORIES)}catch(e){return cp(DEFAULT_CATEGORIES)}})();
function saveCategories(){localStorage.setItem(CATEGORY_KEY,JSON.stringify(categories))}
function renderCategories(){const el=document.getElementById("categoryCards");if(el){const counts={};products.forEach(p=>{const k=p.cat||"Uncategorized";counts[k]=(counts[k]||0)+1});el.innerHTML=categories.map(c=>`<div class="card kpi"><div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start"><div><b>${esc(c.name)}</b><div class="muted" style="margin-top:5px">${esc(c.description||"No description")}</div></div><div style="display:flex;gap:6px"><button class="btn" onclick="editCategory(${c.id})">✎</button><button class="btn danger" onclick="deleteCategory(${c.id})">×</button></div></div><h2>${counts[c.name]||0}</h2><span class="muted">Products</span></div>`).join("")||'<div class="empty">No categories yet. Click "+ Add Category".</div>'}
 const pcEl=document.getElementById("pc");if(pcEl){const current=pcEl.value;pcEl.innerHTML='<option value="">All categories</option>'+categories.map(c=>`<option value="${esc(c.name)}">${esc(c.name)}</option>`).join("");pcEl.value=categories.some(c=>c.name===current)?current:""}
}
function categoryForm(x){x=x||{};return `<form class=form onsubmit="saveCategory(event,${x.id||0})"><label>Category Name<input id=catName required maxlength=40 value="${esc(x.name||"")}" placeholder="e.g. Accessories"></label><label>Description<textarea id=catDesc maxlength=120 placeholder="Short description">${esc(x.description||"")}</textarea></label><div class=foot><button type=button class=btn onclick=closeModal()>Cancel</button><button class="btn primary">${x.id?"Update":"Save"} Category</button></div></form>`}
function saveCategory(e,id){e.preventDefault();const name=document.getElementById("catName").value.trim(),description=document.getElementById("catDesc").value.trim();if(!name)return;if(categories.some(c=>c.name.toLowerCase()===name.toLowerCase()&&c.id!==id)){toast("Category already exists");return}if(id){const c=categories.find(c=>c.id===id);if(c){const old=c.name;c.name=name;c.description=description;products.forEach(p=>{if(p.cat===old)p.cat=name})}}else categories.push({id:Date.now(),name,description});saveCategories();save();renderCategories();renderProducts();closeModal();toast(id?"Category updated":"Category added");log((id?"Updated ":"Added ")+"category "+name)}
function editCategory(id){const c=categories.find(x=>x.id===id);if(c)modal("Edit Category",categoryForm(c))}
function deleteCategory(id){const c=categories.find(x=>x.id===id);if(!c)return;if(!confirm("Delete category '"+c.name+"'?"))return;categories=categories.filter(x=>x.id!==id);products.forEach(p=>{if(p.cat===c.name)p.cat="Uncategorized"});saveCategories();save();renderCategories();renderProducts();toast("Category deleted");log("Deleted category "+c.name)}
function expenseForm(){return `<form class=form onsubmit="event.preventDefault();closeModal();toast('Expense added')"><label>Description<input required placeholder="Expense description"></label><label>Amount<input type=number min=0 step=.01 required placeholder="0.00"></label><label>Category<select><option>Operating</option><option>Marketing</option><option>Other</option></select></label><div class=foot><button type=button class=btn onclick=closeModal()>Cancel</button><button class="btn primary">Save Expense</button></div></form>`}
function couponForm(){return `<form class=form onsubmit="event.preventDefault();closeModal();toast('Coupon created')"><label>Coupon Code<input required placeholder="SAVE20"></label><label>Discount %<input type=number min=1 max=100 required placeholder="20"></label><label>Expiry<input type=date required></label><div class=foot><button type=button class=btn onclick=closeModal()>Cancel</button><button class="btn primary">Create Coupon</button></div></form>`}
function modal(title,body){mt.textContent=title;mf.innerHTML=body;mb.classList.add("show")}function closeModal(){mb.classList.remove("show")}
function openUser(x){x=x||{};modal(x.id?"Edit User":"Add User",`<form class=form onsubmit="saveUser(event,${x.id||0})"><label>Name<input id=f1 required value="${esc(x.name||"")}"></label><label>Email<input id=f2 type=email required value="${esc(x.email||"")}"></label><label>Role<select id=f3>${["Admin","Manager","Staff","Customer"].map(v=>`<option ${x.role===v?"selected":""}>${v}</option>`).join("")}</select></label><div class=foot><button type=button class=btn onclick=closeModal()>Cancel</button> <button class="btn primary">Save</button></div></form>`)}
function saveUser(e,id){e.preventDefault();let x={name:f1.value,email:f2.value,role:f3.value,status:"Active"};if(id)Object.assign(users.find(x=>x.id===id),x);else users.unshift({id:Date.now(),...x});save();log((id?"Updated ":"Added ")+x.name);closeModal();renderAll();toast("User saved")}
function editUser(id){openUser(users.find(x=>x.id===id))}function toggleUser(id){let x=users.find(x=>x.id===id);x.status=x.status==="Active"?"Inactive":"Active";save();log("Changed "+x.name+" status");renderAll()}function delUser(id){if(!confirm("Delete user?"))return;users=users.filter(x=>x.id!==id);save();log("User deleted");renderAll();toast("Deleted")}
function openProduct(x){x=x||{};modal(x.id?"Edit Product":"Add Product",`<form class=form onsubmit="saveProduct(event,${x.id||0})"><label>Name<input id=p1 required value="${esc(x.name||"")}"></label><label>Category<select id=p2>${["Electronics","Clothing","Home","Beauty"].map(v=>`<option ${x.cat===v?"selected":""}>${v}</option>`).join("")}</select></label><label>SKU<input id=p3 required value="${esc(x.sku||"")}"></label><label>Price<input id=p4 type=number min=0 step=.01 required value="${x.price??""}"></label><label>Stock<input id=p5 type=number min=0 required value="${x.stock??""}"></label><div class=foot><button type=button class=btn onclick=closeModal()>Cancel</button> <button class="btn primary">Save</button></div></form>`)}
function saveProduct(e,id){e.preventDefault();let x={name:p1.value,cat:p2.value,sku:p3.value,price:+p4.value,stock:+p5.value};if(id)Object.assign(products.find(x=>x.id===id),x);else products.unshift({id:Date.now(),...x});save();log((id?"Updated ":"Added ")+x.name);closeModal();renderAll();toast("Product saved")}
function editProduct(id){openProduct(products.find(x=>x.id===id))}function delProduct(id){if(!confirm("Delete product?"))return;products=products.filter(x=>x.id!==id);save();log("Product deleted");renderAll()}
function openOrder(){modal("Add Order",`<form class=form onsubmit="saveOrder(event)"><label>Customer<input id=o1 required></label><label>Amount<input id=o2 type=number min=0 step=.01 required></label><label>Status<select id=o3><option>Pending</option><option>Processing</option><option>Delivered</option><option>Cancelled</option></select></label><div class=foot><button type=button class=btn onclick=closeModal()>Cancel</button> <button class="btn primary">Create</button></div></form>`)}
function saveOrder(e){e.preventDefault();let id="#"+Math.floor(Math.random()*9000+1000);orders.unshift({id,customer:o1.value,date:new Date().toLocaleDateString(),amount:+o2.value,status:o3.value});save();log("Created order "+id);closeModal();renderAll();toast("Order created")}
function cycleOrder(id){let x=orders.find(x=>x.id===id),s=["Pending","Processing","Delivered","Cancelled"],i=s.indexOf(x.status);x.status=s[(i+1)%4];save();log("Updated "+id);renderAll()}
function delOrder(id){if(!confirm("Delete order?"))return;orders=orders.filter(x=>x.id!==id);save();log("Order deleted");renderAll()}
function exportCSV(type){let a=type==="orders"?orders: type==="products"?products:customers;let keys=Object.keys(a[0]||{}),csv=keys.join(",")+"\\n"+a.map(x=>keys.map(k=>`"${String(x[k]??"").replaceAll('"','""')}"`).join(",")).join("\\n");let u=URL.createObjectURL(new Blob([csv],{type:"text/csv"})),ael=document.createElement("a");ael.href=u;ael.download=type+".csv";ael.click();URL.revokeObjectURL(u);toast("CSV exported")}
function logout(){authLogout()}function resetData(){if(!confirm("Reset saved data?"))return;users=cp(U0);products=cp(P0);orders=cp(O0);customers=cp(C0);logs=["Demo data reset"];save();renderAll();toast("Reset complete")}
document.getElementById("menu").onclick=(e)=>{
  e.stopPropagation();
  if(window.innerWidth<=800){side.classList.toggle("open");}
  else{side.classList.toggle("collapsed");document.body.classList.toggle("sidebar-collapsed");}
};
window.addEventListener("resize",()=>{
  if(window.innerWidth>800){side.classList.remove("open");}
});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){side.classList.remove("open");document.getElementById("addMenu").classList.remove("show");document.getElementById("notifPanel").classList.remove("show");}});


document.querySelectorAll("[data-page]").forEach(b=>b.addEventListener("click",()=>{if(window.innerWidth<=800)side.classList.remove("open");}));
document.getElementById("refresh").onclick=()=>{load();renderAll();toast("Dashboard refreshed")};
document.getElementById("theme").onclick=()=>{document.body.classList.toggle("dark");localStorage.theme=document.body.classList.contains("dark")?"dark":"light";toast(document.body.classList.contains("dark")?"Dark mode":"Light mode")};
document.getElementById("addTop").onclick=(e)=>{e.stopPropagation();document.getElementById("addMenu").classList.toggle("show");document.getElementById("notifPanel").classList.remove("show")};
document.getElementById("notify").onclick=(e)=>{e.stopPropagation();document.getElementById("notifPanel").classList.toggle("show");document.getElementById("addMenu").classList.remove("show")};
document.addEventListener("click",()=>{document.getElementById("addMenu").classList.remove("show");document.getElementById("notifPanel").classList.remove("show")});
document.getElementById("addMenu").onclick=e=>e.stopPropagation();
document.getElementById("notifPanel").onclick=e=>e.stopPropagation();
function closeAddMenu(){document.getElementById("addMenu").classList.remove("show")}
function showPageFromMenu(id){go(id)}
function clearNotifications(){document.getElementById("ncount").textContent="0";document.getElementById("notify").classList.add("empty");document.getElementById("notifPanel").classList.remove("show");toast("Notifications cleared")}if(localStorage.theme==="dark")document.body.classList.add("dark");
us.oninput=renderUsers;ur.onchange=renderUsers;cs.oninput=renderCustomers;ps.oninput=renderProducts;pc.onchange=renderProducts;os.oninput=renderOrders;of.onchange=renderOrders;
renderAll();




/* FINAL SINGLE AUTH SYSTEM */
(function(){
  const ACCOUNT_KEY='adminpro_account_final_v7';
  const SESSION_KEY='adminpro_session_final_v7';
  const $=id=>document.getElementById(id);

  function account(){
    try{return JSON.parse(localStorage.getItem(ACCOUNT_KEY)||'null')}
    catch(e){return null}
  }

  function dashboard(){
    document.body.classList.remove('auth-locked');
    const gate=$('authBg');
    if(gate)gate.style.display='none';
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    const page=$('dashboard'); if(page)page.classList.add('active');
    document.querySelectorAll('[data-page]').forEach(b=>b.classList.remove('active'));
    const nav=document.querySelector('[data-page="dashboard"]');if(nav)nav.classList.add('active');
    const title=$('title');if(title)title.textContent='Dashboard';
  }

  window.togglePass=function(id,btn){
    const input=$(id);
    input.type=input.type==='password'?'text':'password';
    btn.textContent=input.type==='password'?'Show':'Hide';
  };

  window.showCreateStep=function(){
    $('createStep').classList.add('active');
    $('loginStep').classList.remove('active');
    $('createError').textContent='';
    $('loginError2').textContent='';
  };

  window.showLoginStep=function(){
    $('createStep').classList.remove('active');
    $('loginStep').classList.add('active');
    $('createError').textContent='';
    $('loginError2').textContent='';
    const a=account();
    if(a)$('loginEmail2').value=a.email;
  };

  window.authLogout=function(){
    localStorage.removeItem(SESSION_KEY);
    $('authBg').style.display='grid';
    document.body.classList.add('auth-locked');
    showLoginStep();
    $('loginPassword2').value='';
  };

  $('createAccountForm').addEventListener('submit',function(e){
    e.preventDefault();
    const name=$('createName').value.trim();
    const email=$('createEmail').value.trim().toLowerCase();
    const pass=$('createPassword').value;
    const confirm=$('createConfirm').value;

    if(!name){$('createError').textContent='Please enter your name.';return}
    if(pass.length<6){$('createError').textContent='Password must be at least 6 characters.';return}
    if(pass!==confirm){$('createError').textContent='Passwords do not match.';return}

    localStorage.setItem(ACCOUNT_KEY,JSON.stringify({name,email,password:pass}));
    $('loginEmail2').value=email;
    $('loginPassword2').value='';
    showLoginStep();
    $('loginError2').textContent='Sign in successful. Now login with your email and password.';
  });

  $('loginAccountForm').addEventListener('submit',function(e){
    e.preventDefault();
    const a=account();
    const email=$('loginEmail2').value.trim().toLowerCase();
    const pass=$('loginPassword2').value;

    if(!a){
      showCreateStep();
      $('createError').textContent='Please Sign In first.';
      return;
    }

    if(email!==a.email || pass!==a.password){
      $('loginError2').textContent='Incorrect email or password.';
      return;
    }

    localStorage.setItem(SESSION_KEY,'1');
    dashboard();
  });

  function start(){
    document.body.classList.remove('auth-locked');
    if(localStorage.getItem(SESSION_KEY)==='1'){
      dashboard();
    }else{
      $('authBg').style.display='grid';
      document.body.classList.add('auth-locked');
      if(account())showLoginStep();
      else showCreateStep();
    }
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',start);
  }else{
    start();
  }
})();
