function getStudentPortalUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_STUDENT_PORTAL_URL?.trim() || "https://academy.eelausa.org/";

  try {
    const url = new URL(configuredUrl);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

export function StudentPortalView() {
  const portalUrl = getStudentPortalUrl();

  return (
    <section className="glass-panel student-portal" aria-labelledby="student-portal-title">
      <p className="section-label">EELA Student Portal</p>
      <h3 id="student-portal-title">Your next chapter starts here.</h3>
      <p className="student-portal-copy">
        Access the student portal from your Aluminate workspace.
      </p>
      {portalUrl ? (
        <>
          <a className="primary-button student-portal-link" href={portalUrl} target="_blank" rel="noopener noreferrer">
            Open Student Portal <span aria-hidden="true">↗</span>
          </a>
          <p className="student-portal-note">Opens in a new browser tab. You may need to sign in with your student portal account.</p>
        </>
      ) : (
        <p className="student-portal-note">The student portal is not yet connected. Please check back soon or contact the EEA team for access.</p>
      )}
    </section>
  );
}
