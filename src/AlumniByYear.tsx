import { type CSSProperties, useEffect, useState } from "react";
import { getAlumniByYear } from "@dataconnect/generated";

type Alumni = {
  id: string;
  name: string;
  major?: string | null;
  graduationYear?: number | null;
};

type AlumniByYearResult = {
  data?: {
    users?: Alumni[];
  };
};

export async function fetchAlumniByYear(graduationYear: number): Promise<Alumni[]> {
  const result = (await getAlumniByYear({ graduationYear })) as AlumniByYearResult;
  return result.data?.users ?? [];
}

type AlumniByYearListProps = {
  graduationYear: number;
};

export function AlumniByYearList({ graduationYear }: AlumniByYearListProps) {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAlumni() {
      try {
        setIsLoading(true);
        setError(null);
        const records = await fetchAlumniByYear(graduationYear);
        if (isMounted) setAlumni(records);
      } catch (unknownError) {
        if (isMounted) {
          setError(unknownError instanceof Error ? unknownError.message : "Unable to load alumni.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadAlumni();

    return () => {
      isMounted = false;
    };
  }, [graduationYear]);

  return (
    <section style={styles.card}>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Alumni Directory</p>
          <h2 style={styles.title}>Class of {graduationYear}</h2>
        </div>
        <span style={styles.count}>{alumni.length}</span>
      </div>

      {isLoading && <p style={styles.muted}>Loading alumni...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!isLoading && !error && alumni.length === 0 && (
        <p style={styles.muted}>No alumni found for this graduation year.</p>
      )}

      {!isLoading && !error && alumni.length > 0 && (
        <ul style={styles.list}>
          {alumni.map((person) => (
            <li key={person.id} style={styles.row}>
              <div style={styles.avatar}>{getInitials(person.name)}</div>
              <div>
                <strong style={styles.name}>{person.name}</strong>
                <p style={styles.major}>{person.major || "Major not listed"}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const styles: Record<string, CSSProperties> = {
  card: {
    width: "100%",
    maxWidth: 720,
    border: "1px solid rgba(17, 24, 39, 0.1)",
    borderRadius: 24,
    padding: 20,
    background: "rgba(255, 255, 255, 0.78)",
    boxShadow: "0 24px 80px rgba(36, 45, 78, 0.14)",
    backdropFilter: "blur(24px)"
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 16
  },
  eyebrow: {
    margin: 0,
    color: "#667085",
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase"
  },
  title: {
    margin: "4px 0 0",
    color: "#111827",
    fontSize: 28,
    letterSpacing: 0
  },
  count: {
    display: "grid",
    minWidth: 44,
    height: 36,
    placeItems: "center",
    borderRadius: 999,
    color: "#fff",
    fontWeight: 800,
    background: "linear-gradient(135deg, #1777ff, #8a5cf6)"
  },
  list: {
    display: "grid",
    gap: 10,
    margin: 0,
    padding: 0,
    listStyle: "none"
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    border: "1px solid rgba(17, 24, 39, 0.08)",
    borderRadius: 16,
    padding: 12,
    background: "rgba(255, 255, 255, 0.66)"
  },
  avatar: {
    display: "grid",
    flex: "0 0 auto",
    width: 40,
    height: 40,
    placeItems: "center",
    borderRadius: 14,
    color: "#fff",
    fontSize: 13,
    fontWeight: 900,
    background: "linear-gradient(135deg, #1777ff, #ff5f57)"
  },
  name: {
    display: "block",
    color: "#111827",
    fontSize: 15
  },
  major: {
    margin: "3px 0 0",
    color: "#667085",
    fontSize: 14
  },
  muted: {
    margin: 0,
    color: "#667085"
  },
  error: {
    margin: 0,
    color: "#b42318",
    fontWeight: 700
  }
};
