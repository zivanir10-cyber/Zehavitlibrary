import React, { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithCustomToken,
  signInAnonymously,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  addDoc,
  serverTimestamp,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  Book,
  CheckCircle,
  Clock,
  ChevronLeft,
  FileText,
  User,
  Lock,
  Mail,
  LogOut,
  Award,
  Menu,
  X,
  ArrowRight,
  LibraryBig,
  Sparkles,
  BookOpen,
  Cloud,
  Link as LinkIcon,
  Save,
} from "lucide-react";

const firebaseConfig = {
  apiKey: "AIzaSyDWo2_6S7KVVHn1diDnProt7FSFkZGxng4",
  authDomain: "zehavit-s-library.firebaseapp.com",
  projectId: "zehavit-s-library",
  storageBucket: "zehavit-s-library.firebasestorage.app",
  messagingSenderId: "496159683476",
  appId: "1:496159683476:web:7211af4c23314ee81b9581",
  measurementId: "G-BJW2QH0N4F",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = "extensive-reading-app";

// --- Book Database with Illustrations ---
const LIBRARY_BOOKS = [
  {
    id: "b1",
    title: "Memoirs of a Geisha",
    author: "Arthur Golden",
    plot: "A young girl is sold to a geisha house and becomes one of the most celebrated and successful geishas in Japan, navigating love, war, and strict traditions.",
    imageUrl:
      "https://images.unsplash.com/photo-1545989253-02cc26577f88?w=600&q=80",
    color: "bg-rose-800",
    fileUrl:
      "https://openlibrary.org/search?q=Memoirs+of+a+Geisha+Arthur+Golden",
  },
  {
    id: "b2",
    title: "Captain Corelli's Mandolin",
    author: "Louis de Bernières",
    plot: "An Italian officer is posted to a Greek island during WWII. He falls in love with a local woman, testing allegiances amidst the brutality of war.",
    imageUrl:
      "https://images.unsplash.com/photo-1565593881476-88062b881141?w=600&q=80",
    color: "bg-amber-700",
    fileUrl: "https://openlibrary.org/search?q=Captain+Corelli%27s+Mandolin",
  },
  {
    id: "b3",
    title: "Les Misérables",
    author: "Victor Hugo",
    plot: "Ex-convict Jean Valjean seeks redemption and a new life while being relentlessly hunted for decades by the ruthless Inspector Javert in 19th-century France.",
    imageUrl:
      "https://images.unsplash.com/photo-1584661156681-540e80a161d7?w=600&q=80",
    color: "bg-orange-900",
    fileUrl: "https://openlibrary.org/search?q=Les+Miserables+Victor+Hugo",
  },
  {
    id: "b4",
    title: "The Chamber",
    author: "John Grisham",
    plot: "A young idealistic lawyer tries to save his grandfather, a convicted murderer and white supremacist, from the gas chamber just weeks before his execution.",
    imageUrl:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80",
    color: "bg-stone-800",
    fileUrl: "https://openlibrary.org/search?q=The+Chamber+John+Grisham",
  },
  {
    id: "b5",
    title: "The King of Torts",
    author: "John Grisham",
    plot: "A struggling public defender stumbles upon a massive pharmaceutical conspiracy that makes him incredibly rich, but at a devastating moral and personal cost.",
    imageUrl:
      "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&q=80",
    color: "bg-emerald-900",
    fileUrl: "https://openlibrary.org/search?q=The+King+of+Torts+John+Grisham",
  },
  {
    id: "b6",
    title: "The Testament",
    author: "John Grisham",
    plot: "An eccentric billionaire leaves his vast fortune to an unknown illegitimate daughter living as a missionary in the Brazilian wetlands, sparking a vicious legal war.",
    imageUrl:
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=80",
    color: "bg-teal-800",
    fileUrl: "https://openlibrary.org/search?q=The+Testament+John+Grisham",
  },
  {
    id: "b7",
    title: "Schindler's List",
    author: "Thomas Keneally",
    plot: "The incredible true story of Oskar Schindler, a flawed German businessman who risked his life and fortune to save over a thousand Jewish lives during the Holocaust.",
    imageUrl:
      "https://images.unsplash.com/photo-1455390582262-044cdead27d8?w=600&q=80",
    color: "bg-zinc-800",
    fileUrl:
      "https://openlibrary.org/search?q=Schindler%27s+List+Thomas+Keneally",
  },
  {
    id: "b8",
    title: "Misery",
    author: "Stephen King",
    plot: 'A famous author is rescued from a severe car crash by his "number one fan," who holds him captive and forces him to rewrite his latest novel to her liking.',
    imageUrl:
      "https://images.unsplash.com/photo-1478265409131-1f65c88f965c?w=600&q=80",
    color: "bg-red-900",
    fileUrl: "https://openlibrary.org/search?q=Misery+Stephen+King",
  },
  {
    id: "b9",
    title: "Brave New World",
    author: "Aldous Huxley",
    plot: "In a futuristic, highly controlled society where citizens are genetically engineered and conditioned to be happy, a savage from the outside world challenges their sterile existence.",
    imageUrl:
      "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?w=600&q=80",
    color: "bg-indigo-900",
    fileUrl: "https://openlibrary.org/search?q=Brave+New+World+Aldous+Huxley",
  },
  {
    id: "b10",
    title: "Business @ the Speed of Thought",
    author: "Bill Gates",
    plot: "A visionary guide on how technology and a 'digital nervous system' can transform business operations, allowing companies to respond to challenges and opportunities at the speed of thought.",
    imageUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
    color: "bg-cyan-900",
    fileUrl: "https://openlibrary.org/search?q=Business+the+Speed+of+Thought",
  },
  {
    id: "b11",
    title: "A Room with a View",
    author: "E.M. Forster",
    plot: "Lucy Honeychurch, a young English girl, leads a protected life until a holiday in Italy opens her eyes to a different side of life, teaching her to look closely at people and follow her own heart.",
    imageUrl:
      "https://images.unsplash.com/photo-1498307833015-e7b400441eb8?w=600&q=80",
    color: "bg-emerald-800",
    fileUrl: "https://openlibrary.org/search?q=A+Room+with+a+View+E.M.+Forster",
  },
  {
    id: "b12",
    title: "The Woman in White",
    author: "Wilkie Collins",
    plot: "Walter Hartright encounters a mysterious woman in white on a moonlit road, drawing him into a complex web of secrets, mistaken identities, and a cruel plot against the wealthy Laura Fairlie.",
    imageUrl:
      "https://images.unsplash.com/photo-1518703350285-78e7f1dfb479?w=600&q=80",
    color: "bg-slate-900",
    fileUrl: "collins_wilkie_the_woman_in_white.pdf",
  },
  {
    id: "b13",
    title: "Great Expectations",
    author: "Charles Dickens",
    plot: "Pip, a poor orphan, has his life transformed after encounters with an escaped convict and the wealthy, eccentric Miss Havisham. He unexpectedly receives a fortune to become a gentleman in London.",
    imageUrl:
      "https://images.unsplash.com/photo-1555580062-8d76db78e137?w=600&q=80",
    color: "bg-amber-800",
    fileUrl: "Great Expectations.pdf",
  },
  {
    id: "b14",
    title: "The Runaway Jury",
    author: "John Grisham",
    plot: "In a landmark lawsuit against a powerful tobacco company, a mysterious juror works from the inside to manipulate the verdict, leading to a high-stakes game of cat and mouse with ruthless jury consultants.",
    imageUrl:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80",
    color: "bg-stone-900",
    fileUrl: "Grisham John - The Runaway Jury  - 2008.pdf",
  },
  {
    id: "b15",
    title: "Snow Falling on Cedars",
    author: "David Guterson",
    plot: "In 1954, a Japanese-American fisherman is put on trial for the murder of a fellow fisherman in a tight-knit Pacific Northwest community still grappling with the anti-Japanese prejudice of World War II.",
    imageUrl:
      "https://images.unsplash.com/photo-1542601098-8fc114e148e2?w=600&q=80",
    color: "bg-cyan-800",
    fileUrl: "guterson_david_snow_falling_on_cedars.pdf",
  },
  {
    id: "b16",
    title: "I Know Why the Caged Bird Sings",
    author: "Maya Angelou",
    plot: "The powerful autobiography of Maya Angelou, recounting her early years growing up in the segregated American South, overcoming trauma, racism, and displacement through the power of literature and self-acceptance.",
    imageUrl:
      "https://images.unsplash.com/photo-1480044965905-02098d415086?w=600&q=80",
    color: "bg-rose-900",
    fileUrl: "i_know_why_the_caged_bird_sings.pdf",
  },
  {
    id: "b17",
    title: "Happy Days & Other Short Stories",
    author: "Jake Allsop",
    plot: "A collection of twenty engaging and accessible short stories exploring various themes, everyday situations, and human interactions, designed specifically for English language learners.",
    imageUrl:
      "https://images.unsplash.com/photo-1506869640319-fea1a278e0c9?w=600&q=80",
    color: "bg-yellow-700",
    fileUrl: "Jake Allsop - Happy Days and Other Very Short Stories.pdf",
  },
  {
    id: "b18",
    title: "Northanger Abbey",
    author: "Jane Austen",
    plot: "Catherine Morland, a young and naive girl obsessed with Gothic novels, visits Bath and Northanger Abbey, where her vivid imagination leads her to suspect dark family secrets that complicate her blooming romance.",
    imageUrl:
      "https://images.unsplash.com/photo-1584283921762-f2868ff1dd1f?w=600&q=80",
    color: "bg-emerald-700",
    fileUrl: "Northanger Abbey - 2011.pdf",
  },
  {
    id: "b19",
    title: "Cry, the Beloved Country",
    author: "Alan Paton",
    plot: "A Zulu pastor travels to Johannesburg to search for his son, discovering a city fractured by racial inequality and crime. It is a profound story of tragedy, forgiveness, and the struggle for justice in South Africa.",
    imageUrl:
      "https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=600&q=80",
    color: "bg-orange-800",
    fileUrl: "Paton Alan - Cry the Beloved Country - 2008.pdf",
  },
  {
    id: "b20",
    title: "Lucky Luke & Other Short Stories",
    author: "Paul Stewart",
    plot: "An engaging collection of very short stories tailored for English learners, featuring varied scenarios, intriguing characters, and everyday dilemmas to practice reading comprehension.",
    imageUrl:
      "https://images.unsplash.com/photo-1474932430478-367d16b99031?w=600&q=80",
    color: "bg-blue-800",
    fileUrl: "Paul Stewart - Lucky Luke and Other Very Short Stories.pdf",
  },
  {
    id: "b21",
    title: "The Remains of the Day",
    author: "Kazuo Ishiguro",
    plot: "Stevens, a deeply devoted English butler, takes a road trip across the country. Along the way, he reflects on his life of absolute service to a controversial lord and the personal sacrifices he made for duty.",
    imageUrl:
      "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=600&q=80",
    color: "bg-zinc-700",
    fileUrl: "The Remains of the Day.pdf",
  },
  {
    id: "b22",
    title: "2001: A Space Odyssey",
    author: "Arthur C. Clarke",
    plot: "A mysterious monolith is discovered on the moon, leading a team of astronauts on a dangerous mission to Jupiter with an advanced AI computer named HAL 9000.",
    imageUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
    color: "bg-slate-900",
    fileUrl: "2001 A Space Odyssey.pdf",
  },
  {
    id: "b23",
    title: "Wuthering Heights",
    author: "Emily Brontë",
    plot: "A passionate and destructive tale of love and revenge between Heathcliff and Catherine Earnshaw, set on the desolate and stormy Yorkshire moors.",
    imageUrl:
      "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=600&q=80",
    color: "bg-stone-800",
    fileUrl: "bronte_emily_wuthering_heights.pdf",
  },
  {
    id: "b24",
    title: "Death on the Nile",
    author: "Agatha Christie",
    plot: "Hercule Poirot's luxurious Egyptian vacation aboard a river steamer turns into a terrifying search for a murderer after a young heiress is tragically killed.",
    imageUrl:
      "https://images.unsplash.com/photo-1534008897995-27a23e859048?w=600&q=80",
    color: "bg-amber-800",
    fileUrl: "Death on the Nile.pdf",
  },
  {
    id: "b25",
    title: "The Phantom of the Opera",
    author: "Gaston Leroux",
    plot: "A mysterious and disfigured musical genius haunts the dark passages of the Paris Opera House, becoming dangerously obsessed with a beautiful young soprano.",
    imageUrl:
      "https://images.unsplash.com/photo-1507676184212-d0330a15183c?w=600&q=80",
    color: "bg-red-900",
    fileUrl: "Gaston Leroux - The Phantom of the Opera.pdf",
  },
  {
    id: "b26",
    title: "The Rainmaker",
    author: "John Grisham",
    plot: "A young, inexperienced lawyer takes on a powerful and corrupt insurance company in a seemingly impossible legal battle to fight for a boy dying of leukemia.",
    imageUrl:
      "https://images.unsplash.com/photo-1505664177922-9618f8d4e928?w=600&q=80",
    color: "bg-blue-900",
    fileUrl: "grisham_john_the_rainmaker.pdf",
  },
  {
    id: "b27",
    title: "The War of the Worlds",
    author: "H.G. Wells",
    plot: "Humanity faces total destruction when ruthless Martians invade Earth in terrifying walking machines, armed with deadly heat-rays and poisonous black smoke.",
    imageUrl:
      "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=600&q=80",
    color: "bg-orange-900",
    fileUrl: "H. G. Wells - The War of the Worlds.pdf",
  },
  {
    id: "b28",
    title: "The Invisible Man",
    author: "H.G. Wells",
    plot: "A brilliant but arrogant scientist discovers the secret of true invisibility, but his inability to reverse the dangerous process slowly drives him to madness and terror.",
    imageUrl:
      "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=600&q=80",
    color: "bg-zinc-800",
    fileUrl: "H.G. Wells - The Invisible Man.pdf",
  },
  {
    id: "b29",
    title: "Prime Suspect",
    author: "Lynda La Plante",
    plot: "DCI Jane Tennison must battle deep sexism and skepticism within the police force while leading a high-pressure, grueling investigation to catch a brutal serial killer.",
    imageUrl:
      "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=600&q=80",
    color: "bg-slate-800",
    fileUrl: "Prime Suspect.pdf",
  },
  {
    id: "b30",
    title: "Four Weddings and a Funeral",
    author: "Richard Curtis",
    plot: "A charming but commitment-phobic Englishman repeatedly runs into a captivating American woman at various social events, leading to a hilarious and touching romance.",
    imageUrl:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80",
    color: "bg-pink-800",
    fileUrl: "Richard Curtis - Four Weddings and a Funeral.pdf",
  },
  {
    id: "b31",
    title: "The Body",
    author: "Stephen King",
    plot: "Four young boys embark on a life-changing, dangerous journey along the train tracks to find the body of a missing teenager in the summer of 1959.",
    imageUrl:
      "https://images.unsplash.com/photo-1473654729515-0967db5098b8?w=600&q=80",
    color: "bg-amber-900",
    fileUrl: "Stephen King - The Body.pdf",
  },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [bookLinks, setBookLinks] = useState({});
  const [view, setView] = useState("library");
  const [selectedBook, setSelectedBook] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authMessage, setAuthMessage] = useState("");

  // --- Auth Initialization ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error("Auth init error:", error);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setProfile(null);
        setLoadingAuth(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // --- Fetch Profile ---
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const profileRef = doc(
          db,
          "artifacts",
          appId,
          "users",
          user.uid,
          "profile",
          "data"
        );
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          setProfile(profileSnap.data());
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoadingAuth(false);
      }
    };

    fetchProfile();
  }, [user]);

  // --- Fetch Data (Submissions & Cloud Links) ---
  useEffect(() => {
    if (!user || !profile || profile.role === "guest") return;

    // Fetch Submissions
    const submissionsRef = collection(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      "submissions"
    );
    const unsubSubs = onSnapshot(
      submissionsRef,
      (snapshot) => {
        const subs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        let filteredSubs = subs;
        if (profile.role !== "teacher") {
          // כאן שודרג הסינון: שולף עבודות לפי האימייל ולא לפי המכשיר!
          filteredSubs = subs.filter(
            (sub) =>
              sub.studentEmail?.toLowerCase() === profile.email.toLowerCase()
          );
        }
        filteredSubs.sort(
          (a, b) =>
            (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0)
        );
        setSubmissions(filteredSubs);
      },
      (error) => console.error("Error fetching submissions:", error)
    );

    // Fetch Cloud Book Links
    const linksRef = collection(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      "bookLinks"
    );
    const unsubLinks = onSnapshot(
      linksRef,
      (snapshot) => {
        const links = {};
        snapshot.docs.forEach((doc) => {
          links[doc.id] = doc.data().url;
        });
        setBookLinks(links);
      },
      (error) => console.error("Error fetching book links:", error)
    );

    return () => {
      unsubSubs();
      unsubLinks();
    };
  }, [user, profile]);

  // If Guest, we still need to fetch the public book links
  useEffect(() => {
    if (profile?.role === "guest" && user) {
      const linksRef = collection(
        db,
        "artifacts",
        appId,
        "public",
        "data",
        "bookLinks"
      );
      const unsubLinks = onSnapshot(linksRef, (snapshot) => {
        const links = {};
        snapshot.docs.forEach((doc) => {
          links[doc.id] = doc.data().url;
        });
        setBookLinks(links);
      });
      return () => unsubLinks();
    }
  }, [user, profile]);

  // --- Handlers ---
  const handleAuthSubmit = async (profileData, isLoginMode) => {
    if (!user) return;

    if (profileData.role === "guest") {
      setProfile(profileData);
      setView("library");
      return;
    }

    try {
      const deviceProfileRef = doc(
        db,
        "artifacts",
        appId,
        "users",
        user.uid,
        "profile",
        "data"
      );

      if (profileData.role === "teacher") {
        await setDoc(deviceProfileRef, profileData);
        setProfile(profileData);
        setView("teacher_dashboard");
        setAuthMessage("");
        return;
      }

      // --- לוגיקה חדשה לתלמידים: זיהוי גלובלי לפי אימייל ---
      const emailKey = profileData.email.toLowerCase().trim();
      const globalStudentRef = doc(
        db,
        "artifacts",
        appId,
        "public",
        "data",
        "students",
        emailKey
      );

      if (isLoginMode) {
        // התחברות קיימת (LOG IN)
        const studentSnap = await getDoc(globalStudentRef);
        if (studentSnap.exists()) {
          const studentInfo = studentSnap.data();
          const fullProfile = {
            role: "student",
            name: studentInfo.name,
            email: studentInfo.email,
          };
          // מחבר את המכשיר הנוכחי לפרופיל של התלמיד
          await setDoc(deviceProfileRef, fullProfile);
          setProfile(fullProfile);
          setView("library");
          setAuthMessage("");
        } else {
          setAuthMessage(
            "Account not found. Please check your email or Sign Up first."
          );
        }
      } else {
        // הרשמה חדשה (SIGN UP)
        const studentSnap = await getDoc(globalStudentRef);
        if (studentSnap.exists()) {
          setAuthMessage(
            "This email is already registered. Please switch to 'Log In'."
          );
          return;
        }
        const fullProfile = {
          role: "student",
          name: profileData.name,
          email: emailKey,
        };
        // שומר את התלמיד במאגר הגלובלי של בית הספר
        await setDoc(globalStudentRef, fullProfile);
        // מחבר גם את המכשיר הנוכחי
        await setDoc(deviceProfileRef, fullProfile);
        setProfile(fullProfile);
        setView("library");
        setAuthMessage("");
      }
    } catch (err) {
      console.error("Error creating/fetching profile:", err);
      setAuthMessage("Authentication error. Please try again.");
    }
  };

  const handleLogout = () => {
    setProfile(null);
    setView("library");
    setAuthMessage("");
  };

  const handleRequireLogin = () => {
    setProfile(null);
    setAuthMessage("Please sign in to write and submit a report.");
  };

  const navigateTo = (newView, book = null) => {
    setView(newView);
    setSelectedBook(book);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  // --- Render Gates ---
  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <div
          className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('screen-shot-2017-11-16-at-17.06.02-2.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-orange-50/60 backdrop-blur-sm"></div>
        </div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 relative z-10"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <AuthScreen onAuthSubmit={handleAuthSubmit} authMessage={authMessage} />
    );
  }

  return (
    <div className="min-h-screen font-sans text-stone-900 relative">
      {/* Background Image with Overlay */}
      <div
        className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('screen-shot-2017-11-16-at-17.06.02-2.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-orange-50/60 backdrop-blur-sm"></div>
      </div>

      <Navbar
        profile={profile}
        view={view}
        navigateTo={navigateTo}
        onLogout={handleLogout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {view === "library" && (
          <LibraryView
            navigateTo={navigateTo}
            profile={profile}
            bookLinks={bookLinks}
            onRequireLogin={handleRequireLogin}
          />
        )}
        {view === "report_form" && selectedBook && (
          <ReportForm
            book={selectedBook}
            user={user}
            profile={profile}
            navigateTo={navigateTo}
          />
        )}
        {view === "my_reports" && (
          <StudentReportsView
            submissions={submissions}
            navigateTo={navigateTo}
          />
        )}
        {view === "teacher_dashboard" && (
          <TeacherDashboard
            submissions={submissions}
            bookLinks={bookLinks}
            navigateTo={navigateTo}
          />
        )}
      </main>
    </div>
  );
}

// ==========================================
// AUTHENTICATION SCREEN
// ==========================================
function AuthScreen({ onAuthSubmit, authMessage }) {
  const [isTeacher, setIsTeacher] = useState(false);
  const [isLogin, setIsLogin] = useState(false); // Default to Sign Up for new students
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (isTeacher) {
      if (password !== "book") {
        setError("Incorrect teacher password.");
        return;
      }
      if (!name) {
        setError("Please enter your full name.");
        return;
      }
      onAuthSubmit(
        { role: "teacher", name, email: email || "teacher@school.edu" },
        true
      );
    } else {
      if (!email.trim()) {
        setError("Please provide your Google Email.");
        return;
      }
      if (!isLogin && !name.trim()) {
        setError("Please provide your Full Name to sign up.");
        return;
      }
      if (!email.includes("@")) {
        setError("Please provide a valid email address.");
        return;
      }
      onAuthSubmit({ role: "student", name, email }, isLogin);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div
        className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('screen-shot-2017-11-16-at-17.06.02-2.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/70 to-amber-100/70 backdrop-blur-sm"></div>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-orange-100 relative z-10">
        {authMessage && (
          <div className="mb-6 bg-orange-100 text-orange-800 p-4 rounded-xl text-sm font-medium flex items-start">
            <Lock className="w-5 h-5 mr-2 flex-shrink-0" />
            {authMessage}
          </div>
        )}

        <div className="text-center mb-8">
          <div className="bg-orange-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 rotate-3 shadow-sm">
            <LibraryBig className="w-10 h-10 text-orange-600 -rotate-3" />
          </div>
          <h1 className="text-3xl font-bold text-stone-900 font-serif">
            Zehavit's Library
          </h1>
          <p className="text-stone-500 mt-2 text-sm font-medium uppercase tracking-widest">
            11th Grade Literature
          </p>
        </div>

        <div className="flex bg-stone-100 p-1.5 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => {
              setIsTeacher(false);
              setError("");
            }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
              !isTeacher
                ? "bg-white shadow-sm text-orange-700"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => {
              setIsTeacher(true);
              setError("");
            }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
              isTeacher
                ? "bg-white shadow-sm text-orange-700"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            Teacher
          </button>
        </div>

        {!isTeacher && (
          <div className="flex justify-center space-x-6 mb-6 border-b border-stone-200 pb-0">
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError("");
              }}
              className={`text-sm font-bold transition-colors pb-3 ${
                !isLogin
                  ? "text-orange-600 border-b-2 border-orange-600 -mb-[2px]"
                  : "text-stone-400 hover:text-stone-600"
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError("");
              }}
              className={`text-sm font-bold transition-colors pb-3 ${
                isLogin
                  ? "text-orange-600 border-b-2 border-orange-600 -mb-[2px]"
                  : "text-stone-400 hover:text-stone-600"
              }`}
            >
              Log In
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isTeacher && isLogin && (
            <div className="text-center mb-2">
              <p className="text-sm text-stone-500 font-medium">
                Welcome back! Log in to resume your reading and drafts.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          {(!isLogin || isTeacher) && (
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-11 w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-shadow"
                  placeholder={isTeacher ? "Teacher Name" : "e.g., Jane Doe"}
                />
              </div>
            </div>
          )}

          {!isTeacher && (
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1.5">
                Google Email
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-shadow"
                  placeholder="student@gmail.com"
                />
              </div>
            </div>
          )}

          {isTeacher && (
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1.5">
                Access Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-shadow"
                  placeholder="Enter teacher password"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-orange-600 text-white font-bold py-3.5 rounded-xl hover:bg-orange-700 transition-colors mt-4 shadow-lg shadow-orange-600/20"
          >
            {isTeacher ? "Access Dashboard" : isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        {!isTeacher && (
          <div className="mt-8 pt-6 border-t border-stone-100 text-center">
            <button
              onClick={() =>
                onAuthSubmit(
                  { role: "guest", name: "Guest Reader", email: "" },
                  false
                )
              }
              className="text-stone-500 hover:text-orange-600 font-medium text-sm flex items-center justify-center w-full transition-colors"
            >
              Browse Library as Guest
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// NAVIGATION BAR
// ==========================================
function Navbar({
  profile,
  view,
  navigateTo,
  onLogout,
  mobileMenuOpen,
  setMobileMenuOpen,
}) {
  const isTeacher = profile.role === "teacher";
  const isGuest = profile.role === "guest";

  let navLinks = [];
  if (isTeacher) {
    navLinks = [
      { id: "teacher_dashboard", label: "Dashboard", icon: FileText },
      { id: "library", label: "Digital Library", icon: Book },
    ];
  } else if (isGuest) {
    navLinks = [{ id: "library", label: "Digital Library", icon: Book }];
  } else {
    navLinks = [
      { id: "library", label: "Digital Library", icon: Book },
      { id: "my_reports", label: "My Assignments", icon: FileText },
    ];
  }

  return (
    <nav className="bg-[#FFFDF9] shadow-sm sticky top-0 z-50 border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <div className="bg-orange-100 p-2 rounded-xl">
              <LibraryBig className="h-7 w-7 text-orange-600" />
            </div>
            <span className="ml-3 text-2xl font-bold text-stone-900 hidden sm:block font-serif tracking-tight">
              Zehavit's Library
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => navigateTo(link.id)}
                className={`flex items-center px-1 py-2 text-sm font-bold border-b-2 transition-colors ${
                  view === link.id ||
                  (view === "report_form" && link.id === "library")
                    ? "border-orange-600 text-orange-600"
                    : "border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300"
                }`}
              >
                <link.icon className="w-4 h-4 mr-2" />
                {link.label}
              </button>
            ))}

            <div className="flex items-center border-l border-stone-200 pl-6 ml-2">
              {isGuest ? (
                <button
                  onClick={onLogout}
                  className="bg-orange-100 text-orange-700 hover:bg-orange-200 font-bold py-2 px-5 rounded-lg transition-colors"
                >
                  Sign In
                </button>
              ) : (
                <>
                  <div className="text-right mr-4">
                    <div className="text-sm font-bold text-stone-900">
                      {profile.name}
                    </div>
                    <div className="text-xs text-stone-500 capitalize">
                      {profile.role}
                    </div>
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-2.5 text-stone-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-stone-500 hover:text-stone-900 p-2"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => navigateTo(link.id)}
                className={`w-full flex items-center px-4 py-3.5 rounded-xl text-base font-bold ${
                  view === link.id
                    ? "bg-orange-50 text-orange-700"
                    : "text-stone-600 hover:bg-stone-50"
                }`}
              >
                <link.icon className="w-5 h-5 mr-3" />
                {link.label}
              </button>
            ))}
            <button
              onClick={onLogout}
              className={`w-full flex items-center px-4 py-3.5 rounded-xl text-base font-bold transition-colors ${
                isGuest
                  ? "bg-orange-100 text-orange-700"
                  : "text-red-600 hover:bg-red-50"
              }`}
            >
              {isGuest ? (
                <User className="w-5 h-5 mr-3" />
              ) : (
                <LogOut className="w-5 h-5 mr-3" />
              )}
              {isGuest ? "Sign In" : "Sign Out"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ==========================================
// LIBRARY VIEW (Student & Guest)
// ==========================================
function LibraryView({ navigateTo, profile, bookLinks, onRequireLogin }) {
  const [blockedLink, setBlockedLink] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleWriteReport = (book) => {
    if (profile.role === "guest") {
      onRequireLogin();
    } else {
      navigateTo("report_form", book);
    }
  };

  const handleReadBook = (e, url) => {
    e.preventDefault();
    if (!url) return;

    let formattedUrl = url.trim();

    // Smart URL routing to support both Web Links and Local File Names
    if (/^https?:\/\//i.test(formattedUrl)) {
      // Already a full web link, do nothing
    } else if (
      formattedUrl.toLowerCase().includes("drive.google") ||
      formattedUrl.toLowerCase().includes("dropbox") ||
      formattedUrl.toLowerCase().startsWith("www.")
    ) {
      // Web domain missing https
      formattedUrl = "https://" + formattedUrl;
    } else if (
      formattedUrl.toLowerCase().endsWith(".pdf") ||
      !formattedUrl.includes("/")
    ) {
      // Local uploaded file name - encode it so the browser can read it securely
      formattedUrl = `./${encodeURIComponent(formattedUrl)}`;
    } else {
      formattedUrl = "https://" + formattedUrl;
    }

    try {
      // Try to open the book in a new tab
      const newWindow = window.open(
        formattedUrl,
        "_blank",
        "noopener,noreferrer"
      );

      // If the browser blocks the popup, trigger the fallback copy modal
      if (!newWindow) {
        setBlockedLink(formattedUrl);
      }
    } catch (err) {
      setBlockedLink(formattedUrl);
    }
  };

  const copyToClipboard = () => {
    // Safe clipboard copy mechanism for embedded iframes
    const el = document.createElement("textarea");
    el.value = blockedLink;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setBlockedLink(null); // Close the modal after copying
    }, 2000);
  };

  return (
    <div>
      {/* Popup Blocked Fallback Modal */}
      {blockedLink && (
        <div className="fixed inset-0 z-[200] bg-stone-900/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LinkIcon className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2 text-center">
              Open Book Link
            </h3>
            <p className="text-stone-600 mb-4 text-sm text-center">
              Your browser prevented the book from opening automatically in a
              new tab. Please copy the safe link below and paste it into your
              browser:
            </p>
            <input
              type="text"
              readOnly
              value={blockedLink}
              className="w-full bg-stone-50 border border-stone-200 p-3 rounded-lg mb-4 text-sm font-mono text-stone-800 outline-none"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setBlockedLink(null)}
                className="flex-1 py-2.5 bg-stone-100 text-stone-700 font-bold rounded-xl hover:bg-stone-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={copyToClipboard}
                className="flex-1 py-2.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors shadow-sm"
              >
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-bold text-stone-900 font-serif">
          Zehavit's Library
        </h1>
        <p className="mt-3 text-lg text-stone-600 max-w-2xl">
          Explore our extensive reading selection. Choose a book below to begin
          reading, then complete your assignment to grow your portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {LIBRARY_BOOKS.map((book) => {
          return (
            <div
              key={book.id}
              className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full group"
            >
              {/* Illustrated Cover Header */}
              <div className="relative h-56 w-full overflow-hidden bg-stone-200">
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                {/* Fallback if image fails to load */}
                <div
                  className={`hidden absolute inset-0 ${book.color} p-4 flex-col justify-center items-center text-center shadow-inner`}
                >
                  <h3 className="text-white font-serif font-bold text-xl leading-tight mb-2">
                    {book.title}
                  </h3>
                </div>

                {/* Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/30 to-transparent"></div>

                <div className="absolute bottom-4 left-5 right-5">
                  <h3 className="text-white font-serif font-bold text-xl leading-tight drop-shadow-md">
                    {book.title}
                  </h3>
                  <p className="text-orange-200 font-medium text-sm drop-shadow">
                    {book.author}
                  </p>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <p className="text-sm text-stone-600 line-clamp-4 mb-6 flex-1 leading-relaxed">
                  {book.plot}
                </p>

                <div className="flex flex-col gap-3 mt-auto">
                  {(() => {
                    const cloudUrl = bookLinks && bookLinks[book.id];
                    return cloudUrl ? (
                      <button
                        onClick={(e) => handleReadBook(e, cloudUrl)}
                        className="w-full bg-stone-100 text-stone-700 hover:bg-stone-200 font-bold py-2.5 px-4 rounded-xl transition-colors border border-stone-200 flex justify-center items-center shadow-sm"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Read Book
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-stone-50 text-stone-400 font-bold py-2.5 px-4 rounded-xl border border-stone-100 flex justify-center items-center cursor-not-allowed"
                        title="The teacher hasn't uploaded a cloud link for this book yet."
                      >
                        <Cloud className="w-4 h-4 mr-2" />
                        Not Available
                      </button>
                    );
                  })()}
                  <button
                    onClick={() => handleWriteReport(book)}
                    className="w-full bg-orange-50 text-orange-700 hover:bg-orange-600 hover:text-white font-bold py-2.5 px-4 rounded-xl transition-colors border border-orange-100 hover:border-orange-600 flex justify-center items-center shadow-sm"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Write Report
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// BOOK REPORT FORM (Student)
// ==========================================
function ReportForm({ book, user, profile, navigateTo }) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  const [draftStatus, setDraftStatus] = useState("");
  const [formData, setFormData] = useState({
    settingAndCharacters: "",
    plotSummary: "",
    analysisTheme: "",
    analysisConflict: "",
    personalReflection: "",
    vocabulary: "",
  });

  // --- Load Saved Draft ---
  useEffect(() => {
    let isMounted = true;
    const loadDraft = async () => {
      try {
        const draftRef = doc(
          db,
          "artifacts",
          appId,
          "users",
          user.uid,
          "drafts",
          book.id
        );
        const draftSnap = await getDoc(draftRef);

        if (draftSnap.exists() && isMounted) {
          setFormData(draftSnap.data());
          setDraftStatus("Draft loaded");
          setTimeout(() => {
            if (isMounted) setDraftStatus("");
          }, 3000);
        }
      } catch (err) {
        console.error("Error loading draft:", err);
      } finally {
        if (isMounted) setIsDraftLoaded(true);
      }
    };

    loadDraft();
    return () => {
      isMounted = false;
    };
  }, [book.id, user.uid]);

  // --- Auto-Save Draft (Debounced) ---
  useEffect(() => {
    if (!isDraftLoaded) return; // Don't save before the initial load finishes

    const timer = setTimeout(async () => {
      try {
        setDraftStatus("Saving...");
        const draftRef = doc(
          db,
          "artifacts",
          appId,
          "users",
          user.uid,
          "drafts",
          book.id
        );
        await setDoc(draftRef, formData);
        setDraftStatus("Draft saved");

        // Clear the status message after 2 seconds
        setTimeout(() => setDraftStatus(""), 2000);
      } catch (err) {
        console.error("Error saving draft:", err);
        setDraftStatus("Failed to save");
      }
    }, 1500); // Wait 1.5 seconds after typing stops before saving

    return () => clearTimeout(timer);
  }, [formData, isDraftLoaded, book.id, user.uid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Submit the assignment
      const submissionsRef = collection(
        db,
        "artifacts",
        appId,
        "public",
        "data",
        "submissions"
      );
      await addDoc(submissionsRef, {
        studentId: user.uid,
        studentName: profile.name,
        studentEmail: profile.email,
        bookId: book.id,
        bookTitle: book.title,
        bookAuthor: book.author,
        responses: formData,
        status: "submitted",
        grade: null,
        teacherFeedback: "",
        timestamp: serverTimestamp(),
      });

      // Clear the draft after successful submission
      const draftRef = doc(
        db,
        "artifacts",
        appId,
        "users",
        user.uid,
        "drafts",
        book.id
      );
      await deleteDoc(draftRef);

      setSuccess(true);
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to submit assignment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-lg border border-stone-100 text-center mt-10">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-stone-900 mb-4 font-serif">
          Assignment Submitted!
        </h2>
        <p className="text-stone-600 mb-10 text-lg">
          Your extensive reading report for <strong>"{book.title}"</strong> has
          been successfully submitted for grading.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => navigateTo("library")}
            className="px-8 py-3.5 bg-stone-100 text-stone-700 font-bold rounded-xl hover:bg-stone-200 transition-colors"
          >
            Back to Library
          </button>
          <button
            onClick={() => navigateTo("my_reports")}
            className="px-8 py-3.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 shadow-lg shadow-orange-600/20 transition-colors"
          >
            View My Assignments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigateTo("library")}
        className="flex items-center text-stone-500 hover:text-orange-600 mb-6 font-bold transition-colors"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to Library
      </button>

      <div className="bg-white rounded-3xl shadow-lg border border-stone-200 overflow-hidden">
        {/* Illustrated Header */}
        <div className="relative h-64 md:h-72 w-full overflow-hidden bg-stone-900">
          {/* Background Blurred Image */}
          <img
            src={book.imageUrl}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover opacity-50 blur-md scale-110"
            onError={(e) => (e.target.style.display = "none")}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 to-stone-900/40"></div>

          {/* Content */}
          <div className="absolute inset-0 p-6 md:p-10 flex flex-row items-center">
            <img
              src={book.imageUrl}
              alt={book.title}
              className="w-28 h-40 md:w-36 md:h-52 object-cover rounded-lg shadow-2xl border border-white/20 mr-6 md:mr-10 hidden sm:block"
              onError={(e) => (e.target.style.display = "none")}
            />
            <div className="text-white">
              <span className="inline-block bg-orange-500/20 text-orange-200 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-3">
                11th Grade Extensive Reading Task
              </span>
              <h1 className="text-3xl md:text-5xl font-bold mb-2 font-serif drop-shadow-lg">
                {book.title}
              </h1>
              <p className="text-orange-200 font-medium text-lg md:text-xl drop-shadow">
                By {book.author}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-10">
          <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-xl">
            <h3 className="text-amber-900 font-bold mb-2 flex items-center text-lg">
              <FileText className="w-5 h-5 mr-2" />
              Instructions
            </h3>
            <p className="text-amber-800 text-sm md:text-base leading-relaxed">
              Please answer the following questions in complete sentences. Your
              work will be graded based on Content & Analysis (50%), Vocabulary
              (20%), and Language accuracy (30%) according to the MoE rubrics.
            </p>
          </div>

          <div className="space-y-8">
            <div>
              <label className="block text-xl font-bold text-stone-900 mb-2 font-serif">
                1. Setting and Characters{" "}
                <span className="text-stone-400 text-lg">(15%)</span>
              </label>
              <p className="text-stone-500 text-sm mb-3">
                Describe the main setting (time and place) of the story. Choose
                ONE main character and describe their personality and role in
                the story.
              </p>
              <textarea
                required
                rows={4}
                className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-y transition-shadow text-stone-800 leading-relaxed"
                value={formData.settingAndCharacters}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    settingAndCharacters: e.target.value,
                  })
                }
                placeholder="Write your answer here..."
              />
            </div>

            <div>
              <label className="block text-xl font-bold text-stone-900 mb-2 font-serif">
                2. Plot Summary{" "}
                <span className="text-stone-400 text-lg">(15%)</span>
              </label>
              <p className="text-stone-500 text-sm mb-3">
                Write a short summary of the main events in the book. What is
                the central conflict or problem? How is it resolved? (About
                80-100 words).
              </p>
              <textarea
                required
                rows={5}
                className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-y transition-shadow text-stone-800 leading-relaxed"
                value={formData.plotSummary}
                onChange={(e) =>
                  setFormData({ ...formData, plotSummary: e.target.value })
                }
                placeholder="Write your summary here..."
              />
            </div>

            <div>
              <label className="block text-xl font-bold text-stone-900 mb-2 font-serif">
                3. Literary Analysis: Theme & Message{" "}
                <span className="text-stone-400 text-lg">(20%)</span>
              </label>
              <p className="text-stone-500 text-sm mb-3">
                What do you think is the central theme or underlying message of
                this book? Explain your answer using at least one specific event
                or quote from the story.
              </p>
              <textarea
                required
                rows={4}
                className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-y transition-shadow text-stone-800 leading-relaxed"
                value={formData.analysisTheme}
                onChange={(e) =>
                  setFormData({ ...formData, analysisTheme: e.target.value })
                }
                placeholder="Write your analysis here..."
              />
            </div>

            <div>
              <label className="block text-xl font-bold text-stone-900 mb-2 font-serif">
                4. Literary Analysis: Conflict & Growth{" "}
                <span className="text-stone-400 text-lg">(20%)</span>
              </label>
              <p className="text-stone-500 text-sm mb-3">
                Describe a major conflict (internal or external) that the main
                character faces. How does dealing with this conflict change them
                by the end of the book?
              </p>
              <textarea
                required
                rows={4}
                className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-y transition-shadow text-stone-800 leading-relaxed"
                value={formData.analysisConflict}
                onChange={(e) =>
                  setFormData({ ...formData, analysisConflict: e.target.value })
                }
                placeholder="Describe the conflict and character growth here..."
              />
            </div>

            <div>
              <label className="block text-xl font-bold text-stone-900 mb-2 font-serif">
                5. Personal Reflection{" "}
                <span className="text-stone-400 text-lg">(15%)</span>
              </label>
              <p className="text-stone-500 text-sm mb-3">
                Did you enjoy reading this book? Why or why not? Would you
                recommend it to a friend? Give specific reasons based on the
                story.
              </p>
              <textarea
                required
                rows={4}
                className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-y transition-shadow text-stone-800 leading-relaxed"
                value={formData.personalReflection}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalReflection: e.target.value,
                  })
                }
                placeholder="Share your opinion here..."
              />
            </div>

            <div>
              <label className="block text-xl font-bold text-stone-900 mb-2 font-serif">
                6. Vocabulary Enrichment{" "}
                <span className="text-stone-400 text-lg">(15%)</span>
              </label>
              <p className="text-stone-500 text-sm mb-3">
                List 5 new words you learned from this book. Provide the word,
                its meaning (in English or Hebrew), and write an original
                sentence using each word.
              </p>
              <textarea
                required
                rows={5}
                className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-y transition-shadow text-stone-800 leading-relaxed font-mono text-sm"
                value={formData.vocabulary}
                onChange={(e) =>
                  setFormData({ ...formData, vocabulary: e.target.value })
                }
                placeholder="1. Word - Meaning. Sentence: ...&#10;2. Word - Meaning. Sentence: ..."
              />
            </div>
          </div>

          <div className="pt-8 border-t border-stone-200 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
            <div className="text-sm font-medium text-stone-500 flex items-center h-6 w-full sm:w-auto">
              {draftStatus && (
                <>
                  <Cloud className="w-4 h-4 mr-2" />
                  {draftStatus}
                </>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-4 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => navigateTo("library")}
                className="px-8 py-3.5 text-stone-600 font-bold hover:bg-stone-100 rounded-xl transition-colors w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !isDraftLoaded}
                className={`px-10 py-3.5 bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center w-full sm:w-auto ${
                  submitting || !isDraftLoaded
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-orange-700 hover:shadow-orange-600/20"
                }`}
              >
                {submitting ? "Submitting..." : "Submit Assignment"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// STUDENT REPORTS VIEW
// ==========================================
function StudentReportsView({ submissions, navigateTo }) {
  if (submissions.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-stone-200">
        <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText className="w-12 h-12 text-stone-400" />
        </div>
        <h2 className="text-3xl font-bold text-stone-900 mb-3 font-serif">
          No Assignments Yet
        </h2>
        <p className="text-stone-500 mb-8 text-lg">
          You haven't submitted any extensive reading reports yet.
        </p>
        <button
          onClick={() => navigateTo("library")}
          className="bg-orange-600 text-white font-bold py-3.5 px-8 rounded-xl hover:bg-orange-700 shadow-lg shadow-orange-600/20 transition-all"
        >
          Browse Library
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-stone-900 mb-10 font-serif">
        My Assignments
      </h1>
      <div className="grid gap-6">
        {submissions.map((sub) => (
          <div
            key={sub.id}
            className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all hover:shadow-md"
          >
            <div>
              <h3 className="text-2xl font-bold text-stone-900 mb-2 font-serif">
                {sub.bookTitle}
              </h3>
              <p className="text-stone-500 text-sm mb-4 flex items-center">
                <Clock className="w-4 h-4 mr-1.5" />
                Submitted:{" "}
                {sub.timestamp
                  ? new Date(sub.timestamp.toMillis()).toLocaleDateString()
                  : "Just now"}
              </p>

              {sub.status === "graded" ? (
                <div className="flex items-center space-x-4 bg-green-50 px-4 py-2 rounded-lg w-max">
                  <span className="inline-flex items-center text-sm font-bold text-green-700">
                    <CheckCircle className="w-4 h-4 mr-2" /> Graded
                  </span>
                  <span className="font-bold text-xl text-green-800 border-l border-green-200 pl-4">
                    {sub.grade}{" "}
                    <span className="text-sm text-green-600">/ 100</span>
                  </span>
                </div>
              ) : (
                <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold bg-amber-50 text-amber-700">
                  <Clock className="w-4 h-4 mr-2" /> Pending Review
                </span>
              )}
            </div>

            {sub.status === "graded" && sub.teacherFeedback && (
              <div className="w-full md:w-1/2 bg-stone-50 p-5 rounded-xl border border-stone-200 relative">
                <div className="absolute top-0 left-5 transform -translate-y-1/2 bg-stone-50 px-2 text-xs font-bold text-orange-600 uppercase tracking-wider">
                  Teacher Feedback
                </div>
                <p className="text-stone-700 text-sm leading-relaxed pt-2">
                  "{sub.teacherFeedback}"
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// TEACHER DASHBOARD
// ==========================================
function TeacherDashboard({ submissions, bookLinks, navigateTo }) {
  const [activeTab, setActiveTab] = useState("grading"); // 'grading' | 'links'
  const [selectedSub, setSelectedSub] = useState(null);

  const gradedCount = submissions.filter((s) => s.status === "graded").length;
  const pendingCount = submissions.length - gradedCount;

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-stone-900 font-serif">
            Teacher Dashboard
          </h1>
          <p className="mt-3 text-lg text-stone-600">
            Review assignments and manage cloud links for your library.
          </p>
        </div>
        <button
          onClick={() => navigateTo("library")}
          className="flex items-center justify-center bg-orange-100 text-orange-700 hover:bg-orange-600 hover:text-white font-bold py-3 px-6 rounded-xl transition-colors border border-orange-200 hover:border-orange-600 shadow-sm"
        >
          <Book className="w-5 h-5 mr-2" />
          View Student Library
        </button>
      </div>

      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setActiveTab("grading")}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-colors ${
            activeTab === "grading"
              ? "bg-orange-600 text-white shadow-md"
              : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
          }`}
        >
          Review Submissions
        </button>
        <button
          onClick={() => setActiveTab("links")}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-colors flex items-center ${
            activeTab === "links"
              ? "bg-orange-600 text-white shadow-md"
              : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
          }`}
        >
          <Cloud className="w-4 h-4 mr-2" /> Manage Cloud Books
        </button>
      </div>

      {activeTab === "grading" && (
        <>
          <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-stone-200 w-full md:w-auto mb-6">
            <div className="flex-1 text-center px-6 py-3 border-r border-stone-100">
              <p className="text-3xl font-bold text-stone-900">
                {submissions.length}
              </p>
              <p className="text-xs text-stone-500 uppercase tracking-wider font-bold mt-1">
                Total
              </p>
            </div>
            <div className="flex-1 text-center px-6 py-3 border-r border-stone-100">
              <p className="text-3xl font-bold text-orange-500">
                {pendingCount}
              </p>
              <p className="text-xs text-stone-500 uppercase tracking-wider font-bold mt-1">
                Pending
              </p>
            </div>
            <div className="flex-1 text-center px-6 py-3">
              <p className="text-3xl font-bold text-green-500">{gradedCount}</p>
              <p className="text-xs text-stone-500 uppercase tracking-wider font-bold mt-1">
                Graded
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200">
                    <th className="py-4 px-6 font-bold text-sm text-stone-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="py-4 px-6 font-bold text-sm text-stone-500 uppercase tracking-wider">
                      Book Title
                    </th>
                    <th className="py-4 px-6 font-bold text-sm text-stone-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="py-4 px-6 font-bold text-sm text-stone-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-4 px-6 font-bold text-sm text-stone-500 uppercase tracking-wider text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {submissions.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-12 text-center text-stone-500 text-lg"
                      >
                        No submissions found.
                      </td>
                    </tr>
                  )}
                  {submissions.map((sub) => (
                    <tr
                      key={sub.id}
                      className="hover:bg-orange-50/50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="font-bold text-stone-900">
                          {sub.studentName}
                        </div>
                        <div className="text-xs text-stone-500">
                          {sub.studentEmail}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-serif font-medium text-stone-800">
                        {sub.bookTitle}
                      </td>
                      <td className="py-4 px-6 text-sm text-stone-600">
                        {sub.timestamp
                          ? new Date(
                              sub.timestamp.toMillis()
                            ).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="py-4 px-6">
                        {sub.status === "graded" ? (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-green-100 text-green-800">
                            Graded ({sub.grade})
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-100 text-amber-800">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedSub(sub)}
                          className="text-orange-700 hover:text-white font-bold text-sm bg-orange-100 hover:bg-orange-600 px-4 py-2 rounded-lg transition-colors"
                        >
                          {sub.status === "graded" ? "Edit Grade" : "Review"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === "links" && <CloudLinksManager bookLinks={bookLinks} />}

      {selectedSub && (
        <GradingModal
          submission={selectedSub}
          onClose={() => setSelectedSub(null)}
        />
      )}
    </div>
  );
}

// ==========================================
// CLOUD LINKS MANAGER (Teacher)
// ==========================================
function CloudLinksManager({ bookLinks }) {
  const [links, setLinks] = useState(bookLinks || {});
  const [saveStatus, setSaveStatus] = useState("");
  const timeoutRefs = useRef({});

  useEffect(() => {
    setLinks(bookLinks || {});
  }, [bookLinks]);

  const handleSaveAll = async () => {
    setSaveStatus("Saving links to cloud...");
    try {
      const promises = Object.keys(links).map((bookId) => {
        const url = links[bookId] || "";
        const linkRef = doc(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "bookLinks",
          bookId
        );
        return setDoc(linkRef, { url });
      });
      await Promise.all(promises);
      setSaveStatus("All Links Saved!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (err) {
      console.error("Error saving links", err);
      setSaveStatus("Error saving links.");
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-stone-200">
      <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 mb-8 flex flex-col md:flex-row items-center gap-6">
        <div className="bg-orange-100 p-4 rounded-full text-orange-600 shrink-0">
          <Cloud className="w-8 h-8" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-bold text-orange-900 mb-2 font-serif">
            Library Link Manager
          </h3>
          <p className="text-orange-800 text-sm leading-relaxed">
            Paste the <strong>Google Drive link</strong> OR the exact{" "}
            <strong>PDF File Name</strong> (e.g., <em>"Misery.pdf"</em>) for
            each book. <br className="hidden md:block" />
            The library auto-saves when you finish typing and automatically
            connects students to your files!
          </p>
        </div>
        <div className="shrink-0 flex flex-col items-center">
          <button
            onClick={handleSaveAll}
            className="bg-orange-600 text-white hover:bg-orange-700 px-6 py-3.5 rounded-xl font-bold transition-colors shadow-md flex items-center w-full md:w-auto justify-center"
          >
            <Save className="w-5 h-5 mr-2" />
            Save All Links
          </button>
          {saveStatus && (
            <span className="text-sm font-bold text-orange-700 mt-2">
              {saveStatus}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {LIBRARY_BOOKS.map((book) => (
          <div
            key={book.id}
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 bg-stone-50 border border-stone-200 rounded-2xl gap-4 hover:border-orange-200 transition-colors"
          >
            <div className="w-full lg:w-1/3 flex items-center">
              <div
                className={`w-12 h-16 ${book.color} rounded shadow-sm mr-4 shrink-0`}
              ></div>
              <div>
                <span className="font-bold text-stone-900 font-serif block">
                  {book.title}
                </span>
                <span className="text-xs text-stone-500">{book.author}</span>
              </div>
            </div>

            <div className="w-full lg:flex-1 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full">
                <LinkIcon className="w-5 h-5 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={links[book.id] || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLinks((prev) => ({ ...prev, [book.id]: value }));
                    setSaveStatus("Saving...");

                    // Aggressive Auto-Save: Instantly save to cloud after pasting
                    if (timeoutRefs.current[book.id])
                      clearTimeout(timeoutRefs.current[book.id]);
                    timeoutRefs.current[book.id] = setTimeout(async () => {
                      try {
                        const linkRef = doc(
                          db,
                          "artifacts",
                          appId,
                          "public",
                          "data",
                          "bookLinks",
                          book.id
                        );
                        await setDoc(linkRef, { url: value });
                        setSaveStatus("Link Saved!");
                        setTimeout(() => setSaveStatus(""), 2000);
                      } catch (err) {
                        console.error("Error saving link", err);
                      }
                    }, 500);
                  }}
                  onBlur={handleSaveAll}
                  placeholder="Paste URL or File Name here..."
                  className="w-full pl-11 pr-4 py-3 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-shadow text-sm text-stone-800"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// GRADING MODAL (Teacher)
// ==========================================
function GradingModal({ submission, onClose }) {
  const [grade, setGrade] = useState(submission.grade || "");
  const [feedback, setFeedback] = useState(submission.teacherFeedback || "");
  const [saving, setSaving] = useState(false);
  const [generatingFeedback, setGeneratingFeedback] = useState(false);

  const handleAutoGrade = async () => {
    setGeneratingFeedback(true);
    const apiKey = "AIzaSyDEkc5GgVxtNbmkvAZ9ABgp9CclXGAwZKY";
    const prompt = `Grade the following student book report for the book "${
      submission.bookTitle
    }".
Student Responses:
1. Setting/Characters: ${submission.responses?.settingAndCharacters || ""}
2. Plot Summary: ${submission.responses?.plotSummary || ""}
3. Theme: ${submission.responses?.analysisTheme || ""}
4. Conflict: ${submission.responses?.analysisConflict || ""}
5. Reflection: ${submission.responses?.personalReflection || ""}
6. Vocabulary: ${submission.responses?.vocabulary || ""}

Rubric:
- Content & Analysis: 50%
- Vocabulary Use: 20%
- Language/Grammar: 30%

Provide a pleasant, encouraging feedback message directly to the student and calculate a final grade (0-100).`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: {
        parts: [
          {
            text: "You are a friendly, encouraging high school literature teacher. Provide constructive, pleasant feedback. Return a JSON object with 'grade' (number) and 'feedback' (string).",
          },
        ],
      },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            grade: { type: "INTEGER" },
            feedback: { type: "STRING" },
          },
          required: ["grade", "feedback"],
        },
      },
    };

    let retries = 0;
    const delays = [1000, 2000, 4000, 8000, 16000];

    while (retries <= 5) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const parsed = JSON.parse(data.candidates[0].content.parts[0].text);
        setGrade(parsed.grade);
        setFeedback(parsed.feedback);
        break;
      } catch (error) {
        if (retries === 5) {
          console.error("Failed to generate feedback after retries:", error);
          alert(
            "Failed to generate feedback automatically. Please write it manually."
          );
          break;
        }
        await new Promise((res) => setTimeout(res, delays[retries]));
        retries++;
      }
    }
    setGeneratingFeedback(false);
  };

  const handleSave = async () => {
    if (grade === "" || isNaN(grade) || grade < 0 || grade > 100) {
      alert("Please enter a valid grade between 0 and 100.");
      return;
    }

    setSaving(true);
    try {
      const subRef = doc(
        db,
        "artifacts",
        appId,
        "public",
        "data",
        "submissions",
        submission.id
      );
      await updateDoc(subRef, {
        status: "graded",
        grade: Number(grade),
        teacherFeedback: feedback,
      });
      onClose();
    } catch (err) {
      console.error("Error saving grade:", err);
      alert("Failed to save grade.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="p-5 md:p-8 border-b border-stone-200 flex justify-between items-center bg-stone-50">
          <div>
            <h2 className="text-2xl font-bold text-stone-900 font-serif mb-1">
              Grading Assignment
            </h2>
            <p className="text-sm text-stone-600 font-medium">
              {submission.studentName} <span className="mx-2">•</span>{" "}
              <span className="text-orange-700 font-serif">
                {submission.bookTitle}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white">
          {/* Student Answers */}
          <div className="lg:col-span-2 space-y-8">
            <h3 className="font-bold text-xl text-stone-900 border-b border-stone-200 pb-3 font-serif">
              Student Responses
            </h3>

            <div className="space-y-6">
              <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                <h4 className="text-xs font-bold text-orange-700 uppercase tracking-widest mb-3">
                  1. Setting and Characters
                </h4>
                <p className="text-stone-800 whitespace-pre-wrap leading-relaxed">
                  {submission.responses?.settingAndCharacters}
                </p>
              </div>

              <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                <h4 className="text-xs font-bold text-orange-700 uppercase tracking-widest mb-3">
                  2. Plot Summary
                </h4>
                <p className="text-stone-800 whitespace-pre-wrap leading-relaxed">
                  {submission.responses?.plotSummary}
                </p>
              </div>

              <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                <h4 className="text-xs font-bold text-orange-700 uppercase tracking-widest mb-3">
                  3. Literary Analysis: Theme
                </h4>
                <p className="text-stone-800 whitespace-pre-wrap leading-relaxed">
                  {submission.responses?.analysisTheme}
                </p>
              </div>

              <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                <h4 className="text-xs font-bold text-orange-700 uppercase tracking-widest mb-3">
                  4. Literary Analysis: Conflict
                </h4>
                <p className="text-stone-800 whitespace-pre-wrap leading-relaxed">
                  {submission.responses?.analysisConflict}
                </p>
              </div>

              <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                <h4 className="text-xs font-bold text-orange-700 uppercase tracking-widest mb-3">
                  5. Personal Reflection
                </h4>
                <p className="text-stone-800 whitespace-pre-wrap leading-relaxed">
                  {submission.responses?.personalReflection}
                </p>
              </div>

              <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                <h4 className="text-xs font-bold text-orange-700 uppercase tracking-widest mb-3">
                  6. Vocabulary
                </h4>
                <p className="text-stone-800 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  {submission.responses?.vocabulary}
                </p>
              </div>
            </div>
          </div>

          {/* Grading Panel */}
          <div className="lg:col-span-1 bg-amber-50 p-6 md:p-8 rounded-3xl border border-amber-200 h-fit sticky top-0">
            <h3 className="font-bold text-xl text-stone-900 mb-6 flex items-center justify-between font-serif">
              <span className="flex items-center">
                <Award className="w-6 h-6 mr-2 text-orange-600" />
                Evaluation
              </span>
              <button
                onClick={handleAutoGrade}
                disabled={generatingFeedback}
                className="flex items-center text-sm font-bold bg-white text-orange-600 border border-orange-200 hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                title="Auto-grade with AI"
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                {generatingFeedback ? "Drafting..." : "AI Grade"}
              </button>
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-bold text-stone-700 mb-2">
                Final Grade (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full p-4 text-3xl font-bold text-center border border-amber-300 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-orange-700 bg-white transition-shadow"
                placeholder="---"
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-stone-700 mb-2">
                Teacher Feedback
              </label>
              <textarea
                rows="6"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full p-4 border border-amber-300 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm resize-y leading-relaxed bg-white text-stone-800 transition-shadow"
                placeholder="Write constructive feedback here..."
              />
            </div>

            <div className="space-y-4 mb-8">
              <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">
                Rubric Reference
              </p>
              <div className="text-sm text-stone-700 bg-white p-4 rounded-2xl border border-amber-200 space-y-3 font-medium">
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Content & Analysis:</span>{" "}
                  <span className="font-bold text-stone-900 bg-stone-100 px-2 py-1 rounded">
                    50%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Vocabulary Use:</span>{" "}
                  <span className="font-bold text-stone-900 bg-stone-100 px-2 py-1 rounded">
                    20%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Language/Grammar:</span>{" "}
                  <span className="font-bold text-stone-900 bg-stone-100 px-2 py-1 rounded">
                    30%
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-lg flex items-center justify-center text-lg ${
                saving
                  ? "bg-orange-400 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700 hover:shadow-orange-600/25"
              }`}
            >
              {saving ? "Saving..." : "Save Grade & Feedback"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
