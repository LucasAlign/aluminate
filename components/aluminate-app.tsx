"use client";

import { useMemo, useState } from "react";
import { parseRosterFile } from "@/lib/importers";
import { alumniSeed, initials, learningModules, supportRequests, viewTitles } from "@/lib/seed-data";
import type { AlumniProfile, UserRole, ViewKey } from "@/lib/types";

type ProfileTextField = Exclude<keyof AlumniProfile, "id" | "openToMentor">;

const profileFields: ProfileTextField[] = [
  "name",
  "cohort",
  "school",
  "industry",
  "email",
  "phone",
  "city",
  "status",
  "business",
  "skills"
];

const navItems: Array<{ key: ViewKey; label: string; count: string; icon: string; adminOnly?: boolean }> = [
  { key: "community", label: "Home", count: "12", icon: "H" },
  { key: "directory", label: "Directory", count: "248", icon: "D" },
  { key: "learn", label: "Learn", count: "36", icon: "L" },
  { key: "support", label: "Support", count: "4", icon: "S" },
  { key: "profile", label: "Profile", count: "You", icon: "P" },
  { key: "admin", label: "Admin", count: "Live", icon: "A", adminOnly: true }
];

export function AluminateApp() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [activeView, setActiveView] = useState<ViewKey>("community");
  const [alumni, setAlumni] = useState(alumniSeed);
  const [search, setSearch] = useState("");
  const [activeProfile, setActiveProfile] = useState<AlumniProfile | null>(null);
  const [draftProfile, setDraftProfile] = useState<AlumniProfile | null>(null);
  const [importNote, setImportNote] = useState(
    "Upload CSV or Excel columns like name, cohort, school, industry, email, phone, business, status, city, skills."
  );

  const visibleNav = navItems.filter((item) => !item.adminOnly || role === "admin");
  const filteredAlumni = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return alumni;
    return alumni.filter((person) => Object.values(person).join(" ").toLowerCase().includes(query));
  }, [alumni, search]);

  function loginAs(nextRole: UserRole) {
    setRole(nextRole);
    setActiveView("community");
  }

  function changeView(view: ViewKey) {
    if (view === "admin" && role !== "admin") {
      setActiveView("community");
      return;
    }
    setActiveView(view);
  }

  function openProfile(person: AlumniProfile) {
    setActiveProfile(person);
    setDraftProfile({ ...person });
  }

  function saveProfile() {
    if (!draftProfile) return;
    setAlumni((records) => records.map((person) => (person.id === draftProfile.id ? draftProfile : person)));
    setActiveProfile(null);
    setDraftProfile(null);
  }

  async function handleImport(file: File | undefined) {
    if (!file || role !== "admin") return;

    try {
      const imported = await parseRosterFile(file);
      setAlumni((records) => [...imported, ...records]);
      setImportNote(`Imported ${imported.length} alumni record${imported.length === 1 ? "" : "s"} from ${file.name}.`);
      setActiveView("directory");
    } catch (error) {
      setImportNote(error instanceof Error ? error.message : "Unable to import this roster.");
    }
  }

  if (!role) {
    return (
      <main className="login-screen">
        <section className="glass-panel login-card">
          <LogoBlock large />
          <p className="eyebrow">Emerging Entrepreneurs Academy</p>
          <h1>Aluminate</h1>
          <p className="login-copy">Choose the right portal. Production auth will bind this role to the signed-in account.</p>
          <div className="login-actions">
            <button className="primary-button" onClick={() => loginAs("alumni")}>
              Alumni Login
            </button>
            <button className="secondary-button" onClick={() => loginAs("admin")}>
              Admin Login
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <aside className="glass-panel sidebar">
        <div className="brand">
          <LogoBlock />
          <div>
            <p className="eyebrow">Emerging Entrepreneurs Academy</p>
            <h1>Aluminate</h1>
          </div>
        </div>

        <nav className="nav-list" aria-label="Primary">
          {visibleNav.map((item) => (
            <NavButton key={item.key} item={item} active={activeView === item.key} onClick={() => changeView(item.key)} />
          ))}
        </nav>

        <section className="theme-card">
          <p className="section-label">Phase 1</p>
          <div className="role-grid compact">
            <div>
              <strong>{role === "admin" ? "Admin" : "Alumni"}</strong>
              <span>{role === "admin" ? "Reports, import, moderation" : "Community, learning, support"}</span>
            </div>
          </div>
          <button className="secondary-button logout-button" onClick={() => setRole(null)}>
            <span className="button-icon">O</span>
            Sign out
          </button>
        </section>
      </aside>

      <main className="main-panel">
        <header className="glass-panel topbar">
          <div>
            <p className="eyebrow">Welcome back, Maya</p>
            <h2>{viewTitles[activeView]}</h2>
          </div>
          <div className="top-actions">
            <span className="session-pill">{role === "admin" ? "Admin" : "Alumni"}</span>
            <button className="icon-button" aria-label="Search">
              S
            </button>
            <button className="icon-button" aria-label="Notifications">
              N
            </button>
            <button className="primary-button">
              <span className="button-icon">+</span>
              New Post
            </button>
          </div>
        </header>

        {activeView === "community" && <CommunityView />}
        {activeView === "directory" && (
          <DirectoryView alumni={filteredAlumni} search={search} onSearch={setSearch} onOpenProfile={openProfile} />
        )}
        {activeView === "learn" && <LearnView />}
        {activeView === "support" && <SupportView />}
        {activeView === "profile" && <ProfileView profile={alumni[0]} onEdit={openProfile} />}
        {activeView === "admin" && role === "admin" && (
          <AdminView alumniCount={alumni.length} importNote={importNote} onImport={handleImport} />
        )}
      </main>

      <nav className="glass-panel mobile-nav" aria-label="Mobile primary">
        {visibleNav.map((item) => {
          return (
            <button
              key={item.key}
              className={activeView === item.key ? "active" : ""}
              onClick={() => changeView(item.key)}
              aria-label={item.label}
            >
              <span className="mobile-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {activeProfile && draftProfile && (
        <ProfileModal
          draft={draftProfile}
          onChange={setDraftProfile}
          onClose={() => setActiveProfile(null)}
          onSave={saveProfile}
        />
      )}
    </div>
  );
}

function LogoBlock({ large = false }: { large?: boolean }) {
  return (
    <div className={large ? "brand-logo large-logo" : "brand-logo"}>
      <img src="/assets/eea-logo.png" alt="Emerging Entrepreneurs Academy logo" />
    </div>
  );
}

function NavButton({
  item,
  active,
  onClick
}: {
  item: (typeof navItems)[number];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button className={active ? "nav-item active" : "nav-item"} onClick={onClick}>
      <span>
        <span className="nav-icon">{item.icon}</span>
        {item.label}
      </span>
      <strong>{item.count}</strong>
    </button>
  );
}

function CommunityView() {
  return (
    <section className="content-grid">
      <div className="feed-column">
        <div className="glass-panel composer">
          <div className="avatar">MC</div>
          <button className="composer-input">Share a win, ask for help, or post an opportunity...</button>
        </div>

        <article className="glass-panel post-card">
          <div className="post-head">
            <div className="avatar coral">AR</div>
            <div>
              <h3>Ari Rivera</h3>
              <p>2024 alumni - apparel startup - 18 min ago</p>
            </div>
            <span className="pill">Startup Win</span>
          </div>
          <p className="post-copy">
            First weekend pop-up is booked. I used the pricing worksheet from EEA and finally feel confident about margins.
          </p>
          <div className="image-strip">
            <div className="color-tile red" />
            <div className="color-tile blue" />
            <div className="color-tile gold" />
          </div>
          <div className="post-actions">
            <button>Celebrate</button>
            <button>Comment</button>
            <button>Save</button>
          </div>
        </article>

        <article className="glass-panel post-card">
          <div className="post-head">
            <div className="avatar green">JL</div>
            <div>
              <h3>Jada Lee</h3>
              <p>2025 alumni - food concept - 42 min ago</p>
            </div>
            <span className="pill violet">Mentor Ask</span>
          </div>
          <p className="post-copy">
            Does anyone have experience testing a menu before renting kitchen space? Looking for a mentor who knows food
            licensing basics.
          </p>
          <div className="reply-box">
            <strong>Coach note</strong>
            <span>Gary from the sponsor network can help. Tap Support to request an intro.</span>
          </div>
          <div className="post-actions">
            <button>Helpful</button>
            <button>Comment</button>
            <button>Request Intro</button>
          </div>
        </article>
      </div>

      <aside className="right-rail">
        <section className="glass-panel rail-card">
          <p className="section-label">Upcoming</p>
          <h3>Pitch Practice Night</h3>
          <p>Thursday, 6:30 PM at Penn State Berks</p>
          <div className="mini-row">
            <span>RSVPs</span>
            <strong>32</strong>
          </div>
          <button className="secondary-button">RSVP</button>
        </section>

        <section className="glass-panel rail-card">
          <p className="section-label">Mentor matches</p>
          {["Sam Torres", "Nina Patel"].map((name, index) => (
            <div className="mentor" key={name}>
              <div className={index === 0 ? "avatar blue" : "avatar violet"}>{initials(name)}</div>
              <div>
                <strong>{name}</strong>
                <span>{index === 0 ? "Branding, websites, pricing" : "Finance, projections, grants"}</span>
              </div>
            </div>
          ))}
        </section>
      </aside>
    </section>
  );
}

function DirectoryView({
  alumni,
  search,
  onSearch,
  onOpenProfile
}: {
  alumni: AlumniProfile[];
  search: string;
  onSearch: (value: string) => void;
  onOpenProfile: (person: AlumniProfile) => void;
}) {
  return (
    <section>
      <div className="glass-panel toolbar">
        <input
          aria-label="Search alumni"
          placeholder="Search alumni by name, school, industry..."
          value={search}
          onChange={(event) => onSearch(event.target.value)}
        />
        <button>All cohorts</button>
        <button>Open to mentor</button>
      </div>
      <div className="glass-panel directory-list">
        <div className="directory-header">
          <span>Alumni</span>
          <span>Cohort</span>
          <span>School</span>
          <span>Industry</span>
          <span>Business / Idea</span>
          <span>City</span>
          <span>Status</span>
        </div>
        {alumni.map((person, index) => (
          <button className="alumni-row" key={person.id} onClick={() => onOpenProfile(person)}>
            <span className="alumni-person">
              <span className={`mini-avatar ${index % 3 === 1 ? "coral" : index % 3 === 2 ? "green" : "blue"}`}>
                {initials(person.name)}
              </span>
              <span>
                <strong>{person.name}</strong>
                <small>{person.email}</small>
              </span>
            </span>
            <span>{person.cohort}</span>
            <span>{person.school}</span>
            <span>{person.industry}</span>
            <span>{person.business}</span>
            <span>{person.city}</span>
            <span className="status-chip">{person.status}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function LearnView() {
  return (
    <section className="learning-grid">
      <article className="glass-panel learn-feature">
        <p className="section-label">Continue learning</p>
        <h3>Build Your First Real Business Plan</h3>
        <p>A clean module path from idea validation to projections, built from the EEA workshop flow.</p>
        <button className="primary-button">Resume Module</button>
      </article>
      <div className="module-list">
        {learningModules.map((module) => (
          <article className="glass-panel module" key={module.number}>
            <span>{module.number}</span>
            <div>
              <h3>{module.title}</h3>
              <p>{module.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SupportView() {
  return (
    <section className="support-layout">
      <section className="glass-panel support-card">
        <p className="section-label">Request support</p>
        <h3>What do you need help with?</h3>
        <div className="support-buttons">
          {["Business idea feedback", "Pitch review", "Marketing help", "Funding guidance", "Mentor intro", "Website or brand"].map(
            (item) => (
              <button key={item}>{item}</button>
            )
          )}
        </div>
      </section>
      <section className="glass-panel support-card">
        <p className="section-label">Open requests</p>
        {supportRequests.map((request) => (
          <div className="request-row" key={request.title}>
            <strong>{request.title}</strong>
            <span>{request.status}</span>
          </div>
        ))}
      </section>
    </section>
  );
}

function ProfileView({ profile, onEdit }: { profile: AlumniProfile; onEdit: (person: AlumniProfile) => void }) {
  return (
    <section className="glass-panel profile-card standalone-profile">
      <div className="profile-hero gradient-a" />
      <div className="avatar floating">{initials(profile.name)}</div>
      <p className="section-label">Alumni profile</p>
      <h3>{profile.name}</h3>
      <p>
        {profile.cohort} - {profile.school} - {profile.industry}
      </p>
      <div className="tag-row">
        <span>{profile.status}</span>
        <span>{profile.city}</span>
        <span>{profile.openToMentor ? "Open to mentor" : "Building now"}</span>
      </div>
      <p>{profile.skills}</p>
      <button className="primary-button profile-edit" onClick={() => onEdit(profile)}>
        Edit Profile
      </button>
    </section>
  );
}

function AdminView({
  alumniCount,
  importNote,
  onImport
}: {
  alumniCount: number;
  importNote: string;
  onImport: (file: File | undefined) => void;
}) {
  return (
    <section>
      <div className="metric-grid">
        <article className="glass-panel metric">
          <span>Total alumni</span>
          <strong>{alumniCount}</strong>
          <p>Roster records ready</p>
        </article>
        <article className="glass-panel metric">
          <span>Active this month</span>
          <strong>71%</strong>
          <p>176 alumni engaged</p>
        </article>
        <article className="glass-panel metric">
          <span>Support resolved</span>
          <strong>42</strong>
          <p>8 open requests</p>
        </article>
        <article className="glass-panel metric">
          <span>Businesses launched</span>
          <strong>29</strong>
          <p>Tracked outcomes</p>
        </article>
      </div>

      <div className="admin-grid">
        <section className="glass-panel report-card admin-import-card">
          <p className="section-label">Access controlled</p>
          <h3>Admin Data Import</h3>
          <p className="admin-copy">
            Only Admin users can import rosters, approve accounts, edit alumni records, moderate posts, and export reports.
            Alumni users never see this navigation.
          </p>
          <div className="role-grid">
            <div>
              <strong>Admin</strong>
              <span>Import, edit, reports, moderation</span>
            </div>
            <div>
              <strong>Alumni</strong>
              <span>Directory, groups, support, learning</span>
            </div>
          </div>
          <label className="import-button">
            <span className="button-icon">U</span>
            Import CSV/Excel
            <input type="file" accept=".csv,.xlsx,.xls" onChange={(event) => onImport(event.target.files?.[0])} />
          </label>
          <div className="import-note">{importNote}</div>
        </section>

        <section className="glass-panel report-card">
          <p className="section-label">Engagement by cohort</p>
          {[["2025", "88%"], ["2024", "74%"], ["2023", "61%"], ["2022", "46%"]].map(([year, value]) => (
            <div className="bar-row" key={year}>
              <span>{year}</span>
              <div>
                <i style={{ width: value }} />
              </div>
              <strong>{value}</strong>
            </div>
          ))}
        </section>

        <section className="glass-panel report-card">
          <p className="section-label">Admin tools</p>
          {[
            ["Approve new alumni accounts", "A"],
            ["Review imported alumni data", "R"],
            ["Export sponsor impact report", "E"],
            ["Manage resources and events", "M"],
            ["Review flagged content", "F"]
          ].map(([label, icon]) => {
            return (
              <button className="admin-action" key={label as string}>
                <span className="nav-icon">{icon as string}</span>
                {label as string}
              </button>
            );
          })}
        </section>
      </div>
    </section>
  );
}

function ProfileModal({
  draft,
  onChange,
  onClose,
  onSave
}: {
  draft: AlumniProfile;
  onChange: (profile: AlumniProfile) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div className="modal-backdrop open" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="glass-panel profile-modal" role="dialog" aria-modal="true" aria-labelledby="modal-name">
        <button className="modal-close" onClick={onClose} aria-label="Close profile">
          Close
        </button>
        <div className="modal-head">
          <div className="avatar large">{initials(draft.name)}</div>
          <div>
            <p className="section-label">Alumni profile</p>
            <h3 id="modal-name">{draft.name}</h3>
            <p>
              {draft.cohort} - {draft.school}
            </p>
          </div>
        </div>

        <form className="profile-form">
          {profileFields.map((field) => (
            <label key={field} className={field === "business" || field === "skills" ? "wide" : ""}>
              {field === "business" ? "Business / idea" : field}
              {field === "skills" ? (
                <textarea value={draft[field]} onChange={(event) => onChange({ ...draft, [field]: event.target.value })} />
              ) : (
                <input value={draft[field]} onChange={(event) => onChange({ ...draft, [field]: event.target.value })} />
              )}
            </label>
          ))}
        </form>

        <div className="modal-actions">
          <button className="secondary-button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-button" onClick={onSave}>
            Save Changes
          </button>
        </div>
      </section>
    </div>
  );
}
