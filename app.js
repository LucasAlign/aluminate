const viewTitles = {
  community: "Community Home",
  directory: "Alumni Directory",
  learn: "Learning Hub",
  support: "Support Center",
  admin: "Admin Portal"
};

const themeNames = {
  glass: "Apple Glass Community",
  founder: "Founder Dashboard",
  dream: "Dream Chaser Social",
  impact: "EEA Impact Network"
};

let alumni = [
  {
    name: "Maya Chen",
    cohort: "2023",
    school: "Wyomissing Area",
    industry: "Digital media",
    email: "maya.chen@example.com",
    phone: "484-555-0198",
    city: "Wyomissing, PA",
    business: "Brand studio for student founders",
    status: "Founder",
    skills: "Branding, websites, social media. Needs help with pricing retainers."
  },
  {
    name: "Ari Rivera",
    cohort: "2024",
    school: "Reading High",
    industry: "Apparel",
    email: "ari.rivera@example.com",
    phone: "484-555-0142",
    city: "Reading, PA",
    business: "Local apparel pop-up brand",
    status: "Launching",
    skills: "Retail, pop-ups, sales. Needs vendor fair contacts."
  },
  {
    name: "Jada Lee",
    cohort: "2025",
    school: "Exeter",
    industry: "Food concept",
    email: "jada.lee@example.com",
    phone: "484-555-0176",
    city: "Exeter, PA",
    business: "Weekend dessert catering idea",
    status: "Early idea",
    skills: "Menu testing, customer discovery. Needs licensing guidance."
  },
  {
    name: "Noah Patel",
    cohort: "2022",
    school: "Wilson",
    industry: "Lawn care",
    email: "noah.patel@example.com",
    phone: "484-555-0113",
    city: "Sinking Spring, PA",
    business: "Neighborhood lawn care service",
    status: "Operating",
    skills: "Hiring, estimates, operations. Open to mentor younger alumni."
  }
];

let activeProfileIndex = 0;
let currentRole = "alumni";

const initials = (name) => name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

const profileFields = ["name", "cohort", "school", "industry", "email", "phone", "city", "status", "business", "skills"];

function renderAlumniList() {
  const list = document.getElementById("alumni-list");
  const search = document.getElementById("directory-search").value.trim().toLowerCase();
  const filtered = alumni
    .map((person, index) => ({ person, index }))
    .filter(({ person }) => Object.values(person).join(" ").toLowerCase().includes(search));

  list.innerHTML = filtered.map(({ person, index }) => `
    <button class="alumni-row" data-profile-index="${index}">
      <span class="alumni-person">
        <span class="mini-avatar ${index % 3 === 1 ? "coral" : index % 3 === 2 ? "green" : "blue"}">${initials(person.name)}</span>
        <span><strong>${person.name}</strong><small>${person.email}</small></span>
      </span>
      <span>${person.cohort}</span>
      <span>${person.school}</span>
      <span>${person.industry}</span>
      <span>${person.business}</span>
      <span>${person.city}</span>
      <span class="status-chip">${person.status}</span>
    </button>
  `).join("");
}

function openProfile(index) {
  activeProfileIndex = Number(index);
  const person = alumni[activeProfileIndex];
  const modal = document.getElementById("profile-modal");
  document.getElementById("modal-avatar").textContent = initials(person.name);
  document.getElementById("modal-name").textContent = person.name;
  document.getElementById("modal-subtitle").textContent = `${person.cohort} - ${person.school}`;

  profileFields.forEach((field) => {
    document.querySelector(`[name="${field}"]`).value = person[field] || "";
  });

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeProfile() {
  const modal = document.getElementById("profile-modal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function saveProfile() {
  const updated = { ...alumni[activeProfileIndex] };
  profileFields.forEach((field) => {
    updated[field] = document.querySelector(`[name="${field}"]`).value.trim();
  });
  alumni[activeProfileIndex] = updated;
  renderAlumniList();
  closeProfile();
}

function parseCsv(text) {
  const rows = text.trim().split(/\r?\n/).map((row) => row.split(",").map((cell) => cell.trim()));
  const headers = rows.shift().map((header) => header.toLowerCase());
  return rows.map((row) => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = row[index] || "";
    });
    return {
      name: record.name || "Imported Alumni",
      cohort: record.cohort || record.year || "",
      school: record.school || "",
      industry: record.industry || record.interest || "",
      email: record.email || "",
      phone: record.phone || "",
      city: record.city || record.location || "",
      business: record.business || record.idea || "",
      status: record.status || "Imported",
      skills: record.skills || record.notes || ""
    };
  });
}

function showView(view) {
  if (view === "admin" && currentRole !== "admin") view = "community";
  document.querySelectorAll(".nav-item, .mobile-nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === view));
  document.querySelectorAll(".view").forEach((section) => section.classList.remove("active"));
  document.getElementById(view).classList.add("active");
  document.getElementById("view-title").textContent = viewTitles[view];
}

function loginAs(role) {
  currentRole = role;
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("app-shell").classList.remove("hidden");
  document.querySelectorAll(".admin-only").forEach((item) => item.classList.toggle("hidden", role !== "admin"));
  document.querySelector(".mobile-nav").classList.toggle("admin-mode", role === "admin");
  document.getElementById("session-pill").textContent = role === "admin" ? "Admin" : "Alumni";
  showView("community");
}

document.querySelectorAll(".nav-item, .mobile-nav-item").forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.view));
});

document.getElementById("alumni-list").addEventListener("click", (event) => {
  const row = event.target.closest("[data-profile-index]");
  if (row) openProfile(row.dataset.profileIndex);
});

document.getElementById("directory-search").addEventListener("input", renderAlumniList);
document.getElementById("modal-close").addEventListener("click", closeProfile);
document.getElementById("cancel-edit").addEventListener("click", closeProfile);
document.getElementById("save-profile").addEventListener("click", saveProfile);
document.getElementById("profile-modal").addEventListener("click", (event) => {
  if (event.target.id === "profile-modal") closeProfile();
});

document.getElementById("alumni-import").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  const note = document.getElementById("import-note");
  if (!file) return;

  if (!file.name.toLowerCase().endsWith(".csv")) {
    note.textContent = `${file.name} selected. Excel import would be parsed on the real backend; for this prototype, please try a CSV to populate the list.`;
    return;
  }

  const imported = parseCsv(await file.text());
  alumni = [...imported, ...alumni];
  note.textContent = `Imported ${imported.length} alumni record${imported.length === 1 ? "" : "s"} from ${file.name}.`;
  renderAlumniList();
  event.target.value = "";
});

renderAlumniList();

document.querySelectorAll(".login-choice").forEach((button) => {
  button.addEventListener("click", () => {
    loginAs(button.dataset.loginRole);
  });
});

document.querySelectorAll(".theme-dot").forEach((button) => {
  button.addEventListener("click", () => {
    const theme = button.dataset.theme;
    document.body.dataset.theme = theme;
    document.querySelectorAll(".theme-dot").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    document.querySelector(".theme-name").textContent = themeNames[theme];
  });
});
