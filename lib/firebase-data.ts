import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  type User,
  type UserCredential
} from "firebase/auth";
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  type FirestoreError
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFirebaseServices } from "@/lib/firebase";
import type { AlumniProfile, CommunityPost, PostAttachment, SupportRequest, UserRole } from "@/lib/types";

export type LiveUserProfile = AlumniProfile & {
  uid: string;
  role: UserRole;
};

type PostDocument = Omit<CommunityPost, "createdAt"> & {
  createdAt?: Timestamp;
};

type SupportRequestDocument = Omit<SupportRequest, "createdAt"> & {
  createdAt?: Timestamp;
};

const googleProvider = new GoogleAuthProvider();

export function getLiveServices() {
  return getFirebaseServices();
}

export async function signInForRole(role: UserRole): Promise<UserCredential | null> {
  const services = getLiveServices();
  if (!services) return null;
  return signInWithPopup(services.auth, googleProvider);
}

export async function signInWithEmailPassword(email: string, password: string): Promise<UserCredential | null> {
  const services = getLiveServices();
  if (!services) return null;
  return signInWithEmailAndPassword(services.auth, email, password);
}

export async function loadOrCreateUserProfile(user: User, selectedRole: UserRole): Promise<LiveUserProfile | null> {
  const services = getLiveServices();
  if (!services) return null;

  const profileRef = doc(services.db, "profiles", user.uid);
  const existing = await getDoc(profileRef);
  if (existing.exists()) {
    return { id: user.uid, uid: user.uid, ...existing.data() } as LiveUserProfile;
  }

  const fallbackName = user.displayName || user.email?.split("@")[0] || "Aluminate Member";
  const profile: LiveUserProfile = {
    id: user.uid,
    uid: user.uid,
    role: selectedRole,
    name: fallbackName,
    cohort: "Alumni",
    school: "Emerging Entrepreneurs Academy",
    industry: "Entrepreneurship",
    email: user.email || "",
    phone: "",
    city: "Berks County, PA",
    business: "New venture",
    status: "Active",
    skills: "Add your skills, business needs, and mentor interests.",
    openToMentor: false
  };

  await setDoc(profileRef, profile);
  return profile;
}

export function watchPosts(onPosts: (posts: CommunityPost[]) => void, onError: (error: FirestoreError) => void) {
  const services = getLiveServices();
  if (!services) return null;

  return onSnapshot(
    query(collection(services.db, "posts"), orderBy("createdAt", "desc")),
    (snapshot) => {
      onPosts(
        snapshot.docs.map((record) => {
          const data = record.data() as PostDocument;
          const createdAt = data.createdAt?.toMillis();
          return {
            ...data,
            id: record.id,
            createdAt,
            timeAgo: createdAt ? relativeTime(createdAt) : data.timeAgo
          };
        })
      );
    },
    onError
  );
}

export function watchSupportRequests(
  onRequests: (requests: SupportRequest[]) => void,
  onError: (error: FirestoreError) => void
) {
  const services = getLiveServices();
  if (!services) return null;

  return onSnapshot(
    query(collection(services.db, "supportRequests"), orderBy("createdAt", "desc")),
    (snapshot) => {
      onRequests(
        snapshot.docs.map((record) => {
          const data = record.data() as SupportRequestDocument;
          return {
            ...data,
            id: record.id,
            createdAt: data.createdAt?.toMillis()
          };
        })
      );
    },
    onError
  );
}

export async function saveUserProfile(profile: AlumniProfile) {
  const services = getLiveServices();
  const uid = profile.uid || profile.id;
  if (!services || !uid) return;
  await setDoc(doc(services.db, "profiles", uid), profile, { merge: true });
}

export async function createLivePost({
  body,
  files,
  profile
}: {
  body: string;
  files: File[];
  profile: LiveUserProfile;
}) {
  const services = getLiveServices();
  if (!services) return null;

  const postRef = doc(collection(services.db, "posts"));
  const attachments = await uploadPostAttachments(postRef.id, profile.uid, files);
  const post: CommunityPost = {
    id: postRef.id,
    authorId: profile.uid,
    author: profile.name,
    cohort: `${profile.cohort} alumni`,
    business: profile.business || profile.industry,
    timeAgo: "Just now",
    category: body.endsWith("?") ? "Community Ask" : "Update",
    tone: body.endsWith("?") ? "violet" : "green",
    body: body || "Shared new files with the community.",
    attachments,
    reactions: 0,
    comments: 0,
    createdAt: Date.now()
  };

  await setDoc(postRef, { ...post, createdAt: Timestamp.now() });
  return post;
}

export async function createLiveSupportRequest({
  category,
  detail,
  profile
}: {
  category: string;
  detail: string;
  profile: LiveUserProfile;
}) {
  const services = getLiveServices();
  if (!services) return null;

  const requestRef = doc(collection(services.db, "supportRequests"));
  const request: SupportRequest = {
    id: requestRef.id,
    authorId: profile.uid,
    title: category,
    category,
    status: "New request",
    detail,
    createdAt: Date.now()
  };

  await setDoc(requestRef, { ...request, createdAt: Timestamp.now() });
  return request;
}

async function uploadPostAttachments(postId: string, uid: string, files: File[]): Promise<PostAttachment[]> {
  const services = getLiveServices();
  if (!services || files.length === 0) return [];

  const uploads = files.map(async (file, index) => {
    const id = `attachment-${Date.now()}-${index}`;
    const storagePath = `posts/${uid}/${postId}/${id}-${sanitizeFileName(file.name)}`;
    const fileRef = ref(services.storage, storagePath);
    await uploadBytes(fileRef, file, { contentType: file.type || "application/octet-stream" });
    const url = await getDownloadURL(fileRef);

    return {
      id,
      name: file.name,
      kind: file.type.startsWith("image/") ? "image" : "file",
      url,
      storagePath,
      contentType: file.type,
      size: file.size
    } satisfies PostAttachment;
  });

  return Promise.all(uploads);
}

function sanitizeFileName(name: string) {
  return name.replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
}

function relativeTime(timestamp: number) {
  const seconds = Math.max(1, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}
